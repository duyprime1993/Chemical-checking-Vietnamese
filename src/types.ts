export interface ExtractedEntities {
  casNumbers: string[];
  certificateNumber?: string;
  reportNumber?: string;
  companyName?: string;
  supplier?: string;
  testingDate?: string;
  expiryDate?: string;
  chemicalName?: string;
  mrslVersion?: string;
  signatureFound?: boolean;
  qrCodeFound?: boolean;
  stampFound?: boolean;
  labName?: string;
}

export interface RedFlag {
  id: string;
  category: 'visual' | 'logical' | 'database' | 'metadata' | 'signature';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  evidence: string;
}

export interface ChemicalCheck {
  cas: string;
  chemicalName: string;
  exists: boolean;
  matchesCasName: boolean;
  zdhcLevel?: string; // e.g. L0, L1, L2, L3, Banned
  svhcStatus?: string; // e.g. Under Review, Listed, Safe
  gotsApproval?: string; // Approved, Restricted, Prohibited
  riskLevel: 'low' | 'medium' | 'high';
  note: string;
}

export interface DatabaseCheck {
  source: string; // e.g., "ZDHC Gateway", "ECHA (SVHC List)", "GOTS Database", "SGS Verification Portal"
  checkedItem: string;
  status: 'MATCH' | 'MISMATCH' | 'NOT_FOUND';
  details: string;
}

export interface ForensicDetail {
  checkType: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  message: string;
}

export interface DocumentVerificationResult {
  id: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  timestamp: string;
  overallScore: number; // 0 to 100 represent fake probability
  visualScore: number;
  chemicalScore: number;
  databaseScore: number;
  metadataScore: number;
  signatureScore: number;
  verdict: 'GENUINE' | 'SUSPICIOUS' | 'FAKE';
  confidence: number; // 0 to 100
  metadataInfo?: Record<string, string>;
  extractedEntities: ExtractedEntities;
  redFlags: RedFlag[];
  chemicalChecks: ChemicalCheck[];
  databaseChecks: DatabaseCheck[];
  forensicDetails: ForensicDetail[];
  recommendation: string;
  feedback?: 'GENUINE' | 'FAKE' | null;
  source?: 'gemini-api' | 'local-heuristic-bypass' | 'cache';
}

export interface CustomVerificationHistory {
  id: string;
  fileName: string;
  verdct: 'GENUINE' | 'SUSPICIOUS' | 'FAKE';
  score: number;
  timestamp: string;
}
