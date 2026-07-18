import React, { useState } from 'react';
import { 
  Dumbbell, 
  Clock, 
  Calendar, 
  Plus, 
  Import, 
  Search, 
  MoreHorizontal, 
  X, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { Routine, GymSettings, RoutineLevel } from '../types';
import ImageUpload from './ImageUpload';

interface RoutinesProps {
  gymSettings: GymSettings;
  routines: Routine[];
  onAddRoutine: (newRoutine: Routine) => void;
  onUpdateRoutine: (updatedRoutine: Routine) => void;
  searchVal: string;
}

export default function Routines({ 
  gymSettings, 
  routines, 
  onAddRoutine,
  onUpdateRoutine,
  searchVal
}: RoutinesProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("Todas");
  const [localSearch, setLocalSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formLevel, setFormLevel] = useState<RoutineLevel>("INTERMEDIO");
  const [formDuration, setFormDuration] = useState("30 min");
  const [formFrequency, setFormFrequency] = useState("3 días/sem");
  const [formExercises, setFormExercises] = useState(4);
  const [formImage, setFormImage] = useState("");

  // Dynamic calculations
  const totalRoutines = routines.length;
  const totalAssignments = routines.reduce((acc, r) => acc + r.assignedMembers, 7); // match 7 in image
  const averageAssignments = totalRoutines > 0 ? Math.round(totalAssignments / totalRoutines) : 1;

  // Filters and search logic
  const filteredRoutines = routines.filter(routine => {
    // 1. Level tab filter
    if (activeSubTab !== "Todas") {
      if (routine.level !== activeSubTab.toUpperCase()) return false;
    }

    // 2. Search filter (supports global + local)
    const normalizedSearch = (localSearch || searchVal || "").toLowerCase().trim();
    if (normalizedSearch) {
      const matchTitle = routine.title.toLowerCase().includes(normalizedSearch);
      const matchLevel = routine.level.toLowerCase().includes(normalizedSearch);
      return matchTitle || matchLevel;
    }

    return true;
  });

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const defaultImages = [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80"
    ];

    const newRoutine: Routine = {
      id: `r_${Date.now()}`,
      title: formTitle,
      level: formLevel,
      duration: formDuration,
      frequency: formFrequency,
      exercisesCount: Number(formExercises),
      assignedMembers: 0,
      imageUrl: formImage || defaultImages[Math.floor(Math.random() * defaultImages.length)],
      lastUpdated: "Actualizada hace un momento"
    };

    onAddRoutine(newRoutine);
    setShowAddModal(false);
    resetForm();

    setToastMessage("¡Nueva rutina creada con éxito!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEditClick = (routine: Routine) => {
    setEditingRoutine(routine);
    setFormTitle(routine.title);
    setFormLevel(routine.level);
    setFormDuration(routine.duration);
    setFormFrequency(routine.frequency);
    setFormExercises(routine.exercisesCount);
    setFormImage(routine.imageUrl);
  };

  const handleUpdateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoutine || !formTitle) return;

    const updated: Routine = {
      ...editingRoutine,
      title: formTitle,
      level: formLevel,
      duration: formDuration,
      frequency: formFrequency,
      exercisesCount: Number(formExercises),
      imageUrl: formImage,
      lastUpdated: "Actualizada hace un momento"
    };

    onUpdateRoutine(updated);
    setEditingRoutine(null);
    resetForm();

    setToastMessage("¡Rutina actualizada correctamente!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const resetForm = () => {
    setFormTitle("");
    setFormLevel("INTERMEDIO");
    setFormDuration("30 min");
    setFormFrequency("3 días/sem");
    setFormExercises(4);
    setFormImage("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E1E] text-white text-xs font-semibold px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl border border-gray-800 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
            OPERACIÓN
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
            Rutinas
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Biblioteca compartida de rutinas. Asigná, duplicá o actualizá los programas de tu equipo.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setToastMessage("Las plantillas por defecto han sido importadas con éxito.");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2500);
            }}
            className="flex items-center gap-1.5 bg-white border border-[#EFE9E4] hover:bg-[#FAF7F2] text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Import className="w-3.5 h-3.5 text-gray-400" />
            <span>Importar plantilla</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-[#1E1E1E] hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Crear rutina</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EFE9E4] flex items-center justify-center text-amber-800 flex-shrink-0">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              RUTINAS ACTIVAS
            </span>
            <div className="text-2xl font-black text-gray-900 leading-none mt-1">{totalRoutines}</div>
            <span className="text-[10px] text-gray-400 block mt-1">en este gimnasio</span>
          </div>
        </div>

        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EFE9E4] flex items-center justify-center text-amber-800 flex-shrink-0">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              ASIGNACIONES TOTALES
            </span>
            <div className="text-2xl font-black text-gray-900 leading-none mt-1">{totalAssignments}</div>
            <span className="text-[10px] text-gray-400 block mt-1">rutinas vinculadas a miembros</span>
          </div>
        </div>

        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EFE9E4] flex items-center justify-center text-amber-800 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              PROMEDIO POR RUTINA
            </span>
            <div className="text-2xl font-black text-gray-900 leading-none mt-1">{averageAssignments}</div>
            <span className="text-[10px] text-gray-400 block mt-1">miembros por rutina</span>
          </div>
        </div>
      </div>

      {/* Routine Cards grid view */}
      <div className="bg-white border border-[#EFE9E4] rounded-3xl p-6 shadow-[0_4px_20px_rgba(239,233,228,0.2)] flex flex-col gap-6">
        {/* Search & Filter subtab row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#FAF7F2]">
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              id="routines-inner-search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Buscar rutina por nombre o nivel..."
              className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {["Todas", "Principiante", "Intermedio", "Avanzado"].map((level) => {
              const isActive = activeSubTab === level;
              return (
                <button
                  key={level}
                  onClick={() => setActiveSubTab(level)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#1E1E1E] text-white shadow-sm"
                      : "bg-[#FAF7F2] hover:bg-[#F3ECE5] text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Routine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutines.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-400 text-xs">
              No se encontraron rutinas para el criterio de búsqueda o nivel seleccionado.
            </div>
          ) : (
            filteredRoutines.map((routine) => {
              // Level colors
              const isAvanzado = routine.level === 'AVANZADO';
              const isIntermedio = routine.level === 'INTERMEDIO';
              const isPrincipiante = routine.level === 'PRINCIPIANTE';
              
              let levelColor = "bg-gray-100 text-gray-600";
              if (isAvanzado) levelColor = "bg-orange-500 text-white";
              else if (isIntermedio) levelColor = "bg-[#D97706] text-white"; // warm amber dark
              else if (isPrincipiante) levelColor = "bg-emerald-500 text-white";

              return (
                <div key={routine.id} className="bg-white border border-[#EFE9E4] rounded-2xl overflow-hidden hover:shadow-[0_4px_16px_rgba(239,233,228,0.5)] transition-all flex flex-col justify-between group">
                  {/* Image banner */}
                  <div className="relative h-[160px] overflow-hidden">
                    <img
                      src={routine.imageUrl}
                      alt={routine.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    
                    {/* Level Badge */}
                    <span className={`absolute top-3 left-3 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${levelColor}`}>
                      {routine.level}
                    </span>

                    {/* Option button */}
                    <button className="absolute top-3 right-3 p-1.5 bg-white/85 hover:bg-white text-gray-700 rounded-full cursor-pointer backdrop-blur-xs shadow-sm transition-all">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body details */}
                  <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-950 truncate hover:text-amber-600 cursor-pointer transition-colors">
                        {routine.title}
                      </h3>
                      <span className="text-[10px] text-gray-400 block mt-1">{routine.lastUpdated}</span>

                      {/* Icons Metadata */}
                      <div className="flex items-center gap-4 text-gray-500 text-[10px] font-bold mt-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{routine.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{routine.frequency}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Dumbbell className="w-3.5 h-3.5 text-gray-400" />
                          <span>{routine.exercisesCount} ejercicios</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Assign & Edit */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#FAF7F2] mt-2">
                      <span className="text-[10px] font-bold text-gray-400">
                        Asignada a <strong className="text-gray-700 font-bold">{routine.assignedMembers}</strong> miembros
                      </span>
                      <button
                        onClick={() => handleEditClick(routine)}
                        className="bg-[#FAF7F2] hover:bg-[#F3ECE5] text-gray-700 hover:text-gray-950 font-bold px-3.5 py-1.5 rounded-xl transition-all text-[11px] cursor-pointer"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Routine Modal */}
      {(showAddModal || editingRoutine !== null) && (
        <div className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EFE9E4] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EFE9E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">
                  {editingRoutine !== null ? 'Editar Rutina' : 'Nueva Rutina'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingRoutine(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingRoutine !== null ? handleUpdateRoutine : handleCreateRoutine} className="p-6 flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Nombre de la Rutina *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Hipertrofia Fuerza 4 días"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Dificultad/Nivel</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as RoutineLevel)}
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="PRINCIPIANTE">Principiante</option>
                    <option value="INTERMEDIO">Intermedio</option>
                    <option value="AVANZADO">Avanzado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Ejercicios count</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={formExercises}
                    onChange={(e) => setFormExercises(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Duración de Sesión</label>
                  <input
                    type="text"
                    placeholder="Ej. 45 min"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Frecuencia Semanal</label>
                  <input
                    type="text"
                    placeholder="Ej. 3 días/sem"
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <ImageUpload
                currentImage={formImage}
                onImageChange={setFormImage}
              />

              <div className="flex gap-2.5 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRoutine(null);
                    resetForm();
                  }}
                  className="bg-white border border-[#EFE9E4] hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#1E1E1E] hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                >
                  {editingRoutine !== null ? 'Guardar Cambios' : 'Crear Rutina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
