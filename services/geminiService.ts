
import { GoogleGenAI, Type } from "@google/genai";
import { TestResult, DNSServer } from "../types";

export async function analyzeResults(
  results: TestResult[],
  servers: DNSServer[],
  domain: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const resultsData = results
    .filter(r => r.status === 'success')
    .map(r => {
      const s = servers.find(srv => srv.id === r.serverId);
      return `${s?.name}: ${r.latency}ms`;
    })
    .join(', ');

  const prompt = `
    Analyze these DNS performance test results for the domain "${domain}":
    Results: ${resultsData}

    Provide a concise analysis in Turkish:
    1. Which provider is objectively the best for this user right now based on latency?
    2. Briefly explain what DNS latency means for browsing experience.
    3. Mention if any provider is significantly slower and why that might happen (routing, location).
    4. Provide a tip for better network security (mentioning Quad9 or Cloudflare's security features).
    
    Keep the tone professional and technical yet accessible. Use markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Analiz üretilemedi.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.";
  }
}
