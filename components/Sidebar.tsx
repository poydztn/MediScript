import React from 'react';
import { specialties } from '../data';
import { 
  Activity, Heart, Stethoscope, TestTube, Baby, Bug, Wind, Bone, Ear, 
  Brain, Eye, Hammer, FileText, ChevronRight, Droplet, Users, Siren,
  SortAsc, X, LayoutGrid
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Activity, Heart, Stethoscope, TestTube, Baby, Bug, Wind, Bone, Ear, 
  Brain, Eye, Hammer, FileText, Droplet, Users, Siren
};

interface SidebarProps {
  selectedSpecialtyId: string | null;
  viewMode: 'dashboard' | 'specialty' | 'alphabetical';
  onSelectSpecialty: (id: string) => void;
  onSelectAlphabetical: () => void;
  onSelectDashboard: () => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedSpecialtyId, 
  viewMode,
  onSelectSpecialty,
  onSelectAlphabetical,
  onSelectDashboard,
  onClose
}) => {
  return (
    <div className="w-72 bg-slate-900 text-slate-300 h-screen flex flex-col shadow-2xl print:hidden border-r border-slate-800 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-500/5 blur-3xl z-0 rounded-full -translate-y-1/2"></div>

      {/* Header */}
      <div className="p-6 z-10 flex items-center justify-between">
        <button onClick={onSelectDashboard} className="text-left focus:outline-none group">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-glow">
                <FileText className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-sans font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors">
                  ORDO FACILE
                </h1>
                <p className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">App Médicale v3.0</p>
             </div>
          </div>
        </button>
        {/* Close button for mobile */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 backdrop-blur-sm"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Main Navigation */}
      <div className="px-3 py-2 z-10 space-y-1">
         <button
            onClick={onSelectDashboard}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-left group relative overflow-hidden ${
              viewMode === 'dashboard'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 relative z-10">
              <LayoutGrid className={`w-5 h-5 ${viewMode === 'dashboard' ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
              <span className="text-sm font-medium">Tableau de bord</span>
            </div>
            {viewMode === 'dashboard' && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 z-0"></div>}
          </button>

         <button
            onClick={onSelectAlphabetical}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-left group ${
              viewMode === 'alphabetical'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <SortAsc className={`w-5 h-5 ${viewMode === 'alphabetical' ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
              <span className="text-sm font-medium">Index Alphabétique</span>
            </div>
          </button>
      </div>

      {/* Divider */}
      <div className="mx-6 my-4 border-t border-slate-800 z-10"></div>

      {/* Specialties List */}
      <div className="px-6 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider z-10 flex items-center gap-2">
        <span>Spécialités</span>
        <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">{specialties.length}</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto custom-scroll px-3 pb-4 z-10 space-y-1">
        <ul className="space-y-1">
          {specialties.map((specialty) => {
            const Icon = iconMap[specialty.icon] || Activity;
            const isSelected = viewMode === 'specialty' && selectedSpecialtyId === specialty.id;
            
            return (
              <li key={specialty.id}>
                <button
                  onClick={() => onSelectSpecialty(specialty.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 text-left group ${
                    isSelected 
                      ? 'bg-slate-800 text-white border-l-4 border-blue-500 pl-3' 
                      : 'border-l-4 border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'}`} />
                    <span className="font-medium text-sm truncate">{specialty.name}</span>
                  </div>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 z-10 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-slate-500 font-mono">Base de données sécurisée</p>
        </div>
      </div>
    </div>
  );
};