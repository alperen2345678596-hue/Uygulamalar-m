
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

export interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  org: string;
  asn: string;
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
