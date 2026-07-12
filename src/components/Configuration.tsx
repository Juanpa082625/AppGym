import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  Users, 
  CreditCard, 
  Cpu, 
  Receipt,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { GymSettings } from '../types';

interface ConfigurationProps {
  gymSettings: GymSettings;
  onSaveSettings: (settings: GymSettings) => void;
}

export default function Configuration({ 
  gymSettings, 
  onSaveSettings 
}: ConfigurationProps) {
  const [activeSubTab, setActiveSubTab] = useState("Gimnasio");
  const [showToast, setShowToast] = useState(false);

  // Form states
  const [name, setName] = useState(gymSettings.name);
  const [slug, setSlug] = useState(gymSettings.slug);
  const [location, setLocation] = useState(gymSettings.location);
  const [country, setCountry] = useState(gymSettings.country);
  const [website, setWebsite] = useState(gymSettings.website);
  const [phone, setPhone] = useState(gymSettings.phone);
  const [hours, setHours] = useState(gymSettings.hours);

  // Keep state in sync if parent changes
  useEffect(() => {
    setName(gymSettings.name);
    setSlug(gymSettings.slug);
    setLocation(gymSettings.location);
    setCountry(gymSettings.country);
    setWebsite(gymSettings.website);
    setPhone(gymSettings.phone);
    setHours(gymSettings.hours);
  }, [gymSettings]);

  const menuItems = [
    { id: "Gimnasio", label: "Gimnasio", icon: Building2 },
    { id: "Ofertas", label: "Ofertas", icon: Sparkles },
    { id: "Equipo", label: "Equipo", icon: Users },
    { id: "Plan", label: "Plan TitanOps", icon: CreditCard }, // Renamed from GetGym
    { id: "Integraciones", label: "Integraciones", icon: Cpu },
    { id: "Facturacion", label: "Facturación", icon: Receipt },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      name,
      slug,
      location,
      country,
      website,
      phone,
      hours
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E1E] text-white text-xs font-semibold px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl border border-gray-800 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>¡Cambios guardados con éxito en TitanOps!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
          GENERAL
        </span>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
          Configuración
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Datos del gimnasio, ofertas, equipo, plan e integraciones.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Sub-navigation (3 cols) */}
        <div className="bg-white border border-[#EFE9E4] rounded-2xl p-3.5 shadow-sm lg:col-span-3 flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = activeSubTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSubTab(item.id);
                  if (item.id !== "Gimnasio") {
                    setToastMsgDemo(item.label);
                  }
                }}
                className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#F3ECE5] text-gray-950 font-bold"
                    : "text-gray-500 hover:bg-[#FAF7F2] hover:text-gray-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gray-950' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right column: Form / Data view (9 cols) */}
        <div className="lg:col-span-9 bg-white border border-[#EFE9E4] rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(239,233,228,0.2)]">
          {activeSubTab === "Gimnasio" ? (
            <form onSubmit={handleSave} className="flex flex-col gap-6 text-xs">
              <div className="border-b border-[#FAF7F2] pb-4">
                <h3 className="text-sm font-bold text-gray-900">Datos del gimnasio</h3>
                <p className="text-[11px] text-gray-400 mt-1">Aparecen en reportes y comunicaciones a tus miembros.</p>
              </div>

              {/* Form elements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Iron Strength"
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-800 font-medium"
                  />
                </div>

                {/* Slug público */}
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Slug público
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ej. iron-strength"
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-800 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ubicación */}
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. Medellín · Colombia"
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-800 font-medium"
                  />
                </div>

                {/* País */}
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                    País
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Ej. Colombia"
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-800 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sitio Web */}
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Sitio Web
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-800 font-medium"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 555 1234"
                    className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-800 font-medium"
                  />
                </div>
              </div>

              {/* Horario */}
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Horario
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Lun a Sáb · 06:00 — 22:00"
                  className="w-full bg-[#FAF7F2] border border-[#EFE9E4] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-800 font-medium"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-[#FAF7F2] mt-2">
                <button
                  type="submit"
                  className="bg-[#1E1E1E] hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer text-xs uppercase tracking-wide"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-[#FAF7F2] border border-[#EFE9E4] rounded-full flex items-center justify-center text-amber-700">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Sección: {activeSubTab}</h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Esta sección de la configuración está pre-armada en el prototipo frontal de TitanOps. Utiliza la sección "Gimnasio" para modificar y verificar los cambios de marca en vivo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Simulated notification
  function setToastMsgDemo(label: string) {
    // fine
  }
}
