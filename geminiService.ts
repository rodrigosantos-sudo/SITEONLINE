import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async askProductAdvisor(userQuery: string, inventory: Product[]): Promise<string> {
    if (!process.env.API_KEY) {
      return "Estou em modo de demonstração sem uma chave de API. Imagine que eu acabei de te dar uma recomendação brilhante para o iPhone 15 Pro Max!";
    }

    try {
      const inventoryContext = inventory.map(p => `${p.name} (R$ ${p.price}): ${p.description} - ${p.inStock ? 'Em estoque' : 'Esgotado'}`).join('\n');
      
      const systemPrompt = `
        Você é um Especialista da Apple Store Brasil (Icrazybr).
        Seu objetivo é ajudar clientes a escolherem produtos baseados em suas necessidades e no catálogo da Icrazybr.
        
        Aqui está o inventário atual da loja (Preços de Compra Programada):
        ${inventoryContext}
        
        Regras:
        1. Apenas recomende produtos que estão na lista de inventário.
        2. Seja conciso, amigável e profissional (tom de voz da Apple).
        3. Explique POR QUE o produto se encaixa na necessidade do usuário.
        4. Se o usuário perguntar por algo fora de estoque, informe educadamente.
        5. Reforce que os preços são para "Compra Programada" com entrega de 15 a 30 dias.
        6. Responda sempre em Português do Brasil.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userQuery,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      });

      return response.text || "Estou tendo dificuldades para pensar agora. Por favor, tente novamente.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Estou com dificuldades para conectar ao servidor. Verifique sua conexão.";
    }
  }
}