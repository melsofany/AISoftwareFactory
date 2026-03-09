import axios from "axios";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_API_TOKEN = process.env.DEEPSEEK_API_TOKEN;

interface DeepSeekMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: DeepSeekMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function callDeepSeek(
  messages: DeepSeekMessage[],
  model: string = "deepseek-chat"
): Promise<string> {
  if (!DEEPSEEK_API_TOKEN) {
    throw new Error("DEEPSEEK_API_TOKEN is not set");
  }

  try {
    const response = await axios.post<DeepSeekResponse>(
      DEEPSEEK_API_URL,
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_TOKEN}`,
        },
      }
    );

    const content = response.data.choices[0]?.message.content;
    if (!content) {
      throw new Error("No content in DeepSeek response");
    }

    return content;
  } catch (error) {
    console.error("[DeepSeek] Error calling API:", error);
    throw error;
  }
}

export async function processAgentTask(
  userMessage: string,
  conversationHistory: DeepSeekMessage[] = []
): Promise<string> {
  const systemMessage: DeepSeekMessage = {
    role: "system",
    content: `You are an AI Agent assistant. Your role is to help users execute tasks and provide step-by-step guidance. 
When a user asks you to do something, break it down into clear steps and explain what you're doing. 
Always be helpful, clear, and provide actionable information.`,
  };

  const messages: DeepSeekMessage[] = [
    systemMessage,
    ...conversationHistory,
    {
      role: "user",
      content: userMessage,
    },
  ];

  return callDeepSeek(messages);
}
