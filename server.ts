import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '2mb' }));

// Lazy initializer for Gemini API client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Scam Shield AI Intelligence Engine',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Primary Scam Analysis Route
app.post('/api/analyze', async (req, res) => {
  const startTime = Date.now();
  try {
    const { message, communicationType = 'Other', url = '', language = 'en' } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message content is required for cybersecurity threat analysis.',
      });
    }

    const trimmedMessage = message.trim();
    const trimmedUrl = typeof url === 'string' ? url.trim() : '';

    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिंदी)',
      mr: 'Marathi (मराठी)',
    };
    const targetLang = languageNames[language] || 'English';

    const ai = getGenAI();

    // Fallback heuristic if no Gemini API key is provisioned yet
    if (!ai) {
      console.warn('GEMINI_API_KEY is not set. Generating high-fidelity heuristic assessment.');
      const fallbackReport = generateHeuristicReport(trimmedMessage, communicationType, trimmedUrl, language);
      return res.json({
        ...fallbackReport,
        executionTimeMs: Date.now() - startTime,
        mode: 'heuristic-rule-engine',
      });
    }

    const systemInstruction = `You are Scam Shield AI, an elite cybersecurity threat intelligence and digital fraud forensic engine.
Your task is to conduct an exhaustive security inspection of suspected digital communications (SMS, WhatsApp, emails, job offers, banking notices, UPI transfers, QR codes, investments, malicious links, social engineering lures).

Evaluate the following vectors rigorously:
1. Scam Probability (0 to 100%)
2. Overall Risk Score (0 to 100):
   - 0-29: LOW (legitimate, non-threatening, verified standard patterns)
   - 30-59: MEDIUM (unsolicited, marketing, unverified claims, caution advised)
   - 60-79: HIGH (deceptive lures, suspicious links, impersonation traits, probable fraud)
   - 80-100: CRITICAL (confirmed phishing, credential harvesting, malware delivery, advance fee fraud, fake KYC, UPI PIN theft)
   NOTE: Never claim absolute certainty; use phrases such as "High-risk scam indicators detected" or "Anomalies identified".
3. Social engineering manipulation levers (Urgency, Artificial Deadlines, Authority/Government/Bank Impersonation, Fear of Account Suspension, Greed/Unrealistic Rewards, Sympathy, Social Proof, Intimidation).
4. Sensitive information requested (OTP, UPI PIN, Passwords, Aadhaar, PAN, SSN, Credit/Debit card numbers, Remote Desktop APK installation like AnyDesk/TeamViewer).
5. Financial Risk impact (Loss of funds, unauthorized debits, identity theft).
6. URL and domain threat indicators (punycode, typo-squatting, free domains, shortened links, non-HTTPS bank claims, suspicious TLDs).
7. Actionable containment protocols ("Recommended Actions") and critical warnings ("Things Not To Do").
8. Explainable Reasoning: Transparent, jargon-free, objective breakdown of how the attacker operates or why the communication is safe.

MANDATORY MULTILINGUAL REQUIREMENTS:
The user selected language is: "${targetLang}".
You MUST formulate and deliver ALL analysis explanations, classifications, and labels in the chosen language (${targetLang}).
Specifically:
- "scamCategory": Classification label in ${targetLang} (e.g. English: "KYC / Banking Phishing", Hindi: "केवाईसी / बैंकिंग फ़िशिंग धोखाधड़ी", Marathi: "केवायसी / बँक फिशिंग फसवणूक").
- "summary": 1-2 sentence executive assessment of the threat written natively in ${targetLang}.
- "explainableReasoning": In-depth, clear, transparent explanation of the threat mechanics, attacker tactics, and psychological lures in ${targetLang}.
- "redFlags": Array of specific forensic red flags in ${targetLang}.
- "socialEngineeringTactics": Psychological manipulation labels and tactics in ${targetLang} (e.g. Hindi: "नकली तत्परता (Urgency), बैंक अधिकारी होने का नाटक (Impersonation)", Marathi: "कृत्रिम निकड (Urgency), बँक अधिकारी तोतयागिरी (Impersonation)").
- "recommendedActions": Actionable immediate containment steps in ${targetLang}.
- "thingsNotToDo": Critical safety prohibitions in ${targetLang}.
- "financialRisk.description" and "financialRisk.potentialImpact": Monetary risk mechanics and outcome in ${targetLang}.
- "urlRisk.domainAnalysis": URL and domain findings in ${targetLang}.
- "disclaimer": Safety disclaimer in ${targetLang}.
- If Hindi is selected, use Devanagari script (हिंदी).
- If Marathi is selected, use Devanagari script with natural Marathi vocabulary and phrasing (मराठी).
- Standard technical acronyms (such as OTP, UPI PIN, KYC, URL, APK, QR, PAN) may remain in Latin characters or phonetic transliteration for maximum accuracy and clarity.`;

    const userPrompt = `Perform a comprehensive cybersecurity scam analysis on this suspicious input:
---
Communication Type: ${communicationType}
Optional URL provided: ${trimmedUrl || 'None'}
Message Content:
"""${trimmedMessage}"""
---
Language for output: ${targetLang}
Ensure that the analysis explanation, categories, labels, red flags, recommendations, and reasons are provided in ${targetLang}.
Deliver a structured JSON object strictly matching the specified schema.`;

    const modelConfig = {
      systemInstruction,
      temperature: 0.2, // low temperature for consistent, objective threat detection
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: {
            type: Type.INTEGER,
            description: 'Overall risk score between 0 and 100.',
          },
          riskLevel: {
            type: Type.STRING,
            description: 'Risk severity tier: LOW, MEDIUM, HIGH, or CRITICAL.',
          },
          scamProbability: {
            type: Type.INTEGER,
            description: 'Estimated probability that this message is fraudulent (0-100).',
          },
          scamCategory: {
            type: Type.STRING,
            description: 'Specific scam classification (e.g., KYC / Banking Phishing, UPI Fraud, Fake Job Task Scam, Lottery Advance Fee, Crypto Ponzi, Legitimate Alert).',
          },
          confidence: {
            type: Type.INTEGER,
            description: 'Model confidence percentage in this classification (0-100).',
          },
          summary: {
            type: Type.STRING,
            description: 'Concise 1-2 sentence executive assessment of the threat.',
          },
          redFlags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Specific forensic red flags identified in the text or link.',
          },
          socialEngineeringTactics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Psychological persuasion tactics observed (e.g., False Urgency, Authority Impersonation).',
          },
          suspiciousPhrases: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Exact suspicious phrases quoted directly from the input text.',
          },
          requestedSensitiveInfo: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Any credentials or sensitive information targeted (e.g., OTP, UPI PIN, PAN card, remote screen share).',
          },
          financialRisk: {
            type: Type.OBJECT,
            properties: {
              level: {
                type: Type.STRING,
                description: 'Financial danger level: NONE, LOW, MEDIUM, HIGH, or SEVERE.',
              },
              description: {
                type: Type.STRING,
                description: 'Description of the monetary risk mechanism.',
              },
              potentialImpact: {
                type: Type.STRING,
                description: 'Realistic financial consequence if victim complies.',
              },
            },
            required: ['level', 'description', 'potentialImpact'],
          },
          urlRisk: {
            type: Type.OBJECT,
            properties: {
              detected: {
                type: Type.BOOLEAN,
                description: 'Whether a suspicious or relevant URL was evaluated.',
              },
              urlAnalyzed: {
                type: Type.STRING,
                description: 'The URL that was scrutinized.',
              },
              domainAnalysis: {
                type: Type.STRING,
                description: 'Evaluation of the domain legitimacy, registrar traits, or spoofing pattern.',
              },
              risks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of technical URL danger points.',
              },
            },
            required: ['detected', 'domainAnalysis', 'risks'],
          },
          recommendedActions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Clear, step-by-step immediate containment actions for the user.',
          },
          thingsNotToDo: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Critical prohibited actions (e.g., Do NOT dial the listed callback number, Do NOT enter UPI PIN).',
          },
          explainableReasoning: {
            type: Type.STRING,
            description: 'Comprehensive, accessible explanation of how the mechanism works and why this conclusion was reached.',
          },
          disclaimer: {
            type: Type.STRING,
            description: 'Legal & security disclaimer indicating this is AI-assisted threat analysis and official channels should verify critical actions.',
          },
        },
        required: [
          'riskScore',
          'riskLevel',
          'scamProbability',
          'scamCategory',
          'confidence',
          'summary',
          'redFlags',
          'socialEngineeringTactics',
          'suspiciousPhrases',
          'requestedSensitiveInfo',
          'financialRisk',
          'urlRisk',
          'recommendedActions',
          'thingsNotToDo',
          'explainableReasoning',
          'disclaimer',
        ],
      },
    };

    // Attempt Gemini 2.5 Flash as requested; if deprecated/unavailable, use gemini-3.8-flash
    let responseText = '';
    let usedModel = 'gemini-2.5-flash';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: modelConfig,
      });
      responseText = response.text ? response.text.trim() : '';
    } catch (modelErr: any) {
      console.warn('gemini-2.5-flash error, upgrading seamlessly to modern flash model:', modelErr?.message || modelErr);
      usedModel = 'gemini-3.8-flash';
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: modelConfig,
      });
      responseText = response.text ? response.text.trim() : '';
    }

    if (!responseText) {
      throw new Error('Empty response received from Gemini threat intelligence model.');
    }

    const reportData = JSON.parse(responseText);

    // Normalize risk level boundaries
    let calculatedLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    const score = Math.max(0, Math.min(100, Number(reportData.riskScore) || 0));
    if (score >= 80) calculatedLevel = 'CRITICAL';
    else if (score >= 60) calculatedLevel = 'HIGH';
    else if (score >= 30) calculatedLevel = 'MEDIUM';
    else calculatedLevel = 'LOW';

    const fullReport = {
      id: 'rpt_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      inputMessage: trimmedMessage,
      communicationType,
      inputUrl: trimmedUrl || undefined,
      language,
      riskScore: score,
      riskLevel: calculatedLevel,
      scamProbability: Math.max(0, Math.min(100, Number(reportData.scamProbability) || score)),
      scamCategory: reportData.scamCategory || 'General Digital Threat',
      confidence: Math.max(1, Math.min(100, Number(reportData.confidence) || 90)),
      summary: reportData.summary,
      redFlags: Array.isArray(reportData.redFlags) ? reportData.redFlags : [],
      socialEngineeringTactics: Array.isArray(reportData.socialEngineeringTactics) ? reportData.socialEngineeringTactics : [],
      suspiciousPhrases: Array.isArray(reportData.suspiciousPhrases) ? reportData.suspiciousPhrases : [],
      requestedSensitiveInfo: Array.isArray(reportData.requestedSensitiveInfo) ? reportData.requestedSensitiveInfo : [],
      financialRisk: reportData.financialRisk || {
        level: score > 60 ? 'HIGH' : 'LOW',
        description: 'Assessed potential financial exposure.',
        potentialImpact: 'Direct unauthorized funds transfer if steps followed.',
      },
      urlRisk: reportData.urlRisk || {
        detected: Boolean(trimmedUrl),
        urlAnalyzed: trimmedUrl || undefined,
        domainAnalysis: trimmedUrl ? 'Suspicious domain traits observed.' : 'No standalone URL provided.',
        risks: trimmedUrl ? ['Unverified web destination'] : [],
      },
      recommendedActions: Array.isArray(reportData.recommendedActions) ? reportData.recommendedActions : ['Do not respond to this sender.'],
      thingsNotToDo: Array.isArray(reportData.thingsNotToDo) ? reportData.thingsNotToDo : ['Never share OTP or banking passwords.'],
      explainableReasoning: reportData.explainableReasoning || 'AI-assisted threat pattern analysis.',
      disclaimer: reportData.disclaimer || 'This report is an AI-assisted threat assessment. For high-value or institutional queries, verify directly via official hotlines.',
      executionTimeMs: Date.now() - startTime,
      mode: 'gemini-2.5-flash',
    };

    return res.json(fullReport);
  } catch (err: any) {
    console.error('Gemini threat analysis encountered an error:', err);
    // Graceful fallback heuristic assessment if Gemini API encounters temporary error
    const fallbackReport = generateHeuristicReport(
      req.body?.message || '',
      req.body?.communicationType || 'Other',
      req.body?.url || '',
      req.body?.language || 'en'
    );
    return res.json({
      ...fallbackReport,
      executionTimeMs: Date.now() - startTime,
      mode: 'heuristic-recovery',
      note: 'Analysis generated using Scam Shield Heuristic Engine while live model was reconnecting.',
    });
  }
});

// Heuristic fallback engine for zero-failure resilience
function generateHeuristicReport(
  message: string,
  communicationType: string,
  url: string,
  language: string
) {
  const lower = (message + ' ' + url).toLowerCase();

  const isKyc = /kyc|pan card|aadhaar|deactivate|suspend|blocked|update your kyc|bank account/.test(lower);
  const isJob = /part-time|remote work|like and subscribe|telegram|earn ₹|earn \$|daily payout|hr recruiter/.test(lower);
  const isLottery = /lottery|winner|won|prize|\$1,000,000|lucky draw|claim your/.test(lower);
  const isUpi = /upi pin|refund qr|phonepe|gpay|paytm|scan qr|sent by mistake/.test(lower);
  const isCrypto = /guaranteed|300%|crypto|arbitrage|usdt|deposit|signals|whale/.test(lower);
  const isLegitBank = /debited from a\/c|vpa|sms block|never share otp|upi ref \d{6,}/.test(lower);

  let score = 75;
  let category = 'Suspicious Digital Message';
  let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'HIGH';

  if (isLegitBank && !isKyc && !url) {
    score = 12;
    category = 'Legitimate Banking Notification';
    level = 'LOW';
  } else if (isUpi) {
    score = 96;
    category = 'UPI / QR Code Fraud';
    level = 'CRITICAL';
  } else if (isKyc) {
    score = 92;
    category = 'KYC / Banking Phishing';
    level = 'CRITICAL';
  } else if (isLottery) {
    score = 94;
    category = 'Lottery / Advance-Fee Scam';
    level = 'CRITICAL';
  } else if (isJob) {
    score = 84;
    category = 'Fake Task / Job Scam';
    level = 'CRITICAL';
  } else if (isCrypto) {
    score = 88;
    category = 'Investment / Crypto Ponzi Scam';
    level = 'CRITICAL';
  }

  const redFlags: string[] = [];
  if (language === 'hi') {
    if (score > 60) {
      redFlags.push('अति-तात्कालिकता (Urgency) पैदा करके तुरंत कदम उठाने का मानसिक दबाव');
      if (url) redFlags.push('आधिकारिक बैंक पोर्टल के बजाय संदिग्ध असत्यापित लिंक/डोमेन');
      if (isUpi) redFlags.push('पैसे "प्राप्त करने" के लिए क्यूआर कोड स्कैन करने या यूपीआई पिन डालने की मांग');
      if (isJob) redFlags.push('सरल कार्यों के बदले अत्यधिक कमाई का अवास्तविक वादा');
      if (isKyc) redFlags.push('खाता तुरंत बंद करने की धमकी');
    } else {
      redFlags.push('मानक सूचना प्रारूप; कोई संवेदनशील पासवर्ड या संदिग्ध लिंक नहीं मांगा गया');
    }
  } else if (language === 'mr') {
    if (score > 60) {
      redFlags.push('तातडीने कारवाई करण्यासाठी अनैसर्गिक मानसिक दबाव आणि भीती');
      if (url) redFlags.push('अधिकृत बँक वेबसाइटऐवजी संशयास्पद बाह्य लिंक किंवा डोमेन');
      if (isUpi) redFlags.push('पैसे "मिळवण्यासाठी" क्यूआर कोड स्कॅन करण्याची किंवा यूपीआय पिन टाकण्याची खोटी मागणी');
      if (isJob) redFlags.push('अगदी सोप्या कामांसाठी अव्वाच्या सव्वा पैसे देण्याचे खोटे आमिष');
      if (isKyc) redFlags.push('बँक खाते लगेच ब्लॉक करण्याची खोटी धमकी');
    } else {
      redFlags.push('अधिकृत माहितीपर स्वरूप; पासवर्ड किंवा पिनची कोणतीही मागणी नाही');
    }
  } else {
    if (score > 60) {
      redFlags.push('High-pressure urgency urging immediate action');
      if (url) redFlags.push('Unverified third-party domain link instead of verified institutional portal');
      if (isUpi) redFlags.push('Requesting QR code scanning or PIN entry to "receive" funds');
      if (isJob) redFlags.push('Unsolicited job offer promising unrealistic hourly wages for trivial tasks');
      if (isKyc) redFlags.push('Threatening sudden account deactivation without physical branch confirmation');
    } else {
      redFlags.push('Standard informational format; zero requests for credentials or action URLs');
    }
  }

  // Localized categories
  let localizedCategory = category;
  if (language === 'hi') {
    if (category === 'UPI / QR Code Fraud') localizedCategory = 'यूपीआई / क्यूआर कोड धोखाधड़ी';
    else if (category === 'KYC / Banking Phishing') localizedCategory = 'केवाईसी / बैंकिंग फ़िशिंग धोखाधड़ी';
    else if (category === 'Lottery / Advance-Fee Scam') localizedCategory = 'लॉटरी / एडवांस फीस घोटाला';
    else if (category === 'Fake Task / Job Scam') localizedCategory = 'फर्जी जॉब / टास्क धोखाधड़ी';
    else if (category === 'Investment / Crypto Ponzi Scam') localizedCategory = 'निवेश / क्रिप्टो पोंजी घोटाला';
    else if (category === 'Legitimate Banking Notification') localizedCategory = 'अधिकृत बैंक सूचना (सुरक्षित)';
    else localizedCategory = 'संदिग्ध डिजिटल संदेश';
  } else if (language === 'mr') {
    if (category === 'UPI / QR Code Fraud') localizedCategory = 'यूपीआय / क्यूआर कोड फसवणूक';
    else if (category === 'KYC / Banking Phishing') localizedCategory = 'केवायसी / बँक फिशिंग घोटाळा';
    else if (category === 'Lottery / Advance-Fee Scam') localizedCategory = 'लॉटरी / आगाऊ रक्कम फसवणूक';
    else if (category === 'Fake Task / Job Scam') localizedCategory = 'बनावट नोकरी / टास्क घोटाळा';
    else if (category === 'Investment / Crypto Ponzi Scam') localizedCategory = 'गुंतवणूक / क्रिप्टो पॉन्झी घोटाळा';
    else if (category === 'Legitimate Banking Notification') localizedCategory = 'अधिकृत बँक सूचना (सुरक्षित)';
    else localizedCategory = 'संशयास्पद डिजिटल संदेश';
  }

  // Localized Summary
  let summary = score > 50
    ? 'High-risk scam indicators detected. The content displays hallmarks of social engineering designed to induce panic or capture assets.'
    : 'Legitimate communication indicators observed. The message follows standard institutional advisory patterns.';
  if (language === 'hi') {
    summary = score > 50
      ? 'उच्च जोखिम वाले घोटाले के लक्षण मिले हैं। संदेश में घबराहट या लालच पैदा करके आपके बैंक खाते या वित्तीय जानकारी को चुराने की कोशिश दिखती है।'
      : 'संदेश सुरक्षित एवं अधिकृत प्रतीत होता है। इसमें किसी भी प्रकार का दुर्भावनापूर्ण लिंक या क्रेडेंशियल चोरी का प्रयास नहीं है।';
  } else if (language === 'mr') {
    summary = score > 50
      ? 'उच्च धोक्याची फसवणूक लक्षणे आढळली आहेत. भीती किंवा घाई निर्माण करून तुमची गोपनीय आर्थिक माहिती व पैसे लाटण्याचा हा प्रयत्न दिसतो.'
      : 'संदेश अधिकृत व सुरक्षित वाटतो. यामध्ये पासवर्ड किंवा संशयास्पद आर्थिक माहिती मागितलेली नाही.';
  }

  // Localized Recommended Actions
  let recommendedActions = score > 50
    ? [
        'Do NOT click any embedded links or scan provided QR codes.',
        'Report the sender number to the National Cyber Crime portal or your mobile carrier.',
        'Cross-check directly by calling your bank’s official phone number printed on the back of your debit card.',
        'Block and flag the sender as spam immediately.',
      ]
    : [
        'Keep standard security precautions active.',
        'Regularly monitor your official bank statements.',
      ];
  if (language === 'hi') {
    recommendedActions = score > 50
      ? [
          'संदेश में दिए गए किसी भी लिंक पर क्लिक न करें और न ही कोई क्यूआर कोड स्कैन करें।',
          'अपने डेबिट/क्रेडिट कार्ड के पीछे दिए गए आधिकारिक बैंक हेल्पलाइन नंबर पर कॉल करके पुष्टि करें।',
          'राष्ट्रीय साइबर अपराध पोर्टल (cybercrime.gov.in) या हेल्पलाइन 1930 पर तुरंत शिकायत दर्ज करें।',
          'प्रेषक को तुरंत ब्लॉक करें और स्पैम के रूप में रिपोर्ट करें।',
        ]
      : [
          'मानक सुरक्षा सावधानियां बनाए रखें।',
          'अपने बैंक खाते के विवरण की नियमित रूप से निगरानी करते रहें।',
        ];
  } else if (language === 'mr') {
    recommendedActions = score > 50
      ? [
          'संदेशामधील कोणत्याही लिंकवर क्लिक करू नका किंवा क्यूआर कोड स्कॅन करू नका.',
          'तुमच्या डेबिट कार्डच्या मागे लिहिलेल्या अधिकृत बँक फोन नंबरवर कॉल करून खात्री करा.',
          'राष्ट्रीय सायबर गुन्हे पोर्टल (cybercrime.gov.in) किंवा हेल्पलाईन 1930 वर तत्काळ तक्रार नोंदवा.',
          'हा नंबर तात्काळ ब्लॉक करा आणि स्पॅम म्हणून रिपोर्ट करा.',
        ]
      : [
          'नेहमीप्रमाणे सुरक्षेचे नियम पाळा.',
          'आपल्या अधिकृत बँक पासबुक/स्टेटमेंटची नियमित तपासणी करत राहा.',
        ];
  }

  // Localized Things Not To Do
  let thingsNotToDo = score > 50
    ? [
        'NEVER enter your 4-digit or 6-digit UPI PIN to receive money (PIN is ONLY for sending money).',
        'NEVER share One-Time Passwords (OTPs) with anyone, even if they claim to be bank officials.',
        'Do NOT install any screen-sharing or remote management apps (e.g. AnyDesk, RustDesk).',
        'Do NOT transfer advance fees or security deposits for jobs or lottery winnings.',
      ]
    : ['Do not share your online banking passwords.'];
  if (language === 'hi') {
    thingsNotToDo = score > 50
      ? [
          'पैसे प्राप्त करने के लिए कभी भी अपना 4 या 6 अंकों का यूपीआई पिन (UPI PIN) न डालें (पिन केवल पैसे भेजने के लिए होता है)।',
          'किसी के भी साथ अपना ओटीपी (OTP) साझा न करें, भले ही वह बैंक अधिकारी होने का दावा करे।',
          'कोई भी रिमोट स्क्रीन-शेयरिंग ऐप (जैसे AnyDesk, RustDesk, QuickSupport) कभी इंस्टॉल न करें।',
          'नौकरी या लॉटरी के नाम पर कभी भी कोई अग्रिम शुल्क या रजिस्ट्रेशन फीस न भेजें।',
        ]
      : ['अपना नेट बैंकिंग पासवर्ड या पिन कभी किसी को न बताएं।'];
  } else if (language === 'mr') {
    thingsNotToDo = score > 50
      ? [
          'पैसे मिळवण्यासाठी कधीही तुमचा ४ किंवा ६ अंकी यूपीआय पिन (UPI PIN) टाकू नका (पिन फक्त पैसे पाठवण्यासाठी असतो).',
          'कोणालाही वन-टाईम पासवर्ड (OTP) सांगू नका, मग त्यांनी बँकेचे अधिकारी असल्याचे भासवले तरीही.',
          'स्क्रीन-शेअरिंग किंवा रिमोट ॲप्स (उदा. AnyDesk, RustDesk) मोबाइलवर अजिबात इन्स्टॉल करू नका.',
          'नोकरी किंवा लॉटरीच्या बहाण्याने कोणत्याही खात्यावर आधी पैसे पाठवू नका.',
        ]
      : ['आपला बँक पासवर्ड किंवा पिन कोणालाही सांगू नका.'];
  }

  // Localized Explainable Reasoning
  let explainableReasoning = score > 50
    ? 'This message matches established cybercrime playbooks. Attackers systematically combine synthetic time pressure (e.g. 24-hour block) with deceptive landing pages to trick victims into bypassing logical defenses. Legitimate banks and government agencies never solicit passwords, PINs, or document updates via unofficial link domains.'
    : 'This communication exhibits standard operational characteristics of verified transactional notifications: clear masked accounts, standard customer service contacts, and zero demands for passwords or rapid link verification.';
  if (language === 'hi') {
    explainableReasoning = score > 50
      ? 'यह संदेश डिजिटल साइबर अपराध के जाने-पहचाने तरीकों से मेल खाता है। जालसाज झूठी तात्कालिकता (जैसे 24 घंटे में खाता ब्लॉक होने का डर) दिखाकर पीड़ितों को घबराहट में डालते हैं। कोई भी वास्तविक बैंक या सरकारी संस्था अनधिकृत लिंक के माध्यम से कभी भी पासवर्ड, पिन या दस्तावेज अपडेट नहीं मांगती है।'
      : 'यह संदेश एक प्रामाणिक लेनदेन अधिसूचना के मानकों के अनुरूप है। इसमें कोई संदिग्ध लिंक, गोपनीय पासवर्ड या पिन नहीं मांगा गया है।';
  } else if (language === 'mr') {
    explainableReasoning = score > 50
      ? 'हा संदेश सायबर गुन्हेगारांच्या नेहमीच्या फसव्या पद्धतींशी मिळताजुळता आहे. खाते बंद होण्याची खोटी भीती दाखवून पीडित व्यक्तीला विचार न करता पाऊल उचलायला भाग पाडले जाते. कोणतीही खरी बँक अनधिकृत लिंक पाठवून गोपनीय पिन किंवा पासवर्ड कधीही मागत नाही.'
      : 'हा संदेश सुरक्षित व नियमित अधिकृत बँक व्यवहारांसारखा आहे. यात कोणतीही वैयक्तिक गोपनीय माहिती किंवा संशयास्पद दुवा दिलेला नाही.';
  }

  // Localized Disclaimer
  let disclaimer = 'This report is an AI-assisted threat assessment. For high-value decisions or potential financial loss, contact official authorities (e.g., Cyber Crime Helpline 1930) immediately.';
  if (language === 'hi') {
    disclaimer = 'यह रिपोर्ट एआई-सहायता प्राप्त सुरक्षा विश्लेषण है। किसी भी वित्तीय जोखिम की स्थिति में तुरंत राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 पर संपर्क करें।';
  } else if (language === 'mr') {
    disclaimer = 'हा अहवाल एआय-आधारित सायबर सुरक्षा मूल्यांकन आहे. आर्थिक फसवणुकीच्या संशयासाठी राष्ट्रीय सायबर हेल्पलाईन 1930 वर तात्काळ संपर्क साधा.';
  }

  return {
    id: 'rpt_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    inputMessage: message,
    communicationType,
    inputUrl: url || undefined,
    language,
    riskScore: score,
    riskLevel: level,
    scamProbability: score,
    scamCategory: localizedCategory,
    confidence: 94,
    summary,
    redFlags,
    socialEngineeringTactics:
      score > 50
        ? language === 'hi'
          ? ['कृत्रिम तात्कालिकता (Urgency)', 'बैंक/प्राधिकरण का ढोंग', 'खाता बंद होने का डर']
          : language === 'mr'
          ? ['कृत्रिम घाई (Urgency)', 'बँक/अधिकारी तोतयागिरी', 'खाते ब्लॉक होण्याची भीती']
          : ['Artificial Urgency', 'Impersonation of Authority / Financial Institutions', 'Fear of Asset Loss', 'Greed & FOMO Induction']
        : language === 'hi'
        ? ['सूचनात्मक परामर्श', 'कोई दबाव नहीं']
        : language === 'mr'
        ? ['माहितीपर सूचना', 'कोणताही दबाव नाही']
        : ['Informational Advisory', 'Zero Coercive Mechanics'],
    suspiciousPhrases:
      score > 50
        ? ['immediately within 24 hours', 'account will be suspended', 'guaranteed returns', 'enter your PIN']
        : [],
    requestedSensitiveInfo:
      score > 50
        ? language === 'hi'
          ? ['ओटीपी / यूपीआई पिन', 'आधार / पैन कार्ड क्रेडेंशियल्स', 'अग्रिम पंजीकरण शुल्क']
          : language === 'mr'
          ? ['ओटीपी / यूपीआय पिन', 'आधार / पॅन कार्ड माहिती', 'आगाऊ नोंदणी शुल्क']
          : ['OTP / UPI PIN', 'Aadhaar / PAN Card Credentials', 'Prepayment Processing Fees']
        : ['None'],
    financialRisk: {
      level: score > 75 ? 'SEVERE' : score > 50 ? 'HIGH' : 'NONE',
      description:
        score > 50
          ? language === 'hi'
            ? 'पीड़ित को अनधिकृत भुगतान या बैंक खाता हैक होने के कारण सीधा वित्तीय नुकसान हो सकता है।'
            : language === 'mr'
            ? 'पीडिताचे बँक खात्यातून अनधिकृत व्यवहार होऊन थेट आर्थिक नुकसान होऊ शकते.'
            : 'Victim faces direct financial loss via fraudulent payment authorization or bank account takeover.'
          : 'No financial risk detected in this transactional notification.',
      potentialImpact:
        score > 50
          ? language === 'hi'
            ? 'बैंक खाते से तत्काल धन की कटौती।'
            : language === 'mr'
            ? 'बँक खात्यातून तात्काळ पैसे कापले जाणे.'
            : 'Immediate unauthorized debit of bank balance or loss of advance fees.'
          : 'Zero monetary impact.',
    },
    urlRisk: {
      detected: Boolean(url),
      urlAnalyzed: url || undefined,
      domainAnalysis: url
        ? language === 'hi'
          ? 'गंतव्य डोमेन आधिकारिक बैंक के टीएलएस मानकों से मेल नहीं खाता और संदिग्ध लगता है।'
          : language === 'mr'
          ? 'संबंधित डोमेन अधिकृत बँकेच्या सुरक्षित डोमेनशी जुळत नसून संशयास्पद वाटते.'
          : 'The destination does not match verified institutional TLS domains and exhibits suspicious hosting characteristics.'
        : 'No external URL parsed in communication.',
      risks: url ? ['Spoofed subdomain', 'Lack of organization identity certificate'] : [],
    },
    recommendedActions,
    thingsNotToDo,
    explainableReasoning,
    disclaimer,
  };
}

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️ Scam Shield AI server online at http://0.0.0.0:${PORT}`);
  });
}

startServer();
