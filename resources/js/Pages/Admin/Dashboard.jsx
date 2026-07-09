import { Link } from '@inertiajs/react';
import { LayoutDashboard, Flag, Grid3x3, Users, Clock, CircleCheck, AlertTriangle, TrendingUp, Bike, Home, Gamepad2 } from "lucide-react";

const navItems = [
  { label: "Tableau de bord", href: "admin.dashboard", icon: LayoutDashboard, active: true },
  { label: "Modération", href: "#", icon: Flag },
  { label: "Catégories", href: "categories.index", icon: Grid3x3 },
  { label: "Utilisateurs", href: "#", icon: Users },
];

const kpiConfig = {
  pending:  { label: "En attente",    icon: Clock,         accent: "amber" },
  online:   { label: "En ligne",      icon: CircleCheck,   accent: "teal"  },
  users:    { label: "Utilisateurs",  icon: Users,         accent: "purple"},
  reports:  { label: "Signalements",  icon: AlertTriangle, accent: "red"   },
};

const accentClasses = {
  amber:  { icon: "text-amber-600",  trend: "text-amber-600" },
  teal:   { icon: "text-teal-600",   trend: "text-teal-600" },
  purple: { icon: "text-purple-600", trend: "text-slate-400" },
  red:    { icon: "text-red-600",    trend: "text-red-600" },
};

function KpiCard({ statKey, value, trend }) {
  const { label, icon: Icon, accent } = kpiConfig[statKey];
  const cls = accentClasses[accent];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex justify-between items-start">
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <Icon className={`w-4 h-4 ${cls.icon}`} />
      </div>
      <p className="text-2xl font-semibold mt-2 mb-1">{value}</p>
      {trend && (
        <p className={`text-xs flex items-center gap-1 ${cls.trend}`}>
          <TrendingUp className="w-3 h-3" /> {trend}
        </p>
      )}
    </div>
  );
}

const categoryIcons = { velo: Bike, appartement: Home, console: Gamepad2 };

function StatusBadge({ status }) {
  const styles = {
    "en attente": "bg-amber-50 text-amber-800",
    "validée": "bg-teal-50 text-teal-800",
  };
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard({ stats, recentAnnonces }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-56 bg-slate-900 text-white p-5">
        <div className="flex items-center gap-2 mb-7">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-xs font-bold">⚡</span>
          </div>
          <p className="font-medium text-sm">LeBonCoin admin</p>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          {navItems.map(({ label, href, icon: Icon, active }) => (
            <Link
              key={label}
              href={route(href)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg ${
                active ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Vue d'ensemble</h1>
          <span className="text-sm text-slate-500">
            {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </header>

        {/* KPI grid, entièrement data-driven */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map((stat) => (
            <KpiCard key={stat.key} statKey={stat.key} value={stat.value} trend={stat.trend} />
          ))}
        </div>

        {/* Table de modération */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-slate-800">Dernières annonces</h3>
            <Link href={route('annonces.index')} className="text-xs px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">
              Voir tout
            </Link>
          </div>
          <div className="flex flex-col">
            {recentAnnonces.map((annonce) => {
              const Icon = categoryIcons[annonce.category] ?? Home;
              return (
                <div
                  key={annonce.id}
                  className="flex items-center justify-between py-2.5 border-b last:border-0 border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <Link href={route('annonces.show', annonce.id)} className="text-sm text-slate-700 hover:text-blue-600">
                      {annonce.title}
                    </Link>
                  </div>
                  <StatusBadge status={annonce.status} />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
