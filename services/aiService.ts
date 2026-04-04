import { GoogleGenerativeAI } from "@google/generative-ai";

// For Expo, we use EXPO_PUBLIC_ prefix for env variables
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

export const translateText = async (text: string, targetLanguage: string) => {
  if (!API_KEY) {
    console.warn("Gemini API Key missing. Returning original text.");
    return text;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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

export const resolveDispute = async (disputeDetails: string) => {
  if (!API_KEY) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Act as an impartial mediator for a rental dispute in India. 
    Analyze the following dispute details and provide a suggested resolution based on standard rental practices and fairness. 
    Dispute Details: ${disputeDetails}
    Provide:
    1. Summary of the issue.
    2. Suggested resolution steps.
    3. Potential fair verdict.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Dispute resolution error:", error);
    return null;
  }
};
