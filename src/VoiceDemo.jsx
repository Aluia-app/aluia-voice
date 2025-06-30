import { useEffect, useRef, useState } from 'react'

const VoiceDemo = () => {
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [log, setLog] = useState([])
  const recognitionRef = useRef(null)

  const addLog = (msg) => {
    setLog((prev) => [...prev.slice(-4), msg])
    console.log(msg)
  }

  const speak = (text) => {
    addLog('🔊 Parlo: ' + text)
    if (recognitionRef.current) recognitionRef.current.abort()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'it-IT'
    utterance.onend = () => {
      addLog('✅ Fine parlato, riattivo microfono')
      recognitionRef.current.start()
    }
    speechSynthesis.speak(utterance)
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
      if (e.error === 'aborted') {
        addLog('🕒 Riavvio microfono dopo abort')
        setTimeout(() => recognition.start(), 1000)
      }
    }

    recognition.onend = () => {
      addLog('🛑 Microfono terminato, riavvio...')
      setTimeout(() => recognition.start(), 1000)
    }

    recognition.start()
    recognitionRef.current = recognition

    return () => recognition.abort()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf8ff, #f0fff4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 600, width: '100%', padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#2d3748' }}>🎤 Aluia Voice Demo</h1>
          <p style={{ color: '#4a5568', fontSize: 18 }}>Microfono sempre attivo + Sintesi vocale automatica</p>
          <p style={{ color: '#3182ce', fontSize: 14, marginTop: 8 }}><i>ℹ️ Abilita il microfono per una conversazione più fluida</i></p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#2b6cb0', fontSize: 20 }}>🗣️ Ultima frase riconosciuta</h2>
          <p style={{ fontSize: 18, color: '#2d3748', fontStyle: 'italic' }}>{transcript || 'Parla quando vuoi...'}</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#2f855a', fontSize: 20 }}>💬 Risposta dell'assistente</h2>
          <p style={{ fontSize: 18, color: '#2d3748' }}>{response || 'In attesa di input...'}</p>
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
