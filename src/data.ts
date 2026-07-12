import { Member, Routine, Coach, Payment, GymSettings, HelpSection } from './types';

export const initialGymSettings: GymSettings = {
  name: "Iron Strength",
  slug: "iron-strength",
  location: "Medellín · Colombia",
  country: "Colombia",
  website: "https://ironstrength.co",
  phone: "+57 300 555 1234",
  hours: "Lun a Sáb · 06:00 — 22:00"
};

export const initialMembers: Member[] = [
  {
    id: "m1",
    name: "Juan Pablo Diaz",
    email: "juan.rios@example.com",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta feb 2026",
    plan: "Mensual",
    status: "CANCELADO",
    risk: "ALTO",
    riskScore: 92,
    lastVisit: "hace 1 días",
    coach: "Carlos Rodríguez"
  },
  {
    id: "m2",
    name: "Daniela Castro",
    email: "daniela.castro@example.com",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta mar 2026",
    plan: "Trimestral",
    status: "ACTIVO", // "AL DÍA"
    risk: "MEDIO",
    riskScore: 64,
    lastVisit: "hace 10 días",
    coach: "Camila Pérez"
  },
  {
    id: "m3",
    name: "Mariana Soto",
    email: "mariana.soto@example.com",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta oct 2025",
    plan: "Mensual",
    status: "PAUSADO",
    risk: "MEDIO",
    riskScore: 50,
    lastVisit: "hace 15 días",
    coach: "—"
  },
  {
    id: "m4",
    name: "Andrés Suárez",
    email: "andres.suarez@example.com",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta abr 2026",
    plan: "Mensual",
    status: "ACTIVO", // "AL DÍA"
    risk: "BAJO",
    riskScore: 21,
    lastVisit: "hace 8 días",
    coach: "Carlos Rodríguez"
  },
  {
    id: "m5",
    name: "Florencia Méndez",
    email: "florencia.mendez@example.com",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta may 2026",
    plan: "Mensual",
    status: "ATRASADO",
    risk: "BAJO",
    riskScore: 18,
    lastVisit: "hace 7 días",
    coach: "Camila Pérez"
  },
  {
    id: "m6",
    name: "Mauricio Toro",
    email: "mauricio.toro@example.com",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta ene 2026",
    plan: "Semestral",
    status: "ACTIVO", // "AL DÍA"
    risk: "BAJO",
    riskScore: 15,
    lastVisit: "hace 6 días",
    coach: "Esteban Rivera"
  },
  {
    id: "m7",
    name: "Tomás Rivera",
    email: "tomas.rivera@example.com",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta sep 2025",
    plan: "Semestral",
    status: "ACTIVO", // "AL DÍA"
    risk: "BAJO",
    riskScore: 3,
    lastVisit: "hace 2 días",
    coach: "Camila Pérez"
  },
  {
    id: "m8",
    name: "Pedro González",
    email: "pedro.gonzalez@example.com",
    photoUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta mar 2026",
    plan: "Mensual",
    status: "ACTIVO",
    risk: "BAJO",
    riskScore: 8,
    lastVisit: "hace 2 días",
    coach: "Esteban Rivera"
  },
  {
    id: "m9",
    name: "Sofía Romero",
    email: "sofia.romero@example.com",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta ene 2026",
    plan: "Mensual",
    status: "ACTIVO",
    risk: "BAJO",
    riskScore: 5,
    lastVisit: "hace 3 días",
    coach: "Carlos Rodríguez"
  },
  {
    id: "m10",
    name: "Camila Vega",
    email: "camila.vega@example.com",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta abr 2026",
    plan: "Trimestral",
    status: "NUEVO",
    risk: "BAJO",
    riskScore: 12,
    lastVisit: "hace 4 días",
    coach: "Lucía Galván"
  },
  {
    id: "m11",
    name: "Andrés Felipe",
    email: "andres.f@example.com",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta jun 2026",
    plan: "Mensual",
    status: "NUEVO",
    risk: "BAJO",
    riskScore: 9,
    lastVisit: "hace 1 días",
    coach: "nicolas sosa"
  },
  {
    id: "m12",
    name: "Mateo Gómez",
    email: "mateo.gomez@example.com",
    photoUrl: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150&auto=format&fit=crop&q=80",
    registrationDate: "alta jun 2026",
    plan: "Trimestral",
    status: "NUEVO",
    risk: "BAJO",
    riskScore: 14,
    lastVisit: "hace 1 días",
    coach: "—"
  }
];

export const initialRoutines: Routine[] = [
  {
    id: "r1",
    title: "Hipertrofia 4 dias",
    level: "AVANZADO",
    duration: "30 min",
    frequency: "2 días/sem",
    exercisesCount: 2,
    assignedMembers: 0,
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    lastUpdated: "Actualizada hace 1 días"
  },
  {
    id: "r2",
    title: "Cardio HIIT 30 min",
    level: "INTERMEDIO",
    duration: "30 min",
    frequency: "3 días/sem",
    exercisesCount: 5,
    assignedMembers: 0,
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    lastUpdated: "Actualizada hace 1 días"
  },
  {
    id: "r3",
    title: "Tren inferior mujer",
    level: "INTERMEDIO",
    duration: "55 min",
    frequency: "3 días/sem",
    exercisesCount: 0,
    assignedMembers: 0,
    imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=600&auto=format&fit=crop&q=80",
    lastUpdated: "Actualizada hace 2 días"
  },
  {
    id: "r4",
    title: "Cardio HIIT",
    level: "INTERMEDIO",
    duration: "30 min",
    frequency: "3 días/sem",
    exercisesCount: 0,
    assignedMembers: 0,
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    lastUpdated: "Actualizada hace 3 días"
  },
  {
    id: "r5",
    title: "Full body principiante",
    level: "PRINCIPIANTE",
    duration: "45 min",
    frequency: "3 días/sem",
    exercisesCount: 0,
    assignedMembers: 0,
    imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80",
    lastUpdated: "Actualizada hace 5 días"
  },
  {
    id: "r6",
    title: "Recuperación activa",
    level: "PRINCIPIANTE",
    duration: "40 min",
    frequency: "2 días/sem",
    exercisesCount: 0,
    assignedMembers: 0,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80",
    lastUpdated: "Actualizada hace 6 días"
  }
];

export const initialCoaches: Coach[] = [
  {
    id: "c1",
    name: "nicolas sosa",
    email: "dicoreempresa@gmail.com",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    assignedMembers: 0,
    joinDate: "17 de may de 2026",
    status: "ALTA"
  },
  {
    id: "c2",
    name: "Carlos Rodríguez",
    email: "carlos@ironstrength.co",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    assignedMembers: 3,
    joinDate: "16 de may de 2026",
    status: "ALTA"
  },
  {
    id: "c3",
    name: "Camila Pérez",
    email: "camila.perez@ironstrength.co",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    assignedMembers: 5,
    joinDate: "16 de may de 2026",
    status: "ALTA"
  },
  {
    id: "c4",
    name: "Esteban Rivera",
    email: "esteban@ironstrength.co",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    assignedMembers: 2,
    joinDate: "16 de may de 2026",
    status: "ALTA"
  },
  {
    id: "c5",
    name: "Lucía Galván",
    email: "lucia@ironstrength.co",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    assignedMembers: 0,
    joinDate: "16 de may de 2026",
    status: "ALTA"
  }
];

export const initialPayments: Payment[] = [
  {
    id: "p1",
    member: "Pedro González",
    concept: "Mensualidad junio",
    amount: 34,
    method: "Tarjeta",
    date: "15 de may de 2026",
    status: "PAGADO"
  },
  {
    id: "p2",
    member: "Tomás Rivera",
    concept: "Semestral",
    amount: 168,
    method: "Tarjeta",
    date: "14 de may de 2026",
    status: "PAGADO"
  },
  {
    id: "p3",
    member: "Sofía Romero",
    concept: "Mensualidad junio",
    amount: 34,
    method: "Tarjeta",
    date: "13 de may de 2026",
    status: "PAGADO"
  },
  {
    id: "p4",
    member: "Juan Pablo Diaz",
    concept: "Mensualidad mayo",
    amount: 34,
    method: "Tarjeta",
    date: "11 de abr de 2026",
    status: "PAGADO"
  },
  {
    id: "p5",
    member: "Juan Pablo Diaz",
    concept: "Mensualidad abril",
    amount: 34,
    method: "Tarjeta",
    date: "12 de mar de 2026",
    status: "PAGADO"
  },
  {
    id: "p6",
    member: "Juan Pablo Diaz",
    concept: "Mensualidad marzo",
    amount: 34,
    method: "Tarjeta",
    date: "10 de feb de 2026",
    status: "PAGADO"
  },
  {
    id: "p7",
    member: "Mariana Soto",
    concept: "Mensualidad junio",
    amount: 34,
    method: "Efectivo",
    date: "19 de may de 2026",
    status: "PENDIENTE"
  },
  {
    id: "p8",
    member: "Camila Vega",
    concept: "Trimestral junio-agosto",
    amount: 92,
    method: "Transferencia",
    date: "16 de may de 2026",
    status: "PENDIENTE"
  },
  {
    id: "p9",
    member: "Juan Pablo Diaz",
    concept: "Mensualidad junio",
    amount: 34,
    method: "Tarjeta",
    date: "11 de may de 2026",
    status: "ATRASADO"
  },
  {
    id: "p10",
    member: "Andrés Suárez",
    concept: "Mensualidad junio",
    amount: 34,
    method: "Transferencia",
    date: "08 de may de 2026",
    status: "PAGADO"
  }
];

export const helpSections: HelpSection[] = [
  {
    id: "h1",
    title: "Gestión de miembros",
    description: "Altas, planes, asignación de entrenadores y filtros.",
    icon: "Users"
  },
  {
    id: "h2",
    title: "Score de riesgo",
    description: "Cómo se calcula y cómo actuar sobre las alertas.",
    icon: "AlertTriangle"
  },
  {
    id: "h3",
    title: "Rutinas",
    description: "Crear, editar y asignar rutinas a tus miembros.",
    icon: "Dumbbell"
  },
  {
    id: "h4",
    title: "Pagos manuales",
    description: "Registrar cobros, filtrar y exportar el historial.",
    icon: "CreditCard"
  },
  {
    id: "h5",
    title: "Reportes mensuales",
    description: "Generar reportes automáticos del gimnasio.",
    icon: "FileText"
  },
  {
    id: "h6",
    title: "Entrenadores",
    description: "Invitar coaches y ver cuántos miembros tiene cada uno.",
    icon: "UserSquare"
  }
];

export const mockHistoryReports = [
  { id: "rep1", title: "Reporte Mayo 2026 · Iron Strength", type: "MENSUAL", membersCount: 8, date: "generado 16 may 2026" },
  { id: "rep2", title: "Reporte April 2026 · Iron Strength", type: "MENSUAL", membersCount: 7, date: "generado 16 may 2026" },
  { id: "rep3", title: "Reporte mensual · Marzo 2026", type: "MENSUAL", membersCount: 135, date: "generado 16 may 2026" },
  { id: "rep4", title: "Cohorte Q1 2026 · Análisis de retención", type: "COHORTE", membersCount: 64, date: "generado 16 may 2026" }
];
