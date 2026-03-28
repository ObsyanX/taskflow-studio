import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { scheduleData, preferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a daily routine planner AI for GATE exam preparation. Given a study schedule with subjects, start dates, and end dates, create an optimal daily routine with time blocks.

Rules:
- Create a realistic daily routine (6 AM to 11 PM max)
- Include study blocks, breaks, meals, exercise, and revision
- Prioritize subjects that overlap in their date ranges
- Include Pomodoro-style study sessions (90 min study + 15 min break)
- Add revision slots for previously studied subjects
- Keep blocks practical and achievable

Return a JSON array of routine blocks with this exact structure:
[{
  "title": "Block title",
  "type": "study" | "meal" | "health" | "work" | "custom",
  "duration": number (in minutes),
  "startTime": "HH:MM" (24h format, optional),
  "flowMode": "fixed" | "sequential",
  "reminderStart": true/false,
  "reminderEnd": true/false
}]

Order blocks chronologically. Use "fixed" flowMode for meals and key anchor points, "sequential" for study sessions.`;

    const userPrompt = `Here is my GATE 2027 study schedule:\n${JSON.stringify(scheduleData, null, 2)}\n\nPreferences: ${preferences || 'Standard schedule, morning person, include exercise and meals'}\n\nCreate an optimal daily routine for today based on which subjects are currently active.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_routine_blocks",
              description: "Create daily routine blocks from the study schedule",
              parameters: {
                type: "object",
                properties: {
                  blocks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        type: { type: "string", enum: ["study", "meal", "health", "work", "custom"] },
                        duration: { type: "number", description: "Duration in minutes" },
                        startTime: { type: "string", description: "HH:MM 24h format" },
                        flowMode: { type: "string", enum: ["fixed", "sequential"] },
                        reminderStart: { type: "boolean" },
                        reminderEnd: { type: "boolean" },
                      },
                      required: ["title", "type", "duration", "flowMode", "reminderStart", "reminderEnd"],
                      additionalProperties: false,
                    },
                  },
                  summary: { type: "string", description: "Brief summary of the routine plan" },
                },
                required: ["blocks", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_routine_blocks" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("No structured output from AI");
  } catch (e) {
    console.error("formulate-routine error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
