import { useState } from 'react';
import { 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  RefreshCw, 
  MessageSquare, 
  Phone,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { GymSettings, Member } from '../types';

interface DashboardProps {
  gymSettings: GymSettings;
  members: Member[];
  setActiveTab: (tab: string) => void;
  setMemberFilter: (filter: string) => void;
  onGenerateReport: () => void;
}

export default function Dashboard({ 
  gymSettings, 
  members, 
  setActiveTab, 
  setMemberFilter,
  onGenerateReport 
}: DashboardProps) {
  const [recalculating, setRecalculating] = useState(false);
  const [riskRecalculated, setRiskRecalculated] = useState(false);

  const handleRecalculateRisk = () => {
    setRecalculating(true);
    setTimeout(() => {
      setRecalculating(false);
      setRiskRecalculated(true);
      setTimeout(() => setRiskRecalculated(false), 3000);
    }, 1200);
  };

  // Find members at risk (Juan Pablo, Daniela, Mariana)
  const highRiskMembers = members
    .filter(m => m.risk === 'ALTO' || m.risk === 'MEDIO')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner & Quick Summary */}
      <div className="bg-white border border-[#EFE9E4] rounded-3xl p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-[0_4px_20px_rgba(239,233,228,0.25)]">
        <div className="flex-1">
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
            RESUMEN OPERATIVO · HOY
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Buen día, Roberto.
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-2xl leading-relaxed">
            Hay <strong className="text-gray-900 font-semibold">3 miembros</strong> en riesgo medio o alto en {gymSettings.name} que necesitan atención (1 críticos).
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => {
                setMemberFilter("En riesgo");
                setActiveTab("miembros");
              }}
              className="flex items-center gap-2 bg-[#1E1E1E] hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all cursor-pointer shadow-sm"
            >
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span>Ver miembros en riesgo</span>
            </button>
            <button
              onClick={onGenerateReport}
              className="flex items-center gap-2 bg-white border border-[#EFE9E4] hover:bg-[#FAF7F2] text-[#1E1E1E] text-xs font-bold px-4 py-2.5 rounded-2xl transition-all cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Generar reporte mensual</span>
            </button>
          </div>
        </div>

        {/* Top Right Mini Stats cards */}
        <div className="flex gap-4 flex-shrink-0">
          <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-2xl p-5 w-[160px] relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#F3ECE5] text-amber-700 flex items-center justify-center mb-3">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              MIEMBROS ACTIVOS
            </span>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">9</div>
            <span className="text-[10px] text-gray-500 mt-0.5 block">hoy en el gym</span>
          </div>

          <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-2xl p-5 w-[160px] relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#EBF5EE] text-emerald-700 flex items-center justify-center mb-3">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              ALTAS DEL MES
            </span>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">+3</div>
            <span className="text-[10px] text-gray-500 mt-0.5 block">miembros nuevos</span>
          </div>
        </div>
      </div>

      {/* Under Summary Row of 4 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-[0_2px_12px_rgba(239,233,228,0.15)] flex flex-col justify-between h-[120px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                MIEMBROS ACTIVOS
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                ↗ +3
              </span>
            </div>
            <div className="text-3xl font-black text-gray-900 mt-1.5">9</div>
          </div>
          <span className="text-[11px] text-gray-400">altas en el mes</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-[0_2px_12px_rgba(239,233,228,0.15)] flex flex-col justify-between h-[120px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                EN RIESGO
              </span>
              <span className="bg-orange-50 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                ↘ 1 altos
              </span>
            </div>
            <div className="text-3xl font-black text-gray-900 mt-1.5">3</div>
          </div>
          <span className="text-[11px] text-gray-400">2 medios</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-[0_2px_12px_rgba(239,233,228,0.15)] flex flex-col justify-between h-[120px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                COBRADO ESTE MES
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                ↗ $252 pendientes
              </span>
            </div>
            <div className="text-3xl font-black text-gray-900 mt-1.5">$236</div>
          </div>
          <span className="text-[11px] text-gray-400">del mes en curso</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-[0_2px_12px_rgba(239,233,228,0.15)] flex flex-col justify-between h-[120px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                NUEVOS ESTE MES
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                ↗ Altas
              </span>
            </div>
            <div className="text-3xl font-black text-gray-900 mt-1.5">3</div>
          </div>
          <span className="text-[11px] text-gray-400">desde el día 1</span>
        </div>
      </div>

      {/* Risk Section Container */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Riesgo de la membresía</h2>
            <p className="text-xs text-gray-400 mt-0.5">Recalculá scores cuando agregás asistencia, pagos o notas.</p>
          </div>
          <button
            id="recalculate-risk-btn"
            disabled={recalculating}
            onClick={handleRecalculateRisk}
            className={`flex items-center gap-1.5 border border-[#EFE9E4] hover:bg-[#FAF7F2] text-gray-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              recalculating ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${recalculating ? 'animate-spin' : ''}`} />
            <span>{recalculating ? 'Calculando...' : riskRecalculated ? '¡Hecho!' : 'Recalcular riesgo'}</span>
          </button>
        </div>

        {riskRecalculated && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Scores de riesgo recalculados con éxito en base a la actividad más reciente.</span>
          </div>
        )}

        {/* Risk Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Risk Distribution Card */}
          <div className="bg-white border border-[#EFE9E4] rounded-2xl p-6 shadow-[0_2px_12px_rgba(239,233,228,0.12)] lg:col-span-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Distribución de riesgo</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Score calculado cada 6 horas sobre 152 miembros activos</p>
              </div>
              <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                ⚠️ 14 críticos
              </span>
            </div>

            {/* Circular graph */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-6">
              {/* SVG Circle chart resembling screenshot */}
              <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F1EFEA"
                    strokeWidth="12"
                  />
                  {/* Green Bajo Riesgo: 72% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="70.3" // 251.2 * 0.28 (starts from green offset)
                    className="transition-all duration-1000"
                  />
                  {/* Orange Riesgo Medio: 18% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="206.0" // 251.2 * 0.82
                    className="transition-all duration-1000"
                  />
                  {/* Red Alto Riesgo: 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#EF4444"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="226.1" // 251.2 * 0.90
                    className="transition-all duration-1000"
                  />
                </svg>
                {/* Center elements */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-gray-900">152</span>
                  <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase -mt-0.5">MIEMBROS</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="flex flex-col gap-2.5 w-full">
                {/* Item 1 */}
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      <span className="text-gray-500 font-medium">Alto riesgo</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">14 </span>
                      <span className="text-gray-400 text-[10px]">• 9%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '9%' }}></div>
                  </div>
                </div>

                {/* Item 2 */}
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                      <span className="text-gray-500 font-medium">Riesgo medio</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">28 </span>
                      <span className="text-gray-400 text-[10px]">• 18%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-orange-400 h-full rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>

                {/* Item 3 */}
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-gray-500 font-medium">Bajo riesgo</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">110 </span>
                      <span className="text-gray-400 text-[10px]">• 72%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Members in Risk Panel */}
          <div className="bg-white border border-[#EFE9E4] rounded-2xl p-6 shadow-[0_2px_12px_rgba(239,233,228,0.12)] lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Miembros en riesgo</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Top 3 por score · ordenados de mayor a menor</p>
                </div>
                <button
                  onClick={() => {
                    setMemberFilter("En riesgo");
                    setActiveTab("miembros");
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Ver todos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Members List */}
              <div className="flex flex-col divide-y divide-[#FAF7F2]">
                {highRiskMembers.map((member) => (
                  <div key={member.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#EFE9E4]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{member.name}</span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                            member.risk === 'ALTO' 
                              ? 'bg-red-50 text-red-600' 
                              : 'bg-orange-50 text-orange-600'
                          }`}>
                            {member.risk}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {member.id === 'm1' ? 'Última visita hace 1 días' : 'Frecuencia bajó · última visita ' + member.lastVisit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Score display */}
                      <div className="text-right">
                        <div className="text-base font-black text-gray-900">{member.riskScore}</div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block -mt-1">SCORE</span>
                      </div>
                      
                      {/* Direct actions */}
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`mailto:${member.email}?subject=Notificación importante de ${gymSettings.name}`}
                          className="p-2 bg-white border border-[#EFE9E4] hover:bg-[#FAF7F2] rounded-full text-gray-500 hover:text-gray-800 transition-all cursor-pointer shadow-sm"
                          title="Enviar correo"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${gymSettings.phone}`}
                          className="p-2 bg-white border border-[#EFE9E4] hover:bg-[#FAF7F2] rounded-full text-gray-500 hover:text-gray-800 transition-all cursor-pointer shadow-sm"
                          title="Llamar"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 text-right">
              <span className="text-[10px] text-gray-400 font-medium">Última actualización: hace unos momentos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
