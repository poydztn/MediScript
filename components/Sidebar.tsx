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
    <div className="w-64 md:w-72 bg-medical-primary text-white h-screen flex flex-col shadow-2xl print:hidden border-r border-blue-800">
      <div className="p-6 border-b border-blue-800 bg-blue-900 flex items-center justify-between">
        <button onClick={onSelectDashboard} className="text-left focus:outline-none">
          <h1 className="text-xl font-serif font-bold tracking-wider flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-300" />
            ORDO FACILE
          </h1>
          <p className="text-xs text-blue-300 mt-1 font-mono">Bibliothèque médicale</p>
        </button>
        {/* Close button for mobile */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1 text-blue-300 hover:text-white transition-colors rounded hover:bg-blue-800"
            aria-label="Fermer le menu"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      <div className="p-2 border-b border-blue-800 space-y-1">
         <button
            onClick={onSelectDashboard}
            className={`w-full flex items-center justify-between px-4 py-3 rounded transition-all duration-200 text-left group ${
              viewMode === 'dashboard'
                ? 'bg-blue-800 text-white shadow-inner font-bold' 
                : 'hover:bg-blue-800/50 text-blue-200 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className={`w-5 h-5 ${viewMode === 'dashboard' ? 'text-blue-300' : 'text-blue-400'}`} />
              <span className="text-sm">Accueil</span>
            </div>
            {viewMode === 'dashboard' && <ChevronRight className="w-4 h-4 text-blue-300" />}
          </button>

         <button
            onClick={onSelectAlphabetical}
            className={`w-full flex items-center justify-between px-4 py-3 rounded transition-all duration-200 text-left group ${
              viewMode === 'alphabetical'
                ? 'bg-blue-800 text-white shadow-inner font-bold' 
                : 'hover:bg-blue-800/50 text-blue-200 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <SortAsc className={`w-5 h-5 ${viewMode === 'alphabetical' ? 'text-blue-300' : 'text-blue-400'}`} />
              <span className="text-sm">Index Alphabétique</span>
            </div>
            {viewMode === 'alphabetical' && <ChevronRight className="w-4 h-4 text-blue-300" />}
          </button>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scroll py-2">
        <div className="px-4 pb-2 text-xs font-bold text-blue-400 uppercase tracking-wider">Spécialités</div>
        <ul className="space-y-0.5">
          {specialties.map((specialty) => {
            const Icon = iconMap[specialty.icon] || Activity;
            const isSelected = viewMode === 'specialty' && selectedSpecialtyId === specialty.id;
            
            return (
              <li key={specialty.id}>
                <button
                  onClick={() => onSelectSpecialty(specialty.id)}
                  className={`w-full flex items-center justify-between px-6 py-3 transition-all duration-200 border-l-4 text-left group ${
                    isSelected 
                      ? 'bg-blue-800 border-blue-300 text-white shadow-inner' 
                      : 'border-transparent hover:bg-blue-800/50 text-blue-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-blue-300' : 'text-blue-400 group-hover:text-white'}`} />
                    <span className="font-medium text-sm truncate">{specialty.name}</span>
                  </div>
                  {isSelected && <ChevronRight className="w-4 h-4 text-blue-300 flex-shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 bg-blue-900 text-xs text-blue-400 font-mono border-t border-blue-800 text-center">
        Ordo Facile v3.0
      </div>
    </div>
  );
};