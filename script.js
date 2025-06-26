const startBtn = document.getElementById("start");
const statusEl = document.getElementById("status");
const transcriptEl = document.getElementById("transcript");

let recognition;

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
} else if ("SpeechRecognition" in window) {
    recognition = new SpeechRecognition();
} else {
    alert("Il tuo browser non supporta il riconoscimento vocale.");
}

if (recognition) {
    recognition.lang = "it-IT";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        statusEl.textContent = "🔴 Sto ascoltando...";
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        transcriptEl.textContent = "📝 " + text;
        statusEl.textContent = "✅ Testo ricevuto";
        // Qui potresti inviare il testo al tuo GPT e ricevere la risposta vocale
    };

    recognition.onerror = (event) => {
        statusEl.textContent = "⚠️ Errore: " + event.error;
    };

    recognition.onend = () => {
        statusEl.textContent = "🟡 In attesa...";
    };

    startBtn.onclick = () => recognition.start();
}
