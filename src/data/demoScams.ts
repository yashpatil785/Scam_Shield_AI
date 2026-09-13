import { DemoScamExample } from '../types';

export const DEMO_SCAM_EXAMPLES: DemoScamExample[] = [
  {
    id: 'demo-kyc',
    title: 'Bank KYC Deactivation Threat',
    category: 'KYC / Banking Phishing',
    expectedRisk: 'CRITICAL',
    communicationType: 'SMS',
    url: 'http://sbi-kyc-update-net.in/login.php',
    message:
      'Dear Customer, Your SBI account number ending in 4920 has been temporarily suspended due to pending KYC verification. Please click http://sbi-kyc-update-net.in/login.php immediately within 24 hours to update your PAN & Aadhaar details or your account will be permanently blocked.',
    description:
      'Classic banking smishing targeting PAN and Aadhaar credentials through synthetic urgency and a deceptive domain.',
    isLegitimate: false,
  },
  {
    id: 'demo-job',
    title: 'YouTube Part-Time Job Offer',
    category: 'Fake Job Offer',
    expectedRisk: 'HIGH',
    communicationType: 'WhatsApp',
    url: 'https://t.me/hr_global_career_recruit',
    message:
      'Hello Dear! I am Emily from Global Media HR. We have part-time remote openings requiring only 15-20 minutes a day. Simply like and subscribe to YouTube video channels and earn ₹3,000 to ₹8,500 daily! Daily payouts via UPI/GPay. No experience needed. Join our Telegram recruiter now: https://t.me/hr_global_career_recruit to claim ₹500 joining bonus!',
    description:
      'Prevalent task scam where victims are lured with small early payouts before being asked for "prepayment security deposits".',
    isLegitimate: false,
  },
  {
    id: 'demo-lottery',
    title: 'Google Annual Lucky Winner',
    category: 'Lottery / Prize Scam',
    expectedRisk: 'CRITICAL',
    communicationType: 'Email',
    url: 'http://claim-google-draw-prize.org/verify',
    message:
      'OFFICIAL WINNING NOTIFICATION: Your email address was randomly selected as the 1st prize winner of $1,500,000 USD in the Google Global 25th Anniversary Lucky Draw! To process the disbursement of your funds, reply with your Full Name, Bank Account Number, Passport Copy, and transfer an initial administrative fee of $250 for international clearance.',
    description:
      'Advance-fee fraud impersonating a major tech brand demanding personal identification and advance fees.',
    isLegitimate: false,
  },
  {
    id: 'demo-upi',
    title: 'Mistaken UPI Transfer & QR Code Fraud',
    category: 'UPI / Payment Scam',
    expectedRisk: 'CRITICAL',
    communicationType: 'UPI',
    url: '',
    message:
      'Sir, I accidentally sent ₹15,000 to your PhonePe mobile number instead of my brother in hospital. Please help me, he needs surgery urgently! I am sending you a refund QR code. Just scan it in your GooglePay/PhonePe and enter your 6-digit UPI PIN to approve the return back to me. God bless you!',
    description:
      'Exploits human empathy; scanning a QR code and typing your UPI PIN always DEBITS money from your account, never receives it.',
    isLegitimate: false,
  },
  {
    id: 'demo-crypto',
    title: 'Telegram AI Crypto Arbitrage Guaranteed Returns',
    category: 'Investment / Crypto Scam',
    expectedRisk: 'HIGH',
    communicationType: 'Investment',
    url: 'https://t.me/VIP_Whale_CryptoSignals_Official',
    message:
      'Guaranteed 350% profit in 48 hours! Join our VIP Telegram AI Quantum Arbitrage Group. Minimum investment $100 returns $450 guaranteed. Zero risk backed by smart contract reserve. 500+ members already withdraw daily. Deposit USDT now to reserve your slot before spots close at midnight!',
    description:
      'High-yield investment fraud (Ponzi/Pig Butchering) offering mathematically impossible risk-free returns.',
    isLegitimate: false,
  },
  {
    id: 'demo-legit-bank',
    title: 'Genuine Bank Debit Alert',
    category: 'Legitimate Banking Notification',
    expectedRisk: 'LOW',
    communicationType: 'Banking',
    url: '',
    message:
      'HDFC Bank: INR 450.00 debited from a/c **9812 on 10-SEP-26 to VPA zomato@icici (UPI Ref 425319871024). Not you? Call 18002586161 or SMS BLOCK to 5676712 immediately. Never share OTP or PIN with anyone.',
    description:
      'Standard factual bank notification with masked account number, transaction reference, and standard bank helpline.',
    isLegitimate: true,
  },
  {
    id: 'demo-legit-interview',
    title: 'Verified Corporate Interview Confirmation',
    category: 'Legitimate Employment Communication',
    expectedRisk: 'LOW',
    communicationType: 'Job Offer',
    url: 'https://meet.google.com/abc-defg-hij',
    message:
      'Hi Sarah, Thank you for speaking with our talent acquisition team yesterday. We would like to invite you for a 45-minute technical interview for the Frontend Engineer position on Friday at 2:00 PM IST via Google Meet (meet.google.com/abc-defg-hij). No preparation or fees are required. You may reach out to recruiting@verifiedcompany.com for any scheduling adjustments.',
    description:
      'Legitimate corporate communication with professional tone, official domain email, clear schedule, and zero fee demands.',
    isLegitimate: true,
  },
];
