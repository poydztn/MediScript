import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { PrescriptionCard } from './components/PrescriptionCard';
import { specialties } from './data';
import { 
  Search, Menu, X, ArrowLeft, FileText, ChevronRight, 
  Activity, Heart, Stethoscope, TestTube, Baby, Bug, Wind, Bone, Ear, 
  Brain, Eye, Hammer, Droplet, Users, Siren
} from 'lucide-react';
import { Prescription } from './types';

const iconMap: Record<string, any> = {
  Activity, Heart, Stethoscope, TestTube, Baby, Bug, Wind, Bone, Ear, 
  Brain, Eye, Hammer, FileText, Droplet, Users, Siren
};

function App() {
  // viewMode: 'dashboard' means Home Grid, 'specialty' means a specific category, 'alphabetical' means A-Z list
  const [viewMode, setViewMode] = useState<'dashboard' | 'specialty' | 'alphabetical'>('dashboard');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- NAVIGATION HANDLERS ---

  const handleSelectDashboard = () => {
    setViewMode('dashboard');
    setSelectedSpecialtyId(null);
    setSelectedPrescription(null);
    setSearchTerm('');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleSelectSpecialty = (id: string) => {
    setViewMode('specialty');
    setSelectedSpecialtyId(id);
    setSelectedPrescription(null);
    setSearchTerm('');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAlphabetical = () => {
    setViewMode('alphabetical');
    setSelectedSpecialtyId(null);
    setSelectedPrescription(null);
    setSearchTerm('');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedPrescription(null);
  };

  // --- DATA PROCESSING ---

  // Get the list of items to display in the "List View"
  const displayItems = useMemo(() => {
    // 1. SEARCH MODE (Global)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      let results: Array<{ prescription: Prescription, specialtyName: string }> = [];
      
      specialties.forEach(s => {
        s.prescriptions.forEach(p => {
          if (
            p.title.toLowerCase().includes(term) ||
            p.subtitle?.toLowerCase().includes(term) ||
            p.lines.some(l => l.text.toLowerCase().includes(term))
          ) {
            results.push({ prescription: p, specialtyName: s.name });
          }
        });
      });
      return results;
    }

    // 2. ALPHABETICAL MODE
    if (viewMode === 'alphabetical') {
      let all: Array<{ prescription: Prescription, specialtyName: string }> = [];
      specialties.forEach(s => {
        s.prescriptions.forEach(p => {
          all.push({ prescription: p, specialtyName: s.name });
        });
      });
      return all.sort((a, b) => a.prescription.title.localeCompare(b.prescription.title));
    }

    // 3. SPECIALTY MODE
    if (selectedSpecialtyId) {
      const specialty = specialties.find(s => s.id === selectedSpecialtyId);
      if (specialty) {
        return specialty.prescriptions.map(p => ({
          prescription: p,
          specialtyName: specialty.name
        }));
      }
    }

    return [];
  }, [viewMode, selectedSpecialtyId, searchTerm]);

  const currentSpecialtyName = useMemo(() => {
    if (searchTerm) return `Résultats pour : "${searchTerm}"`;
    if (viewMode === 'alphabetical') return "Index Alphabétique (A-Z)";
    return specialties.find(s => s.id === selectedSpecialtyId)?.name || "Spécialité";
  }, [viewMode, selectedSpecialtyId, searchTerm]);


  // --- RENDER ---

  const isDashboard = viewMode === 'dashboard' && !searchTerm && !selectedPrescription;

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative transition-transform duration-300 ease-in-out z-40 md:flex`}>
        <Sidebar 
          selectedSpecialtyId={selectedSpecialtyId} 
          viewMode={viewMode}
          onSelectSpecialty={handleSelectSpecialty} 
          onSelectAlphabetical={handleSelectAlphabetical}
          onSelectDashboard={handleSelectDashboard}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
        
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm p-4 flex items-center gap-4 print:hidden z-10 shrink-0">
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          {selectedPrescription ? (
             <button 
               onClick={handleBackToList}
               className="flex items-center gap-2 text-medical-primary font-medium hover:underline mr-auto focus:outline-none"
             >
               <ArrowLeft className="w-4 h-4" />
               Retour
             </button>
          ) : (
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Rechercher un médicament, une pathologie, une spécialité..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value && selectedPrescription) {
                    setSelectedPrescription(null);
                  }
                  if (e.target.value) {
                      // If searching from dashboard, we technically enter a search mode
                      // But viewMode state can remain as is, render logic handles it via `searchTerm` check
                  }
                }}
              />
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scroll bg-[#f3f4f6] p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full flex flex-col">

            {/* VIEW: DASHBOARD (Grid of Specialties) */}
            {isDashboard ? (
               <div className="animate-in fade-in duration-300 flex-1 flex flex-col">
                  <div className="text-center mb-8 mt-4">
                    {/* Credits moved to top */}
                    <div className="mb-8 text-center border-b border-gray-200/50 pb-6">
                       <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-3">Élaboré par</p>
                       <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 font-serif text-medical-primary text-lg font-bold">
                         <span className="px-3 py-1 bg-blue-50 rounded-full">Dr ZEOUITINI YOUSSEF</span>
                         <span className="hidden md:inline text-gray-300">•</span>
                         <span>Noumairi Mohammed</span>
                         <span className="hidden md:inline text-gray-300">•</span>
                         <span>M. EL-AZRAK</span>
                       </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-medical-primary mb-2">Bienvenue sur Ordo Facile</h2>
                    <p className="text-gray-500">Sélectionnez une spécialité ou utilisez la recherche ci-dessus.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {specialties.map(specialty => {
                       const Icon = iconMap[specialty.icon] || Activity;
                       return (
                         <button 
                           key={specialty.id}
                           onClick={() => handleSelectSpecialty(specialty.id)}
                           className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col items-center text-center gap-3 group"
                         >
                           <div className="p-4 bg-blue-50 rounded-full text-medical-primary group-hover:bg-blue-600 group-hover:text-white transition-colors">
                             <Icon className="w-8 h-8" />
                           </div>
                           <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-800">{specialty.name}</h3>
                           <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                             {specialty.prescriptions.length} fiches
                           </span>
                         </button>
                       )
                    })}
                  </div>
               </div>
            ) : (
              /* VIEW: LIST OR DETAIL */
              <>
                {selectedPrescription ? (
                  /* VIEW: DETAIL (Single Prescription) */
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
                    <div className="mb-4 print:hidden">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {searchTerm 
                          ? 'Recherche' 
                          : (viewMode === 'alphabetical' ? 'Index Global' : specialties.find(s => s.id === selectedSpecialtyId)?.name)
                        }
                      </span>
                    </div>
                    <PrescriptionCard prescription={selectedPrescription} />
                  </div>
                ) : (
                  /* VIEW: LIST (Selection) */
                  <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6 border-b-2 border-medical-primary/10 pb-4">
                      <h2 className="text-2xl md:text-3xl font-serif text-medical-primary font-bold truncate">
                        {currentSpecialtyName}
                      </h2>
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-mono shrink-0 ml-4">
                        {displayItems.length} ordonnance{displayItems.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {displayItems.length === 0 ? (
                      <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
                        <p className="text-lg">Aucun résultat trouvé.</p>
                        {searchTerm && (
                          <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-blue-600 hover:underline"
                          >
                            Effacer la recherche
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {displayItems.map((item, idx) => (
                          <button
                            key={`${item.prescription.id}-${idx}`}
                            onClick={() => handleSelectPrescription(item.prescription)}
                            className="group bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 text-left flex items-center justify-between"
                          >
                            <div className="flex items-start gap-4 w-full min-w-0">
                              <div className="bg-blue-50 p-2 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mt-1 shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-gray-800 group-hover:text-blue-800 text-base md:text-lg leading-tight truncate">
                                  {item.prescription.title}
                                </h3>
                                {item.prescription.subtitle && (
                                  <p className="text-gray-500 text-xs md:text-sm mt-1 italic truncate">
                                    {item.prescription.subtitle}
                                  </p>
                                )}
                                {(viewMode === 'alphabetical' || searchTerm) && (
                                  <span className="inline-block mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded">
                                    {item.specialtyName}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;