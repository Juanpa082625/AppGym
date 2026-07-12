import React, { useState } from 'react';
import { 
  Plus, 
  Mail, 
  Users, 
  UserSquare, 
  X, 
  CheckCircle, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { Coach, GymSettings } from '../types';

interface CoachesProps {
  gymSettings: GymSettings;
  coaches: Coach[];
  onAddCoach: (newCoach: Coach) => void;
  searchVal: string;
}

export default function Coaches({ 
  gymSettings, 
  coaches, 
  onAddCoach,
  searchVal
}: CoachesProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");

  // Dynamic statistics
  const activeCoachesCount = coaches.length;
  const totalAssignedMembers = coaches.reduce((acc, c) => acc + c.assignedMembers, 0);

  // Filter coaches based on global search
  const filteredCoaches = coaches.filter(coach => {
    const normalizedSearch = searchVal.toLowerCase().trim();
    if (normalizedSearch) {
      return (
        coach.name.toLowerCase().includes(normalizedSearch) ||
        coach.email.toLowerCase().includes(normalizedSearch)
      );
    }
    return true;
  });

  const handleInviteCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    const newCoach: Coach = {
      id: `c_${Date.now()}`,
      name: formName,
      email: formEmail,
      photoUrl: "", // triggers initials view if empty
      assignedMembers: 0,
      joinDate: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "ALTA"
    };

    onAddCoach(newCoach);
    setShowAddModal(false);
    setFormName("");
    setFormEmail("");

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Helper to extract initials
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E1E] text-white text-xs font-semibold px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl border border-gray-800 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>¡Invitación enviada al entrenador con éxito!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
            OPERACIÓN
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
            Entrenadores
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gestioná tu equipo, asigná miembros y dales acceso al panel.
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-[#1E1E1E] hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Invitar entrenador</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EFE9E4] flex items-center justify-center text-amber-800 flex-shrink-0">
            <UserSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              ENTRENADORES ACTIVOS
            </span>
            <div className="text-2xl font-black text-gray-900 leading-none mt-1">{activeCoachesCount}</div>
            <span className="text-[10px] text-gray-400 block mt-1">en el equipo del gimnasio</span>
          </div>
        </div>

        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EFE9E4] flex items-center justify-center text-amber-800 flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              MIEMBROS ASIGNADOS
            </span>
            <div className="text-2xl font-black text-gray-900 leading-none mt-1">{totalAssignedMembers}</div>
            <span className="text-[10px] text-gray-400 block mt-1">suma de todos los coaches</span>
          </div>
        </div>

        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EFE9E4] flex items-center justify-center text-gray-400 flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              SIN COACH
            </span>
            <div className="text-2xl font-black text-gray-400 leading-none mt-1">—</div>
            <span className="text-[10px] text-gray-400 block mt-1">ver desde Miembros</span>
          </div>
        </div>
      </div>

      {/* Roster Panel */}
      <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 shadow-[0_4px_20px_rgba(239,233,228,0.2)] flex flex-col gap-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-[#FAF7F2] pb-3">
          Equipo
        </h3>

        {/* Coaches Table/List resembling image */}
        <div className="flex flex-col divide-y divide-[#FAF7F2]">
          {filteredCoaches.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              No se encontraron entrenadores para la búsqueda.
            </div>
          ) : (
            filteredCoaches.map((coach) => {
              const useInitials = !coach.photoUrl;
              return (
                <div key={coach.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-[#FAF7F2]/30 px-2 rounded-xl transition-colors">
                  {/* Name and avatar column */}
                  <div className="flex items-center gap-3.5 sm:w-1/3">
                    {useInitials ? (
                      <div className="w-10 h-10 rounded-full bg-[#F3ECE5] border border-[#EFE9E4] flex items-center justify-center font-bold text-amber-800 text-xs">
                        {getInitials(coach.name)}
                      </div>
                    ) : (
                      <img
                        src={coach.photoUrl}
                        alt={coach.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#EFE9E4]"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight block hover:text-amber-600 cursor-pointer">{coach.name}</h4>
                      <span className="text-[11px] text-gray-400 mt-0.5 block font-medium">{coach.email}</span>
                    </div>
                  </div>

                  {/* Assignments Column */}
                  <div className="flex flex-col sm:w-1/3 sm:items-start pl-14 sm:pl-0">
                    <span className="text-base font-extrabold text-gray-900 leading-none">
                      {coach.assignedMembers}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1">
                      MIEMBROS ASIGNADOS
                    </span>
                  </div>

                  {/* Joined Date and Status Column */}
                  <div className="flex flex-col sm:w-1/4 pl-14 sm:pl-0">
                    <span className="text-xs font-bold text-gray-900">
                      {coach.joinDate}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-0.5">
                      {coach.status}
                    </span>
                  </div>

                  {/* Action Columns */}
                  <div className="flex justify-end gap-2 pr-2">
                    <a
                      href={`mailto:${coach.email}`}
                      className="p-2 bg-white border border-[#EFE9E4] hover:bg-[#FAF7F2] rounded-full text-gray-400 hover:text-gray-900 transition-all cursor-pointer shadow-sm"
                      title="Enviar Correo"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Invite Coach Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EFE9E4] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EFE9E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserSquare className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Invitar Entrenador</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteCoach} className="p-6 flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Nombre completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Rodríguez"
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
                  placeholder="coach@gimnasio.co"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="bg-[#FAF7F2] border border-[#EFE9E4] p-4 rounded-xl text-gray-500 leading-relaxed text-[11px] mt-2">
                El entrenador recibirá una invitación para crear su contraseña y acceder al panel de TitanOps con los permisos del gimnasio asignados.
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
                  Enviar invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
