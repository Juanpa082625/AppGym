import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Flame, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Search, 
  Building2, 
  Sparkles, 
  Users, 
  CreditCard, 
  HelpCircle, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Percent,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onLogin: () => void;
  gymSettings: { name: string; location: string };
}

export default function LandingPage({ onLogin, gymSettings }: LandingPageProps) {
  const { signIn, signUp } = useAuth();
  // 'landing' | 'login' | 'register'
  const [view, setView] = useState<'landing' | 'login' | 'register'>('landing');
  
  // Login form state
  const [email, setEmail] = useState('owner@titanops.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  // Widget interactivity
  const [callingMember, setCallingMember] = useState<string | null>(null);
  const [riskActionToast, setRiskActionToast] = useState<string | null>(null);

  // FAQ Accordion State (stores opened FAQ indices)
  const [openedFaqs, setOpenedFaqs] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    if (openedFaqs.includes(index)) {
      setOpenedFaqs(openedFaqs.filter(i => i !== index));
    } else {
      setOpenedFaqs([...openedFaqs, index]);
    }
  };

  const handleCall = (name: string) => {
    setCallingMember(name);
    setRiskActionToast(`Iniciando contacto de retención con ${name}...`);
    setTimeout(() => {
      setCallingMember(null);
      setRiskActionToast(null);
    }, 4000);
  };

  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    
    try {
      await signIn({ email, password });
      onLogin();
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFormRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (regPass !== regPassConfirm) {
      setAuthError('Las contraseñas no coinciden');
      return;
    }
    
    if (regPass.length < 6) {
      setAuthError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setAuthLoading(true);
    
    try {
      await signUp({
        email: regEmail,
        password: regPass,
        fullName: regName,
        businessName: regName + "'s Gym"
      });
      
      // Auto-login after successful registration
      await signIn({ email: regEmail, password: regPass });
      onLogin();
    } catch (error: any) {
      console.error('Registration error:', error);
      setAuthError(error.message || 'Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setAuthLoading(false);
    }
  };

  const faqs = [
    {
      q: "¿Cuánto cuesta empezar?",
      a: "Tenés un plan Free para siempre con hasta 30 miembros activos. Si ya tenés más, los planes pagos arrancan en $17 USD/mes y los probás 14 días gratis sin tarjeta de crédito."
    },
    {
      q: "¿Está en español y pensado para LATAM?",
      a: "100%. La interfaz, los reportes, las notificaciones y la documentación están en español rioplatense / latam neutro. Los precios se muestran en USD pero podés cobrar en cualquier moneda local."
    },
    {
      q: "¿Cómo se calcula el score de riesgo?",
      a: "Combinamos 4 señales: días sin venir al gym, caída de frecuencia comparando últimos 30 vs 30 anteriores, pagos atrasados y falta de contacto del coach. El score va de 0 a 100 y se recalcula automáticamente."
    },
    {
      q: "¿Mis miembros tienen su propia app?",
      a: "Sí. Cada miembro tiene su login con dashboard personal, rutina asignada, reserva de clases, registro de progreso, fotos comparativas, logros y encuestas post-entreno. Se ve perfecto desde el celular."
    },
    {
      q: "¿Puedo importar mi base de miembros actual?",
      a: "Sí, importás desde CSV o cargás manualmente. El onboarding lleva 5–10 minutos. Si tenés más de 200 miembros te ayudamos sin costo en una sesión de 30 min."
    },
    {
      q: "¿Cómo cobro las cuotas?",
      a: "Por ahora registrás los pagos manualmente desde el panel (rapidísimo). Mercado Pago se integra para cobros automáticos en LATAM próximamente."
    },
    {
      q: "¿Hay contrato o permanencia?",
      a: "No. Mes a mes. Cancelás cuando quieras desde tu configuración y conservás el acceso hasta el final del período pagado."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-gray-900 selection:bg-amber-100 selection:text-amber-900 scroll-smooth">
      {/* Risk Actions Toast inside Landing */}
      {riskActionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E1E] text-white text-xs font-semibold px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl border border-gray-800 animate-bounce">
          <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{riskActionToast}</span>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="p-1.5 bg-[#1E1E1E] text-white rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xl font-extrabold text-[#1E1E1E] tracking-tight">
              Get<span className="text-amber-600">Gym</span>
            </span>
          </div>

          {view === 'landing' && (
            <div className="hidden md:flex items-center gap-8">
              <a href="#beneficios" className="text-sm text-gray-500 font-medium hover:text-gray-950 transition-colors">Beneficios</a>
              <a href="#como-funciona" className="text-sm text-gray-500 font-medium hover:text-gray-950 transition-colors">Cómo funciona</a>
              <a href="#precios" className="text-sm text-gray-500 font-medium hover:text-gray-950 transition-colors">Precios</a>
              <a href="#preguntas" className="text-sm text-gray-500 font-medium hover:text-gray-950 transition-colors">Preguntas</a>
            </div>
          )}

          <div className="flex items-center gap-3">
            {view === 'landing' ? (
              <>
                <button 
                  onClick={() => setView('login')} 
                  className="text-sm font-semibold text-gray-700 hover:text-gray-950 px-3.5 py-1.5 rounded-xl border border-gray-300 hover:border-gray-800 transition-all cursor-pointer"
                >
                  Iniciar sesión
                </button>
                <button 
                  onClick={() => setView('register')} 
                  className="bg-[#1E1E1E] hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Probar gratis →
                </button>
              </>
            ) : (
              <button 
                onClick={() => setView('landing')} 
                className="text-sm font-semibold text-gray-500 hover:text-gray-950 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                ← Volver al inicio
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* RENDER VIEW DEPENDING ON STATE */}
      {view === 'landing' && (
        <>
          {/* HERO */}
          <header className="py-20 md:py-28 text-center px-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <span className="inline-block bg-amber-100/80 border border-amber-200/50 text-amber-800 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                Hecho en LATAM para dueños de gym
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-gray-950 tracking-tight leading-[1.1] mb-6 max-w-3xl">
                Sabé quién está por dejar tu gym <span className="text-amber-600 block sm:inline">antes que se vaya.</span>
              </h1>
              <p className="text-gray-500 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
                GetGym calcula el riesgo de cada miembro, automatiza tus reportes y te da el plan de acción cada mañana. Sin Excel. Sin perseguir morosos a mano.
              </p>

              <div className="flex justify-center gap-3.5 flex-wrap mb-4">
                <button 
                  onClick={() => setView('register')} 
                  className="bg-[#1E1E1E] hover:bg-gray-800 text-white font-extrabold px-7 py-4 rounded-2xl shadow-md transition-all cursor-pointer text-sm uppercase tracking-wider"
                >
                  Probar gratis 14 días
                </button>
                <a 
                  href="#como-funciona" 
                  className="bg-white border border-gray-300 hover:border-gray-800 text-gray-800 font-extrabold px-7 py-4 rounded-2xl transition-all cursor-pointer text-sm uppercase tracking-wider flex items-center justify-center"
                >
                  Cómo funciona
                </a>
              </div>

              <p className="text-xs text-gray-400 mb-2">Sin tarjeta · Setup en 5 min · En español</p>
              <p className="text-xs text-gray-400 font-semibold mb-14 flex items-center gap-1 flex-wrap justify-center">
                <span>En uso en</span>
                <span className="text-gray-600">🇨🇴 Colombia · 🇲🇽 México · 🇦🇷 Argentina · 🇨🇱 Chile · 🇵🇪 Perú · 🇪🇨 Ecuador</span>
              </p>

              {/* DASHBOARD PREVIEW WIDGET */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white border border-[#EFE9E4] rounded-3xl p-6 md:p-8 text-left shadow-[0_15px_40px_rgba(239,233,228,0.7)]"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">RESUMEN OPERATIVO</span>
                    <strong className="text-xs text-gray-800 font-extrabold mt-0.5">Iron Strength · {gymSettings.location}</strong>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-100">
                    En vivo · hoy
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                  Buen día, Roberto. Hay <span className="text-amber-600 font-bold underline">3 miembros en riesgo alto</span> que necesitan tu atención esta semana.
                </p>

                {/* Grid stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-gray-950">62</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase mt-1">Score Prom.</div>
                  </div>
                  <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-emerald-700">88%</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase mt-1">Retención</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-amber-800">3</div>
                    <div className="text-[9px] text-amber-700 font-bold uppercase mt-1">Riesgo Alto</div>
                  </div>
                </div>

                {/* Risk list */}
                <div>
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2.5">Miembros en riesgo</h4>
                  <div className="flex flex-col divide-y divide-[#FAF7F2]">
                    {[
                      { name: 'Daniela Castro', reason: 'Sin asistir hace 9 días' },
                      { name: 'Mariana Soto', reason: 'Frecuencia bajó 60%' },
                      { name: 'Pedro González', reason: 'Pago atrasado 12 días' }
                    ].map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold text-gray-900">{item.name}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 font-medium">{item.reason}</div>
                        </div>
                        <button 
                          disabled={callingMember === item.name}
                          onClick={() => handleCall(item.name)}
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            callingMember === item.name 
                              ? 'bg-amber-100 text-amber-800 border-amber-200' 
                              : 'bg-white text-amber-600 hover:text-white border-amber-500/20 hover:bg-amber-500 hover:border-amber-500 shadow-xs'
                          }`}
                        >
                          {callingMember === item.name ? 'Conectando...' : 'Llamar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </header>

          {/* PROBLEMS */}
          <section className="py-20 bg-white" id="beneficios">
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-xs uppercase font-bold text-amber-600 tracking-wider text-center">¿Te suena familiar?</p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-950 text-center tracking-tight mt-1 mb-14">
                Estos 3 problemas le pasan a todo dueño de gym en LATAM.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-3xl p-8 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-full bg-[#F3ECE5] border border-[#EFE9E4] flex items-center justify-center text-amber-800 font-bold mb-5">
                    1
                  </div>
                  <h3 className="text-base font-extrabold text-gray-950 mb-3">Vivís dentro de planillas Excel</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Cargás asistencias, pagos y datos en mil archivos sueltos. Cuando querés un reporte, te lleva medio día armarlo a mano.
                  </p>
                </div>

                <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-3xl p-8 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-full bg-[#F3ECE5] border border-[#EFE9E4] flex items-center justify-center text-amber-800 font-bold mb-5">
                    2
                  </div>
                  <h3 className="text-base font-extrabold text-gray-950 mb-3">Te enterás del churn cuando ya se fueron</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Un miembro dejó de venir hace 3 semanas y nadie lo notó. Cuando lo llamás, ya está en el gym de la otra cuadra.
                  </p>
                </div>

                <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-3xl p-8 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-full bg-[#F3ECE5] border border-[#EFE9E4] flex items-center justify-center text-amber-800 font-bold mb-5">
                    3
                  </div>
                  <h3 className="text-base font-extrabold text-gray-950 mb-3">Perdés horas persiguiendo morosos</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Llamadas, mensajes, anotaciones en papel. Sin sistema, los pagos atrasados se acumulan y la caja se desordena.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES / BENEFITS */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-xs uppercase font-bold text-amber-600 tracking-wider text-center">Todo lo que necesitás, en un solo lugar</p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-950 text-center tracking-tight mt-1 mb-2">
                Una plataforma diseñada para que retengas, no para que cargues datos.
              </h2>
              <p className="text-xs text-gray-500 text-center max-w-lg mx-auto mb-16 leading-relaxed">
                Cada feature pensada para resolver un problema concreto del día a día de un gimnasio en LATAM.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: '📊',
                    title: 'Score de riesgo automático',
                    desc: 'Cada miembro tiene un score 0–100 que se recalcula con su asistencia, frecuencia, pagos y contacto del coach. Sabés a quién llamar primero.'
                  },
                  {
                    icon: '📈',
                    title: 'Reportes mensuales sin tocar Excel',
                    desc: 'El primero de cada mes recibís un reporte web con retención, altas, bajas, ingresos y top miembros. Cero trabajo manual.'
                  },
                  {
                    icon: '👥',
                    title: 'Miembros, pagos y rutinas en un solo lugar',
                    desc: 'Editor de rutinas, biblioteca de ejercicios, asignación a miembros y registro de pagos manuales con filtros avanzados.'
                  },
                  {
                    icon: '🎯',
                    title: 'Ofertas configurables para retener',
                    desc: 'Publicás una oferta y aparece en el dashboard de cada miembro. Comunidad interna con feed, logros automáticos y encuestas post-entreno.'
                  },
                  {
                    icon: '🔔',
                    title: 'Alertas in-app y notificaciones',
                    desc: 'Cuando un miembro pasa a riesgo alto, te llega una notificación. Cuando se desbloquea un logro, el miembro recibe la suya.'
                  },
                  {
                    icon: '📱',
                    title: 'Tu gym desde el celular',
                    desc: 'App responsive con menú estilo nativo. Tus miembros reservan clases, ven su rutina, registran progreso y ven sus pagos.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-[#EFE9E4] rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EFE9E4] flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wide">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mt-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="py-20 bg-white border-t border-b border-[#EFE9E4]" id="como-funciona">
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-xs uppercase font-bold text-amber-600 tracking-wider text-center">Cómo funciona</p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-950 text-center tracking-tight mt-1 mb-16">
                Estás operando con datos reales en menos de 10 minutos.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-5xl font-black text-amber-600/30">01</div>
                  <h3 className="text-base font-extrabold text-gray-950">Creá tu cuenta</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                    Te registrás con email y nombre del gimnasio. En 2 minutos ya estás dentro del panel. Sin tarjeta de crédito.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="text-5xl font-black text-amber-600/30">02</div>
                  <h3 className="text-base font-extrabold text-gray-950">Cargás tus miembros</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                    Invitás a tu equipo de entrenadores y agregás miembros uno por uno o pegando un CSV. Cada miembro recibe su acceso.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="text-5xl font-black text-amber-600/30">03</div>
                  <h3 className="text-base font-extrabold text-gray-950">Empezás a recibir alertas</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                    A medida que entran asistencias y pagos, el score se calcula solo. La primer alerta de riesgo te llega en la primera semana.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* METRICS */}
          <section className="py-20 bg-[#FAF7F2]">
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-xs uppercase font-bold text-amber-600 tracking-wider text-center">Resultados reales</p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-950 text-center tracking-tight mt-1 mb-16">
                Gimnasios que ya usan GetGym lo notan en el primer mes.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white border border-[#EFE9E4] rounded-3xl p-8 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-amber-600 leading-none mb-3">+22%</span>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs font-semibold">
                    Retención mensual promedio en gyms que usan score de riesgo
                  </p>
                </div>

                <div className="bg-white border border-[#EFE9E4] rounded-3xl p-8 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-amber-600 leading-none mb-3">3.2 h</span>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs font-semibold">
                    Tiempo ahorrado por semana al automatizar reportes y alertas
                  </p>
                </div>

                <div className="bg-white border border-[#EFE9E4] rounded-3xl p-8 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-amber-600 leading-none mb-3">$1.140</span>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs font-semibold">
                    Ingreso recuperado promedio por mes por gym (recuperos de morosos)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-xs uppercase font-bold text-amber-600 tracking-wider text-center">Lo que dicen los dueños</p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-950 text-center tracking-tight mt-1 mb-16">
                Hecho con dueños de gym, no con consultores.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    quote: '"En 6 semanas pasamos de 71% a 88% de retención. Lo más útil es que cada mañana sé exactamente a quién llamar. Antes era a ciegas."',
                    author: 'Roberto Martínez',
                    role: 'Dueño · Iron Strength · Medellín'
                  },
                  {
                    quote: '"Dejé de cargar planillas. Mis tres coaches usan la app desde el celular para registrar asistencias y rutinas. Los reportes mensuales son automáticos."',
                    author: 'Laura Giménez',
                    role: 'Dueña · Power Hub · Buenos Aires'
                  },
                  {
                    quote: '"Pasamos a Plan Enterprise. La data nos sirvió para abrir una segunda sede sin perder calidad. Saber el churn proyectado cambia la planificación."',
                    author: 'Andrés Rodríguez',
                    role: 'Dueño · Wellness Bogotá'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-3xl p-8 hover:shadow-md transition-all flex flex-col justify-between">
                    <p className="text-xs italic text-gray-600 leading-relaxed mb-6">
                      {item.quote}
                    </p>
                    <div className="flex items-center gap-3 border-t border-[#FAF7F2] pt-4">
                      <div className="w-9 h-9 rounded-full bg-[#1E1E1E] text-amber-400 font-extrabold flex items-center justify-center text-xs">
                        {item.author.split(' ').map(p => p[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-950 leading-tight">{item.author}</h4>
                        <span className="text-[10px] text-gray-400 font-semibold mt-0.5 block">{item.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section className="py-20" id="precios">
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-xs uppercase font-bold text-amber-600 tracking-wider text-center">Precios simples</p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-950 text-center tracking-tight mt-1 mb-2">
                Un plan para cada momento. Sin contratos.
              </h2>
              <p className="text-xs text-gray-500 text-center max-w-sm mx-auto mb-16 leading-relaxed">
                Pasás de plan cuando crece tu gym. Cancelás cuando quieras.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {/* Card 1 */}
                <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">Free</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-normal mb-4">Para gimnasios chicos que recién arrancan o quieren probar.</p>
                    <div className="text-3xl font-black text-gray-950 mb-0.5">$0</div>
                    <p className="text-[10px] text-gray-400 font-bold mb-6">para siempre</p>

                    <ul className="text-xs text-gray-500 flex flex-col gap-2.5 mb-8">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Hasta 30 miembros activos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Dashboard básico + score</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>1 administrador</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Soporte por email</span>
                      </li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => setView('register')} 
                    className="w-full text-center bg-white border border-gray-300 hover:border-gray-950 text-gray-800 text-xs font-bold py-2.5 rounded-xl transition-all uppercase tracking-wide cursor-pointer"
                  >
                    Empezar gratis
                  </button>
                </div>

                {/* Card 2 Featured */}
                <div className="bg-white border-2 border-amber-500 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative transform scale-105 md:scale-105 z-10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                    Más elegido
                  </div>
                  
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide mt-2">Starter</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-normal mb-4">Gimnasio independiente con foco en retención.</p>
                    <div className="text-3xl font-black text-gray-950 mb-0.5">$17 <span className="text-xs font-semibold text-gray-400">USD / mes</span></div>
                    <p className="text-[10px] text-gray-400 font-bold mb-6">&nbsp;</p>

                    <ul className="text-xs text-gray-500 flex flex-col gap-2.5 mb-8">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="font-semibold text-gray-900">Hasta 150 miembros activos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Reportes mensuales automáticos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Hasta 3 entrenadores</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Comunidad y logros</span>
                      </li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => setView('register')} 
                    className="w-full text-center bg-[#1E1E1E] hover:bg-gray-800 text-white text-xs font-black py-2.5 rounded-xl transition-all uppercase tracking-wide cursor-pointer"
                  >
                    Probar 14 días gratis
                  </button>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">Pro</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-normal mb-4">Gimnasio establecido que quiere maximizar retención.</p>
                    <div className="text-3xl font-black text-gray-950 mb-0.5">$48 <span className="text-xs font-semibold text-gray-400">USD / mes</span></div>
                    <p className="text-[10px] text-gray-400 font-bold mb-6">&nbsp;</p>

                    <ul className="text-xs text-gray-500 flex flex-col gap-2.5 mb-8">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="font-semibold text-gray-900">Hasta 500 miembros activos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Cohortes y reportes avanzados</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Integraciones (Mercado Pago pr.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Hasta 10 entrenadores</span>
                      </li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => setView('register')} 
                    className="w-full text-center bg-[#1E1E1E] hover:bg-gray-800 text-white text-xs font-black py-2.5 rounded-xl transition-all uppercase tracking-wide cursor-pointer"
                  >
                    Probar 14 días gratis
                  </button>
                </div>

                {/* Card 4 */}
                <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">Enterprise</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-normal mb-4">Cadenas y gimnasios con múltiples sedes.</p>
                    <div className="text-3xl font-black text-gray-950 mb-0.5">$120 <span className="text-xs font-semibold text-gray-400">USD / mes</span></div>
                    <p className="text-[10px] text-gray-400 font-bold mb-6">&nbsp;</p>

                    <ul className="text-xs text-gray-500 flex flex-col gap-2.5 mb-8">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="font-semibold text-gray-900">Miembros ilimitados</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Multi-sede</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>API y webhooks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Onboarding dedicado</span>
                      </li>
                    </ul>
                  </div>

                  <a 
                    href="mailto:soporte@getgym.app" 
                    className="w-full text-center bg-white border border-gray-300 hover:border-gray-950 text-gray-800 text-xs font-bold py-2.5 rounded-xl transition-all uppercase tracking-wide block cursor-pointer"
                  >
                    Hablemos
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="py-20 bg-white" id="preguntas">
            <div className="max-w-4xl mx-auto px-6">
              <p className="text-xs uppercase font-bold text-amber-600 tracking-wider text-center">Preguntas frecuentes</p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-950 text-center tracking-tight mt-1 mb-16">
                Lo que más nos preguntan los dueños.
              </h2>

              <div className="flex flex-col divide-y divide-gray-200">
                {faqs.map((faq, index) => {
                  const isOpen = openedFaqs.includes(index);
                  return (
                    <div key={index} className="py-5 cursor-pointer" onClick={() => toggleFaq(index)}>
                      <div className="flex justify-between items-center font-bold text-gray-900 text-sm md:text-base gap-4">
                        <span>{faq.q}</span>
                        <span className="text-gray-400 flex-shrink-0">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </div>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-gray-500 leading-relaxed mt-3 max-w-3xl">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-xs text-gray-400 mt-12 font-semibold">
                ¿Otra pregunta? <a href="mailto:soporte@getgym.app" className="text-amber-600 hover:underline">soporte@getgym.app</a>
              </p>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="py-24 text-center px-6 border-t border-gray-100 bg-gradient-to-br from-white to-[#FAF7F2]">
            <div className="max-w-3xl mx-auto">
              <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">Empezá hoy</span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight mt-1.5 mb-4">
                Tu próximo miembro perdido es una asistencia de menos.
              </h2>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-lg mx-auto mb-10">
                Empezá gratis hoy, configurá tu gym en menos de 10 minutos y empezá a recibir alertas de riesgo esta semana.
              </p>

              <div className="flex justify-center gap-3.5 flex-wrap mb-4">
                <button 
                  onClick={() => setView('register')} 
                  className="bg-[#1E1E1E] hover:bg-gray-800 text-white font-extrabold px-6 py-4 rounded-xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wider"
                >
                  Crear cuenta gratis
                </button>
                <button 
                  onClick={() => setView('login')} 
                  className="bg-white border border-gray-300 hover:border-gray-800 text-gray-800 font-extrabold px-6 py-4 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider"
                >
                  Ya tengo cuenta · Ingresar
                </button>
              </div>

              <p className="text-[11px] text-gray-400">Sin tarjeta de crédito · Cancelás cuando quieras · Soporte en español</p>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="bg-white border-t border-gray-100 py-16 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-xs">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-[#1E1E1E] text-white rounded flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-lg font-black text-[#1E1E1E] tracking-tight">
                    Get<span className="text-amber-600">Gym</span>
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed max-w-xs">
                  Plataforma de retención hecha en LATAM para dueños de gym. Reducí el churn sin pasar tu día en Excel.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-extrabold text-gray-900 uppercase tracking-wide">Producto</h4>
                <a href="#beneficios" className="text-gray-500 hover:text-gray-900 transition-colors">Beneficios</a>
                <a href="#como-funciona" className="text-gray-500 hover:text-gray-900 transition-colors">Cómo funciona</a>
                <a href="#precios" className="text-gray-500 hover:text-gray-900 transition-colors">Precios</a>
                <a href="#preguntas" className="text-gray-500 hover:text-gray-900 transition-colors">FAQ</a>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-extrabold text-gray-900 uppercase tracking-wide">Empezar</h4>
                <button onClick={() => setView('register')} className="text-left text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Crear cuenta</button>
                <button onClick={() => setView('login')} className="text-left text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Iniciar sesión</button>
                <a href="mailto:soporte@getgym.app" className="text-gray-500 hover:text-gray-900 transition-colors">Soporte</a>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-extrabold text-gray-900 uppercase tracking-wide">Legales</h4>
                <span className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Términos y condiciones</span>
                <span className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Política de privacidad</span>
              </div>
            </div>

            <div className="max-w-6xl mx-auto border-t border-gray-100 mt-12 pt-6 text-center text-[11px] text-gray-400 font-medium">
              © 2026 GetGym SAS. Hecho en LATAM. v1.0
            </div>
          </footer>
        </>
      )}

      {/* LOGIN VIEW */}
      {view === 'login' && (
        <div className="flex-1 flex items-center justify-center py-16 px-6">
          <div className="bg-white border border-[#EFE9E4] rounded-3xl p-8 max-w-md w-full shadow-[0_15px_40px_rgba(239,233,228,0.75)] animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-8">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Bienvenido de vuelta</span>
              <h1 className="text-2xl font-black text-gray-950 mt-1">Iniciá sesión</h1>
              <p className="text-xs text-gray-400 mt-1">
                ¿Sos nuevo? <button onClick={() => setView('register')} className="text-amber-600 font-bold hover:underline cursor-pointer">Creá una cuenta</button>
              </p>
            </div>

            <form onSubmit={handleFormLogin} className="flex flex-col gap-4 text-xs">
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium">
                  {authError}
                </div>
              )}
              
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl pl-10 pr-3.5 py-3.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-[15px]" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl pl-10 pr-10 py-3.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-[15px]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[15px] text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button type="button" className="text-xs font-bold text-amber-600 hover:underline cursor-pointer">¿Olvidaste tu contraseña?</button>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="bg-[#1E1E1E] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider mt-3 shadow-md cursor-pointer"
              >
                {authLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-y-1/2 left-0 right-0 h-px bg-[#FAF7F2]"></div>
              <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-gray-400 tracking-widest z-10">o continuá con</span>
            </div>

            <button 
              onClick={onLogin}
              className="w-full bg-white hover:bg-[#FAF7F2] border border-[#EFE9E4] text-gray-700 text-xs font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continuar con Google</span>
            </button>
          </div>
        </div>
      )}

      {/* REGISTER VIEW */}
      {view === 'register' && (
        <div className="flex-1 flex items-center justify-center py-16 px-6">
          <div className="bg-white border border-[#EFE9E4] rounded-3xl p-8 max-w-md w-full shadow-[0_15px_40px_rgba(239,233,228,0.75)] animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-8">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Empezá hoy gratis</span>
              <h1 className="text-2xl font-black text-gray-950 mt-1">Creá tu cuenta</h1>
              <p className="text-xs text-gray-400 mt-1">
                ¿Ya tenés cuenta? <button onClick={() => setView('login')} className="text-amber-600 font-bold hover:underline cursor-pointer">Iniciá sesión</button>
              </p>
            </div>

            <form onSubmit={handleFormRegister} className="flex flex-col gap-4 text-xs">
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium">
                  {authError}
                </div>
              )}
              
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Nombre</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl pl-10 pr-3.5 py-3.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <Users className="w-4 h-4 text-gray-400 absolute left-3 top-[15px]" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl pl-10 pr-3.5 py-3.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-[15px]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showRegPass ? 'text' : 'password'}
                      required
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl pl-10 pr-3.5 py-3.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-[15px]" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Confirmar</label>
                  <div className="relative">
                    <input
                      type={showRegPass ? 'text' : 'password'}
                      required
                      value={regPassConfirm}
                      onChange={(e) => setRegPassConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl pl-10 pr-10 py-3.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-[15px]" />
                    <button
                      type="button"
                      onClick={() => setShowRegPass(!showRegPass)}
                      className="absolute right-3 top-[15px] text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="bg-[#1E1E1E] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider mt-3 shadow-md cursor-pointer"
              >
                {authLoading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-y-1/2 left-0 right-0 h-px bg-[#FAF7F2]"></div>
              <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-gray-400 tracking-widest z-10">o continuá con</span>
            </div>

            <button 
              onClick={onLogin}
              className="w-full bg-white hover:bg-[#FAF7F2] border border-[#EFE9E4] text-gray-700 text-xs font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continuar con Google</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
