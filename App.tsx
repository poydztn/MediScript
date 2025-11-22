import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { PrescriptionCard } from './components/PrescriptionCard';
import { specialties } from './data';
import { 
  Search, Menu, X, ArrowLeft, FileText, ChevronRight, 
  Activity, Heart, Stethoscope, TestTube, Baby, Bug, Wind, Bone, Ear, 
  Brain, Eye, Hammer, Droplet, Users, Siren, Sparkles, AlertTriangle
} from 'lucide-react';
import { Prescription } from './types';

const iconMap: Record<string, any> = {
  Activity, Heart, Stethoscope, TestTube, Baby, Bug, Wind, Bone, Ear, 
  Brain, Eye, Hammer, FileText, Droplet, Users, Siren
};

function App() {
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

  const displayItems = useMemo(() => {
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

    if (viewMode === 'alphabetical') {
      let all: Array<{ prescription: Prescription, specialtyName: string }> = [];
      specialties.forEach(s => {
        s.prescriptions.forEach(p => {
          all.push({ prescription: p, specialtyName: s.name });
        });
      });
      return all.sort((a, b) => a.prescription.title.localeCompare(b.prescription.title));
    }

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

  const currentSpecialty = useMemo(() => specialties.find(s => s.id === selectedSpecialtyId), [selectedSpecialtyId]);

  const currentViewTitle = useMemo(() => {
    if (searchTerm) return `Résultats de recherche pour "${searchTerm}"`;
    if (viewMode === 'alphabetical') return "Index Alphabétique Global";
    return currentSpecialty?.name || "Spécialité";
  }, [viewMode, currentSpecialty, searchTerm]);


  // --- RENDER ---

  const isDashboard = viewMode === 'dashboard' && !searchTerm && !selectedPrescription;

  return (
    <div className="flex h-screen bg-medical-background font-sans overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) z-40 md:flex shadow-2xl md:shadow-none`}>
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
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-6 py-4 flex items-center gap-4 print:hidden">
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </button>

          {selectedPrescription ? (
             <button 
               onClick={handleBackToList}
               className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
             >
               <div className="bg-white border border-slate-200 rounded-full p-1 group-hover:border-blue-200 shadow-sm">
                 <ArrowLeft className="w-4 h-4" />
               </div>
               <span>Retour à la liste</span>
             </button>
          ) : (
            <div className="flex-1 max-w-2xl relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type="text"
                placeholder="Rechercher un médicament, une pathologie..."
                className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-inner focus:shadow-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value && selectedPrescription) {
                    setSelectedPrescription(null);
                  }
                }}
              />
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8 relative">
          {/* Decorative background blobs */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white to-transparent -z-10 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto h-full flex flex-col">

            {/* VIEW: DASHBOARD (Grid of Specialties) */}
            {isDashboard ? (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
                  
                  {/* Hero / Credits Section */}
                  <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl text-white p-8 md:p-12">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
                     <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                     
                     <div className="relative z-10 flex flex-col items-center text-center">
                       
                       {/* Réalisé par */}
                       <div className="mb-8 flex flex-col items-center">
                          <span className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">Réalisé par</span>
                          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
                             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-serif font-bold shadow-lg border-2 border-slate-700 text-2xl">Z</div>
                             <span className="text-xl md:text-3xl font-bold tracking-tight">Dr ZEOUITINI YOUSSEF</span>
                          </div>
                       </div>

                       {/* Sources */}
                       <div className="mb-10 w-full max-w-4xl">
                          <div className="flex items-center gap-4 mb-4 justify-center">
                             <div className="h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent w-full max-w-[100px]"></div>
                             <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Sources</span>
                             <div className="h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent w-full max-w-[100px]"></div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 flex-wrap">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                               <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-serif font-bold shadow-lg border border-slate-600">E</div>
                               <span className="text-base md:text-lg font-medium text-slate-200">Dr EL-AZRAK MOHAMED</span>
                            </div>
                            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-600"></div>
                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                               <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-serif font-bold shadow-lg border border-slate-600">N</div>
                               <span className="text-base md:text-lg font-medium text-slate-200">Dr NOUMAIRI MOHAMMED</span>
                            </div>
                          </div>
                       </div>

                       {/* Disclaimer */}
                       <div className="inline-block bg-orange-500/10 border border-orange-500/30 backdrop-blur-md rounded-xl px-6 py-3 max-w-3xl mx-auto">
                          <p className="text-orange-200 text-sm font-medium flex items-center justify-center gap-3 text-center">
                            <AlertTriangle className="w-5 h-5 shrink-0 text-orange-400" />
                            <span>Attention : Cet outil est purement pédagogique, destiné aux médecins, et ne remplace pas une consultation médicale.</span>
                          </p>
                       </div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-blue-600" />
                      Spécialités Médicales
                    </h2>
                    <span className="text-sm text-slate-500">Sélectionnez une catégorie</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {specialties.map((specialty, idx) => {
                       const Icon = iconMap[specialty.icon] || Activity;
                       return (
                         <button 
                           key={specialty.id}
                           onClick={() => handleSelectSpecialty(specialty.id)}
                           className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden"
                           style={{ animationDelay: `${idx * 50}ms` }}
                         >
                           <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                           
                           <div className="relative z-10">
                             <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                               <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                                 <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                               </div>
                             </div>
                             
                             <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-700 transition-colors">{specialty.name}</h3>
                             <p className="text-sm text-slate-400 font-medium">{specialty.prescriptions.length} protocoles</p>
                           </div>
                           
                           <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                               <ChevronRight className="w-4 h-4 text-blue-600" />
                             </div>
                           </div>
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
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-4xl mx-auto">
                    <div className="mb-6 print:hidden flex items-center justify-between">
                       <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                         <span className="uppercase tracking-wider">{viewMode === 'alphabetical' ? 'Index' : currentSpecialty?.name}</span>
                         <ChevronRight className="w-4 h-4" />
                         <span className="text-blue-600">{selectedPrescription.title}</span>
                       </div>
                    </div>
                    <PrescriptionCard prescription={selectedPrescription} />
                  </div>
                ) : (
                  /* VIEW: LIST (Selection) */
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                      <div className="p-8 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-3xl font-serif text-slate-800 font-bold mb-2">
                              {currentViewTitle}
                            </h2>
                            <p className="text-slate-500">
                              Sélectionnez une pathologie pour voir l'ordonnance type.
                            </p>
                          </div>
                          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center">
                             <span className="block text-2xl font-bold text-blue-600">{displayItems.length}</span>
                             <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Fiches</span>
                          </div>
                        </div>
                      </div>

                      {displayItems.length === 0 ? (
                        <div className="text-center py-24">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                          </div>
                          <h3 className="text-lg font-medium text-slate-900">Aucun résultat trouvé</h3>
                          <p className="text-slate-500 mt-1">Essayez de modifier votre recherche.</p>
                          {searchTerm && (
                            <button 
                              onClick={() => setSearchTerm('')}
                              className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                            >
                              Effacer la recherche
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {displayItems.map((item, idx) => (
                            <button
                              key={`${item.prescription.id}-${idx}`}
                              onClick={() => handleSelectPrescription(item.prescription)}
                              className="w-full group hover:bg-blue-50/50 transition-colors p-6 text-left flex items-center justify-between"
                            >
                              <div className="flex items-start gap-5 min-w-0">
                                <div className="mt-1 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-slate-700 group-hover:text-blue-700 text-lg mb-1 truncate transition-colors">
                                    {item.prescription.title}
                                  </h3>
                                  {item.prescription.subtitle && (
                                    <p className="text-slate-500 text-sm mb-2 italic">
                                      {item.prescription.subtitle}
                                    </p>
                                  )}
                                  {(viewMode === 'alphabetical' || searchTerm) && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                      {item.specialtyName}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-blue-500 group-hover:shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                                <ChevronRight className="w-5 h-5" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
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