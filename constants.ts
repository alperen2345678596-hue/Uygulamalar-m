
import { DNSServer, ModemCredential } from './types';

export const POPULAR_DNS: DNSServer[] = [
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    provider: '1.1.1.1',
    dohUrl: 'https://cloudflare-dns.com/dns-query'
  },
  {
    id: 'google',
    name: 'Google Public DNS',
    provider: '8.8.8.8',
    dohUrl: 'https://dns.google/resolve'
  },
  {
    id: 'nextdns',
    name: 'NextDNS',
    provider: 'NextDNS',
    dohUrl: 'https://dns.nextdns.io/dns-query'
  },
  {
    id: 'adguard',
    name: 'AdGuard DNS',
    provider: '94.140.14.14',
    dohUrl: 'https://dns.adguard-dns.com/resolve'
  },
  {
    id: 'quad9',
    name: 'Quad9',
    provider: '9.9.9.9',
    dohUrl: 'https://dns.quad9.net/dns-query'
  }
];

export const DEFAULT_DOMAIN = 'google.com';

export const MODEM_DATA: ModemCredential[] = [
  { brand: 'TP-Link', defaultIp: '192.168.1.1', username: 'admin', password: 'admin', notes: 'Bazı modellerde admin/password' },
  { brand: 'TP-Link (Archer)', defaultIp: '192.168.0.1', username: 'admin', password: 'admin' },
  { brand: 'Asus', defaultIp: '192.168.1.1', username: 'admin', password: 'admin' },
  { brand: 'Zyxel', defaultIp: '192.168.1.1', username: 'admin', password: '1234' },
  { brand: 'Huawei', defaultIp: '192.168.1.1', username: 'admin', password: 'admin' },
  { brand: 'Huawei (Superonline)', defaultIp: '192.168.1.1', username: 'admin', password: 'superonline' },
  { brand: 'Netgear', defaultIp: '192.168.1.1', username: 'admin', password: 'password' },
  { brand: 'D-Link', defaultIp: '192.168.0.1', username: 'admin', password: 'Boş Bırakın' },
  { brand: 'Linksys', defaultIp: '192.168.1.1', username: 'admin', password: 'admin' },
  { brand: 'Tenda', defaultIp: '192.168.0.1', username: 'admin', password: 'admin' },
  { brand: 'Keenetic', defaultIp: '192.168.1.1', username: 'admin', password: 'Kurulumda Belirlenir' },
  { brand: 'Xiaomi (Mi Router)', defaultIp: '192.168.31.1', username: 'admin', password: 'Kurulumda Belirlenir' },
  { brand: 'Airties', defaultIp: '192.168.2.1', username: 'admin', password: 'Boş Bırakın' },
  { brand: 'Turk Telekom (ZTE)', defaultIp: '192.168.1.1', username: 'admin', password: 'ttnet' },
  { brand: 'TurkNet (Zyxel)', defaultIp: '192.168.1.1', username: 'admin', password: '1234' }
];
