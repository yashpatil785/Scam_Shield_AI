export type CommunicationType =
  | 'SMS'
  | 'WhatsApp'
  | 'Email'
  | 'Job Offer'
  | 'Banking'
  | 'UPI'
  | 'Investment'
  | 'Social Media'
  | 'Other';

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FinancialRiskDetails {
  level: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'SEVERE';
  description: string;
  potentialImpact: string;
}

export interface UrlRiskDetails {
  detected: boolean;
  urlAnalyzed?: string;
  domainAnalysis: string;
  risks: string[];
}

export interface ScamAnalysisReport {
  id: string;
  timestamp: string;
  inputMessage: string;
  communicationType: CommunicationType;
  inputUrl?: string;
  language: SupportedLanguage;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  scamProbability: number; // 0 - 100
  scamCategory: string;
  confidence: number; // 0 - 100
  summary: string;
  redFlags: string[];
  socialEngineeringTactics: string[];
  suspiciousPhrases: string[];
  requestedSensitiveInfo: string[];
  financialRisk: FinancialRiskDetails;
  urlRisk: UrlRiskDetails;
  recommendedActions: string[];
  thingsNotToDo: string[];
  explainableReasoning: string;
  disclaimer: string;
  executionTimeMs?: number;
}

export interface AnalysisRequest {
  message: string;
  communicationType: CommunicationType;
  url?: string;
  language: SupportedLanguage;
}

export interface DemoScamExample {
  id: string;
  title: string;
  category: string;
  expectedRisk: RiskLevel;
  communicationType: CommunicationType;
  message: string;
  url?: string;
  description: string;
  isLegitimate?: boolean;
}
