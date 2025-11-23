import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { PrescriptionCard } from './components/PrescriptionCard';
import { specialties } from './data';
import { 
  Search, Menu, X, ArrowLeft, FileText, ChevronRight, 
  Activity, Heart, Stethoscope, TestTube, Baby, Bug, Wind, Bone, Ear, 
  Brain, Eye, Hammer, Droplet, Users, Siren, AlertTriangle, Info, LayoutGrid
} from 'lucide-react';
import { Prescription } from './types';

const iconMap: Record<string, any> = {
  Activity, Heart, Stethoscope, TestTube, Baby, Bug, Wind, Bone, Ear, 
  Brain, Eye, Hammer, FileText, Droplet, Users, Siren
};

// Helper to remove accents for search
const removeAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Interface for grouped items
interface GroupedItem {
  id: string;
  prescription: Prescription;
  tags: Array<{ id: string; name: string; color: string }>;
}

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

  const displayItems: GroupedItem[] = useMemo(() => {
    const groupedMap = new Map<string, GroupedItem>();

    // Function to add item to map
    const addItem = (p: Prescription, s: { id: string, name: string, color: string }) => {
      if (!groupedMap.has(p.id)) {
        groupedMap.set(p.id, { 
          id: p.id, 
          prescription: p, 
          tags: [] 
        });
      }
      // Add tag if not already present
      const item = groupedMap.get(p.id)!;
      if (!item.tags.some(t => t.id === s.id)) {
        item.tags.push({ id: s.id, name: s.name, color: s.color });
      }
    };

    const term = searchTerm ? removeAccents(searchTerm.toLowerCase()) : '';

    if (term) {
      specialties.forEach(s => {
        s.prescriptions.forEach(p => {
          if (
            removeAccents(p.title.toLowerCase()).includes(term) ||
            (p.subtitle && removeAccents(p.subtitle.toLowerCase()).includes(term)) ||
            p.lines.some(l => removeAccents(l.text.toLowerCase()).includes(term))
          ) {
            addItem(p, s);
          }
        });
      });
    } else if (viewMode === 'alphabetical') {
      specialties.forEach(s => {
        s.prescriptions.forEach(p => {
          addItem(p, s);
        });
      });
    } else if (selectedSpecialtyId) {
      const specialty = specialties.find(s => s.id === selectedSpecialtyId);
      if (specialty) {
        specialty.prescriptions.forEach(p => {
          addItem(p, specialty);
        });
      }
    }

    // Convert map to array and sort
    return Array.from(groupedMap.values()).sort((a, b) => 
      a.prescription.title.localeCompare(b.prescription.title)
    );
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
    <div className="flex h-screen bg-medical-background font-sans overflow-hidden w-full">
      
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
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative min-w-0">
        
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-4 md:px-6 py-4 flex items-center gap-3 md:gap-4 print:hidden w-full">
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
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
               <span className="hidden xs:inline">Retour à la liste</span>
               <span className="xs:hidden">Retour</span>
             </button>
          ) : (
            <div className="flex-1 max-w-2xl relative group min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type="text"
                placeholder="Rechercher un médicament, une pathologie..."
                className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-inner focus:shadow-lg min-w-0"
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
        <main className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8 relative w-full">
          {/* Decorative background blobs */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white to-transparent -z-10 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto h-full flex flex-col min-w-0">

            {/* VIEW: DASHBOARD (Grid of Specialties) */}
            {isDashboard ? (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
                  
                  {/* Hero / Credits Section */}
                  <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl text-white p-6 md:p-12">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
                     <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                     
                     <div className="relative z-10 flex flex-col items-center text-center">
                       
                       {/* Réalisé par */}
                       <div className="mb-8 flex flex-col items-center w-full">
                          <span className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">Réalisé par</span>
                          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-300 max-w-full">
                             <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-serif font-bold shadow-lg border-2 border-slate-700 text-2xl">Z</div>
                             <span className="text-lg md:text-3xl font-bold tracking-tight truncate">Dr ZEOUITINI YOUSSEF</span>
                          </div>
                       </div>

                       {/* Merci à */}
                       <div className="mb-10 w-full max-w-4xl">
                          <div className="flex items-center gap-4 mb-4 justify-center">
                             <div className="h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent w-full max-w-[100px]"></div>
                             <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Merci à</span>
                             <div className="h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent w-full max-w-[100px]"></div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 flex-wrap">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors w-full md:w-auto">
                               <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-white font-serif font-bold shadow-lg border border-slate-600">E</div>
                               <span className="text-sm md:text-base font-medium text-slate-200">Dr EL-AZRAK MOHAMED</span>
                            </div>
                            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-600"></div>
                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors w-full md:w-auto">
                               <div className="w-8 h-8 shrink-0 rounded-full bg-purple-500 flex items-center justify-center text-white font-serif font-bold shadow-lg border border-slate-600">N</div>
                               <span className="text-sm md:text-base font-medium text-slate-200">Dr NOUMAIRI MOHAMMED</span>
                            </div>
                            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-600"></div>
                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors w-full md:w-auto">
                               <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-500 flex items-center justify-center text-white font-serif font-bold shadow-lg border border-slate-600">B</div>
                               <span className="text-sm md:text-base font-medium text-slate-200">Dr BOUBGA TAOUFIK</span>
                            </div>
                          </div>
                       </div>

                       {/* Disclaimer */}
                       <div className="inline-block bg-orange-500/10 border border-orange-500/30 backdrop-blur-md rounded-xl px-6 py-3 max-w-3xl mx-auto w-full">
                          <p className="text-orange-200 text-xs md:text-sm font-medium flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-center">
                            <AlertTriangle className="w-5 h-5 shrink-0 text-orange-400" />
                            <span>Attention : Cet outil est purement pédagogique, destiné aux médecins, et ne remplace pas une consultation médicale.</span>
                          </p>
                       </div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-blue-600" />
                      Spécialités Médicales
                    </h2>
                    <span className="text-xs md:text-sm text-slate-500 hidden sm:inline">Sélectionnez une catégorie</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {specialties.map((specialty, idx) => {
                       const Icon = iconMap[specialty.icon] || Activity;
                       const color = specialty.color || 'blue';
                       return (
                         <button 
                           key={specialty.id}
                           onClick={() => handleSelectSpecialty(specialty.id)}
                           className={`group relative bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-xl border border-slate-100 hover:border-${color}-100 transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden`}
                           style={{ animationDelay: `${idx * 50}ms` }}
                         >
                           <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-${color}-50 to-${color}-100/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
                           
                           <div className="relative z-10">
                             <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                               <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center group-hover:bg-${color}-500 transition-colors duration-300`}>
                                 <Icon className={`w-6 h-6 text-${color}-500 group-hover:text-white transition-colors duration-300`} />
                               </div>
                             </div>
                             
                             <h3 className={`font-bold text-slate-800 text-lg mb-1 group-hover:text-${color}-600 transition-colors`}>{specialty.name}</h3>
                             <p className="text-sm text-slate-400 font-medium">{specialty.prescriptions.length} protocoles</p>
                           </div>
                           
                           <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                             <div className={`w-8 h-8 rounded-full bg-${color}-100 flex items-center justify-center`}>
                               <ChevronRight className={`w-4 h-4 text-${color}-600`} />
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
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-4xl mx-auto w-full">
                    <div className="mb-6 print:hidden flex items-center justify-between overflow-hidden">
                       <div className="flex items-center gap-2 text-sm font-medium text-slate-400 truncate">
                         <span className="uppercase tracking-wider shrink-0">{viewMode === 'alphabetical' ? 'Index' : currentSpecialty?.name || 'Recherche'}</span>
                         <ChevronRight className="w-4 h-4 shrink-0" />
                         <span className={`text-${currentSpecialty?.color || 'blue'}-600 truncate`}>{selectedPrescription.title}</span>
                       </div>
                    </div>
                    {/* Pass specialty color to card if available, else check display items for search results context */}
                    <PrescriptionCard 
                      prescription={selectedPrescription} 
                      color={currentSpecialty?.color || displayItems.find(i => i.prescription.id === selectedPrescription.id)?.tags[0].color}
                    />
                  </div>
                ) : (
                  /* VIEW: LIST (Selection) */
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 w-full">
                      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h2 className={`text-2xl md:text-3xl font-serif font-bold mb-2 truncate ${currentSpecialty ? `text-${currentSpecialty.color}-700` : 'text-slate-800'}`}>
                              {currentViewTitle}
                            </h2>
                            <p className="text-slate-500 text-sm md:text-base">
                              Sélectionnez une pathologie pour voir l'ordonnance type.
                            </p>
                          </div>
                          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center self-start shrink-0">
                             <span className={`block text-2xl font-bold ${currentSpecialty ? `text-${currentSpecialty.color}-600` : 'text-blue-600'}`}>
                                {displayItems.length}
                             </span>
                             <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Fiches</span>
                          </div>
                        </div>
                      </div>

                      {displayItems.length === 0 ? (
                        <div className="text-center py-20 px-6 max-w-lg mx-auto">
                          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <Search className="w-10 h-10 text-slate-300" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3">Aucun résultat pour "{searchTerm}"</h3>
                          
                          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 text-left shadow-sm">
                            <p className="text-blue-800 font-bold mb-2 flex items-center gap-2">
                              <Info className="w-5 h-5" /> 
                              Conseil de recherche :
                            </p>
                            <p className="text-blue-700/80 text-sm leading-relaxed">
                              L'ordonnance recherchée est peut-être enregistrée sous un <strong>nom scientifique</strong>, un <strong>synonyme</strong> ou une orthographe différente.
                            </p>
                          </div>

                          <p className="text-slate-500 mb-8 text-sm">
                            Nous vous invitons à explorer directement les dossiers par spécialité pour trouver ce que vous cherchez.
                          </p>

                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                              onClick={() => setSearchTerm('')}
                              className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                            >
                              Effacer la recherche
                            </button>
                            <button 
                              onClick={handleSelectDashboard}
                              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 hover:shadow-blue-300"
                            >
                              Parcourir les spécialités
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {displayItems.map((item, idx) => (
                            <button
                              key={`${item.prescription.id}-${idx}`}
                              onClick={() => handleSelectPrescription(item.prescription)}
                              className={`w-full group hover:bg-slate-50/50 transition-colors p-4 md:p-6 text-left flex items-center justify-between overflow-hidden`}
                            >
                              <div className="flex items-start gap-4 md:gap-5 min-w-0 flex-1">
                                <div className={`mt-1 w-10 h-10 rounded-full bg-${item.tags[0].color}-100 text-${item.tags[0].color}-600 flex items-center justify-center shrink-0 group-hover:bg-${item.tags[0].color}-500 group-hover:text-white transition-all duration-300 shadow-sm`}>
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className={`font-bold text-slate-700 group-hover:text-${item.tags[0].color}-700 text-base md:text-lg mb-1 break-words transition-colors leading-tight`}>
                                    {item.prescription.title}
                                  </h3>
                                  {item.prescription.subtitle && (
                                    <p className="text-slate-500 text-sm mb-2 italic truncate">
                                      {item.prescription.subtitle}
                                    </p>
                                  )}
                                  
                                  {/* Multi-specialty tags */}
                                  {(viewMode === 'alphabetical' || searchTerm) && (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {item.tags.map(tag => (
                                        <span 
                                          key={tag.id}
                                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-${tag.color}-50 text-${tag.color}-700 border border-${tag.color}-100`}
                                        >
                                          {tag.name}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-${item.tags[0].color}-500 group-hover:shadow-md transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 md:transform md:translate-x-2 md:group-hover:translate-x-0 shrink-0 ml-2`}>
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