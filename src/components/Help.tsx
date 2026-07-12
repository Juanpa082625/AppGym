import { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  Users, 
  AlertTriangle, 
  Dumbbell, 
  CreditCard, 
  FileText, 
  UserSquare, 
  Mail,
  ChevronDown,
  X
} from 'lucide-react';
import { HelpSection, GymSettings } from '../types';
import { helpSections } from '../data';

interface HelpProps {
  gymSettings: GymSettings;
  searchVal: string;
}

export default function Help({ gymSettings, searchVal }: HelpProps) {
  const [helpSearch, setHelpSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<HelpSection | null>(null);

  // Combine parent search with local search
  const query = (helpSearch || searchVal || "").toLowerCase().trim();

  // Filter sections
  const filteredSections = helpSections.filter(sec => {
    return (
      sec.title.toLowerCase().includes(query) ||
      sec.description.toLowerCase().includes(query)
    );
  });

  const faqs = [
    {
      q: "¿Cómo se calcula el score de riesgo de un miembro?",
      a: "El score de riesgo de TitanOps se calcula automáticamente en base a tres factores: la cantidad de días transcurridos desde la última visita al gimnasio, la disminución de la frecuencia de asistencia semanal comparada con su histórico promedio, y el estado actual de pago de su suscripción."
    },
    {
      q: "¿Puedo registrar un pago parcial de membresía?",
      a: "Sí, a través de la pestaña 'Pagos', puedes registrar un cobro manual. Si el miembro realiza un pago parcial, puedes registrar el monto abonado con estado 'PENDIENTE' y añadir notas descriptivas, o bien registrar múltiples cuotas."
    },
    {
      q: "¿Cómo exporto la lista completa de mis entrenadores?",
      a: "Puedes ver e interactuar con tu equipo desde la sección 'Entrenadores'. Para exportaciones completas, la lista de miembros te permite filtrar por entrenador específico y descargar un archivo CSV estructurado."
    }
  ];

  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="w-5 h-5 text-amber-800" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-amber-800" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5 text-amber-800" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-amber-800" />;
      case 'FileText': return <FileText className="w-5 h-5 text-amber-800" />;
      case 'UserSquare': return <UserSquare className="w-5 h-5 text-amber-800" />;
      default: return <HelpCircle className="w-5 h-5 text-amber-800" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 text-xs">
      {/* Big Header Banner */}
      <div className="bg-gradient-to-br from-white to-[#FAF7F2] border border-[#EFE9E4] rounded-3xl p-8 md:p-12 text-center flex flex-col items-center justify-center shadow-[0_4px_24px_rgba(239,233,228,0.25)] relative overflow-hidden">
        <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-amber-100/50">
          CENTRO DE AYUDA PARA DUEÑOS
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-950 max-w-2xl tracking-tight leading-tight mb-3">
          ¿Cómo te podemos ayudar con tu gimnasio?
        </h1>
        <p className="text-gray-500 text-xs max-w-md leading-relaxed mb-6">
          Buscá guías rápidas sobre cómo usar el panel de TitanOps. Si necesitás algo específico de tu cuenta o suscripción, escribinos a <strong className="text-gray-800 font-semibold">soporte@titanops.app</strong>.
        </p>

        {/* Big Search bar inside banner */}
        <div className="relative w-full max-w-lg shadow-sm rounded-2xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-4.5 w-4.5 text-gray-400" />
          </span>
          <input
            type="text"
            value={helpSearch}
            onChange={(e) => setHelpSearch(e.target.value)}
            placeholder="Ej: cómo registrar un pago, calcular riesgo..."
            className="w-full bg-[#FFFFFF] border border-[#EFE9E4] rounded-2xl pl-12 pr-4 py-3.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Explora por sección */}
      <div>
        <h2 className="text-lg font-bold text-gray-950 mb-1">Explorá por sección</h2>
        <p className="text-xs text-gray-400 mb-5">Cada tarjeta te lleva directo a conocer las guías del panel.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSections.map((sec) => (
            <div 
              key={sec.id} 
              onClick={() => setSelectedTopic(sec)}
              className="bg-white border border-[#EFE9E4] hover:border-amber-500/40 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-3 group"
            >
              <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#EFE9E4] flex items-center justify-center flex-shrink-0 group-hover:bg-[#F3ECE5] transition-colors">
                {getSectionIcon(sec.icon)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-950 group-hover:text-amber-700 transition-colors">{sec.title}</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed mt-1">{sec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs and Support layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
        {/* FAQs list (7 cols) */}
        <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 shadow-sm lg:col-span-8 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-950 border-b border-[#FAF7F2] pb-3">
            Preguntas frecuentes
          </h3>

          <div className="flex flex-col gap-4 divide-y divide-[#FAF7F2]">
            {faqs.map((faq, index) => (
              <div key={index} className={`${index > 0 ? 'pt-4' : ''} flex flex-col gap-1.5`}>
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-amber-500">¿</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-gray-500 text-[11px] leading-relaxed pl-3.5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Card (4 cols) */}
        <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 shadow-sm lg:col-span-4 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-full bg-[#EBF5EE] text-emerald-700 flex items-center justify-center">
            <Mail className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-gray-950 uppercase tracking-wider">¿Necesitás más ayuda?</h3>
            <p className="text-gray-500 text-[11px] leading-relaxed mt-2">
              Escribinos a <strong className="text-gray-800 font-semibold">soporte@titanops.app</strong> y te respondemos dentro de las próximas 24 horas hábiles.
            </p>
          </div>
          <a
            href="mailto:soporte@titanops.app"
            className="bg-[#1E1E1E] hover:bg-gray-800 text-white font-bold text-center py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm text-[11px] uppercase tracking-wide mt-1"
          >
            Enviar Email
          </a>
        </div>
      </div>

      {/* Guide Detail Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EFE9E4] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EFE9E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Guía de TitanOps</h3>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs text-gray-600 leading-relaxed">
              <div>
                <h2 className="text-base font-extrabold text-gray-950">{selectedTopic.title}</h2>
                <p className="text-gray-400 text-[11px] mt-0.5">{selectedTopic.description}</p>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EFE9E4] flex flex-col gap-2">
                <span className="font-bold text-gray-900 block text-[11px] uppercase tracking-wide">Puntos clave:</span>
                <ul className="list-disc pl-4 flex flex-col gap-1.5 text-gray-500">
                  <li>Accede con un clic a la sección correspondiente desde la barra lateral izquierda.</li>
                  <li>Usa filtros avanzados y barras de búsqueda para segmentar la información rápidamente.</li>
                  <li>Puedes registrar, editar o dar de baja información en tiempo real.</li>
                  <li>Exporta históricos en formato CSV para conciliar con planillas contables externas.</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#FAF7F2]">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="bg-[#1E1E1E] hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
