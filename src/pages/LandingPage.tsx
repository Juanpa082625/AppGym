import { useState } from 'react'
import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <>
      <Hero />
      <Problems />
      <Features />
      <HowItWorks />
      <Metrics />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}

function Hero() {
  return (
    <section className="py-20 text-center">
      <div className="max-w-5xl mx-auto px-4">
        <div className="inline-block bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Hecho en LATAM para dueños de gym
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-5 max-w-3xl mx-auto">
          Sabé quién está por dejar tu gym{' '}
          <span className="text-brand-500">antes que se vaya.</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
          GetGym calcula el riesgo de cada miembro, automatiza tus reportes y te da el plan de acción cada mañana. Sin Excel. Sin perseguir morosos a mano.
        </p>
        <div className="flex justify-center gap-3 flex-wrap mb-6">
          <Link
            to="/login"
            className="px-7 py-3.5 text-base font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Probar gratis 14 días
          </Link>
          <a
            href="#como-funciona"
            className="px-7 py-3.5 text-base font-medium text-gray-900 bg-transparent border border-gray-300 rounded-xl hover:border-gray-900 transition-colors"
          >
            Cómo funciona
          </a>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Sin tarjeta · Setup en 5 min · En español
        </p>
      </div>
    </section>
  )
}

function Problems() {
  const problems = [
    {
      title: 'Vivís dentro de planillas Excel',
      desc: 'Cargás asistencias, pagos y datos en mil archivos sueltos. Cuando querés un reporte, te lleva medio día armarlo a mano.',
    },
    {
      title: 'Te enterás del churn cuando ya se fueron',
      desc: 'Un miembro dejó de venir hace 3 semanas y nadie lo notó. Cuando lo llamás, ya está en el gym de la otra cuadra.',
    },
    {
      title: 'Perdés horas persiguiendo morosos',
      desc: 'Llamadas, mensajes, anotaciones en papel. Sin sistema, los pagos atrasados se acumulan y la caja se desordena.',
    },
  ]

  return (
    <section className="py-20" id="beneficios">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider text-center mb-3">
          ¿Te suena familiar?
        </p>
        <h2 className="text-3xl font-semibold text-center mb-12 max-w-2xl mx-auto">
          Estos 3 problemas le pasan a todo dueño de gym en LATAM.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-lg font-semibold mb-2.5">{p.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    { icon: '📊', title: 'Score de riesgo automático', desc: 'Cada miembro tiene un score 0–100 que se recalcula con su asistencia, frecuencia, pagos y contacto del coach.' },
    { icon: '📈', title: 'Reportes mensuales sin tocar Excel', desc: 'El primero de cada mes recibís un reporte web con retención, altas, bajas, ingresos y top miembros.' },
    { icon: '👥', title: 'Miembros, pagos y rutinas en un solo lugar', desc: 'Editor de rutinas, biblioteca de ejercicios, asignación a miembros y registro de pagos manuales.' },
    { icon: '🎯', title: 'Ofertas configurables para retener', desc: 'Publicás una oferta y aparece en el dashboard de cada miembro. Comunidad interna con feed y logros.' },
    { icon: '🔔', title: 'Alertas in-app y notificaciones', desc: 'Cuando un miembro pasa a riesgo alto, te llega una notificación automáticamente.' },
    { icon: '📱', title: 'Tu gym desde el celular', desc: 'App responsive con menú estilo nativo. Tus miembros reservan clases, ven su rutina y registran progreso.' },
  ]

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider text-center mb-3">
          Todo lo que necesitás, en un solo lugar
        </p>
        <h2 className="text-3xl font-semibold text-center mb-4 max-w-2xl mx-auto">
          Una plataforma diseñada para que retengas, no para que cargues datos.
        </h2>
        <p className="text-base text-gray-600 text-center max-w-xl mx-auto mb-12">
          Cada feature pensada para resolver un problema concreto del día a día de un gimnasio LATAM.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-lg mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Creá tu cuenta', desc: 'Te registrás con email y nombre del gimnasio. En 2 minutos ya estás dentro del panel.' },
    { num: '02', title: 'Cargás tus miembros', desc: 'Invitás a tu equipo y agregás miembros uno por uno o pegando un CSV.' },
    { num: '03', title: 'Empezás a recibir alertas', desc: 'A medida que entran asistencias y pagos, el score se calcula solo.' },
  ]

  return (
    <section className="py-20" id="como-funciona">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider text-center mb-3">
          Cómo funciona
        </p>
        <h2 className="text-3xl font-semibold text-center mb-12 max-w-2xl mx-auto">
          Estás operando con datos reales en menos de 10 minutos.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-bold text-brand-500 mb-3">{s.num}</div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Metrics() {
  const metrics = [
    { num: '+22%', label: 'Retención mensual promedio en gyms que usan score de riesgo' },
    { num: '3.2 h', label: 'Tiempo ahorrado por semana al automatizar reportes y alertas' },
    { num: '$1.140', label: 'Ingreso recuperado promedio por mes por gym (recuperos)' },
  ]

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider text-center mb-3">
          Resultados reales
        </p>
        <h2 className="text-3xl font-semibold text-center mb-12 max-w-2xl mx-auto">
          Gimnasios que ya usan GetGym lo notan en el primer mes.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {metrics.map((m, i) => (
            <div key={i}>
              <div className="text-5xl font-bold text-brand-500">{m.num}</div>
              <div className="text-sm text-gray-600 mt-2 leading-relaxed">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const testimonials = [
    { quote: '"En 6 semanas pasamos de 71% a 88% de retención. Lo más útil es que cada mañana sé exactamente a quién llamar."', name: 'Roberto Martínez', role: 'Dueño · Iron Strength · Medellín', initials: 'RM' },
    { quote: '"Dejé de cargar planillas. Mis tres coaches usan la app desde el celular para registrar asistencias y rutinas."', name: 'Laura Giménez', role: 'Dueña · Power Hub · Buenos Aires', initials: 'LG' },
    { quote: '"Pasamos a Plan Enterprise. La data nos sirvió para abrir una segunda sede sin perder calidad."', name: 'Andrés Rodríguez', role: 'Dueño · Wellness Bogotá', initials: 'AR' },
  ]

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider text-center mb-3">
          Lo que dicen los dueños
        </p>
        <h2 className="text-3xl font-semibold text-center mb-12 max-w-2xl mx-auto">
          Hecho con dueños de gym, no con consultores.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <blockquote className="text-sm text-gray-900 leading-relaxed mb-5 italic">
                {t.quote}
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-sm font-semibold text-brand-700">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    { name: 'Free', desc: 'Para gimnasios chicos que recién arrancan.', price: '$0', note: 'para siempre', features: ['Hasta 30 miembros activos', 'Dashboard básico + score de riesgo', '1 administrador', 'Soporte por email'], featured: false, cta: 'Empezar gratis' },
    { name: 'Starter', desc: 'Gimnasio independiente con foco en retención.', price: '$17', note: 'USD / mes', features: ['Hasta 150 miembros activos', 'Reportes mensuales automáticos', 'Hasta 3 entrenadores', 'Comunidad y logros'], featured: true, cta: 'Probar 14 días gratis' },
    { name: 'Pro', desc: 'Gimnasio establecido que quiere maximizar retención.', price: '$48', note: 'USD / mes', features: ['Hasta 500 miembros activos', 'Cohortes y reportes avanzados', 'Integraciones', 'Hasta 10 entrenadores', 'Soporte prioritario'], featured: false, cta: 'Probar 14 días gratis' },
    { name: 'Enterprise', desc: 'Cadenas y gimnasios con múltiples sedes.', price: '$120', note: 'USD / mes', features: ['Miembros ilimitados', 'Multi-sede', 'API y webhooks', 'Onboarding dedicado', 'Coach asignado de éxito'], featured: false, cta: 'Hablemos' },
  ]

  return (
    <section className="py-20" id="precios">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider text-center mb-3">
          Precios simples
        </p>
        <h2 className="text-3xl font-semibold text-center mb-4 max-w-2xl mx-auto">
          Un plan para cada momento. Sin contratos.
        </h2>
        <p className="text-base text-gray-600 text-center max-w-xl mx-auto mb-12">
          Pasás de plan cuando crece tu gym. Cancelás cuando quieras.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`bg-white border rounded-2xl p-7 shadow-sm relative ${
                p.featured ? 'border-brand-500 border-2' : 'border-gray-200'
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Más elegido
                </div>
              )}
              <h3 className="text-lg font-semibold mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{p.desc}</p>
              <div className="text-4xl font-bold mb-1">{p.price}</div>
              <p className="text-xs text-gray-500 mb-5">{p.note}</p>
              <ul className="mb-6 space-y-2">
                {p.features.map((f, j) => (
                  <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-brand-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className={`block w-full py-3 text-sm font-medium rounded-lg text-center transition-colors ${
                  p.featured
                    ? 'text-white bg-gray-900 hover:bg-gray-800'
                    : 'text-gray-900 bg-white border border-gray-300 hover:border-gray-900'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: '¿Cuánto cuesta empezar?', a: 'Tenés un plan Free para siempre con hasta 30 miembros activos. Si ya tenés más, los planes pagos arrancan en $17 USD/mes y los probás 14 días gratis sin tarjeta de crédito.' },
    { q: '¿Está en español y pensado para LATAM?', a: '100%. La interfaz, los reportes, las notificaciones y la documentación están en español. Los precios se muestran en USD pero podés cobrar en cualquier moneda local.' },
    { q: '¿Cómo se calcula el score de riesgo?', a: 'Combinamos 4 señales: días sin venir al gym, caída de frecuencia, pagos atrasados y falta de contacto del coach. El score va de 0 a 100 y se recalcula automáticamente.' },
    { q: '¿Mis miembros tienen su propia app?', a: 'Sí. Cada miembro tiene su login con dashboard personal, rutina asignada, reserva de clases, registro de progreso y logros.' },
    { q: '¿Puedo importar mi base de miembros actual?', a: 'Sí, importás desde CSV o cargás manualmente. El onboarding lleva 5–10 minutos.' },
    { q: '¿Hay contrato o permanencia?', a: 'No. Mes a mes. Cancelás cuando quieras desde tu configuración.' },
  ]

  return (
    <section className="py-20" id="preguntas">
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider text-center mb-3">
          Preguntas frecuentes
        </p>
        <h2 className="text-3xl font-semibold text-center mb-12">
          Lo que más nos preguntan los dueños.
        </h2>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="py-5 cursor-pointer"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex justify-between items-center">
                <span className="text-base font-medium">{faq.q}</span>
                <span className="text-xl text-gray-500">
                  {openIndex === i ? '−' : '+'}
                </span>
              </div>
              {openIndex === i && (
                <p className="text-sm text-gray-600 leading-relaxed mt-3">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-20 text-center">
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-3">
          Empezá hoy
        </p>
        <h2 className="text-3xl font-semibold mb-3">
          Tu próximo miembro perdido es una asistencia de menos.
        </h2>
        <p className="text-base text-gray-600 max-w-xl mx-auto mb-8">
          Empezá gratis hoy, configurá tu gym en menos de 10 minutos y empezá a recibir alertas de riesgo esta semana.
        </p>
        <div className="flex justify-center gap-3 flex-wrap mb-4">
          <Link
            to="/login"
            className="px-7 py-3.5 text-base font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Crear cuenta gratis
          </Link>
          <Link
            to="/login"
            className="px-7 py-3.5 text-base font-medium text-gray-900 bg-transparent border border-gray-300 rounded-xl hover:border-gray-900 transition-colors"
          >
            Ya tengo cuenta · Ingresar
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          Sin tarjeta de crédito · Cancelás cuando quieras · Soporte en español
        </p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold mb-2">
              Get<span className="text-brand-500">Gym</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Plataforma de retención hecha en LATAM para dueños de gym.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Producto</h4>
            <div className="space-y-2">
              <a href="#beneficios" className="block text-sm text-gray-500 hover:text-gray-900">Beneficios</a>
              <a href="#como-funciona" className="block text-sm text-gray-500 hover:text-gray-900">Cómo funciona</a>
              <a href="#precios" className="block text-sm text-gray-500 hover:text-gray-900">Precios</a>
              <a href="#preguntas" className="block text-sm text-gray-500 hover:text-gray-900">FAQ</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Empezar</h4>
            <div className="space-y-2">
              <Link to="/login" className="block text-sm text-gray-500 hover:text-gray-900">Crear cuenta</Link>
              <Link to="/login" className="block text-sm text-gray-500 hover:text-gray-900">Iniciar sesión</Link>
              <a href="mailto:soporte@getgym.app" className="block text-sm text-gray-500 hover:text-gray-900">Soporte</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Legales</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-gray-500 hover:text-gray-900">Términos y condiciones</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-gray-900">Política de privacidad</a>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center pt-6 border-t border-gray-200">
          © 2026 GetGym SAS. Hecho en LATAM. v1.0
        </div>
      </div>
    </footer>
  )
}
