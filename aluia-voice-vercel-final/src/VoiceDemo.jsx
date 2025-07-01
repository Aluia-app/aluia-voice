
import { useEffect, useRef, useState } from 'react'

const VoiceDemo = () => {
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [log, setLog] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [inputText, setInputText] = useState('')
  const recognitionRef = useRef(null)

  const addLog = (msg) => {
    setLog((prev) => [...prev.slice(-4), msg])
    console.log(msg)
  }

  const speak = (text) => {
    addLog('🔊 Provo a parlare: ' + text)
    if (!window.speechSynthesis) {
      addLog('❌ Sintesi vocale non disponibile')
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'it-IT'
    utterance.volume = 1
    utterance.rate = 1
    utterance.pitch = 1
    utterance.onend = () => {
      addLog('✅ Fine parlato')
      recognitionRef.current?.start()
      setIsListening(true)
    }

    speechSynthesis.speak(utterance)
  }

  const handleTextSubmit = () => {
    if (!inputText.trim()) return
    setTranscript(inputText)
    const reply = `Hai scritto: ${inputText}`
    setResponse(reply)
    speak(reply)
    setInputText('')
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech Recognition non supportato')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'it-IT'
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onend = () => {
      addLog('🛑 Microfono terminato, riavvio...')
      setIsListening(false)
      setTimeout(() => recognition.start(), 1000)
    }

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1][0].transcript.trim()
      addLog('🎙️ Riconosciuto: ' + result)
      setTranscript(result)

      const reply = `Hai detto: ${result}`
      setResponse(reply)
      speak(reply)
    }

    recognition.onerror = (e) => {
      addLog('❌ Errore: ' + e.error)
      if (e.error === 'aborted' || e.error === 'no-speech') {
        setTimeout(() => recognition.start(), 1000)
      }
    }

    recognition.start()
    recognitionRef.current = recognition

    return () => recognition.abort()
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #ebf8ff, #f0fff4)', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 600, width: '100%', padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#2d3748' }}>🎤 Aluia Voice Assistant</h1>
          <p style={{ color: '#4a5568', fontSize: 18 }}>Parla liberamente o usa la chat testuale</p>
          <p style={{ color: '#3182ce', fontSize: 14, marginTop: 8 }}><i>{isListening ? '🎙️ Microfono attivo...' : '🎧 Attiva il microfono per iniziare la conversazione'}</i></p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#2b6cb0', fontSize: 20 }}>🗣️ Ultima frase riconosciuta</h2>
          <p style={{ fontSize: 18, color: '#2d3748', fontStyle: 'italic' }}>{transcript || 'Parla quando vuoi o scrivi sotto...'}</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#2f855a', fontSize: 20 }}>💬 Risposta dell'assistente</h2>
          <p style={{ fontSize: 18, color: '#2d3748' }}>{response || 'In attesa del tuo input...'}</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit() }}
            placeholder="Scrivi qui se preferisci..."
            style={{ flexGrow: 1, padding: 10, borderRadius: 8, border: '1px solid #CBD5E0', fontSize: 16 }}
          />
          <button
            onClick={handleTextSubmit}
            style={{ padding: '10px 16px', backgroundColor: '#2b6cb0', color: 'white', borderRadius: 8, border: 'none', fontSize: 16 }}>
            Invia
          </button>
        </div>

        <div style={{ backgroundColor: '#f7fafc', borderRadius: 12, padding: 16 }}>
          <h4 style={{ color: '#4a5568', marginBottom: 8 }}>🔧 Debug log:</h4>
          {log.map((l, i) => (
            <p key={i} style={{ color: '#718096', fontSize: 14 }}>• {l}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VoiceDemo
