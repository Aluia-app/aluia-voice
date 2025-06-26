
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Messaggio mancante" });
  }

  try {
    const chat = await openai.beta.threads.createAndRun({
      assistant_id: "asst_iCAdIlnv6glpM35KJcwPWuN8",
      thread: {
        messages: [{ role: "user", content: message }]
      }
    });

    const result = await openai.beta.threads.messages.list(chat.thread_id);
    const reply = result.data[0]?.content[0]?.text?.value || "Risposta non disponibile.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Errore GPT: " + error.message });
  }
}
