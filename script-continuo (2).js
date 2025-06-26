const startBtn = document.getElementById("start");
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

function startRecognition() {
    if (recognition) {
        recognition.lang = "it-IT";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            statusEl.textContent = "🎤 Sto ascoltando...";
            isListening = true;
        };

        recognition.onresult = async (event) => {
            const text = event.results[0][0].transcript;
            transcriptEl.textContent = "📝 " + text;
            statusEl.textContent = "💬 Risposta in arrivo...";

            // Simulazione della risposta GPT
            const gptResponse = "Capisco, raccontami di più.";

            // Sintesi vocale
            const utterance = new SpeechSynthesisUtterance(gptResponse);
            utterance.lang = "it-IT";
            utterance.onend = () => {
                statusEl.textContent = "🔁 Pronto ad ascoltare...";
                startRecognition(); // Riavvia automaticamente
            };
            speechSynthesis.speak(utterance);
        };

        recognition.onerror = (event) => {
            statusEl.textContent = "⚠️ Errore: " + event.error;
            if (event.error !== "no-speech") {
                setTimeout(startRecognition, 1000);
            }
        };

        recognition.onend = () => {
            if (isListening) {
                // Aspetta un attimo e riavvia
                setTimeout(startRecognition, 500);
            }
        };

        recognition.start();
    }
}

startBtn.onclick = () => {
    if (!isListening) {
        startRecognition();
    }
};
