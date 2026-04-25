const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

const SYSTEM_PROMPT = `You are ArcPay, a safe autonomous expense agent on Arc blockchain. You have a wallet with USDC. Always check user rules before paying. Never spend more than the daily cap. If a request violates a rule, reject it. If a request DOES NOT violate any rules and is within the daily cap, default to 'pay' (or 'approve' if you are unsure). IMPORTANT: Do not over-classify things as rule violations. For example, API access, weather data, or software are NOT entertainment. If the user asks a general question or asks for their balance, use action: 'message' and put the response in 'reason'. Output only valid JSON.`;



export async function processExpenseChat(message: string, rules: any[], dailySpent: number) {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured in .env");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // OpenRouter model choice
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `User message: "${message}". Active Rules: ${JSON.stringify(rules)}. Daily spent so far: $${dailySpent}. Evaluate the request securely.` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "determine_payment_action",
            description: "Determines whether to pay, approve, reject, or just message the user.",
            parameters: {
              type: "object",
              properties: {
                action: { type: "string", description: "The action to take: 'pay', 'approve', 'reject', or 'message'" },
                amountInUSDC: { type: "number", description: "The exact amount in USDC required (or 0 if just a message)" },
                reason: { type: "string", description: "A brief reason for taking this action, or the message itself" },
                merchant: { type: "string", description: "The name of the merchant or recipient" },
                needsApproval: { type: "boolean", description: "True if explicit user approval is required by the rules" }
              },
              required: ["action", "amountInUSDC", "reason"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "determine_payment_action" } }
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0].message.tool_calls) {
      const toolCall = data.choices[0].message.tool_calls[0];
      return JSON.parse(toolCall.function.arguments);
    }

    // Fallback JSON parser if the model replies in raw text
    const text = data.choices?.[0]?.message?.content || "";
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);

    return { action: "reject", reason: "AI could not compute an action.", amountInUSDC: 0 };
  } catch (error: any) {
    console.error("OpenRouter Error:", error.message);
    throw new Error(`AI processing failed: ${error.message}`);
  }
}
