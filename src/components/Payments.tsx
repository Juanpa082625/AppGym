import React, { useState } from 'react';
import { 
  Plus, 
  CreditCard, 
  Search, 
  Filter, 
  X, 
  CheckCircle,
  Coins,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { Payment, GymSettings, PaymentStatus } from '../types';

interface PaymentsProps {
  gymSettings: GymSettings;
  payments: Payment[];
  onAddPayment: (newPayment: Payment) => void;
  searchVal: string;
}

export default function Payments({ 
  gymSettings, 
  payments, 
  onAddPayment,
  searchVal 
}: PaymentsProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("Todos");
  const [localSearch, setLocalSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form states
  const [formMember, setFormMember] = useState("");
  const [formConcept, setFormConcept] = useState("Mensualidad junio");
  const [formAmount, setFormAmount] = useState(34);
  const [formMethod, setFormMethod] = useState<'Tarjeta' | 'Efectivo' | 'Transferencia'>('Tarjeta');
  const [formStatus, setFormStatus] = useState<PaymentStatus>('PAGADO');

  // Dynamic calculations based on state
  const confirmedPaid = payments
    .filter(p => p.status === 'PAGADO')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'PENDIENTE')
    .reduce((acc, p) => acc + p.amount, 0);

  const overdueAmount = payments
    .filter(p => p.status === 'ATRASADO')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalProjection = confirmedPaid + pendingAmount; // cobrado + pendiente

  // Filters
  const filteredPayments = payments.filter(payment => {
    // 1. Status tab filter
    if (activeSubTab === "Pagados" && payment.status !== 'PAGADO') return false;
    if (activeSubTab === "Pendientes" && payment.status !== 'PENDIENTE') return false;
    if (activeSubTab === "Atrasados" && payment.status !== 'ATRASADO') return false;
    if (activeSubTab === "Reembolsados" && payment.status !== 'ATRASADO') return false; // mockup handle

    // 2. Search filtering (global + local)
    const normalizedSearch = (localSearch || searchVal || "").toLowerCase().trim();
    if (normalizedSearch) {
      return (
        payment.member.toLowerCase().includes(normalizedSearch) ||
        payment.concept.toLowerCase().includes(normalizedSearch) ||
        payment.method.toLowerCase().includes(normalizedSearch)
      );
    }

    return true;
  });

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMember) return;

    const newPayment: Payment = {
      id: `p_${Date.now()}`,
      member: formMember,
      concept: formConcept,
      amount: Number(formAmount),
      method: formMethod,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: formStatus
    };

    onAddPayment(newPayment);
    setShowAddModal(false);
    
    // Reset Form
    setFormMember("");
    setFormConcept("Mensualidad junio");
    setFormAmount(34);
    setFormMethod("Tarjeta");
    setFormStatus("PAGADO");

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E1E] text-white text-xs font-semibold px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl border border-gray-800 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>¡Pago registrado con éxito en el sistema!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
            NEGOCIO
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
            Pagos
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Cobros, renovaciones y morosos. Todo cargado manualmente por ahora.
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-[#1E1E1E] hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Registrar pago</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[116px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                COBRADO ESTE MES
              </span>
              <span className="bg-emerald-50 text-emerald-700 p-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-2xl font-black text-gray-950 mt-1.5">${confirmedPaid}</div>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">pagos confirmados</span>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[116px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                PENDIENTES
              </span>
              <span className="bg-amber-50 text-amber-700 p-1 rounded-full">
                <Coins className="w-3 h-3 text-amber-600" />
              </span>
            </div>
            <div className="text-2xl font-black text-gray-950 mt-1.5">${pendingAmount}</div>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">por cobrar</span>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[116px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                ATRASADOS
              </span>
              <span className="bg-red-50 text-red-600 p-1 rounded-full">
                <X className="w-3 h-3 text-red-500" />
              </span>
            </div>
            <div className="text-2xl font-black text-gray-950 mt-1.5">${overdueAmount}</div>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">requieren acción</span>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[116px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                PROYECCIÓN DE CIERRE
              </span>
              <span className="bg-emerald-50 text-emerald-700 p-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-2xl font-black text-gray-950 mt-1.5">${totalProjection}</div>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">cobrado + pendiente</span>
        </div>
      </div>

      {/* Transactions panel */}
      <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 shadow-[0_4px_20px_rgba(239,233,228,0.2)] flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FAF7F2] pb-4">
          <span className="text-xs font-bold text-gray-500">
            {filteredPayments.length} transacciones
          </span>

          <div className="flex items-center gap-3.5 flex-wrap">
            {/* Search */}
            <div className="relative w-[240px]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-3.5 w-3.5 text-gray-400" />
              </span>
              <input
                type="text"
                id="payments-inner-search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Buscar por miembro o concepto..."
                className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button className="flex items-center gap-1.5 text-xs font-bold text-gray-600 border border-[#EFE9E4] px-3 py-1.5 rounded-xl hover:bg-[#FAF7F2] transition-all cursor-pointer">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Filtros</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Filters bar status */}
        <div className="flex gap-2 flex-wrap pb-2 border-b border-[#FAF7F2]">
          {["Todos", "Pagados", "Pendientes", "Atrasados", "Reembolsados"].map((tab) => {
            const isTabActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isTabActive
                    ? "bg-[#1E1E1E] text-white shadow-sm"
                    : "bg-[#FAF7F2] hover:bg-[#F3ECE5] text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#FAF7F2] text-gray-400 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="py-3 px-4">Miembro</th>
                <th className="py-3 px-4">Concepto</th>
                <th className="py-3 px-4">Monto</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F2]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No se encontraron transacciones para el criterio de búsqueda o filtro seleccionado.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  return (
                    <tr key={payment.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-950">{payment.member}</td>
                      <td className="py-4 px-4 text-gray-600 font-medium">{payment.concept}</td>
                      <td className="py-4 px-4 font-black text-gray-950">${payment.amount} USD</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                          <span>{payment.method}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 font-semibold">{payment.date}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          payment.status === 'PAGADO'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : payment.status === 'PENDIENTE'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EFE9E4] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EFE9E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Registrar Pago Manual</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="p-6 flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Nombre del Miembro *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pedro González"
                  value={formMember}
                  onChange={(e) => setFormMember(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Concepto de cobro *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mensualidad junio"
                  value={formConcept}
                  onChange={(e) => setFormConcept(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Monto (USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="34"
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Método de pago</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Estado de Transacción</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['PAGADO', 'PENDIENTE', 'ATRASADO'].map((status) => {
                    const isSelected = formStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormStatus(status as PaymentStatus)}
                        className={`py-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#1E1E1E] border-[#1E1E1E] text-white' 
                            : 'bg-[#FAF7F2] border-[#EFE9E4] text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2.5 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-white border border-[#EFE9E4] hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#1E1E1E] hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Registrar pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
