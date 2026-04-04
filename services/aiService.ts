import { GoogleGenerativeAI } from "@google/generative-ai";

// For Expo, we use EXPO_PUBLIC_ prefix for env variables
const API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY || "").trim();

const genAI = new GoogleGenerativeAI(API_KEY);

let globalDisputeVerdict: string | null = null;
export const getGlobalVerdict = () => globalDisputeVerdict;
export const setGlobalVerdict = (v: string | null) => { globalDisputeVerdict = v; };

export const translateText = async (text: string, targetLanguage: string) => {
  if (!API_KEY) {
    console.warn("Gemini API Key missing. Returning original text.");
    return text;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }, { apiVersion: 'v1beta' });
    const prompt = `Translate the following rental agreement text into ${targetLanguage}. 
    Keep the tone professional and maintain the legal context. 
    Only return the translated text, no other conversation.
    Text: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export const chatWithGemini = async (message: string, history: { role: string; parts: { text: string }[] }[], agreementContext?: string) => {
  if (!API_KEY) {
    return "I'm sorry, but I can't help right now as the AI assistant is not fully configured. Please check back later.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }, { apiVersion: 'v1beta' });
    
    let systemPrompt = "You are a helpful AI assistant for Tenant-Bridge, an app for managing rental agreements and disputes in India. Your goal is to help owners and tenants manage their agreements, resolve disputes fairly, and answer questions about rental laws in India. ";
    
    if (agreementContext) {
      systemPrompt += `\n\nIMPORTANT: Here are the clauses of the current user's agreement. Base your answers on these terms when asked about their lease:\n"""\n${agreementContext}\n"""\n`;
    }
    
    systemPrompt += `\nCRITICAL INSTRUCTION: If the user describes a serious dispute (e.g., eviction, physical violence, large financial fraud, unlivable conditions without repair), you must include the exact string "[SERIOUS_DISPUTE_ESCALATION]" anywhere in your response. This will trigger our app to show a Legal Consultant button. Advise them to seek professional legal help.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am the Tenant-Bridge AI assistant. I will use the provided agreement clauses if applicable, and I will include [SERIOUS_DISPUTE_ESCALATION] if I detect a severe issue requiring legal assistance. How can I help you?" }],
        },
        ...history,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Chat error:", error);
    return "I encountered an error while processing your request. Please try again.";
  }
};

export const resolveDisputeWithEvidence = async (disputeDetails: string, base64Image?: string, agreementContext?: string) => {
  if (!API_KEY) {
    return "Analysis failed: Gemini API Key is missing. Please ensure EXPO_PUBLIC_GEMINI_API_KEY is defined in your .env file and restart the Expo server.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }, { apiVersion: 'v1beta' });
    let prompt = `Act as an impartial mediator for a rental dispute in India. 
    Analyze the following dispute details and provide a suggested resolution based on standard rental practices and fairness. `;
    
    if (agreementContext) {
      prompt += `\n\nCRITICAL CONTEXT - You MUST base your resolution on these specific clauses from their rental agreement:\n"""\n${agreementContext}\n"""\n`;
    }

    prompt += `\nDispute Details: ${disputeDetails}
    Return exactly this JSON structure and nothing else:
    {
      "clauseReference": "Summary of the agreement clause you are basing this on",
      "reasoning": "Your step-by-step reasoning for the conflict",
      "finalVerdict": "Your conclusive suggested resolution"
    }`;

    const parts: any[] = [{ text: prompt }];

    if (base64Image) {
      parts.push({
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    let text = response.text();
    // Clean markdown code blocks if the model wrapped the JSON in them
    text = text.replace(/```json\\n?/g, '').replace(/```\\n?/g, '').trim();
    return text;
  } catch (error: any) {
    console.error("Dispute resolution error:", error);
    return `Analysis failed: ${error.message || "Unknown error occurred"}. Please try again without an image or with a smaller image size.`;
  }
};
