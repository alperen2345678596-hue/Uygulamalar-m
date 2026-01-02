
import { TestResult } from '../types';

export async function testDNSServer(domain: string, dohUrl: string, serverId: string): Promise<TestResult> {
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = new URL(dohUrl);
    
    // Set standard parameters
    url.searchParams.set('name', domain);
    url.searchParams.set('type', 'A');
    
    // IMPORTANT: For many DoH providers (like Quad9, Cloudflare, NextDNS) using GET, 
    // you MUST set 'ct' (Content-Type) to 'application/dns-json' in the query string 
    // to receive a JSON response instead of a binary DNS message (which browsers can't easily parse as JSON).
    // This also helps avoid HTTP 400 errors.
    if (!dohUrl.includes('/resolve')) {
      url.searchParams.set('ct', 'application/dns-json');
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/dns-json',
      },
      // Ensure we don't send credentials which can trigger strict CORS preflights
      credentials: 'omit',
      mode: 'cors',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Log the specific status to help debugging
      console.warn(`DNS Provider ${serverId} returned status ${response.status}`);
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.warn(`Provider ${serverId} (${dohUrl}) did not return valid JSON. Response start: ${text.substring(0, 50)}`);
      throw new Error('Invalid JSON format');
    }

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    // Answer count varies by provider JSON schema (usually Answer array)
    const answerCount = data.Answer?.length || (data.Status === 0 ? 0 : 0);

    return {
      serverId,
      latency,
      status: 'success',
      timestamp: Date.now(),
      answerCount
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // Detailed error logging for the developer
    if (error.name === 'AbortError') {
      console.error(`DNS Test timeout for ${serverId}`);
    } else {
      console.error(`DNS Test fail for ${serverId}:`, error.message);
    }

    return {
      serverId,
      latency: 0,
      status: 'error',
      timestamp: Date.now(),
    };
  }
}
