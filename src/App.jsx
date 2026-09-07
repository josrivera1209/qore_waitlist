import { useState, useEffect } from 'react'
import { FaInstagram, FaTiktok } from 'react-icons/fa6'
import { HiCheckCircle } from 'react-icons/hi2' // Importamos un icono limpio para el éxito

function App() {
  const [email, setEmail] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false) // Nuevo estado para alternar el diseño al registrarse

  const carouselTexts = [
    "Sistema inteligente para restaurantes y cafeterías.",
    "Analíticas en tiempo real de tus tarjetas físicas.",
    "Mide el impacto de cada interacción con tus clientes.",
    "Únete a la lista de espera."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % carouselTexts.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setErrorMsg('Por favor, ingresa tu correo electrónico.')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMsg('Por favor, ingresa un correo electrónico válido.')
      return
    }

    setErrorMsg('') 

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setIsSubmitted(true) // Muestra tu animación de éxito
      } else {
        setErrorMsg('Hubo un error al registrarte. Intenta de nuevo.')
      }
    } catch (err) {
      setErrorMsg('Error de conexión con el servidor.')
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] flex flex-col justify-between font-sans selection:bg-white selection:text-black">
      
      {/* Contenido Principal */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 text-center">
        
        {/* Logo con sutil sombra/resplandor blanco */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="w-28 h-28 flex items-center justify-center rounded-full overflow-hidden bg-[#111] shadow-[0_0_25px_rgba(255,255,255,0.15)] border border-[#222]">
            <img src="/logo_QORE_OG.jpg" alt="Qore Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Si ya se registró, mostramos la tarjeta de éxito elegante en lugar del formulario */}
        {isSubmitted ? (
          <div className="w-full max-w-md space-y-4 animate-fade-in-up p-8 rounded-2xl bg-[#111] border border-[#222] shadow-2xl">
            <div className="flex justify-center mb-2">
              <HiCheckCircle className="text-white text-5xl animate-bounce" />
            </div>
            <h2 className="text-2xl font-medium text-white tracking-tight">
              ¡Estás en la lista de espera!
            </h2>
            <p className="text-sm text-[#888] font-light leading-relaxed">
              Te hemos registrado con éxito (<span className="text-white">{email}</span>). Pronto nos pondremos en contacto contigo para avisarte cuando el sistema esté terminado. Puedes cerrar esta ventana
            </p>
          </div>
        ) : (
          /* Contenido normal antes del registro */
          <>
            {/* Propuesta de Valor */}
            <div className="max-w-3xl mx-auto space-y-5 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-tight">
                El sistema detrás de tus reseñas.
              </h1>
              <p className="text-lg md:text-xl text-[#888] font-light max-w-2xl mx-auto">
                La plataforma centralizada para gestionar, medir y escalar el rendimiento de tus tarjetas NFC.
              </p>
            </div>

            {/* Carrusel de Textos Animado */}
            <div className="h-10 flex items-center justify-center mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <p 
                key={textIndex} 
                className="text-md md:text-lg text-[#aaa] font-light animate-slide-up"
              >
                {carouselTexts[textIndex]}
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="tu@correo.com" 
                  className="flex-grow px-6 py-4 rounded-full bg-[#111] border border-[#222] text-white placeholder-[#666] focus:outline-none focus:border-[#555] transition-colors text-sm"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errorMsg) setErrorMsg('')
                  }}
                />
                <button 
                  type="submit" 
                  className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-[#e0e0e0] transition-colors text-sm cursor-pointer"
                >
                  Unirme a la lista
                </button>
              </div>

              {/* Alerta de error elegante y sutil */}
              {errorMsg && (
                <p className="mt-3 text-xs text-rose-400 font-light tracking-wide animate-fade-in-up">
                  {errorMsg}
                </p>
              )}

              {/* Tipografía más amigable y cercana */}
              <p className="mt-4 text-xs text-[#777] font-normal tracking-wide">
                Pronto abriremos lugares para los primeros negocios con un precio especial. Sin spam.
              </p>
            </form>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-[#1a1a1a] animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          
          <div className="flex gap-6">
            <a href="https://instagram.com/qoreoficial" target="_blank" rel="noreferrer" className="text-[#666] hover:text-white transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="https://tiktok.com/@qore_oficial" target="_blank" rel="noreferrer" className="text-[#666] hover:text-white transition-colors">
              <FaTiktok size={20} />
            </a>
          </div>

          <p className="text-xs text-[#777] font-normal tracking-wider">
            Hecho con dedicación y pasión por <span className="text-[#aaa]">qore_oficial</span>
          </p>
        </div>
      </footer>

    </div>
  )
}

export default App