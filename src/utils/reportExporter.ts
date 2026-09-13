import { jsPDF } from 'jspdf';
import { ScamAnalysisReport } from '../types';

/**
 * Downloads the analysis report as a formatted JSON file.
 */
export function downloadReportAsJson(report: ScamAnalysisReport): boolean {
  try {
    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeId = report.id ? report.id.slice(0, 8) : Date.now().toString().slice(-6);
    link.download = `scam-shield-report-${safeId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to export JSON report:', err);
    return false;
  }
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function getRiskColor(level: string): { primary: RgbColor; bg: RgbColor; text: RgbColor } {
  switch (level?.toUpperCase()) {
    case 'CRITICAL':
      return {
        primary: { r: 225, g: 29, b: 72 }, // rose-600
        bg: { r: 254, g: 242, b: 242 },     // rose-50
        text: { r: 159, g: 18, b: 57 },     // rose-800
      };
    case 'HIGH':
      return {
        primary: { r: 234, g: 88, b: 12 }, // orange-600
        bg: { r: 255, g: 247, b: 237 },    // orange-50
        text: { r: 154, g: 52, b: 18 },     // orange-800
      };
    case 'MEDIUM':
      return {
        primary: { r: 217, g: 119, b: 6 },  // amber-600
        bg: { r: 254, g: 252, b: 232 },    // amber-50
        text: { r: 146, g: 64, b: 14 },     // amber-800
      };
    case 'LOW':
    default:
      return {
        primary: { r: 16, g: 185, b: 129 }, // emerald-500
        bg: { r: 236, g: 253, b: 245 },     // emerald-50
        text: { r: 6, g: 95, b: 70 },       // emerald-800
      };
  }
}

/**
 * Generates and downloads an executive-grade cybersecurity PDF report.
 */
export function downloadReportAsPdf(report: ScamAnalysisReport): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const riskColors = getRiskColor(report.riskLevel);

    // Helper: check page break
    const ensureSpace = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 18) {
        doc.addPage();
        y = margin + 8;
        drawPageHeader();
      }
    };

    const drawPageHeader = () => {
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, 8, contentWidth, 0.8, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('SCAM SHIELD AI • FORENSIC THREAT INTELLIGENCE REPORT', margin, 6);
      doc.text(`ID: ${report.id}`, pageWidth - margin, 6, { align: 'right' });
    };

    // --- COVER / FIRST PAGE HEADER ---
    // Top banner card
    doc.setFillColor(15, 23, 42); // Dark slate
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

    // Accent line on banner
    doc.setFillColor(riskColors.primary.r, riskColors.primary.g, riskColors.primary.b);
    doc.rect(margin, y, 3, 24, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('SCAM SHIELD AI • THREAT INTELLIGENCE REPORT', margin + 6, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    const scanDate = new Date(report.timestamp).toLocaleString();
    doc.text(`Analyzed: ${scanDate}   |   Channel: ${report.communicationType}   |   Engine: Gemini AI`, margin + 6, y + 14);
    doc.text(`Report Ref: #${report.id}`, margin + 6, y + 19);

    y += 28;

    // --- EXECUTIVE RISK SCORE CARD ---
    ensureSpace(34);
    const riskBoxHeight = 30;
    doc.setFillColor(riskColors.bg.r, riskColors.bg.g, riskColors.bg.b);
    doc.setDrawColor(riskColors.primary.r, riskColors.primary.g, riskColors.primary.b);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, riskBoxHeight, 2, 2, 'FD');

    // Left block: Risk Score
    doc.setFillColor(riskColors.primary.r, riskColors.primary.g, riskColors.primary.b);
    doc.roundedRect(margin + 4, y + 4, 32, 22, 1.5, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`${report.riskScore}`, margin + 20, y + 14, { align: 'center' });
    doc.setFontSize(7);
    doc.text('/ 100 RISK', margin + 20, y + 20, { align: 'center' });

    // Middle block: Category & Level
    doc.setTextColor(riskColors.text.r, riskColors.text.g, riskColors.text.b);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`THREAT LEVEL: ${report.riskLevel} PRIORITY`, margin + 40, y + 10);

    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(`Category: ${report.scamCategory}`, margin + 40, y + 16);

    // Right metrics: Probability & Confidence
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Scam Probability: ${report.scamProbability}%`, margin + 40, y + 22);
    doc.text(`AI Confidence: ${report.confidence}%`, margin + 95, y + 22);
    doc.text(`Language: ${report.language.toUpperCase()}`, margin + 145, y + 22);

    y += riskBoxHeight + 5;

    // --- EXECUTIVE SUMMARY ---
    ensureSpace(24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('EXECUTIVE THREAT SUMMARY', margin, y + 4);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const summaryLines = doc.splitTextToSize(report.summary, contentWidth - 6);
    const summaryBoxHeight = summaryLines.length * 4.2 + 6;
    ensureSpace(summaryBoxHeight);

    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, summaryBoxHeight, 1.5, 1.5, 'FD');
    doc.text(summaryLines, margin + 3, y + 5);

    y += summaryBoxHeight + 5;

    // --- CRITICAL WHAT NOT TO DO (SAFETY DIRECTIVES) ---
    if (report.thingsNotToDo && report.thingsNotToDo.length > 0) {
      ensureSpace(25);
      doc.setFillColor(254, 242, 242); // soft red
      doc.setDrawColor(239, 68, 68);
      doc.setLineWidth(0.4);

      // Pre-calculate height for items
      const notToDoLines: string[][] = report.thingsNotToDo.map((item) =>
        doc.splitTextToSize(`• ${item}`, contentWidth - 12)
      );
      const totalItemLines = notToDoLines.reduce((acc, cur) => acc + cur.length, 0);
      const directivesBoxHeight = totalItemLines * 4 + 11;

      ensureSpace(directivesBoxHeight);
      doc.roundedRect(margin, y, contentWidth, directivesBoxHeight, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(185, 28, 28); // red-700
      doc.text('CRITICAL SAFETY DIRECTIVES - WHAT YOU MUST NOT DO', margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(127, 29, 29); // red-900

      let dy = y + 9;
      notToDoLines.forEach((lines) => {
        doc.text(lines, margin + 5, dy);
        dy += lines.length * 4;
      });

      y += directivesBoxHeight + 5;
    }

    // --- DETECTED RED FLAGS ---
    if (report.redFlags && report.redFlags.length > 0) {
      ensureSpace(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('DETECTED RED FLAGS & RISK INDICATORS', margin, y + 4);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      report.redFlags.forEach((flag) => {
        const flagLines = doc.splitTextToSize(`[!] ${flag}`, contentWidth - 6);
        const itemH = flagLines.length * 4 + 2;
        ensureSpace(itemH);

        doc.setFillColor(255, 241, 242); // rose-50
        doc.setDrawColor(254, 205, 211); // rose-200
        doc.setLineWidth(0.2);
        doc.roundedRect(margin, y, contentWidth, itemH, 1, 1, 'FD');

        doc.setTextColor(159, 18, 57);
        doc.text(flagLines, margin + 3, y + 3.5);
        y += itemH + 1.5;
      });
      y += 3;
    }

    // --- SOCIAL ENGINEERING & SENSITIVE CREDENTIALS ---
    ensureSpace(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('SOCIAL ENGINEERING & SENSITIVE DATA TARGETING', margin, y + 4);
    y += 6;

    // Tactics
    const tacticsStr = report.socialEngineeringTactics.join('  •  ');
    const tacticLines = doc.splitTextToSize(`Tactics: ${tacticsStr}`, contentWidth - 6);
    const tacticH = tacticLines.length * 4 + 4;
    ensureSpace(tacticH);

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, y, contentWidth, tacticH, 1, 1, 'FD');
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(tacticLines, margin + 3, y + 3.5);
    y += tacticH + 2;

    // Requested credentials
    if (report.requestedSensitiveInfo && report.requestedSensitiveInfo.length > 0) {
      const infoStr = report.requestedSensitiveInfo.join('  |  ');
      const infoLines = doc.splitTextToSize(`Targeted Credentials/Data: ${infoStr}`, contentWidth - 6);
      const infoH = infoLines.length * 4 + 4;
      ensureSpace(infoH);

      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(252, 165, 165);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, infoH, 1, 1, 'FD');
      doc.setTextColor(185, 28, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(infoLines, margin + 3, y + 3.5);
      y += infoH + 3;
    }

    // --- FLAGGED SUSPICIOUS PHRASES ---
    if (report.suspiciousPhrases && report.suspiciousPhrases.length > 0) {
      ensureSpace(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('FLAGGED FORENSIC PHRASES', margin, y + 4);
      y += 6;

      const phrasesFormatted = report.suspiciousPhrases.map((p) => `"${p}"`).join('   ');
      const phraseLines = doc.splitTextToSize(phrasesFormatted, contentWidth - 6);
      const phraseH = phraseLines.length * 4 + 4;
      ensureSpace(phraseH);

      doc.setFillColor(254, 249, 195); // amber-50
      doc.setDrawColor(253, 224, 71); // amber-300
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, y, contentWidth, phraseH, 1, 1, 'FD');

      doc.setTextColor(146, 64, 14);
      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.text(phraseLines, margin + 3, y + 3.5);
      y += phraseH + 3;
    }

    // --- FINANCIAL EXPOSURE & URL RISK ---
    ensureSpace(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('FINANCIAL & TECHNICAL THREAT VECTORS', margin, y + 4);
    y += 6;

    const finText = `Level: ${report.financialRisk.level} | Mechanism: ${report.financialRisk.description} | Impact: ${report.financialRisk.potentialImpact}`;
    const finLines = doc.splitTextToSize(finText, contentWidth - 6);
    const finH = finLines.length * 4 + 4;
    ensureSpace(finH);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, finH, 1, 1, 'FD');
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(finLines, margin + 3, y + 3.5);
    y += finH + 2;

    if (report.urlRisk.urlAnalyzed || report.urlRisk.domainAnalysis) {
      const urlText = `Link / Domain: ${report.urlRisk.urlAnalyzed || 'None specified'} | Analysis: ${report.urlRisk.domainAnalysis}`;
      const urlLines = doc.splitTextToSize(urlText, contentWidth - 6);
      const urlH = urlLines.length * 4 + 4;
      ensureSpace(urlH);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, urlH, 1, 1, 'FD');
      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(urlLines, margin + 3, y + 3.5);
      y += urlH + 3;
    }

    // --- RECOMMENDED SECURITY ACTIONS ---
    if (report.recommendedActions && report.recommendedActions.length > 0) {
      ensureSpace(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('RECOMMENDED SECURITY CONTAINMENT ACTIONS', margin, y + 4);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      report.recommendedActions.forEach((action, idx) => {
        const actionLines = doc.splitTextToSize(`[Step ${idx + 1}] ${action}`, contentWidth - 6);
        const itemH = actionLines.length * 4 + 2;
        ensureSpace(itemH);

        doc.setFillColor(240, 253, 244); // emerald-50
        doc.setDrawColor(187, 247, 208); // emerald-200
        doc.setLineWidth(0.2);
        doc.roundedRect(margin, y, contentWidth, itemH, 1, 1, 'FD');

        doc.setTextColor(6, 95, 70);
        doc.text(actionLines, margin + 3, y + 3.5);
        y += itemH + 1.5;
      });
      y += 3;
    }

    // --- AI FORENSIC REASONING ---
    if (report.explainableReasoning) {
      ensureSpace(24);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('AI FORENSIC REASONING & ANOMALY BREAKDOWN', margin, y + 4);
      y += 6;

      const reasonLines = doc.splitTextToSize(report.explainableReasoning, contentWidth - 6);
      const reasonH = reasonLines.length * 3.8 + 5;
      ensureSpace(reasonH);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, y, contentWidth, reasonH, 1, 1, 'FD');

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.text(reasonLines, margin + 3, y + 4);
      y += reasonH + 3;
    }

    // --- SUBMITTED AUDIT PAYLOAD ---
    if (report.inputMessage) {
      ensureSpace(24);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('SUBMITTED SUSPICIOUS CONTENT (AUDIT TRAIL)', margin, y + 4);
      y += 5;

      const sampleMsg = report.inputMessage.length > 500
        ? report.inputMessage.slice(0, 500) + '... [TRUNCATED IN AUDIT LOG]'
        : report.inputMessage;
      const msgLines = doc.splitTextToSize(sampleMsg, contentWidth - 6);
      const msgH = Math.min(msgLines.length * 3.5 + 4, 30);
      ensureSpace(msgH);

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, y, contentWidth, msgH, 1, 1, 'FD');
      doc.setTextColor(71, 85, 105);
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.text(msgLines.slice(0, 7), margin + 3, y + 3.5);
      y += msgH + 4;
    }

    // --- HELPLINES & LEGAL DISCLAIMER ---
    ensureSpace(24);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 18, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('INCIDENT REPORTING & EMERGENCY HELPLINES:', margin + 3, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(
      'India: Dial 1930 / https://cybercrime.gov.in  |  USA: https://reportfraud.ftc.gov & https://ic3.gov  |  UK: Action Fraud 0300 123 2040',
      margin + 3,
      y + 8
    );
    doc.text(
      `Disclaimer: ${report.disclaimer.slice(0, 140)}...`,
      margin + 3,
      y + 13
    );

    // --- FOOTERS ON ALL PAGES ---
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, pageHeight - 12, contentWidth, 0.4, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Generated by Scam Shield AI • Threat Intel Reference #${report.id.slice(0, 8)}`,
        margin,
        pageHeight - 8
      );
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    const safeId = report.id ? report.id.slice(0, 8) : Date.now().toString().slice(-6);
    doc.save(`scam-shield-report-${safeId}.pdf`);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF report:', err);
    return false;
  }
}
