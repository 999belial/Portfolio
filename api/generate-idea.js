export const config = {
  runtime: "edge",
  regions: ["fra1"],
};

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API key is missing in Vercel settings." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  let genre = "Random";
  let lang = "en";

  try {
    const body = await request.json();
    if (body && body.genre) genre = body.genre;
    if (body && body.lang) lang = body.lang;
  } catch (e) {}

  const langInstruction =
    lang === "de" ? "Antworte bitte auf Deutsch." : "Please answer in English.";

  const promptText = `Generate a unique, short game idea for Unity. Genre: ${genre}. Include a Title, Core Loop, and a brief description. ${langInstruction} Do not use markdown stars. Keep it under 300 characters.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
        }),
      },
    );

    const json = await response.json();

    if (json.error) {
      return new Response(
        JSON.stringify({
          error: "Google API Error",
          details: json.error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const aiResponse = json.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ idea: aiResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
