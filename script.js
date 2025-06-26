const statusEl = document.getElementById("status");
const transcriptEl = document.getElementById("transcript");

let recognition;
let isListening = false;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
} else if ("SpeechRecognition" in window) {
  recognition = new SpeechRecognition();
} else {
  alert("Il tuo browser non supporta il riconoscimento vocale.");
}

async function fetchGPTResponse(userText) {
  const response = await fetch("https://api.openai.com/v1/assistants/asst_iCAdIlnv6glpM35KJcwPWuN8/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_OPENAI_API_KEY"
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: userText }],
      model: "gpt-4"
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Non ho capito. Puoi ripetere?";
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "it-IT";
  utterance.pitch = 1.1;
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
  utterance.onend = () => {
    setTimeout(startRecognition, 500);
  };
}

function startRecognition() {
  if (!recognition) return;

  recognition.lang = "it-IT";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    statusEl.textContent = "🎤 Sto ascoltando...";
  };

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    transcriptEl.textContent = "📝 " + text;
    statusEl.textContent = "💬 Attendi risposta...";

    try {
      const gptReply = await fetchGPTResponse(text);
      speak(gptReply);
    } catch (err) {
      console.error("Errore GPT:", err);
      statusEl.textContent = "❌ Errore nella risposta.";
    }
  };

  recognition.onerror = (e) => {
    console.warn("Errore riconoscimento:", e.error);
    setTimeout(startRecognition, 1000);
  };

  recognition.onend = () => {
    if (isListening) {
      setTimeout(startRecognition, 500);
    }
  };

  recognition.start();
}

window.onload = () => {
  startRecognition();
};
