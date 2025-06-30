import { useEffect, useRef, useState } from 'react'

const VoiceDemo = () => {
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [log, setLog] = useState([])
  const recognitionRef = useRef(null)

  // Funzione per logging
  const addLog = (msg) => {
    setLog((prev) => [...prev.slice(-4), msg])
    console.log(msg)
  }

  // Sintesi vocale con riattivazione microfono
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

      // Risposta demo
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 font-['Inter']">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎤 Aluia Voice Demo</h1>
          <p className="text-gray-600 text-lg">Microfono sempre attivo + Sintesi vocale automatica</p>
          <p className="text-sm text-blue-600 mt-2 italic">ℹ️ Abilita il microfono per una conversazione più fluida</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">🗣️ Ultima frase riconosciuta</h2>
          <p className="text-lg text-gray-700 italic">{transcript || 'Parla quando vuoi...'}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700">💬 Risposta dell'assistente</h2>
          <p className="text-lg text-gray-700">{response || 'In attesa di input...'}</p>
        </div>

        <div className="bg-gray-50 rounded-xl shadow-inner p-4 text-sm">
          <h4 className="font-semibold text-gray-600 mb-2">🔧 Debug log:</h4>
          {log.map((l, i) => (
            <p key={i} className="text-gray-500">• {l}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VoiceDemo
