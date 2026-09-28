import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, activeModule, conversationHistory } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Call Google Gemini API streaming
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are NEXUS, a futuristic spatial operating system AI assistant. 
Active Context Module: ${activeModule || 'General Orbit'}.
Respond concisely, clearly, and authoritatively.

User query: ${message}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      return new NextResponse(response.body, {
        headers: {
          'Content-Type': 'application/json',
          'Transfer-Encoding': 'chunked',
        },
      });
    }

    // Fallback: Intelligent synthetic stream for local offline usage
    const encoder = new TextEncoder();
    const mockResponses: Record<string, string> = {
      instagram: "Instagram Telemetry: Your follower count reached 48.2K (+14.2% weekly). Top reel engagement is up 34% in AI content.",
      stocks: "Market Intelligence: NVIDIA is up +3.4% today at $138.50. Tech sector exposure is optimized at 42% portfolio allocation.",
      projects: "Spatial Workspaces: 4 active projects loaded. 'Nexus Spatial OS' builds clean across all WebGL2 pipelines.",
      weather: "Atmospheric Telemetry: Current conditions in your region indicate 18°C with light volumetric mist drifting at 4 km/h.",
      default: `NEXUS AI online. Context [${activeModule || 'Spatial Core'}]: Processing your query "${message}". All systems running at 60 FPS.`,
    };

    const responseText = mockResponses[activeModule?.toLowerCase() || ''] || mockResponses.default;
    const tokens = responseText.split(' ');

    const stream = new ReadableStream({
      async start(controller) {
        for (const token of tokens) {
          const chunk = JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [{ text: token + ' ' }],
                },
              },
            ],
          }) + '\n';
          controller.enqueue(encoder.encode(chunk));
          await new Promise((res) => setTimeout(res, 60));
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
