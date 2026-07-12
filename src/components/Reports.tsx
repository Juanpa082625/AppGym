import { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Plus, 
  Eye, 
  Mail, 
  X,
  TrendingUp,
  Users,
  CreditCard,
  Percent,
  CheckCircle
} from 'lucide-react';
import { GymSettings, Member, Payment } from '../types';
import { mockHistoryReports } from '../data';

interface ReportsProps {
  gymSettings: GymSettings;
  members: Member[];
  payments: Payment[];
  searchVal: string;
}

interface HistoricalReport {
  id: string;
  title: string;
  type: string;
  membersCount: number;
  date: string;
}

export default function Reports({ 
  gymSettings, 
  members, 
  payments,
  searchVal 
}: ReportsProps) {
  const [reports, setReports] = useState<HistoricalReport[]>(mockHistoryReports);
  const [selectedReport, setSelectedReport] = useState<HistoricalReport | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const handleGenerateReport = () => {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const now = new Date();
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    const reportTitle = `Reporte ${currentMonth} ${currentYear} · ${gymSettings.name}`;
    
    // Check if already generated to prevent duplicate
    if (reports.some(r => r.title === reportTitle)) {
      setToastMsg("El reporte para este periodo ya ha sido generado.");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }

    const newReport: HistoricalReport = {
      id: `rep_${Date.now()}`,
      title: reportTitle,
      type: "MENSUAL",
      membersCount: members.length,
      date: `generado hoy, ${now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
    };

    setReports([newReport, ...reports]);
    setToastMsg("¡Nuevo reporte histórico generado!");
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Filter reports
  const filteredReports = reports.filter(r => {
    return r.title.toLowerCase().includes(searchVal.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E1E] text-white text-xs font-semibold px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl border border-gray-800 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
            NEGOCIO
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
            Reportes
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Snapshots mensuales del gimnasio. Generá uno cuando quieras.
          </p>
        </div>

        <div>
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-1.5 bg-[#1E1E1E] hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Generar reporte</span>
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-[#1E2229] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-gray-800 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-amber-400 flex-shrink-0 border border-gray-700 shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-gray-100">Tu próximo reporte automático sale en 15 días</h3>
            <p className="text-[11px] text-gray-400 mt-1">
              Se generará el reporte de jun 2026 para tu gimnasio. Envío por email • próximamente.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Two Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: History */}
        <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 shadow-[0_4px_20px_rgba(239,233,228,0.2)] lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Histórico</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{filteredReports.length} reportes generados</p>
              </div>
            </div>

            {/* Reports List */}
            <div className="flex flex-col divide-y divide-[#FAF7F2] mt-2">
              {filteredReports.map((report) => (
                <div key={report.id} className="py-4 flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EFE9E4] flex items-center justify-center text-amber-800">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-tight block hover:text-amber-600 transition-colors cursor-pointer" onClick={() => setSelectedReport(report)}>
                        {report.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">
                        {report.membersCount} miembros • {report.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${
                      report.type === 'COHORTE' 
                        ? 'bg-amber-50 text-amber-800 border border-amber-100' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {report.type}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 cursor-pointer"
                        title="Ver Reporte"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 cursor-pointer"
                        title="Enviar por Correo"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Auto reports */}
        <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 shadow-[0_4px_20px_rgba(239,233,228,0.2)] lg:col-span-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Reportes automáticos</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Configurá qué se genera y cuándo</p>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {/* Box 1 */}
            <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900">Reporte mensual del gimnasio</h4>
                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  Activo
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Se genera automáticamente el día 1 de cada mes con los datos del mes anterior.
              </p>
              <div className="text-[10px] text-gray-400 font-bold border-t border-[#EFE9E4] pt-2 mt-1">
                Frecuencia: Mensual • Próximo: jun 2026
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-2xl p-4 flex flex-col gap-3 opacity-70">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900">Reporte individual por miembro</h4>
                <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Próximamente
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Cada miembro recibirá su resumen personal cuando integremos envío por email.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EFE9E4] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EFE9E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Vista de Reporte</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 text-xs">
              <div>
                <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                  {selectedReport.type}
                </span>
                <h2 className="text-lg font-extrabold text-gray-900 mt-2">{selectedReport.title}</h2>
                <p className="text-gray-400 text-[11px] mt-0.5">Generado el {selectedReport.date.replace('generado ', '')}</p>
              </div>

              {/* Stats highlights */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl p-3.5">
                  <span className="text-[9px] font-bold text-gray-400 block uppercase">Miembros</span>
                  <div className="text-xl font-black text-gray-950 mt-1 flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{selectedReport.membersCount}</span>
                  </div>
                </div>
                <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl p-3.5">
                  <span className="text-[9px] font-bold text-gray-400 block uppercase">Ingresos Est.</span>
                  <div className="text-xl font-black text-gray-950 mt-1 flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span>${selectedReport.membersCount * 31}</span>
                  </div>
                </div>
                <div className="bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl p-3.5">
                  <span className="text-[9px] font-bold text-gray-400 block uppercase">Retención</span>
                  <div className="text-xl font-black text-gray-950 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>94.8%</span>
                  </div>
                </div>
              </div>

              {/* Graphic summary */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2 uppercase tracking-wide">Desglose de actividad</h4>
                <div className="flex flex-col gap-2.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-gray-500">
                      <span>Asistencia Regular (Frecuente)</span>
                      <span className="font-bold text-gray-950">72%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-gray-500">
                      <span>Asistencia Moderada (En Alerta)</span>
                      <span className="font-bold text-gray-950">18%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div className="bg-orange-400 h-full rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-gray-500">
                      <span>Asistencia Baja (Riesgo Crítico)</span>
                      <span className="font-bold text-gray-950">10%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#FAF7F2]">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="bg-[#1E1E1E] hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
