
export interface DNSServer {
  id: string;
  name: string;
  provider: string;
  dohUrl: string;
  isCustom?: boolean;
}

export interface TestResult {
  serverId: string;
  latency: number;
  status: 'success' | 'error';
  timestamp: number;
  answerCount?: number;
}

export interface DNSAnalysis {
  recommendation: string;
  explanation: string;
  securityScore: number;
}

export enum DNSRecordType {
  A = 'A',
  AAAA = 'AAAA',
  MX = 'MX',
  CNAME = 'CNAME',
  TXT = 'TXT',
  NS = 'NS'
}

export interface ModemCredential {
  brand: string;
  model?: string;
  defaultIp: string;
  username: string;
  password: string;
  notes?: string;
}
