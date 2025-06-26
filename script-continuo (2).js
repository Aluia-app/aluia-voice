// api_gpt.js

export default async function handler(req, res) {
  const { text } = await req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Agisci come terapeuta empatico. Rispondi sempre in tono calmo, comprensivo e incoraggiante." },
        { role: "user", content: text },
      ],
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Non ho capito. Puoi ripetere?";

  res.status(200).json({ reply });
}
