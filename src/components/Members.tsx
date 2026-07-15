import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone,
  X,
  UserPlus,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Member, GymSettings, MemberStatus, RiskLevel } from '../types';

interface MembersProps {
  gymSettings: GymSettings;
  members: Member[];
  onAddMember: (newMember: Member) => void;
  filterFromDashboard: string;
  setFilterFromDashboard: (filter: string) => void;
  searchVal: string;
}

export default function Members({ 
  gymSettings, 
  members, 
  onAddMember,
  filterFromDashboard,
  setFilterFromDashboard,
  searchVal
}: MembersProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>(filterFromDashboard || "Todos");
  const [tableSearch, setTableSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);

  // Form states for new member
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPlan, setFormPlan] = useState("Mensual");
  const [formStatus, setFormStatus] = useState<MemberStatus>("ACTIVO");
  const [formCoach, setFormCoach] = useState("—");

  // Sync tab filter if redirected from dashboard
  if (filterFromDashboard && activeSubTab !== filterFromDashboard) {
    setActiveSubTab(filterFromDashboard);
  }

  // Calculate stats dynamically
  const totalCount = members.length;
  const activeCount = members.filter(m => m.status === 'ACTIVO' || m.status === 'NUEVO').length;
  const riskCount = members.filter(m => m.risk === 'ALTO' || m.risk === 'MEDIO').length;
  const newCount = members.filter(m => m.status === 'NUEVO' || m.registrationDate.includes('jun 2026')).length;

  // Filter members based on active tab & searches
  const filteredMembers = members.filter(member => {
    // 1. Tab filters
    if (activeSubTab === "Activos") {
      if (member.status !== 'ACTIVO' && member.status !== 'NUEVO') return false;
    } else if (activeSubTab === "En riesgo") {
      if (member.risk !== 'ALTO' && member.risk !== 'MEDIO') return false;
    } else if (activeSubTab === "Atrasados") {
      if (member.status !== 'ATRASADO') return false;
    } else if (activeSubTab === "Pausados") {
      if (member.status !== 'PAUSADO') return false;
    } else if (activeSubTab === "Nuevos") {
      if (member.status !== 'NUEVO' && !member.registrationDate.includes('jun 2026')) return false;
    }

    // 2. Search filtering (supports global search + table search)
    const normalizedSearch = (tableSearch || searchVal || "").toLowerCase().trim();
    if (normalizedSearch) {
      const matchName = member.name.toLowerCase().includes(normalizedSearch);
      const matchEmail = member.email.toLowerCase().includes(normalizedSearch);
      const matchPlan = member.plan.toLowerCase().includes(normalizedSearch);
      const matchCoach = member.coach.toLowerCase().includes(normalizedSearch);
      return matchName || matchEmail || matchPlan || matchCoach;
    }

    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(filteredMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, id]);
    } else {
      setSelectedMembers(selectedMembers.filter(mId => mId !== id));
    }
  };

  const handleExportCSV = () => {
    const headers = "ID,Nombre,Email,Registro,Plan,Estado,Riesgo,Risk Score,Ultima Visita,Entrenador\n";
    const rows = filteredMembers.map(m => 
      `"${m.id}","${m.name}","${m.email}","${m.registrationDate}","${m.plan}","${m.status}","${m.risk}",${m.riskScore},"${m.lastVisit}","${m.coach}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `miembros_${gymSettings.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    const newMember: Member = {
      id: `m_${Date.now()}`,
      name: formName,
      email: formEmail,
      photoUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?w=150&auto=format&fit=crop&q=80`,
      registrationDate: "alta jun 2026",
      plan: formPlan,
      status: formStatus,
      risk: 'BAJO', // Will be calculated automatically by database trigger
      riskScore: 100, // Will be calculated automatically by database trigger
      lastVisit: "hace 1 días",
      coach: formCoach
    };

    onAddMember(newMember);
    setShowAddModal(false);
    
    // Reset Form
    setFormName("");
    setFormEmail("");
    setFormPlan("Mensual");
    setFormStatus("ACTIVO");
    setFormCoach("—");

    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E1E] text-white text-xs font-semibold px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl border border-gray-800 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>¡Miembro agregado correctamente!</span>
        </div>
      )}

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
            OPERACIÓN
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
            Miembros
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gestioná altas, score de riesgo y comunicación con cada miembro de {gymSettings.name}.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white border border-[#EFE9E4] hover:bg-[#FAF7F2] text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-gray-400" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-[#1E1E1E] hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Agregar miembro</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            TOTAL MIEMBROS
          </span>
          <div className="text-2xl font-black text-gray-900 mt-1">{totalCount}</div>
          <span className="text-[10px] text-gray-400 block mt-0.5">en este gimnasio</span>
        </div>

        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            ACTIVOS
          </span>
          <div className="text-2xl font-black text-gray-900 mt-1">{activeCount}</div>
          <span className="text-[10px] text-gray-400 block mt-0.5">del gimnasio completo</span>
        </div>

        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            EN RIESGO
          </span>
          <div className="text-2xl font-black text-gray-900 mt-1">{riskCount}</div>
          <span className="text-[10px] text-gray-400 block mt-0.5">1 críticos</span>
        </div>

        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            NUEVOS ESTE MES
          </span>
          <div className="text-2xl font-black text-gray-900 mt-1">{newCount}</div>
          <span className="text-[10px] text-gray-400 block mt-0.5">altas en el mes</span>
        </div>
      </div>

      {/* Filter and search layout */}
      <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 shadow-[0_4px_20px_rgba(239,233,228,0.2)] flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FAF7F2] pb-4">
          {/* Inner Search bar */}
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              id="members-inner-search"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Buscar por nombre, email o plan..."
              className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-600 border border-[#EFE9E4] px-3.5 py-2 rounded-xl hover:bg-[#FAF7F2] transition-all self-start md:self-auto cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Filtros avanzados</span>
          </button>
        </div>

        {/* Tab filters */}
        <div className="flex gap-2 flex-wrap pb-2 border-b border-[#FAF7F2]">
          {["Todos", "Activos", "En riesgo", "Atrasados", "Pausados", "Nuevos"].map((tab) => {
            const isTabActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                id={`subtab-${tab}`}
                onClick={() => {
                  setActiveSubTab(tab);
                  setFilterFromDashboard(""); // clear dashboard filter route once clicked
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#FAF7F2] text-gray-400 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="py-3 px-2 w-[40px]">
                  <input 
                    type="checkbox"
                    checked={filteredMembers.length > 0 && selectedMembers.length === filteredMembers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                  />
                </th>
                <th className="py-3 px-4">Miembro</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Riesgo</th>
                <th className="py-3 px-4">Última Visita</th>
                <th className="py-3 px-4">Entrenador</th>
                <th className="py-3 px-4 text-center w-[60px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F2]">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No se encontraron miembros para el criterio de búsqueda o filtro seleccionado.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const isChecked = selectedMembers.includes(member.id);
                  return (
                    <tr key={member.id} className="hover:bg-[#FAF7F2]/50 transition-colors group">
                      <td className="py-3.5 px-2">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => handleSelectMember(member.id, e.target.checked)}
                          className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover border border-[#EFE9E4]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-gray-950 block hover:text-amber-600 transition-colors cursor-pointer">{member.name}</span>
                            <span className="text-gray-400 text-[10px] font-medium block">{member.email} • {member.registrationDate}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-700">{member.plan}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          member.status === 'ACTIVO' || member.status === 'NUEVO'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : member.status === 'ATRASADO'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : member.status === 'CANCELADO'
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {member.status === 'ACTIVO' ? 'AL DÍA' : member.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black ${
                          member.risk === 'ALTO'
                            ? 'bg-red-50 text-red-600'
                            : member.risk === 'MEDIO'
                            ? 'bg-orange-50 text-orange-600'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            member.risk === 'ALTO' ? 'bg-red-500' : member.risk === 'MEDIO' ? 'bg-orange-400' : 'bg-emerald-500'
                          }`}></span>
                          {member.risk} • {member.riskScore}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{member.lastVisit}</td>
                      <td className="py-3.5 px-4 text-gray-600 font-semibold">{member.coach}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={`mailto:${member.email}`}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900"
                            title="Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          <button
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900"
                            title="Opciones"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EFE9E4] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EFE9E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Nuevo Miembro</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Nombre completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Correo electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Plan</label>
                  <select
                    value={formPlan}
                    onChange={(e) => setFormPlan(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Mensual">Mensual ($34)</option>
                    <option value="Trimestral">Trimestral ($92)</option>
                    <option value="Semestral">Semestral ($168)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Coach Asignado</label>
                  <select
                    value={formCoach}
                    onChange={(e) => setFormCoach(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="—">Ninguno (—)</option>
                    <option value="Carlos Rodríguez">Carlos Rodríguez</option>
                    <option value="Camila Pérez">Camila Pérez</option>
                    <option value="Esteban Rivera">Esteban Rivera</option>
                    <option value="Lucía Galván">Lucía Galván</option>
                    <option value="nicolas sosa">nicolas sosa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Estado de pago</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as MemberStatus)}
                  className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="ACTIVO">Al día (ACTIVO)</option>
                  <option value="NUEVO">Nuevo</option>
                  <option value="ATRASADO">Atrasado</option>
                  <option value="PAUSADO">Pausado</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
                <strong>Nota:</strong> El score de riesgo se calculará automáticamente basado en asistencia, pagos, frecuencia y otros factores.
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
                  Guardar miembro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
