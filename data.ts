import { Specialty, Prescription, PrescriptionLine } from './types';

// --- RAW DATA PROCESSING ---
// This helper function normalizes the diverse input formats into a standard structure
// supported by the PrescriptionCard component.
const normalize = (
  title: string,
  rawLines: any[],
  options: { id?: string, subtitle?: string, notes?: string[], warnings?: string[] } = {}
): Prescription => {
  const lines: PrescriptionLine[] = rawLines.map(line => {
    // String case
    if (typeof line === 'string') return { text: line };
    
    // Objects with specific keys from different datasets
    if (line.isHeader) return { text: line.text, isHeader: true };
    if (line.type === 'header') return { text: line.content, isHeader: true };
    if (line.type === 'note') return { text: line.content, isNote: true };
    if (line.isNote) return { text: line.text, isNote: true }; // handle pre-normalized
    if (line.type === 'drug' || line.type === 'instruction') return { text: line.content };

    // Drug object case
    if (line.drug) {
      let text = line.drug;
      if (line.dosage) text += ` : ${line.dosage}`;
      if (line.duration) text += ` (${line.duration})`;
      return { text };
    }
    // Name object case
    if (line.name) {
      let text = line.name;
      if (line.dosage) text += ` : ${line.dosage}`;
      if (line.note) text += ` (${line.note})`;
      if (line.duration) text += ` (${line.duration})`;
      return { text };
    }
    
    // Already normalized
    if (line.text) return line;

    return { text: JSON.stringify(line) };
  });

  return {
    id: options.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title,
    subtitle: options.subtitle,
    lines,
    notes: options.notes,
    warnings: options.warnings
  };
};

// --- SPECIALTY DATA DEFINITIONS ---

// 1. DERMATOLOGIE
const dermatoPrescriptions = [
  normalize('Acné rétentionnelle', [
    '-LIPIKAR SURGAS lotion : lavage *2/j (matin et soir)',
    '-RETACNYL 0,25% crème: 1app/J le soir pendant 3mois',
    '-CETAPHIL crème hydratante : 1app/j le matin pendant 3 mois',
    '-HYSEKE écran solaire'
  ], { subtitle: 'Comédons, microkystes' }),
  normalize('Acné inflammatoire', [
    '-LIPIKAR SURGAS lotion : lavage *2/j (matin et soir)',
    '-CUTACNYL 5% gel: 1app/J le soir pdt 3mois',
    '-CETAPHIL crème hydratante : 1app/j le matin pdt 3 mois',
    '-ERYFLUID lotion : 2app/j matin et soir pendant 3mois',
    '-Si inflammation sévère : VIBRAMYCINE 100 mg cp: 1cp/j pendant 3mois',
    '-HYSEKE écran solaire'
  ]),
  normalize('Acné importante du visage et résistante', [
    '-TETRALYSAL 300mg gélule : 1 gélule*2/j pendant 3mois',
    '-RETACNYL 0,25 crème % : 1app/j le soir pendant 3mois'
  ]),
  normalize('Vulvo-vaginite à candida albicans', [
    '-HYDRALIN poudre (pour toilette vaginale) : 1 sachet dans un litre d’eau',
    '-GYNO-PEVARYL 150mg ovule ou PEVAGINE 150mg ovule: 1 ovule le soir pendant 3 jours',
    '-PEVAGINE crème : 2app/j pendant 3 jours'
  ]),
  normalize('Vulvo-vaginite - En cas de récidive', [
    { type: 'header', content: '1 cure 1 fois/mois pendant 2 mois :' },
    '-GYNO-PEVARYL 150mg ovule : 1 ovule le soir pendant 6 jours',
    '-FUNGIZONE 10% suspension buvable : 1 cuillère *3/j pendant 10 jours'
  ]),
  normalize('Candidose buccale', [
    '-FUNGIZONE suspension buvable :',
    'Chez le nourrisson et l’enfant : 1 cuillère/10kg/j en 2 à 3 prises',
    'Chez adulte : 1 cuillère *4/j pendant 2 à 3 semaines'
  ]),
  normalize('Candidose des plis sous mammaires', [
    '-PEVARYL 0,01 crème : 1app*2/j pendant 2 semaines'
  ]),
  normalize('Lucite estivale bénigne', [
    '-DIPROSONE crème : 1app/J pendant 4 jours puis 1app/2j pendant 4 jours'
  ]),
  normalize('Teigne du cuir chevelu', [
    '-Eviction scolaire',
    '-Chercher l’origine animale ou humaine',
    '-KETODERM crème : 1app*2/j pendant 6 à 8 semaines',
    '-GRISEO 500mg cp : 2cp/j (adulte), 20mg/kg/j chez l’enfant'
  ]),
  normalize('Herpes circiné', [
    '-KETODERM crème : 1app*2/j pendant 1 mois',
    'OU LAMISIL 1% crème : 1app/j chez l’enfant'
  ]),
  normalize('Onyxis/ Périonyxis', [
    '-KETODERM crème : 1app/j pendant 4 mois pour la main et 9 mois pour le pied'
  ]),
  normalize('Onychomycose', [
    '-MYCOSTER VERNIX : 1app *2/j la 1er semaine, puis 1app /j la 2ème semaine, puis 1app/semaine pendant 3 à 6 semaines'
  ]),
  normalize('Dermatophytie du pli inguinal', [
    '-KETODERM crème : 1app*2/j pendant 1 mois',
    'OU LAMISIL 1% crème : 1app/j chez l’enfant'
  ]),
  normalize('Intertrigo inter-orteils', [
    '-Bain des pieds biquotidien : à l’eau + savon de Marseille puis sécher et appliquer KETODERM crème pendant 1 mois'
  ]),
  normalize('Dysidroses', [
    '-DIPROSONE pommade : 1 application/J pendant 7 jours, puis 1app/2j pendant 7 jours, puis 2 fois/semaine pendant 2 semaines'
  ], { notes: ['Diagnostic différentiel avec la gale, psoriasis, dermatite d’irritation'] }),
  normalize('Eczéma de contact aigu', [
    '-Soins antiseptiques par CYTEAL sol. Moussante + eau et rincer',
    '- DIPROSONE crème : 1app/j pendant 7 jours, puis 1app/2j pendant 4 jours (Il ne faut pas l’appliquer sur le visage : contre indiqué)',
    '-Si surinfection : ASTAPH 500mg cp: 1cp*3/j'
  ]),
  normalize('Eczéma de contact aigu très suintant et impétiginisé', [
    '- Soins antiseptiques par CYTEAL sol. Moussante + eau et rincer',
    '-EOSINE AQUEUSE DEMEL 2% : 1app*2/j, puis laisser sécher',
    '-DIPROSONE (Voir l’ordonnance précédente)',
    '-PYOSTACINE 500mg cp: 2cp*2/j pendant 7 jours'
  ], { subtitle: 'Sauf visage' }),
  normalize('Eczéma chronique sec, fissuré des mains', [
    '-Laver à l’eau et au savon 2 fois par jour',
    '-Vaseline : Appliquer sur les fissures, 2 fois par jour',
    '-DIPROSONE crème : 1app/j pendant 7 jours, puis 1app/2j pendant 7 jours, puis 2 fois/semaine pendant 15 jours.'
  ]),
  normalize('Erysipèle de la jambe', [
    '-AMOXIL 1g cp: 1cp*3/j pendant 15 jours (TTT ambulatoire)',
    '-Si hospitalisation : PENICILLINE G 1MUI : 10 à 20 MUI /j en 4 à 6 perfusions jusqu’à l’apyrexie, puis relais per os par ORACILLINE 1MUI cp : 2cp*3/j pendant 15 jours',
    '-Si allergie a la pénicilline : PYOSTACINE 500 mg cp: 2cp*3/j pendant 15 jours',
    '+ Traitement de la porte d’entrée',
    '-PAS D’AINS'
  ]),
  normalize('Furoncles extra-faciaux', [
    '-HEXOMEDINE solution : imbiber une compresse par la solution et l’appliquer pendant 3 min *3/j sur le furoncle'
  ]),
  normalize('Furoncle à risque', [
    '-HEXOMEDINE solution : imbiber une compresse par la solution et l’appliquer pdt 3 min *3/j sur le furoncle',
    '-ASTAPH 500 mg cp: 1cp*3/j pendant 10 jours'
  ], { subtitle: 'Visage, diabète, ID…' }),
  normalize('Furonculose récidivante', [
    '-Toilette quotidienne (par CYTEAL sol. moussante)',
    '-FUCIDINE crème : 1app *2/j pendant 1 semaine, puis 1 fois/mois pendant 6 mois',
    '-ASTAPH 500mg cp: 1cp*3/j pendant 15 jours'
  ]),
  normalize('Folliculite', [
    { type: 'header', content: 'Peu étendue:' },
    '-FUCIDINE crème : 1app*4/j pendant 7 jours',
    '-HEXOMEDINE solution',
    { type: 'header', content: 'Etendue:' },
    '-FUCIDINE crème : 1app*4/j pendant 7 jours',
    '-HEXOMEDINE solution',
    '-ASTAPH 500mg cp: 1cp*3/J pendant 10 jours'
  ]),
  normalize('Panaris', [
    '- BAINS et pansements pluriquotidiens par des antiseptiques locaux (Ex : HEXOMEDINE transcutanée 0,15%)',
    '- Antalgiques : EFFERALGAN 500mg cp : 2cp x 3/j',
    '+/- Traitement étiologique : ablation d\'un corps étranger',
    '-Antibiothérapie si signes régionaux ou généraux associés +++',
    '- Vaccination antitétanique : SAT-VAT++'
  ], { subtitle: 'Traitement ambulatoire', notes: ['Surveillance : bilan à la 48H', 'Arrêt de travail systématique si profession liée à l\'industrie alimentaire'] }),
  normalize('Gale non compliquée de l’adulte', [
    '-Traitement de toutes les personnes sous le même toit',
    '-Prendre une douche, se laver avec le savon de Marseille puis rincer à l’eau',
    '-Sécher puis badigeonner sur tout le corps sauf le visage par ASCABIOL lotion',
    '-Garder pendant 24h puis se laver',
    '=> Répéter la même procédure 3 jours de suite',
    '-Laver les vêtements et la literie (Ajouter BAYGON poudre et laisser pendant 48H puis laver)',
    '-CLARTEC 10mg cp: 1cp le soir'
  ]),
  normalize('Gale surinfectée de l’adulte', [
    '- ASTAPH 500mg cp: 1cp*3/j pendant 7 jours',
    '- FUCIDINE crème : 1app *2/j sur les lésions croûteuses',
    '-Après 2 jours de ce traitement, suivre la prescription "Gale non compliquée"'
  ]),
  normalize('Gale du nourrisson ou de l’enfant < 2 ans', [
    '-Une seule application de : ASCABIOL Lotion pendant 12H (après la douche et le séchage)',
    '-SPREGAL solution : une seule application pendant 6H'
  ]),
  normalize('Herpès labial récurrent peu gênant', [
    '-ZOVIRAX crème : 1 application*4/j'
  ]),
  normalize('Herpès: Primo infection ou herpès récurrent invalidant', [
    '-ZELITREX 500 mg cp: 1cp matin et soir pendant 10 jours si primo-infection ET pendant 5 jours si récurrence'
  ]),
  normalize('Impétigo', [
    { type: 'header', content: 'Si lésions peu nombreuses:' },
    '-Eviction scolaire',
    '-Se laver à l’eau et au savon, 2 fois par jour',
    '-FUCIDINE pommade : 1app *3/j pendant 10 jours',
    '-HEXOMEDINE solution',
    { type: 'header', content: 'Si lésions nombreuses:' },
    '-Eviction scolaire',
    '-Se laver à l’eau et au savon, 2 fois par jour',
    '-FUCIDINE pommade 1app*3/j pendant 10 jours',
    '-HEXOMEDINE solution',
    '-ASTAPH 500mg cp : 1cp *3/j pendant 7 jours'
  ]),
  normalize('Zona intercostale', [
    '-HEXOMEDINE sol. : 1 app*2/j',
    '-CODOLIPRANE 400mg cp : 1cp*3/j',
    '-ZELITREX 500mg cp : 2cp*3/j pendant 7 jours'
  ]),
  normalize('Algies post zostériennes', [
    '-NOZINAN 25 mg cp: 1cp*2/j'
  ]),
  normalize('Urticaire', [
    { type: 'header', content: 'Aigue (adulte):' },
    '-PRIMALIN 10 mg cp: 1cp *2/j pendant 1 semaine',
    { type: 'header', content: 'Chronique (adulte):' },
    '-XYZALL 5mg cp: 1cp /j le matin pendant 1 mois',
    '-Bilan étiologique : à réaliser en milieu hospitalier'
  ]),
  normalize('Œdème de Quincke', [
    '-SOLUMEDROL 20mg injectable : 1 ampoule en IVD',
    '-ADRENALINE injectable: 0,25 mg en IM',
    '-POLARAMINE injectable : 1 ampoule en IM/j ; à renouveler en cas de besoin',
    'Si dyspnée (œdème de la glotte) : ADRENALINE 0,25mg à 1mg en IM toutes les 15 min sans dépasser 1 mg',
    'Si choc anaphylactique : Remplissage + ADRENALINE injectable : 1mg +9cc de SS 0,9% : 1cc en sous-cutané/1min',
    { type: 'header', content: 'Suivi du patient (Relais per os):' },
    '- Corticoïdes : CORTANCYL® : 0,5 mg/kg/j et décroissance rapide sur une semaine',
    '- ZYRTEC® 10mg cp : 1 cp/j pendant 2 semaines'
  ]),
  normalize('Rosacée papulo-pustuleuse', [
    { type: 'header', content: 'Modérée:' },
    '-ROZEX gel : 1app*2/j pendant 3 mois',
    '-Les corticoïdes sont CI',
    { type: 'header', content: 'Intense:' },
    '-TETRALYSAL 300mg gélule: 2gel *2/j pendant 15 jours, puis 1gel/j pendant 3 mois',
    '-Puis relais par ROZEX : 1app*2/j pendant 3 mois'
  ]),
  normalize('Pityriasis versicolor', [
    '-KETODERM 2% crème : une seule application (1 tube en monodose) sur tout le corps, y compris le cuir chevelu -> Laisser 10min puis rincer',
    '-POLYTAR AF shampoing: appliquer selon le même principe, 2 fois par semaine pendant 1 mois'
  ]),
  normalize('Lichen plan', [
    '-DIPROSONE pommade : 1app/j pendant 10 jours, puis 1app/2j pendant 10 jours, puis 2fois/semaine pendant 2 semaines'
  ]),
  normalize('Phtiriase du cuir chevelu', [
    { type: 'header', content: 'Chez l’enfant :' },
    '- appliquer PARAPOUX pendant 2H, puis laver',
    { type: 'header', content: 'Chez l’adulte :' },
    '-Appliquer PARAPOUX, laisser sécher, puis recouvrir par un bonnet',
    '-Garder pendant 12H (toute une nuit), puis laver en utilisant un peigne fin',
    '-A refaire une semaine après'
  ]),
  normalize('Phtiriase du corps / Pubienne', [
    { type: 'header', content: 'Corps:' },
    '-Appliquer PARAPOUX le soir et dormir avec un slip et un tricot de corps',
    '- Désinfecter les vêtements',
    { type: 'header', content: 'Pubienne:' },
    '-Raser la région pubienne',
    '-Appliquer PARAPOUX le soir au coucher, puis dormir avec un slip et un tricot',
    '-Bien laver le lendemain matin'
  ]),
  normalize('Psoriasis', [
    { type: 'header', content: 'Limité des coudes et des genoux:' },
    '-DIPROSALIC pommade : 1app*2/j pendant 7 jours',
    '-Puis DIPROSONE pommade : 1app/j pendant 21 jours, puis 3j/semaine pendant 2 semaines',
    { type: 'header', content: 'Tronc et des membres :' },
    '-DAIVONEX 50µg/g pommade : 1application matin et soir jusqu’ à guérison',
    { type: 'header', content: 'Plis:' },
    '-DIPROSONE pommade : 1app/j pendant 7 jours, puis 1app/2j pendant 7 jours, puis 3fois/semaine pendant 2 semaines',
    { type: 'header', content: 'Cuir chevelu:' },
    '- DIPROSALIC lotion : 1app /j pendant 2 semaines, puis 1fois/2j pendant 2 semaines, puis 2fois/semaine pendant 1 mois'
  ]),
  normalize('Staphylococcie maligne de la face', [
    '-Avis spécialisé',
    '-ASTAPH 1g injectable: 1inj en IM *3/j pendant 2 à 3 jours, puis relais per os pendant 15 jours par ASTAPH 500mg gélule : 2 fois par jour'
  ]),
  normalize('Condylomes / Vénériens', [
    '-WARTEC crème en application locale',
    'OU',
    '-ALDARA 5% crème : 1app*3/semaine pendant 16 semaines ou traitement physique (cryothérapie)'
  ]),
  normalize('Verrues', [
    '-VASELINE SALICYLEE 10% : 1app*2/j',
    'OU DUOFILM : 1app *2/j',
    'OU cryothérapie'
  ]),
  normalize('Ongle incarné', [
    '-Rinçage avec HEXOMEDINE (isomedine) puis sécher',
    '-Appliquer fucidine pommade (Antibiotique à usage local)',
    '-ATB si pus (ex: amoxicilline)',
    '-puis à enlever par une petite incision (Traumato ou chirurgie générale)'
  ]),
  normalize("Piqûre d'insecte", [
    '-CLARITYNE 10mg (antihistaminique) : 01cp/j le matin',
    '-CELESTENE 2mg (betamétasone) : 1cp le matin pendant 5j',
    '-AMOXIL 1g : 1cp x 02/j pendant 7j'
  ]),
  normalize('Brûlure (Traitement ambulatoire)', [
    '-Flammazine pommade : 1app 3/j',
    '-DOLIPRANE 15mg/kg/6h',
    '-ASTAPH 500mg : 1cp 3/j',
    '-Si 2ème ou 3ème degré : hospitalisation'
  ]),
  normalize('Cicatrice', [
    '-CICATRIZEN (CREME CICATRISANTE) : 1app/j'
  ]),
  normalize('Dermatite atopique', [
    '-LOCAPRED CREME 0.1% :',
    ' 1app/j pendant 1 semaine',
    ' 1app/2j pendant 1 semaine',
    ' 1app/3j pendant 1 semaine puis arrêt',
    '-PRIMALAN sirop (antihistaminique) : 1cam/5kg 2/j',
    '-Emmolient hydratant vaseline blanche : jusqu\'à 4 fois/j'
  ]),
  normalize('Dermite séborrhéique', [
    '-TEGUMA CREME 1% (antimycosique) : app 2/j pdt 21j',
    '-DOLIPRANE 1g : 1cp 3/j'
  ]),
  normalize('Engelures', [
    'Pas de médicament avec AMM spécifique.',
    '-Sinon LOCAPRED CREME 0.1% (Dermocorticoïde)',
    '-OU ASEPTA AKILENJUR (parapharmacie)'
  ]),
  normalize('Erythème polymorphe', [
    { type: 'header', content: 'Si plusieurs récidives post-herpétiques' },
    '-ZELITREX 500mg (Antiviral) : 1cp/j pdt 6 mois',
    '-Ecran solaire',
    { type: 'header', content: 'Si pas de récidive' },
    '-HEXOMEDINE : 1app 2/j'
  ]),
  normalize('Anthrax', [
    '-CIPROXINE (Ciprofloxacine) IV 400 mg/12h : 1g amp inj 1inj/j en IM',
    '-Relais per os dés que possible CIPROXINE 500mg 1cp 2/j'
  ])
];

// 2. CARDIOLOGIE
const cardioPrescriptions = [
  normalize('Angor stable: BASIC', [
    '-KARDEGIC 75mg sachets : 1 sachet /j à vie',
    '-DETENSIEL 10mg cp: 1cp matin à vie ou AMLOR cp 10 mg: 1cp/j',
    '-TAHOR 10 mg cp: 1cp/j ou ELISOR 20mg cp : 1cp*2 /j',
    '-COVERSYL 5mg cp : 1/2 cp /j puis augmenter la dose jusqu’à 10 mg /j ou TRIATEC 2,5 mg cp : 1cp*2/j',
    '-Contrôle des FDR cardio-vasculaires'
  ]),
  normalize('Angor spastique pur', [
    '-KARDEGIC 160mg sachets: 1sachet/j',
    '-AMLOR 10mg cp: 1cp/j',
    '- Les bêtabloquants sont contre indiqués'
  ]),
  normalize('Syndrome coronarien aigu', [
    '-ASPEGIC 500 mg IV ou per os : sachets',
    '-PLAVIX 75mg cp : 4cp en dose de charge',
    '-LOVENOX 0,1 cc /10kg/12h (100 UI/kg/12h) pendant 48h',
    '- Appeler le cardiologue de garde pour une éventuelle thrombolyse ou angioplastie'
  ]),
  normalize('Ordonnance de sortie en post-IDM', [
    '-KARDEGIC 75mg sachets : 1 sachet /j à vie',
    '-PLAVIX cp : 1cp/j pdt 12 mois si Stent actif',
    '-DETENSIEL 10mg cp : 1cp le matin à vie OU AMLOR 10mg cp : 1cp/j',
    '-TAHOR 10 mg cp: 1cp/j ou ELISOR 20mg cp :1cp*2 /j',
    '-COVERSYL 5mg : 1/2 cp /j, puis augmenter la dose jusqu’à 10 mg /j ou TRIATEC 2,5 mg cp : 1cp*2/j',
    '-Contrôle des FDR cardio-vasculaires'
  ]),
  normalize('Artériopathie oblitérante des membres inférieurs', [
    { type: 'header', content: 'AOMI stade 2 :' },
    '-PLAVIX 75 mg cp: 1cp/j',
    '-TAHOR 10 mg cp: 1cp/J le soir',
    '-TRIATEC 2,5 mg cp : 1cp/j ; La dose peut atteindre jusqu’à 10mg /j (Forme 10mg cp) : 1 cp/j en une seule prise',
    { type: 'header', content: 'AOMI stade 3 et 4 : -Revascularisation chirurgicale' }
  ]),
  normalize('Péricardite aigue virale', [
    '-Repos',
    '-ASPEGIC 1000 mg sachets : 1 sachet * 3 /j pendant 3 semaines',
    '-OEDES 20mg cp: 1cp le matin à jeun',
    '-Si péricardite traînante : avis spécialisé',
    '-Si péricardite mal tolérée : Hospitalisation, Drainage, Remplissage'
  ]),
  normalize('Hypertension artérielle (HTA)', [
    { type: 'header', content: 'Sujet sans comorbidités :' },
    '-AMEP 5 mg cp : 1cp/j',
    { type: 'header', content: 'Sujet âgé :' },
    '-AMEP 5mg cp: 1cp /j ou FLUDEX 1,5 mg cp : 1cp le matin',
    { type: 'header', content: 'Diabétique type 1 :' },
    '-LOPRIL 25mg cp : 1cp*2/j ou TRIATEC 5 mg cp: 1cp/j le matin',
    { type: 'header', content: 'Diabétique type 2 :' },
    '-COZAAR 50 mg cp : 1cp/j ou TAREG 80 mg cp: 1cp /J le matin',
    { type: 'header', content: 'Insuffisant rénal :' },
    '-LOPRIL 25mg cp : 1cp/j et/ou COZAAR 50 mg cp : 1cp/j',
    { type: 'header', content: 'Coronarien / Post-IDM / Insuffisance cardiaque :' },
    '-DETENSIEL 10mg cp: 1cp le matin (commencer par ½ cp)',
    { type: 'header', content: 'Insuffisant rénal sévère :' },
    '-LASILIX 40 mg cp: 1cp/j le matin',
    { type: 'header', content: 'Femme enceinte :' },
    '-ALDOMET 500 mg cp : 1cp/j'
  ], { notes: ['Objectifs: PA<140/90 (général), PA<130/85 (diabétique), PA<150/90 (sujet âgé)', 'Bithérapie si échec: PRETERAX 2,5mg ou LODOZ 2,5/6,25mg'] }),
  normalize('Dissection aortique & Urgences hypertensives', [
    { type: 'header', content: 'Dissection aortique:' },
    '- LOXEN injectable à la SAP : 8 à15 mg/h, puis 2 à 4mg/h',
    '-Titration de morphine',
    '-Appeler le cardiologue de garde',
    { type: 'header', content: 'Urgences hypertensives:' },
    '-LOXEN à la seringue auto-pulsée : 8 à15 mg/h, puis 2 à 4mg/h',
    '-Ne pas chercher à normaliser rapidement la PA sauf en cas de dissection aortique'
  ]),
  normalize('Embolie pulmonaire', [
    { type: 'header', content: 'En l’absence d’un état de choc :' },
    '-INNOHEP 175UI/Kg/j en une seule injection sous cutané OU LOVENOX 100UI/kg/12h',
    '-Puis relais précoce per os par SINTROM 4mg cp (INR cible 2-3)',
    '-si clairance < 30 ml/min : HNF 50 UI/kg en dose de charge, puis 500 UI/kg/J en perfusion continue',
    { type: 'header', content: 'Si présence d’un état de choc :' },
    '-EN REANIMATION : Injection de : ACTILYSE 100mg IV sur 2H suivie de l’administration de l’HBPM à la seringue électrique : 400 à 600 UI/Kg/j',
    'NB : la dose préventive de LOVENOX : 0,4 cc /J.'
  ]),
  normalize('Insuffisance cardiaque', [
    { type: 'header', content: 'Classe 1 :' },
    '-Mesures hygiéno-diététiques',
    '-COVERSYL 5mg cp :1cp/J le soir',
    '-LASILIX 40mg cp: 1cp /j surtout en présence de signes congestifs',
    { type: 'header', content: 'Classe 2 et 3 :' },
    '-Même ordonnance précédente + avis cardio pour la prescription d’un béta-bloquant',
    { type: 'header', content: 'Classe 4 :' },
    '-Envisager l’implantation d’un PACE MAKER',
    { type: 'header', content: 'Décompensée (OAP) :' },
    '-Position demi assise + O2 nasal',
    '-LASILIX 20 mg, solution injectable : 2 à 4 ampoules en IV'
  ]),
  normalize('Blocs auriculo-ventriculaires', [
    { type: 'header', content: 'Si le patient est instable :' },
    '-Coup de poing sternal',
    '+/- ATROPINE : 1 à 3 mg en IV',
    '- ISUPREL 5 ampoules dans 250 cc de SG5%, à passer en IV',
    '- Choc électrique'
  ]),
  normalize('ACFA (Arythmie cardiaque par fibrillation auriculaire)', [
    '-DIGOXINE 0,25mg cp : 1cp/j si FC élevée',
    '-LOVENOX 0,1cc/10Kg/12h, puis relais per os par SINTROM : la dose à adapter en fonction de l’INR',
    '-Ne pas oublier de doser les hormones thyroïdiennes +++'
  ]),
  normalize('Tachycardie ventriculaire', [
    '• Massage cardiaque externe si arrêt cardio-circulatoire',
    '• Cardio-version électrique si TV mal tolérée : CEE sous brève AG à 200-300 J',
    '• Cardio-version médicamenteuse :',
    '- CORDARONE® 150 mg/3ml : 5 mg/kg en 30 min IVSE',
    'OU',
    '- XYLOCARD® : 1 à 1,5 mg/kg : bolus en IVD'
  ]),
  normalize('Endocardite infectieuse', [
    { type: 'header', content: 'Si valve native :' },
    '-STAPHYMYCINE injectable (500 et 1000mg) :200 à 300mg/kg/j',
    '-AXIMYCINE injectable : 200 à 300mg/kg/j',
    '-GENTALLINE (10/40/80/160mg): 3mg/kg/j',
    { type: 'header', content: 'Si valve prothétique :' },
    '-VANCOMYCINE injectable (125/250/500/1000mg) : 30mg/kg /J',
    '-GENTALLINE injectable : 3mg/kg/j',
    '-Rifampicine injectable : 600mg/12h',
    '-Traiter la porte d’entrée'
  ], { subtitle: 'Antibiothérapie probabiliste' }),
  normalize('CAT devant une syncope', [
    '- Dextro : Hypoglycémie ?',
    '- ECG : BAV ? TV ? Bradycardie ?',
    '- Auscultation : Souffle ? (Rao/CMO)',
    '- Hypotension orthostatique ?',
    '- Massage du sinus carotidien ? (Hypersensibilité)',
    '- Si tout est négatif : Syncope isolée -> Exploration électrophysiologique'
  ]),
  normalize('Accidents aux AVK (Surdosage)', [
    'INR < 5 (Pas de saignement) : Sauter une prise',
    '5 < INR < 9 (Pas de saignement) : Sauter 1 ou 2 prises, vit K si besoin',
    'INR > 9 (Pas de saignement) : Vit K 3 à 5mg, renouveler si besoin',
    'Saignement majeur : Hospitalisation, Arrêt AVK, PPSB + Vit K 10mg',
    'Saignement mineur : Hospitalisation, vit K'
  ]),
  normalize('Hypotension orthostatique', [
    '-EFFORTIL (Etiléfrine) 20 à 25 gouttes 3 fois par jour'
  ])
];

// 3. GASTRO
const gastroPrescriptions = [
  normalize('Amibiase intestinale et viscérale', [], { notes: ['Voir PARASITOLOGIE'] }),
  normalize('Cirrhose en décompensation ascitique', [
    { drug: 'ALDACTONE 75mg cp', dosage: '1cp/j (+ Régime sans sels)' },
    { drug: 'LASILIX 40mg Cp', dosage: 'Si inefficace associer : 1cp*2/j' }
  ]),
  normalize('Encéphalopathie hépatique', [
    { drug: 'Régime', dosage: 'pauvre en protide' },
    { drug: 'DUPHALAC (lactulose) solution buvable', dosage: '2-6 fois/j' }
  ]),
  normalize('Hépatite alcoolique aigue grave', [
    { drug: 'Hospitalisation', dosage: '' },
    { drug: 'Vit B1 et B6', dosage: '' },
    { drug: 'SOLUPRED 20mg cp', dosage: '2cp/j pendant 28 jours' }
  ]),
  normalize('Cirrhose avec ATCD d’hémorragie', [
    { drug: 'NOROXINE 400mg cp', dosage: '1cp/j au long cours' }
  ], { subtitle: 'Digestive par HTP et/ou ascite infectée' }),
  normalize('Syndrome de l’intestin irritable', [
    { drug: 'METEOSPASMYL 60mg capsule', dosage: '1capsule*2/j pendant 1mois' }
  ], { subtitle: 'Type douleur modérée intermittente + lien avec les repas' }),
  normalize('Syndrome de l’intestin irritable (Alternance)', [
    { drug: 'BEDELIX 3G sachets', dosage: '1 sachet /j pendant 1 mois' }
  ], { subtitle: 'Alternance diarrhée/constipation' }),
  normalize('Constipation chronique', [
    { type: 'header', content: 'Si constipation proximale' },
    { drug: 'TRANSILAC sachets', dosage: '2sachets le matin pendant 1 mois' },
    { drug: 'SPASFON cp 80mg', dosage: '1cp*2/j si douleur' },
    { type: 'header', content: 'Si constipation distale' },
    { drug: 'NORMACOL LAVEMENT', dosage: '1 lavement évacuateur le matin' }
  ]),
  normalize('Diarrhée aigüe sans contexte de prise d’ATB', [
    { drug: 'Repos', dosage: '' },
    { drug: 'Réhydratation', dosage: '(par les SRO)' },
    { drug: 'SMECTA 3g sachets', dosage: '1sachet*3/j' }
  ]),
  normalize('Diarrhée avec ATB', [
    { drug: 'Arrêt de l’ATB', dosage: '' },
    { drug: 'FLAGYL 250mg cp', dosage: '1cp*4/j pendant 10 jours' },
    { drug: 'ULTRALEVURE 250mg gélule', dosage: '1 gélule *4/j pendant 1 mois' }
  ], { subtitle: 'Colite non hémorragique' }),
  normalize('Diarrhée avec ATB (Hémorragique)', [
    { drug: 'Arrêt de l’ATB', dosage: '' },
    { drug: 'CIFLOXINE 500mg cp', dosage: '1cp*2/J pendant 5 jours' },
    { drug: 'FLAGYL 250mg cp', dosage: '1cp*4/j pendant 10 jours' }
  ], { subtitle: 'Colite hémorragique' }),
  normalize('Colite hémorragique (Autre)', [
    { drug: 'CIFLOXINE 500mg cp', dosage: '1 cp*2/j pendant 5 jours' },
    { drug: 'FLAGYL 500mg cp', dosage: '1*3/j pendant 7 jours' }
  ]),
  normalize('Diarrhée chronique', [], { notes: ['Traitement étiologique'] }),
  normalize('Achalasie : Traitement d’attente', [
    { drug: 'ADALATE 10mg capsule molle', dosage: '1cp*3 /j pendant 5 jours' }
  ]),
  normalize('Œsophagite à éosinophile', [
    { drug: 'FLIXOTIDE 500 µg inhalation buccale', dosage: '1 bouffée *2/j (ne pas boire ni manger dans les 30min suivant l’ingestion)' }
  ]),
  normalize('RGO: symptômes typiques >60 ans', [
    { drug: 'INEXIUM 40 mg cp', dosage: '1cp/j pendant 8 semaines' }
  ], { subtitle: 'Œsophagite sévère' }),
  normalize('RGO: symptômes < 60 ans', [
    { drug: 'PRAZOL 20mg cp', dosage: '1cp/j pendant 4 semaines' }
  ]),
  normalize('Dyspepsie', [
    { type: 'header', content: 'Si satiété précoce' },
    { drug: 'PRIMPERAN 10mg cp', dosage: '1cp, à prendre 15 à 30min avant chaque repas' },
    { type: 'header', content: 'Si hypersensibilité' },
    { drug: 'MOPRAL 20mg gélule', dosage: '1gel/j le soir, 30min avant le repas' }
  ]),
  normalize('Ulcère gastro duodénal sous AINS', [
    { drug: 'PRAZOL 20mg cp', dosage: '1cp/j' }
  ]),
  normalize('Eradication de l’HP', [
    { drug: 'AMOXIL 1G cp', dosage: '1cp*2/j matin et soir pendant 5 jours' },
    { drug: 'PRAZOL 20mg gélule', dosage: '1 gél. matin et soir pendant 5 jours' },
    { text: 'PUIS :', isHeader: true },
    { drug: 'ZECLAR 500mg cp', dosage: '1cp*2/j pendant 5 jours' },
    { drug: 'FLAGYL 500mg cp', dosage: '1cp*2/j pendant 5 jours' },
    { drug: 'PRAZOL 20mg gélule', dosage: '1gél. matin et soir pendant 5 jours' }
  ]),
  normalize('Hémorragie digestive haute (Ulcère)', [
    { drug: 'MOPRAL 40mg injectable', dosage: '2 ampoules (80mg) en IV puis 8mg/H à la SAP pendant 72H' }
  ]),
  normalize('Hémorragie digestive haute (Varices)', [
    { drug: 'TRIAXON injectable', dosage: '2g/24h ou per os : CIFLOXINE 500mg cp : 1cp*2/j pendant 7 jours' },
    { drug: 'SANDOSTATINE 50µg injectable', dosage: 'bolus de 50µg en IV puis 25µg /H pendant 72H' },
    { drug: 'DUPHALAC solution buvable', dosage: '2 à 6 fois /j' },
    { drug: 'A distance : AVLOCARDYL LP 160mg cp', dosage: '1cp/j à vie' }
  ]),
  normalize('Fissure anale aigue idiopathique', [
    { drug: 'TITANOREINE suppo', dosage: '1suppo*2/j pendant 1 mois' },
    { drug: 'MITOSYL crème', dosage: '1 application*2/j sur le suppo pendant 1 mois' },
    { drug: 'FORLAX 10g solution buvable', dosage: '2 sachets le matin' },
    { drug: 'CODOLIPRANE 400mg cp', dosage: '1cp*3/J' }
  ]),
  normalize('Thrombose hémorroïdaire externe', [
    { drug: 'MOVICOL sachets', dosage: '4 à 6 fois /j selon le transit' },
    { drug: 'XYLOCAINE 2% crème', dosage: '*4/j' },
    { drug: 'TITANOREINE crème', dosage: '1app*2/j sur le suppo' },
    { drug: 'TITANOREINE suppo', dosage: '1suppo*2/j' },
    { drug: 'PROFENID LP 200mg cp', dosage: '1cp /j en milieu du repas' }
  ]),
  normalize('Thrombose hémorroïdaire (Grossesse)', [
    { drug: 'Pas d’AINS', dosage: '' },
    { drug: 'Suivre la même ordonnance précédente sauf AINS', dosage: '' },
    { drug: 'CORTANCYL 20mg cp', dosage: '2cp /j pendant 5 jours' }
  ], { subtitle: '3ème trimestre ou post partum' }),
  normalize('Hémorroïdes internes hémorragiques', [
    { drug: 'MOVICOL sachets', dosage: '1sachet*4/j' },
    { drug: 'PROCTOLOG crème', dosage: '1app*2/j' },
    { drug: 'PROCTOLOG suppo', dosage: '1suppo*2/j en appliquant la crème sur le suppo pendant 3 semaines' }
  ]),
  normalize('Incontinence anale active', [
    { drug: 'IMODIUM 2mg gélule', dosage: 'max= 8gél./j pendant 15 jours' },
    { drug: 'Si échec', dosage: 'adresser au spécialiste' }
  ]),
  normalize('Angiocholite', [
    { drug: 'AUGMENTIN 1G injectable', dosage: '1g*3/j en IV' },
    { drug: 'SPASFON 40mg injectable', dosage: '2 ampoules *3/j en IV' },
    { type: 'header', content: 'Si angiocholite grave' },
    { drug: 'AUGMENTIN 1G injectable', dosage: '1g*3/j' },
    { drug: 'FLAGYL 500mg injectable', dosage: 'dans 125cc de SG 5% en perfusion de 30min, 3 fois/j' },
    { drug: 'SPASFON 40mg injectable', dosage: '2 ampoules *3/j en IV' }
  ]),
  normalize('Cholécystite/ Appendicite/ Péritonite', [
    { drug: 'FLAGYL 500 mg injectable', dosage: '1g/j' },
    { drug: 'GENTALLINE 160mg injectable', dosage: '1 injection/j' },
    { drug: 'Si sepsis', dosage: 'ajouter TRIAXON 1g injectable : 2g/j' },
    { drug: 'SPASFON 40mg injectable', dosage: '2 ampoules*3 /j' }
  ]),
  normalize('Diverticulite sigmoïdienne', [
    { type: 'header', content: 'Si non compliquée (Ambulatoire)' },
    { drug: 'AUGMENTIN 1g cp', dosage: '1cp*3/j pendant 10 jours' },
    { drug: 'Si allergie : OFLOCET 200mg cp', dosage: '1cp*2/j pendant 10 jours' },
    { type: 'header', content: 'Si tolérance moyenne (Hospitalisation)' },
    { drug: 'AUGMENTIN 1g injectable', dosage: '1g*3/j' },
    { drug: 'OU OFLOCET 200mg injectable', dosage: '1inj.*2/j tant que la fièvre persiste, puis relais per os' }
  ]),
  normalize('Fécalome', [
    { type: 'header', content: 'Le fécalome n\'est pas dur' },
    '-Faire un lavement de type Zetalax DM 1 à 2 microlavements par jour.',
    '-Puis faire suivre d\'un ou deux lavements d\'eau tiède (environ 500 cc) additionnés de 100 cc d\'huile de vaseline.',
    '-Il est impératif d\'effectuer ces lavements sous faible pression.',
    { type: 'header', content: 'Le fécalome est dur' },
    '-Ramollir le fécalome par un lavement huileux (500cc eau tiède + 100cc huile vaseline).',
    '-De petits lavements à l\'eau oxygénée 10 volumes (2 cuillères à soupe dans 200 cc).',
    '-Procéder à la fragmentation au doigt si nécessaire.',
    '-Poursuivre l\'évacuation par lavements.',
    '-Vérifier par toucher rectal que l\'évacuation est complète.'
  ], { notes: ['Prévention : Alimentation variée contenant des légumes tous les jours. Hydratation correcte (1.5L/j). Marche régulière.'] }),
  normalize('Gastro-entérite aiguë', [
    '-SPASFON : 2cp 3/j',
    '-CLOPRAME sirop : 1cas 3/j si vomissement',
    '-Si fièvre ou syndrome dysentérique (antibiothérapie): COTRIM FORT 1cp 2/j pdt 5j'
  ]),
  normalize('Hémorroïdes simples', [
    '-OSMOLAX SIROP : 1cas 3/j pdt 5j',
    '-TITANOREINE POMMADE : 1app 2/J pendant 10j',
    '-TITANOREINE SUPPO : 1suppo 2/J pendant 10j',
    '-BI-PROFÉNID 100 mg (ains) : 1cp 2/J pendant 5j',
    '-IPP chez les sujets à risque : KALEST 20mg 1cp le matin pdt 5J'
  ], { notes: ['Mesures hygiéno-diététiques : Augmenter la consommation de fibres, boire suffisamment, activité physique modérée.'] }),
  normalize('Hépatite A', [
    '-Pas de traitement spécifique',
    '-Repos conseillé',
    '-Arrêt de l\'alcool et des médicaments hépatotoxiques',
    '-Surveillance clinique et du TP'
  ]),
  normalize('Hépatite B', [
    { type: 'header', content: '1- Aiguë' },
    '-Recherche de MST et sérologies',
    '-Surveillance clinique et bilan hépatique (hospitaliser si TP < 50%)',
    '-Arrêt de l\'alcool et des médicaments hépatotoxiques',
    '-Surveillance de l\'Ag HBs (doit disparaitre à 6 mois sinon hépatite B chronique)',
    { type: 'header', content: '2- Chronique' },
    '-Suivi spécialisé'
  ]),
  normalize('Vomissement / Nausée', [
    '-CLOPRAME sirop : 1cas 3/j'
  ]),
  normalize('Coliques hépatiques simples', [
    '-SPASFON : 2cp 3/j'
  ], { notes: ['Pas de défense, pas de fièvre, moins de 6h'] }),
  normalize('Colopathie fonctionnelle', [
    { type: 'header', content: 'Si ballonnement' },
    '-EUCARBON : 1cp 3/j',
    { type: 'header', content: 'Si constipation' },
    '-DUPHALAC : 1cas 3/j',
    { type: 'header', content: 'Si diarrhée' },
    '-SMECTA : 1s 3/j',
    { type: 'header', content: 'Si douleur' },
    '-SPASFON : 1 cp 3/j'
  ]),
  normalize('Abcès anal', [
    '-AUGMENTIN (amoxicilline protégée) 1g 3/j pdt 10J',
    '-FLAGYL 500mg(metronidazole) 1cp 3/j pdt 8j',
    '-DOLIPRANE 1g (paracétamol) 1cp 3/j si douleur',
    '-Drainage chirugical'
  ])
];

// 4. ENDOCRINO
const endocrinoPrescriptions = [
  normalize('Diabète type 1', [
    { text: 'Schéma de 2 injections (mélange) matin et soir', isHeader: true },
    { drug: 'MIXTARD 30 (100UI/ML injectable)', dosage: '0,7UI/Kg/j ; 2/3 de la dose le matin et 1/3 le soir' },
    { text: 'Schéma de 3 injections', isHeader: true },
    { text: '(2 mélanges + 1 rapide à midi)' },
    { text: 'Schéma de 4 injections (basal bolus)', isHeader: true },
    { text: '0,7 UI /kg/j dont 3 rapides (60%) + 1 basal (40%) le soir' },
    { drug: 'ACTRAPID HM 100UI/ml', dosage: '+ UMULINE NPH 100UI/Ml' }
  ]),
  normalize('Exemples des insulines analogues', [
    { drug: 'LANTUS 100UI/ML injectable', dosage: '' },
    { drug: 'HUMALOG (ultra rapide)', dosage: '100UI/ML injectable' },
    { drug: 'HUMALOG MIX 25-100UI/ML', dosage: 'injectable' },
    { drug: 'NOVOMIX 30 FLEXPEN 100UI/ML', dosage: 'injectable' }
  ]),
  normalize('Diabète type 2', [
    { drug: 'GLUCOPHAGE 500 mg cp', dosage: '1cp/j lors du repas principal (2 sem), puis 2cp/j (1cp matin et soir) (max 3g/j)' },
    { text: 'Si inefficacité, ajouter :', isHeader: true },
    { text: 'DIAMICRON 60mg cp (1cp/j) OU AMAREL 1mg cp (1cp/j) OU JANUVIA 100mg cp (1cp/j)' },
    { text: 'Si inefficacité', isHeader: true },
    { text: 'associer les 3 médicaments précédents' },
    { text: 'Si inefficacité (étape finale)', isHeader: true },
    { text: 'garder les 3 médicaments ET ajouter Insuline basal (UMULINE NPH 10UI le soir ou LANTUS 10UI le soir)' }
  ]),
  normalize('Hypoglycémie', [
    { drug: 'Si patient conscient', dosage: '3 morceaux de sucres ou 2 cuillères de miel/confiture. Si pas d\'amélioration, 2ème dose.' },
    { drug: 'Si patient inconscient', dosage: '40 à 80 cc de SG 30% en IV puis relais par SG 10%' }
  ]),
  normalize('DCA (décompensation céto-acidosique) chez l’adulte', [
    { drug: 'SS O,9%', dosage: 'tant que la Glycémie > 2,5g/L' },
    { drug: 'SG 5% (+ 4 à 5g de NaCl)', dosage: 'quand la Glycémie < 2,5g/l (6L/24h)' },
    { drug: '10UI d’insuline rapide en IV /H', dosage: 'jusqu’à la négativation de la cétonurie puis insuline SC /4H :' },
    { text: 'Si glycémie > 2,5 g/l : 10UI' },
    { text: 'Si 1,8 < glycémie < 2,5 g/l : 7UI' },
    { text: 'Si 1,3 < glycémie < 1,8 : 5UI' },
    { text: 'Si glycémie < 1,3g/l : revenir au schéma habituel' },
    { drug: 'Chercher facteur déclenchant', dosage: '(ECG, RX thorax, ECBU)' }
  ]),
  normalize('DCA chez l’enfant', [
    { type: 'header', content: 'I- Réhydratation' },
    { drug: 'Si collapsus', dosage: 'HAEMACCEL 20ml/Kg en 30mn' },
    { drug: 'Si Acidose sévère (pH < 7.1)', dosage: 'Bicarbonates de sodium 14 o/oo : 5ml/Kg en 30mn' },
    { drug: 'Sérum salé 9 o/oo', dosage: '10ml/Kg/h (Pendant 2 heures max)' },
    { drug: 'À interrompre', dosage: 'si la glycémie capillaire est inférieure à 2.5 g/l' },
    { drug: 'Sérum glucosé 10 %', dosage: '3 litres / m2 / 24h associé à : NaCl 2g/l, KCl 3g/l, GCa 1g/l' },
    { type: 'header', content: 'II- Insulinothérapie' },
    { text: 'A débuter simultanément avec la réhydratation (Insuline rapide IV ex: ACTRAPID)' },
    { drug: '0.05 UI/ Kg / h', dosage: 'si l\'âge est < 5 ans' },
    { drug: '0.1 UI/ Kg / h', dosage: 'si l\'âge est > 5 ans' }
  ]),
  normalize('Coma hyperosmolaire', [
    { drug: 'Hospitalisation', dosage: 'en réanimation' },
    { drug: 'administrer le SS 0,9%', dosage: '1ère heure : 1 L, H1 à H4 : 2 à 3 L, H4 à H24 : 4 à 6 L' },
    { drug: 'Insuline à la seringue électrique', dosage: '2 à 3 UI/H ou 5UI en sous cutané/4H en maintenant la glycémie > 2,5g/l' },
    { drug: 'LOVENOX 0,4UI/j', dosage: '' },
    { drug: 'Traitement de l’infection', dosage: '(facteur déclenchant)' }
  ]),
  normalize('Dyslipidémie', [
    { drug: 'TAHOR 10mg cp', dosage: '1cp le soir' }
  ]),
  normalize('Syndrome métabolique', [
    { drug: 'Il n\'y a pas de traitement spécifique', dosage: 'Il faut traiter chaque facteur séparément :' },
    { drug: 'GLUCOPHAGE 850 mg cp', dosage: '1cp/j pendant 2 semaines, puis 1cp*3/j en milieu du repas' },
    { drug: '+/- TAHOR 10mg cp', dosage: '1cp le soir' },
    { drug: '+/- TRIATEC 2,5mg cp', dosage: '1cp/j' }
  ]),
  normalize('Hyperthyroïdie', [
    { drug: 'Repos', dosage: '' },
    { drug: 'AVLOCARDYL 40mg cp', dosage: '1cp*3/j pendant 3 à 4 semaines' },
    { drug: 'LEXOMIL 6mg cp', dosage: '½ cp si nervosité importante' },
    { drug: 'IMOVANE 7,5mg cp', dosage: '1/2 cp le soir' },
    { drug: 'DIMAZOL 10mg cp', dosage: '3 cp en une seule prise le matin pendant 1mois, puis réévaluer' },
    { drug: 'Surveillance', dosage: 'NFS 1fois/10j (risque d’agranulocytose)' }
  ]),
  normalize('Hypothyroïdie', [
    { drug: 'LEVOTHYROX (25-50-100-200µg)', dosage: '1,4 à 1,7 µg/kg/j à jeun 30min avant petit déj pendant 6 semaines' },
    { drug: 'Augmentation', dosage: 'de 25µg toutes les 4 semaines jusqu’à normalisation TSH' }
  ]),
  normalize('Thyroïdite subaiguë de QUERVAIN', [
    { drug: 'Repos', dosage: '(arrêt du travail de 1 à 2 semaines)' },
    { drug: 'ASPEGIC 1000mg sachets', dosage: '1 sachet*3/j' },
    { drug: 'Si forme hyperalgique', dosage: 'repos + SOLUPRED : 0,5mg/kg/j pendant 2 semaines, puis décroitre sur 6 à 8 semaines' }
  ]),
  normalize('Insuffisance surrénalienne aigue', [
    { drug: 'Traitement urgent en milieu hospitalier', dosage: '' },
    { drug: 'Réhydratation', dosage: '1ère demi-heure : 1L de SG5% + NaCl 4 à 6g/l sans KCl' },
    { drug: 'Puis alternance', dosage: '500cc SS 0,9%/3h ET 500cc SG 5%/ 3h' },
    { drug: '100mg d’HYDROCORTISONE en IV', dosage: 'puis diminution progressive : 100mg/6h IV, puis 50mg/6h' },
    { drug: 'Relais oral', dosage: 'substitutif par voie orale en 3 à 4j' }
  ]),
  normalize('Arrêt de la corticothérapie', [
    { drug: 'Diminution progressive', dosage: 'des doses de 10% TOUS les 10 jours jusqu’à la dose de 7,5 mg de prednisone' },
    { drug: 'Puis remplacer par', dosage: 'HYDROCORTISONE 30mg/J' },
    { drug: '2 à 8 semaines après', dosage: 'évaluation de l’axe corticotrope (SYNACTHENE ou cortisolémie 8h)' }
  ]),
  normalize('Hyperprolactinémie', [
    { drug: 'DOSTINEX 0,5 mg cp', dosage: '1/2 cp /semaine au milieu du repas du soir' },
    { drug: 'Augmentation', dosage: 'mensuelle jusqu’à normalisation (max 9cp/semaine)' }
  ]),
  normalize('Carence en Vitamine D', [
    { type: 'header', content: 'Entre 20 et 30ng/ml' },
    'D-CURE FORTE ampoule : 1 amp à J0 et 1 amp à J14 (total 2 amp)',
    { type: 'header', content: 'Entre 10 et 20ng/ml' },
    'D-CURE FORTE ampoule : 1 amp à J0 et 1 amp à J14 et 1 amp à J28 (total 3 amp)',
    { type: 'header', content: 'Inférieure à 10ng/ml' },
    'D-CURE FORTE ampoule : 1 amp à J0 et 1 amp à J14 et 1 amp à J28 et 1 amp à J42 (total 4 amp)'
  ]),
  normalize('Asthénie', [
    '-Après avoir éliminé une cause organique',
    '-SARGENOR 1g : 2 à 3 ampoules par jour'
  ])
];

// 5. GYNECOLOGIE
const gynecoPrescriptions = [
  normalize('Bartholinite Aiguë', [
    { text: 'NOROXINE 400mg cp: 1cp x 2/j' },
    { text: 'FLAGYL 500mg cp: 1cp x 2/j' },
    { text: 'NIFLURIL adulte suppo : 1 suppo x 2/j pendant 10 jours' }
  ], { notes: ['Le traitement est chirurgical'] }),
  normalize('Bartholinite (Femme Enceinte)', [
    { text: 'AUGMENTIN 500 mg cp: 1cp x 3/j' },
    { text: 'CODOLIPRANE 400mg cp: 1cp x 3/j' }
  ]),
  normalize('Contraception Orale', [
    { text: 'ADEPAL cp : 1cp /j pendant 21 j/28j' },
    { text: '(Arrêter 7 jours avant de reprendre)' }
  ], { notes: ['Bilan biologique avant prescription : glycémie à jeun, TG, CT, LDL, HDL'] }),
  normalize('Contraception Progestatifs', [
    { text: 'CERAZETTE 0,075mg cp : 1cp/j tous les jours' }
  ], { subtitle: '>40 ans ou diabétique' }),
  normalize('Contraception Post Partum', [
    { text: 'MICROVAL 30µg cp : 1cp/j tous les jours' },
    { text: 'À débuter à J21 du post partum' }
  ]),
  normalize('Contraception (Acné/Hyperandrogénie)', [
    { text: 'DIANE cp (progestatif)' }
  ]),
  normalize("Contraception d'Urgence", [
    { text: 'NORLEVO cp (Boite de 1) : 1cp dans les 72H au maximum suivant le rapport sexuel non protégé' }
  ]),
  normalize("Spotting (Porteuse DIU)", [
    { text: 'DICYNONE 250 mg cp: 2cp x 3/j' }
  ]),
  normalize("Ménorragie (Porteuse DIU)", [
    { text: 'EXACYL 1G solution buvable : 3 ampoules /j' }
  ]),
  normalize("Dysménorrhée Essentielle", [
    { text: 'PONSTYL 250mg gélule : 2 gélules x 3/j (dès le début des règles)' },
    { text: 'Si CI: SPASFON 80mg cp : jusqu’à 6cp/j' },
    { text: 'OU DUPHASTON 10mg cp : 2cp/j du 10ème au 25ème jour du cycle' }
  ]),
  normalize("Fibromyome", [
    { text: 'SURGESTONE 0,250mg cp: 1cp/j du 15ème j au 24ème j du cycle' }
  ]),
  normalize("Vulvo-vaginite à Trichomonas", [
    { text: 'FLAGYL 500mg ovule : 1 ovule le soir pendant une semaine' },
    { text: 'FASIGYNE 500mg cp: 4cp en une seule prise (à renouveler 8 jours plus tard)' }
  ]),
  normalize("Vulvo-vaginite à Gonocoque", [
    { text: 'TRIAXON 500mg injectable : 1inj en IM' },
    { text: 'VIBRAMYCINE 100mg cp: 1cp x 2/J pendant 7 jours' }
  ]),
  normalize("Vulvo-vaginite à Chlamydia", [
    { text: 'VIBRAMYCINE 100mg cp: 1cp x 2/j pendant 21 jours' }
  ]),
  normalize("Salpingite", [
    { text: 'AUGMENTIN 1G injectable : 1G en IV x 4/j (10 jours)' },
    { text: 'VIBRAMYCINE 100mg cp: 2cp/j' },
    { text: 'FLAGYL 500mg cp: 1cp x 2/j' },
    { isHeader: true, text: 'Ordonnance de sortie (15j):' },
    { text: 'AUGMENTIN 1G cp : 1cp matin et soir' },
    { text: 'VIBRAMYCINE 100mg cp: 2cp/j' },
    { text: 'FLAGYL 500mg cp: 1cp x 2/j' }
  ], { notes: ['Hospitalisation (non systématique)'] }),
  normalize("Vomissements (Début Grossesse)", [
    { text: 'PRIMPERAN 10mg cp: 1cp x 3/j' }
  ]),
  normalize("Syndrome de Lacomme", [
    { text: 'MAGNE B6 cp : 2cp le matin et 1cp le midi' }
  ], { notes: ['Douleur bassin/pubis chez femme enceinte'] }),
  normalize("Pré-éclampsie", [
    { text: 'Objectif PA : 140mmHg/90mmHg' },
    { text: 'Repos au lit décubitus latéral gauche' },
    { text: 'ALDOMET 250 mg : 3 à 6 cp/j' },
    { text: 'LOXEN 50 LP : 2 comprimés par jour' }
  ]),
  normalize("Menace d'Accouchement Prématuré (MAP)", [
    { isHeader: true, text: 'Tocolyse :' },
    { text: 'SALBUTAMOL 5 mg injectable (perf) OU SALBUMOL 0,5mg inj' },
    { text: 'Puis VENTOLINE 2mg cp, en relais (24-48h) : 4 à 6 cp/j' },
    { isHeader: true, text: 'Maturation pulmonaire :' },
    { text: 'CELESTENE : 2 injections IM de 12 mg à 24 h d\'intervalle (si < 34 SA)' }
  ]),
  normalize("Rupture Prématurée des Membranes", [
    { text: 'AMOXIL 1g cp : 1cp x 2/j (ATB préventive)' },
    { text: 'CELESTENE : 2 injections IM de 12mg à 24H d’intervalle' }
  ], { notes: ['24-34 SA: Expectative + ATB', '>37 SA: ATB + Déclenchement'] }),
  normalize("Bactériurie Asymptomatique (Grossesse)", [
    { text: 'OROKEN 200mg cp : 1cp x 2/j (5 jours)' },
    { text: 'OU AMOXIL 500 mg cp: 1cp x 3/j (7 jours)' },
    { text: '+ ECBU de contrôle 2 semaines après arrêt' }
  ]),
  normalize("Toxoplasmose et Grossesse", [
    { text: 'ROVAMYCINE 3MUI cp : 1cp x 3/j' },
    { isHeader: true, text: 'Si atteinte fœtale (Amniocentèse +) :' },
    { text: 'ADIAZINE : 3mg/j' },
    { text: 'MALOCIDE : 1mg/kg/j' },
    { text: 'ACFOL 5mg cp : 1cp x 2/semaine' }
  ], { notes: ['Si primo infection'] }),
  normalize("Herpes et Grossesse", [
    { isHeader: true, text: 'Primo-infection ou non primaire (mois précédent):' },
    { text: 'ZOVIRAX 200mg cp : 1cp x 5/j jusqu’à l’accouchement' },
    { isHeader: true, text: 'Avant le dernier mois :' },
    { text: 'ZOVIRAX 200mg cp : 1cp x 5/j pendant 10 jours' }
  ]),
  normalize('Engorgement du sein', [
    '-DOLIPRANE 1g 3/j',
    '-Massage aréolaire',
    '-Douche chaude ou serviette chaude'
  ], { notes: ['Amélioration au bout de 24h, disparition au bout de 48h'] }),
  normalize('Lymphangite du sein', [
    '-DOLIPRANE 1g 3/j',
    '-Massage aréolaire',
    '-Douche chaude ou serviette chaude',
    '-VOLTARENE 50mg : 1cp 3/j'
  ]),
  normalize('Abcès du sein', [
    { type: 'header', content: 'En phase pré-suppurative (Ambulatoire)' },
    '-Antibiothérapie antistaphylococcique (Pyostacine®) : 6 cp/j pendant 8 jours',
    '-Antalgiques',
    '-Jeter le lait de ce sein, tirer le lait de l\'autre sein',
    { type: 'header', content: 'En phase collectée' },
    '-Pas d\'antibiothérapie',
    '-Incision - drainage sous anesthésie générale',
    '-Contre-indication de l\'allaitement (sauf demande expresse après phase aiguë sur sein sain)'
  ])
];

// 6. INFECTIOLOGIE
const infectioPrescriptions = [
  normalize("Méningite Purulente", [
    { text: 'TRIAXON 500mg inj : 100mg/kg/j en 2 perfusions (2 jours)' },
    { isHeader: true, text: 'Puis selon germe :' },
    { text: 'Méningocoque/Strepto: TRIAXON 75mg/kg/j (7 jours)' },
    { text: 'Pneumocoque: TRIAXON 100mg/kg/j (14 jours)' },
    { text: 'Listeria: AXIMYCINE (2g/4h) + GENTAMEN (3-5mg/kg/j)' }
  ]),
  normalize("Prophylaxie Méningocoque", [
    { text: 'ROVAMYCINE 1,5MUI cp' },
    { text: 'Adulte : 2cp x 2/j pendant 5 jours' },
    { text: 'Enfant : ½ cp x 2/j pendant 5 jours' }
  ]),
  normalize("Méningite à Liquide Clair", [
    { text: 'AXIMYCINE (500mg ET 1G) inj : 1g/2h ou 2g/4h en IVD' },
    { text: 'ZOVIRAX 250 mg inj: 10 à 15 mg/kg/8H en perfusion' }
  ]),
  normalize("Purpura Fulminans", [
    { text: 'Enfant : TRIAXON : 50 à 100 mg/kg (max 1g)' },
    { text: 'Adulte : TRIAXON 2g OU AXIMYCINE 1g en IV' }
  ]),
  normalize("Neutropénie Fébrile", [
    { text: 'AUGMENTIN 1g cp : 1cp x 3/j' },
    { text: 'CIPROXINE 750mg cp : 1cp x 2/j' },
    { text: 'Si haut risque : ZIDIME 2G injectable: 2g x 3/j' }
  ]),
  normalize("Sinusite", [
    { text: 'AUGMENTIN 1g sachets: 1 sachet x 3/j pendant 10 jours' },
    { text: 'SOLUPRED (5 et 20mg) : 1mg/kg/j (matin) pendant 5 jours' },
    { text: 'Désobstruction nasale' }
  ]),
  normalize("Pneumonie Aiguë Communautaire", [
    { text: 'Sans comorbidités : AMOXIL 1g cp: 1cp x 3 /j (8 jours)' },
    { text: 'Si comorbidités : AUGMENTIN 1g sachets : 1 sachet x 3/j (8 jours)' }
  ]),
  normalize("Antibioprophylaxie (Endocardite)", [
    { isHeader: true, text: 'Geste endobuccal :' },
    { text: 'AMOXIL 1g cp : 3cp une heure avant le geste' },
    { isHeader: true, text: 'Soins dentaires / Voies aériennes :' },
    { text: '1h avant et 6h après : AXIMYCINE 2g en IV (30min) + 1G per os' },
    { isHeader: true, text: 'Urologie / Digestif :' },
    { text: 'Ajouter GENTALLINE : 1,5 mg/kg perfusion' }
  ]),
  normalize("Ecoulement Urétral", [
    { text: 'TRIAXON injectable : 250mg en IM (dose unique)' },
    { text: 'VIBRAMYCINE 100mg cp: 1cp x 2/j pendant 7 jours' },
    { text: 'Traitement du conjoint' }
  ]),
  normalize("Ulcère Génital", [
    { text: 'EXTENCILLINE 1,2 MU inj : 2 inj IM (une par fesse)' },
    { text: 'CIPROXINE 500mg cp: dose unique' },
    { text: 'Si CI Extencilline: VIBRAMYCINE 100mg (14 jours)' },
    { text: 'Si CI Ciproxine: AZ 500 mg cp (4cp dose unique)' }
  ]),
  normalize("Fièvre Typhoïde", [
    { text: 'CIPRO 500mg cp : 1cp x 2/J (8 jours)' },
    { text: 'OU TRIAXON 1G injectable : 1 inj/j (8 jours)' },
    { text: 'DOLIPRANE 500mg cp: 1cp x 3/j' }
  ], { notes: ['Hospitalisation, Isolement'] }),
  normalize("Choléra", [
    { text: 'VIBRA 200mg cp : 25mg/kg/j (une prise /j pendant 5 jours)' },
    { text: 'SPASFON 40mg inj : 2 ampoules x 3/j' }
  ], { notes: ['Hospitalisation, Déclaration, Réhydratation'] }),
  normalize("Tétanos", [
    { text: 'LOVENOX 0,4 UI/j' },
    { text: 'VALIUM 10mg cp : 1cp/j (ou IV si grave)' },
    { text: 'PENICILLINE G 1MUI : 4MUI/j (7 jours)' },
    { text: 'SAT : 500UI en IM + VAT' }
  ], { notes: ['Réanimation, Nettoyage plaie'] }),
  normalize("Brucellose (Phase Aiguë)", [
    { text: 'VIBRAMYCINE 100mg cp: 1cp x 2 /j pendant 6 semaines' },
    { text: 'GENTALLINE injectable : 5mg/kg/j pendant 10 jours' }
  ]),
  normalize("La Rage", [
    { text: 'AUGMENTIN 1G cp: 1cp x 3 /j pendant 8 jours' },
    { text: 'VACCIN: schéma J0 – J3 – J7 – J14 – J28' },
    { text: 'Sérum anti rabique' }
  ], { notes: ['Laver, Rincer, Betadine', 'Eviter de suturer immédiatement'] }),
  normalize("Maladie de Lyme", [
    { text: 'VIBRAMYCINE 100mg cp: 1cp x 2/j pendant 14 jours' },
    { text: 'Si paralysie faciale : TRIAXON 2g/j (3 semaines)' }
  ]),
  normalize("Leptospirose", [
    { text: 'PENICILLINE G 1MUI : 8-15 MUI/J (15 jours)' },
    { text: 'OU AXIMYCINE : 100mg/Kg/J (7-10 jours)' },
    { text: 'Si précoce : VIBRA 200mg cp : 1cp/j (7 jours)' }
  ]),
  normalize("Infections Dentaires", [
    { text: 'ROVAMYCINE 3MUI cp : 1cp, 3 fois par jour (7 jours)' },
    { text: 'SURGAM 200mg cp : 1cp, 3 fois par jour' },
    { text: 'ALODONT : 3 goblets par jour' },
    { text: 'CODOLIPRANE cp : 1cp, 3 fois par jour' }
  ]),
  normalize("Prophylaxie VIH (CD4 < 200)", [
    { isHeader: true, text: 'Pneumocystose :' },
    { text: 'CO-TRIM 400mg/80mg : 1cp par jour' },
    { isHeader: true, text: 'Toxoplasmose (si sérologie +) :' },
    { text: 'CO-TRIM : 1cp par jour' }
  ]),
  normalize('Chancre mixte', [
    '-Bactrim forte : 1cp x 2/j pdt 7j',
    '-EXTENCILLINE : inj en IM 2,4 M UI une seule injection',
    '-Surveillance par VDRL, TPHA : 3, 6, 12, 24 mois'
  ]),
  normalize('Chancre mou', [
    '-Bactrim forte : 1 cp x 2/j pdt 7j'
  ]),
  normalize('Syphilis', [
     { type: 'header', content: '1- Primaire et secondaire précoce' },
     '-EXTENCILLINE : 1 inj IM de 2,4 millions d\'unités',
     { type: 'header', content: '2- Primaire et secondaire latente' },
     '-EXTENCILLINE : 1 inj IM de 2,4 millions d\'unités par semaine pendant 3 semaines',
     { type: 'header', content: '3- Neurosyphilis' },
     '-EXTENCILLINE : 1 inj IV de 2,4 millions d\'unités par jour pendant 10 à 15 J'
  ]),
  normalize('Rickettsioses', [
    '-VIBRAMYCINE 100mg : 1cp 2/j pdt 7 jours'
  ]),
  normalize('Shigellose', [
    '-BACTRIM FORT (Sulfaméthoxazole/Triméthoprime) : 1cp 2/j pdt 10 jours'
  ]),
  normalize('Abcès dentaire', [
    { type: 'header', content: 'Suivant gravité et emplacement' },
    '-Prise d\'antibiotiques préalable si nécessaire',
    '-Drainage si ampleur avancée',
    '-Si origine gencive : drainage et curetage',
    '-Si origine dentaire : nettoyage endodontique +/- couronne'
  ])
];

// 7. NEPHROLOGIE
const nephroPrescriptions = [
  normalize('Insuffisance Rénale Aiguë - Hyperkaliémie', [
    { drug: 'GLUCONATE DE CALCIUM', dosage: '1 ampoule de 1g en IVL' },
    { drug: 'BRICANYL', dosage: '1 nébulisation à renouveler au besoin' },
    { drug: 'BICARBONATE 14‰', dosage: '500 ml à perfuser en 1h' },
    { drug: 'ACTRAPID', dosage: '30 UI dans 200 ml SG 30% en 1h' },
    { drug: 'KAYEXALATE', dosage: '20 à 60 g (1 à 3 cam) + Diurétiques' },
  ], { subtitle: 'Traitement d\'urgence', notes: ['Si K+ > 6.5 mmol/l : Prévoir une EER d\'urgence.', 'Si K+ < 6.5 mmol/l : Kayexalate.'] }),
  normalize('Insuffisance Rénale Aiguë - Surcharge', [
    { drug: 'LASILIX', dosage: '500 à 1500mg/j' }
  ], { subtitle: 'Surcharge hydrosodée (OAP...)', notes: ['Si inefficace : EER.'] }),
  normalize('Traitement néphroprotecteur (IRC)', [
    { drug: 'RENITEC 5mg cp', dosage: '1/2 cp puis augmenter progressivement jusqu\'à 20mg/j' }
  ]),
  normalize('Traitement néphroprotecteur (Diabète type 2)', [
    { drug: 'APROVEL 150mg cp', dosage: '1/2 cp puis augmenter jusqu\'à 300mg/j' }
  ]),
  normalize('Complications de l\'IRC (Surcharge)', [
    { drug: 'LASILIX 40 mg cp', dosage: '1cp le matin jusqu\'à disparition des œdèmes' }
  ]),
  normalize('Complications de l\'IRC (Anémie)', [
    { drug: 'FUMAFER 66mg cp', dosage: '2 à 3 cp/j en dehors des repas' }
  ]),
  normalize('Complications de l\'IRC (Hyperphosphorémie)', [
    { drug: 'RENAGEL 800 mg cp', dosage: '1cp/j puis augmenter la dose jusqu\'à 9cp/j' }
  ])
];

// 8. HEMATOLOGIE
const hematoPrescriptions = [
  normalize('Anémie par carence martiale', [
    { drug: 'FUMAFER 66mg cp', dosage: '(2mg/kg/j) : 2 à 3 cp/j pendant 3 mois en dehors des repas' }
  ], { notes: ['Surveillance par : NFS 1/mois et Ferritinémie à 3 mois'] }),
  normalize('Anémie mégaloblastique (Vit B9)', [
    { drug: 'ACFOL 5mg cp', dosage: '2 à 3 cp/j pendant 3 mois' }
  ]),
  normalize('Anémie mégaloblastique (Vit B12)', [
    { drug: 'HYDROXO injectable', dosage: '1000 gamma/j en IM pendant 10 jours' }
  ], { notes: ['A J10 : crise réticulocytaire', 'Si réparation incomplète : 1000 gamma/mois à vie'] }),
  normalize('Thrombopénie auto-immune idiopathique', [
    { drug: 'CORTANCYL', dosage: '1mg/kg/j le matin pendant 21 jours, puis décroissance' },
    { drug: 'MOPRAL 20mg gélule', dosage: '1 gél. le soir pendant 1 mois' }
  ], { notes: ['Surveillance NFS, 1 fois par semaine'] }),
  normalize('Thrombocytose', [
    { drug: 'ASPEGIC 100mg sachet', dosage: '1 sachet/j' }
  ]),
  normalize('Protocole de Transfusion', [
    { drug: 'CULOTS GLOBULAIRES', dosage: 'FORMULE = (Hbi-Hbr) x 3 x Poids / 250' },
    { drug: 'PFC (Si TP < 50%)', dosage: '20 ML/KG / 250 = NOMBRE DE POCHETTES' },
    { drug: 'CULOTS PLAQUETTAIRES', dosage: '1 CP / 10 KG DE POIDS' }
  ])
];

// 9. GERIATRIE
const geriatriePrescriptions = [
  normalize('Chondrocalcinose', [
    { drug: 'DOLIPRANE 1g cp', dosage: '1g x 3/j pendant 5 jours' },
    { drug: 'COLCHICINE 1mg cp', dosage: 'J1: 1cp matin, midi, soir. J2-J3: 1cp matin, soir. Puis 1 cp le soir pendant 8 jours' }
  ]),
  normalize('La démence d’Alzheimer', [
    { drug: 'ARICEPT 5 mg cp', dosage: '1cp le soir pendant 6 semaines' },
    { drug: 'puis ARICEPT 10mg cp', dosage: '1cp le soir' }
  ]),
  normalize('HTA modérée chez un sujet âgé', [
    { drug: 'FLUDEX 1,5 mg cp', dosage: '1cp le matin' }
  ]),
  normalize('Incontinence urinaire (Femme âgée)', [
    { drug: 'Rééducation périnéo-sphinctérienne', dosage: '' },
    { drug: 'DITROPAN 5 mg cp', dosage: '1/2 cp x 3/j' }
  ]),
  normalize('Incontinence urinaire (Rétention)', [
    { drug: 'XATRAL 2,5 mg cp', dosage: '1cp matin et soir' }
  ]),
  normalize('Incontinence urinaire (Insuffisance)', [
    { drug: 'COLPOTROPHINE crème', dosage: '1 application le soir sur la vulve pendant 3 mois, puis 10j/mois' },
    { drug: 'Rééducation périnéo-sphinctérienne', dosage: '' }
  ]),
  normalize('Infection urinaire basse', [
    { drug: 'Boire 1,5 L/j', dosage: '' },
    { drug: 'BACTRIM FORTE 800 mg cp', dosage: '1cp matin et soir pendant 10 jours' }
  ]),
  normalize('Cystite chez l’adulte (Minute)', [
    { drug: 'MONURIL ADULTE 3G sachet', dosage: 'Dose unique' }
  ]),
  normalize('Insomnie récente', [
    { drug: 'IMOVANE 7,5mg cp', dosage: '1cp le soir au coucher puis ½ cp les soirs suivants pendant 5 jours' }
  ]),
  normalize('Prurit essentiel', [
    { drug: 'DEXERYL crème', dosage: '1app/j après la douche pendant 2 mois' }
  ]),
  normalize('Prurit sénile', [
    { drug: 'ATARAX 25mg cp', dosage: '1cp matin et soir' },
    { drug: 'SEPTIVON', dosage: 'Dans 1L d’eau, appliquer sur les lésions, rincer et sécher (si lésions de grattage)' }
  ], { notes: ['Sous-vêtements en coton', 'Eviter les savons habituels'] }),
  normalize('Prise en charge du patient chuteur', [
    { drug: 'CALCIFIX D3 500mg cp', dosage: '1cp/j en dehors des repas' },
    { drug: 'FOSAMAX 70mg cp', dosage: '1cp/j pendant 2 mois par trimestre' }
  ])
];

// 10. OPHTALMOLOGIE
const ophtalmoPrescriptions = [
  normalize('Décollement de la rétine', [
    { type: 'header', content: 'Traitement chirurgical' },
    'Rétinopexie (Laser- Cryothérapie trans-sclérale)',
    'Indentation sclérale',
    'Vitrectomie avec tamponnement interne (Injection de gaz lourd)',
    'Evacuation du liquide sous rétinien par ponction'
  ], { notes: ['Examen clé = Lampe à fente', 'Hospitalisation avec repos postural'] }),
  normalize('Oblitération de l’artère centrale de la rétine', [
    { type: 'header', content: 'Traitement d\'urgence' },
    'Traitement thrombolytique ou par l\'héparine',
    'Traitement par vasodilatateurs'
  ], { notes: ['Traitement dans un centre spécialisé'] }),
  normalize('Oblitération de la veine centrale de la rétine', [
    { type: 'header', content: 'Traitement médical' },
    'Antiagrégant + séances d’hémodilutions',
    'Rechercher une étiologie',
    'Anti-VEGF : Prévention d’une complication néo-vasculaire et de l’inflammation',
    { type: 'header', content: 'Chirurgie' },
    'Laser sur les zones d’hypoxie pour éviter un glaucome néo-vasculaire'
  ]),
  normalize('Cataracte', [
    { type: 'header', content: 'Traitement médical (Pré-op / Attente)' },
    { name: 'CATACOL 0,1%', dosage: '2 gouttes matin et soir si gêne mineure' },
    { type: 'header', content: 'En post opératoire' },
    { name: 'TOBRADEX 0,3/0,1% collyre', dosage: '1 goutte, 3 fois par jour (8 jours)' },
    { name: 'INDOCOLLYRE 0,1% collyre', dosage: '1 goutte, 3 fois par jour (6 semaines)' }
  ]),
  normalize('DMLA', [
    { type: 'header', content: 'Forme exsudative' },
    'Injections intra-vitréennes : Anti-VEGF (LUCENTIS* ou AVASTIN*)',
    'Lutéine, sels minéraux et vitamines',
    { type: 'header', content: 'Stade ultime' },
    'Appareillage + rééducation basse vision'
  ]),
  normalize('Conjonctivites', [
    { type: 'header', content: 'Forme purulente bactérienne' },
    { name: 'DACRYOSERIUM', dosage: 'Lavement, 4 fois par jour' },
    { name: 'AZYTER 15mg/g collyre', dosage: '1 goutte, 2 fois par jour (3 jours)' },
    { type: 'header', content: 'Conjonctivites virales' },
    { name: 'RIFAMYCINE collyre', dosage: '2 gouttes, 4 fois par jour (8 jours)' },
    { type: 'header', content: 'Conjonctivites allergiques' },
    { name: 'CROMABAK 20mg collyre', dosage: '2 gouttes, 3 fois par jour' },
    { name: 'ZYRTEC 10mg cp', dosage: '1 cp par jour (15 jours)' }
  ]),
  normalize('Glaucome aigu (GAFA)', [
    { type: 'header', content: 'Traitement d\'urgence' },
    { name: 'DIAMOX 250mg', dosage: '2 cp per os puis ½ cp, 6 fois par jour (chaque 4H)' },
    { name: 'MANNITOL 20%', dosage: '1mg/kg dans une perfusion de 30 minutes' },
    { name: 'PILO collyre 2%', dosage: '1 goutte/10 min jusqu’à myosis puis 1 goutte 4 fois par jour (1h après Mannitol)' },
    { name: 'INDOCOLLYRE 0,1% collyre', dosage: '1 goutte, 3 fois par jour' },
    { name: 'TIMOLOL 0,5% collyre', dosage: '1 goutte d’emblée puis 1 goutte, 2 fois par jour' }
  ]),
  normalize('Kératites', [
    { type: 'header', content: 'Kératites superficielles' },
    { name: 'EURONAC 5% collyre', dosage: '2 gouttes, 4 fois par jour (8 jours)' },
    { name: 'FUCITHALMIC gel', dosage: '1 application matin et soir (8 jours)' },
    { type: 'header', content: 'Kératites herpétiques' },
    { name: 'ZOVIRAX 3% pommade', dosage: '1 application, 5 fois par jour (5 jours)' },
    { name: 'RIFAMYCINE collyre', dosage: '2 gouttes, 3 fois par jour (15 jours)' }
  ]),
  normalize('Pathologies Palpébrales', [
    { type: 'header', content: 'Blépharites' },
    'Hygiène locale : massage compresses tièdes',
    { name: 'TOBRADEX pommade', dosage: '4 applications par jour (15 jours)' },
    { type: 'header', content: 'Herpès palpébral' },
    { name: 'ZOVIRAX 3% pommade', dosage: '5 applications par jour (5 jours)' },
    { type: 'header', content: 'Chalazion' },
    { name: 'STERDEX capsule molle', dosage: '1 application matin et soir' },
    { type: 'header', content: 'Orgelet' },
    { name: 'TOBRADEX pommade', dosage: '1 application, 2 à 3 fois par jour (10 jours)' }
  ]),
  normalize('Oeil sec', [
    '-Traitement étiologique',
    '-Larmes artificielles LARMABAK 0,9% : 4-6 fois par jour'
  ]),
  normalize('Zona ophtalmique', [
    '-ZELITREX 500mg (antiviraux) 2cp 3/j pdt 7j',
    '-CODOLIPRANE 500 mg/30 mg (paracétamol+codeine) 1cp 3/j',
    '-HEXOMEDINE (antiseptique) 1app 2/j',
    '-Consultation ophtalmo'
  ])
];

// 11. NEUROLOGIE
const neuroPrescriptions = [
  normalize('AVC - Phase Aiguë', [
    { type: 'header', content: 'Traitement de l\'HTA sévère (>220/120)' },
    { name: 'LOXEN IV', dosage: '2mg/H à la SAP', duration: 'Augmenter toutes les 15min tant que PA > 220' },
    { type: 'header', content: 'Thrombolytique (Si délai < 4h30)' },
    { name: 'ACTILYSE', dosage: 'Bolus 15mg IV, puis 0.75mg/kg (30min), puis 0.5mg/kg (60min)' }
  ], { notes: ['FAST: Face, Arms, Speech, Test'] }),
  normalize('AVC Ischémique (Post-Aigu)', [
    { type: 'header', content: 'Traitement initial' },
    { name: 'ASPEGIC 250mg', dosage: '1 sachet' },
    { name: 'LOVENOX 0,4UI/j', dosage: 'Préventif' },
    { type: 'header', content: 'Prévention secondaire' },
    { name: 'COVERSYL 5mg', dosage: '1/2 cp 1 mois puis 1cp/j' },
    { name: 'FLUDEX 1,5mg', dosage: '1 cp/j' },
    { name: 'TAHOR 80mg', dosage: '1 cp le soir' },
    { name: 'PLAVIX 75mg', dosage: '1 cp/j' }
  ]),
  normalize('AVC Hémorragique / Œdème Cérébral', [
    { name: 'PERFALGAN 1G', dosage: '1 perf, 3 fois par jour' },
    { name: 'NIMOTOP 10mg/50ml', dosage: '1mg/H pendant 2H, puis 2mg/H pendant 5 jours (IV)' },
    { name: 'MANNITOL 20%', dosage: '250cc en perfusion continue sur 24h' },
    'Pas de corticoïdes pour AVC'
  ]),
  normalize('Epilepsie (Adulte)', [
    { type: 'header', content: 'Epilepsie généralisée idiopathique (70kg)' },
    { name: 'DEPAKINE chrono 500mg', dosage: '1cp soir (J1-3), 1cp matin+soir (J4-6), 1cp matin+2cp soir' },
    { type: 'header', content: 'Epilepsie partielle (60kg)' },
    { name: 'TEGRETOL LP 400mg', dosage: 'Progression sur 10 jours jusqu\'à 2cp/j' },
    { type: 'header', content: 'Epilepsie chez alcoolique sevré' },
    { name: 'GARDENAL 50mg', dosage: '2 cp le soir' }
  ]),
  normalize('Etat de Mal Convulsif (Urgence)', [
    { type: 'header', content: '1er temps (0-30 min)' },
    { name: 'VALIUM', dosage: '0.2 mg/kg IV' },
    { name: 'Associé à GARDENAL', dosage: '10 mg/kg en IVL' },
    { type: 'header', content: '2ème temps (>30 min)' },
    'Renforcer GARDENAL (bolus 5mg/kg)',
    { type: 'header', content: '3ème temps (>1h)' },
    'Anesthésie générale (Thiopental)'
  ]),
  normalize('Sclérose en Plaques (SEP)', [
    { name: 'SOLUMEDROL 1G', dosage: 'Dans 250cc SG5%, sur 2H', duration: '1 fois par jour pendant 3 jours' },
    { name: 'Relais CORTANCYL', dosage: '60mg/j (3j) puis dégression', duration: '(Si névrite optique)' }
  ]),
  normalize('Maladie de Parkinson', [
    { name: 'TRIVASTAL 20mg', dosage: '1cp/j (3j), puis augmenter de 1cp tous les 3j' },
    { name: 'Ou TRIVASTAL 50mg', dosage: 'en 3 prises' }
  ]),
  normalize('Paralysie Faciale a Frigori', [
    { name: 'CORTANCYL 20mg', dosage: '3cp matin (3j), 2cp (5j), 1cp (5j)', duration: 'Arrêt progressif' },
    { name: 'DIFFU-K 600mg', dosage: '1 gélule/j' },
    { name: 'LARMABAK', dosage: '1 goutte 4 fois par jour + Pansement occlusif nuit' }
  ]),
  normalize('Migraine / Douleur / Vertige', [
    { type: 'header', content: 'Douleur rebelle neuro' },
    { name: 'LAROXYL 40mg/ml', dosage: '10 à 50 gouttes/j', duration: 'Débuter progressivement' },
    { type: 'header', content: 'Crise vertigineuse (Vestibulaire)' },
    { name: 'TANGANIL 500mg', dosage: '1cp, 3 fois par jour' },
    { name: 'PRIMPERAN 10mg', dosage: '1cp, 3 fois par jour' },
    { type: 'header', content: 'Maladie de Menière' },
    { name: 'SERC 8mg', dosage: '2cp 3 fois par jour (15 jours)' }
  ]),
  normalize('Céphalée primaire (Céphalée de tension)', [
    { type: 'header', content: 'Crise de faible intensité' },
    '-DOLIPRANE 1g (paracétamol) : 1g 3/j',
    { type: 'header', content: 'Crise de forte intensité' },
    '-NURODOL 400 mg : 1 comprimé dès le début de la crise (max 3 jours)'
  ]),
  normalize('Névralgie du trijumeau', [
    '-TEGRETOL 200mg cp : 1cp par jour pendant 3j',
    '-Augmenter par 100mg (1/2 cp) chaque 5 j jusqu\'à dose efficace',
    '-Max 2000mg/j (moyenne 800 à 1200mg/j)'
  ]),
  normalize('Myasthénie', [
    '-MYTELASE 10mg (Antimyasthénique) : 1/2cp 2/j',
    '-Puis augmenter de 1/2cp tous les 3 jours jusqu\'à 3cp/j'
  ]),
  normalize('Tremblement essentiel', [
    '-AVLOCARDYL 40mg cp : 80 à 240mg/j'
  ])
];

// 12. PARASITOLOGIE
const parasitoPrescriptions = [
  normalize('Paludisme (Traitement Curatif)', [
    { type: 'header', content: 'Si non résistance à la Chloroquine' },
    "NIVAQUINE 100mg : 10mg/kg à H0, puis 5mg/kg à H6, H24 et H48",
    { type: 'header', content: 'Si résistance (Per os possible)' },
    "MALANIL : 4cp par jour pendant 3 jours",
    "OU COARTEM : 4cp à H0, H8, H24, H36, H48 et H60",
    { type: 'header', content: 'Si résistance (Per os impossible)' },
    "Quinine : 25mg/Kg/J en 3 perfusions par jour"
  ]),
  normalize('Oxyurose', [
    "ZENTEL 400mg cp ou 4% suspension buvable : 1 cp ou 1 cuillère mesure",
    "Refaire une 2ème cure 15 jours après",
    "Traiter tous les membres de la famille"
  ]),
  normalize('Ascardiose', [
    "ZENTEL 400mg cp : 1 cp en une prise",
    "OU COMBANTRIN 125mg cp : 1cp en une prise"
  ]),
  normalize('Giardiose', [
    "FASIGYNE 500mg cp : 4 cp en prise unique",
    "OU FLAGYL 500mg cp : 2 cp par jour pendant 5-7 jours"
  ]),
  normalize('Amibiase', [
    { type: 'header', content: 'Amibiase intestinale' },
    "FASIGYNE 500mg cp : 4cp en prise unique",
    "PUIS INTETRIX 200mg cp : 4 cp par jour pendant 10 jours",
    { type: 'header', content: 'Amibiase viscérale' },
    "FASIGYNE 500mg cp : 4cp en 1 seule prise par jour pendant 3 jours",
    "PUIS INTETRIX 200mg cp : 4 cp par jour pendant 10 jours"
  ]),
  normalize('Teania Tropicale', [
    { type: 'header', content: 'Adulte' },
    "Praziquantel 600mg cp : 2cp en une seule prise",
    { type: 'header', content: 'Enfant' },
    "Praziquantel : 20mg/kg en une seule prise"
  ]),
  normalize('Bilharziose', [
    { type: 'header', content: 'Bilharzioses uro-génitale et intestinale' },
    '-Biltricide® 600mg (praziquantel) : 40 mg/kg en 1 à 2 prises en un seul jour',
    { type: 'header', content: 'Bilharzioses artério-veineuses' },
    '-Biltricide® 600mg (praziquantel) : 60 mg/kg'
  ], { notes: ['Un traitement chirurgical peut être proposé si le traitement médical n\'a pas fait régresser les lésions'] }),
  normalize('Leishmaniose cutanée', [
    { type: 'header', content: 'Traitement local' },
    '-AUREOMYCINE 3% : 1app 3/j',
    '-BÉTADINE jusqu\'à cicatrisation complète',
    { type: 'header', content: 'Si lésions importantes' },
    '-GLUCANTIME (ampoule 1.5g/5ml) : 1inj/semaine (injection en péri-lésionnel à 1cm de la lésion)'
  ]),
  normalize('Leishmaniose viscérale', [
    '-GLUCANTIME injectable IM (ampoule de 5ml contient 1.5g) : 60mg/kg/j sans dépasser 2 ampoules pendant 20j'
  ])
];

// 13. ORL
const orlPrescriptions = [
  normalize('Acouphènes', [
    { type: 'header', content: 'Si retentissement psychique' },
    "VASTAREL 35mg cp : 1 cp matin et soir pendant 2 mois",
    "LEXOMIL 6mg cp : ¼ cp matin ; ½ cp le soir pendant 2 mois"
  ]),
  normalize('Otorrhée (Porteur aérateur)', [
    "Aspiration douce évacuatrice",
    "AUGMENTIN 100mg poudre pour sirop nourrisson : 1 mesure de 15kg, 3 fois par jour",
    "OFLOCET auriculaire : 1 dosette matin et soir"
  ]),
  normalize('Amygdalectomie (Soins post-op)', [
    "AMOXIL 250 mg poudre pour sirop : 2 cuillères mesure, 2 fois par jour pendant 8 jours",
    "DOLIPRANE suppositoire : 1 suppo, 3 fois par jour ou à la demande",
    "CODENFAN sirop (si douleur importante) : 1 dose de 15mg, 3 fois par jour maximum"
  ]),
  normalize('Angines (Bactérienne)', [
    { type: 'header', content: 'Chez l\'adulte' },
    "AMOXIL 1g cp : 1 cp matin et soir pendant 6 jours",
    "OU RULID 150mg cp : 1 cp matin et soir si allergie",
    "DOLIPRANE 1g cp : 1 cp par prise en cas de douleur"
  ]),
  normalize('Bouchon de Cérumen', [
    "Lavage à l'eau tiède à l'aide d'une poire avec un pavillon tracté en haut et en arrière",
    "Extraction",
    "Otoscopie : Vérifier l'intégrité du tympan"
  ]),
  normalize('Corps Étrangers (Nez/Gorge)', [
    { type: 'header', content: 'Nasal' },
    "Extraction simple si CE bien visible",
    "Désinfection rhinopharyngée : SERUM PHYSIO, 3 fois par jour",
    { type: 'header', content: 'Pharyngo-œsophagien' },
    "AUGMENTIN : 2g par jour pendant 4 jours"
  ]),
  normalize('Dyspnée Laryngée / Laryngite', [
    { type: 'header', content: 'Laryngite aigue de l\'enfant' },
    "CELESTENE injectable : (0,1- 0,2mg/kg): 1 ampoule de 4mg en IM ou en IV",
    "Atmosphère humide",
    { type: 'header', content: 'Si amélioration' },
    "CELESTENE 0,5mg/ml gouttes : 40 gouttes matin et midi pendant 4 jours",
    { type: 'header', content: 'Laryngite aigue de l\'adulte' },
    "Repos vocal et arrêt du tabac",
    "AMOXIL 1G cp : 1 cp matin et soir pendant 8 jours",
    "SOLUPRED 20mg orodispersible : 2 à 3 cp le matin pendant 6 jours"
  ]),
  normalize('Epistaxis', [
    "Compression digitale, tête en avant",
    "Si méchage : AMOXIL 1G cp : 1 cp matin et soir",
    "Si tension élevée (>180mmHg) : LOXEN per os avant méchage"
  ]),
  normalize('Otites Externes', [
    "POLYDEXA, bains d'oreilles, 3 fois par jour",
    "EFFERALGAN 500mg (maximum 6 cp par jour)",
    { type: 'header', content: 'Formes très importantes' },
    "Laisser en place une mèche POP-OTOWICK pendant 48H avec POLYDEXA",
    "CIFLOXINE 500mg cp : 1 cp matin et soir pendant 8 jours"
  ]),
  normalize('Otite Moyenne Aiguë', [
    "CELESTENE gouttes : 10 gouttes/kg/j pendant 4-5 jours",
    "AUGMENTIN suspension buvable : 80 mg/kg/j en 3 prises (<2 ans) ou 50mg/kg/j (>2 ans) pendant 8 jours",
    "DOLIPRANE suppositoire si Douleur ou température >38°c (15mg/kg/prise)",
    "Désinfection rhinopharyngée au sérum physiologique"
  ]),
  normalize('Paralysie Faciale Idiopathique', [
    "SOLUPRED 20mg cp : 2 cp matin, 1 cp midi pendant 10 jours puis régression",
    "VASTREL 35mg cp : 1 cp matin et soir",
    "JUVAMINE : 1 cp, 3 fois par jour",
    "Soins oculaires : collyre avec pansement occlusif",
    { type: 'header', content: 'Si zona' },
    "+ ZOVIRAX 200mg cp : 1cp, 5 fois par jour pendant 10 jours"
  ]),
  normalize('Rhinite Aiguë (Adulte)', [
    "ACTIFED cp : 3 cp par jour (avec 1 cp pris le soir) pendant 6 jours",
    "Lavage du nez 3 fois par jour par le sérum physiologique"
  ]),
  normalize('Rhinite Allergique', [
    "XYZALL 5mg cp : 1 cp par jour",
    "RHINOCORT : 2 pulvérisations matin et soir dans chaque narine",
    "Traitement pendant 3 semaines"
  ]),
  normalize('Sinusites', [
    { type: 'header', content: 'Sinusite non compliquée' },
    "AUGMENTIN 1G sachets : 1 sachet matin et soir pendant 10 jours",
    "SOLUPRED 20 mg cp : 3 cp matin pendant 5 jours",
    { type: 'header', content: 'Sinusite frontale, éthmoïdale' },
    "AUGMENTIN 1G + TAVANIC 500mg cp pendant 10 jours"
  ]),
  normalize('Grande crise de vertige', [
    "Repos au lit au calme",
    "TANGANIL 500mg cp : 2 cp par jour",
    "PRIMPERAN 10mg cp : 1 cp, 3 fois par jour",
    "TRANXENE 5mg gélule : 2 gélules par jour"
  ]),
  normalize('Surdité Brusque', [
    "SOLUMEDROL : 1mg/kg/j IM ou SOLUPRED : 1mg/kg/j per os",
    "Repos au calme, Vasodilatateurs ou oxygénateurs"
  ]),
  normalize('Pharyngite', [
    '-ELUDRIL collutoire : 1 pulvérisation 3/j'
  ]),
  normalize('Rhume / Rhinopharyngite', [
    '-HUMEX RHUME : 1cp 3/j',
    '-MAXILASE SIROP : 1 cuillère à soupe 3/j'
  ]),
  normalize('Mal de gorge', [
    '-ELUDRIL collutoire : 1 pulvérisation 3/j'
  ]),
  normalize('Mycoses du conduit auditif externe', [
     '-AURICULARUM solution : 5gtt matin et soir pdt 14J'
  ]),
  normalize('Aphtes', [
    '-Suppression des aliments favorisant les épines irritatives locales (détartrage, soins dentaires)',
    '-ELUDRIL bain de bouche 1app 3/j'
  ])
];

// 14. PHLEBOLOGIE
const phleboPrescriptions = [
  normalize('Insuffisance Veineuse Symptomatique', [
    "Contention par bas ou collants classe 2",
    "Si insuffisance limitée au mollet : mi-bas",
    { text: "GINKOR FORT gélule : 2 gélules par jour" }
  ]),
  normalize('Traitement après chirurgie des varices', [
    "Contention élastique classe 2 (1 mois)",
    "Reprise des activités sportives (après 1 mois)",
    "Terrains à risque : LOVENOX 0,4 ml 1 fois par jour en sous cutané"
  ]),
  normalize('Eczéma Variqueux', [
    "Corticoïdes locaux : DIPROSONE crème",
    "Suintement : EOSINE AQUEUSE 2%",
    "Traitement de la varicose",
    "Contention par BIFLEX"
  ]),
  normalize('Hypodermite Aigue', [
    "IBUPHIL 400 mg : 2-3 fois par jour",
    "PRAZOL 20mg gélule : 1 gélule le soir avant repas",
    "BIFLEX (bande élastique)"
  ]),
  normalize('Lymphangite', [
    "AUGMENTIN 1G : 2g par jour en 2 prises (10 jours)",
    "OU ZECLAR 500mg 2 fois par jour si intolérance",
    "CORTANCYL : 0,5 mg/kg/j le matin (4 jours)"
  ]),
  normalize('Thrombose Veineuse Profonde', [
    "LOVENOX : 100 UI/kg en 2 injections par jour",
    "OU INNOHEP 175 UI/kg en une seule injection par jour",
    "PUIS PREVISCAN cp : 1 cp par jour le soir pendant 3 jours puis adapter à l’INR",
    "Bas ou collant de contention classe 2 (3 mois)"
  ]),
  normalize('Varices (Traitement médical)', [
    '-VENULA 200mg (Vasculoprotecteurs) : 1cp 3/j pdt 3 mois',
    '-VENOXYL GEL : 1app/j le soir',
    '-Bas de contention + diminuer le poids + marche + coucher avec jambes pendantes'
  ])
];

// 15. PEDIATRIE
const pediatriePrescriptions = [
  normalize('Croûtes de lait', [
    "Huile d’amende sur le cuir chevelu toute la nuit",
    "Décoller le matin avec un coton tige",
    "OU Vaseline 1% la veille et décapage le lendemain par SEPTIVON 0,5%"
  ]),
  normalize('Erythème fessier', [
    "Prévenir par un écran : pommade grasse MITOSYL notamment la nuit",
    "Traiter par EOSINE PHARMA 2G avec des fesses à l’air le plus longtemps possible",
    "+ MITOSYL pommade ou BEPANTHEN pommade"
  ]),
  normalize('Muguet du bébé', [
    "FUNGIZONE 10% suspension buvable : en bain de bouche, 3 fois par jour"
  ]),
  normalize('Crise d’acétone', [
    "Apporter du sucre : Boissons froides sucrées, en petites quantités répétées",
    "Eviter la déshydratation : BIOSEL 1 sachet dans 200 ml d’eau, à volonté",
    "Vomissements : MOTILIUM 1 dose/Poids, 3 fois par jour"
  ]),
  normalize('Angine à Streptocoque A', [
    "AMOXIL : 50mg/kg/j en 2-3 prises pendant 6 jours",
    "OU ALFATIL : 50mg/kg/j en 3 prises (4 jours)",
    "OU ORELOX : 1 dose/Poids, 2 fois par jour pendant 5 jours"
  ]),
  normalize('Asthme : Crise Légère', [
    "VENTOLINE : 1 Bouffée/ 2 kg (Min 4 à max 15) ou BRICANYL TURBUHALER",
    "Si amélioration : VENTOLINE 2 B/4H pendant 24H puis 2 B/6H pendant 3 jours"
  ]),
  normalize('Asthme : Crise Modérée à Sévère', [
    "VENTOLINE 10 B (chambre d’inhalation) chaque 20 min pendant 1 H",
    "Ou Nébulisation (1cc VENTOLINE + 3cc sérum salé 0,9% dans 6-8L d’O2)",
    "+ CORTANCYL 1-2 mg/kg/j en 2 prises matin et soir pendant 5 jours"
  ]),
  normalize('Asthme : Traitement de Fond', [
    { type: 'header', content: 'Enfant < 5 ans' },
    "FLIXOTIDE 50µg : 2B, 2 fois par jour au babyhaler (si 1-4 ans)",
    "FLIXOTIDE diskus 100µg : 1 inhalation, 2 fois par jour (si > 4 ans)",
    "Alternative : SINGULAIR 4mg (6m-5a) / 5mg (6-14a) / 10mg (>14a)"
  ]),
  normalize('Bronchiolite du Nourrisson', [
    "Désobstruction rhinopharyngée au sérum physiologique avant biberon",
    "Fractionner les repas, les épaissir + hydratation suffisante",
    "Position proclive 30°",
    "Kinésithérapie respiratoire pour drainage bronchique",
    "Antibiotiques si suspicion surinfection : AUGMENTIN ou ORELOX"
  ]),
  normalize('Coliques du Nourrisson', [
    "Masser le ventre, coucher à plat ventre sur le bras",
    "Douleur : DOLIPRANE 60mg/kg/J",
    "POLUSILANE gel oral : 1-2 cm/biberon",
    "DEBRIDAT : 1 dose/Poids, 3-4 fois par jour après repas"
  ]),
  normalize('Constipation du Nourrisson', [
    "Eau minérale : 1-2 biberons par jour",
    "Si échec : NOVALAC transit",
    "Si échec : LANSOYL (cuillère à café dans biberon le soir)",
    "Si échec : FORLAX 4g (1 sachet par jour)",
    "Si échec : suppositoire de glycérine"
  ]),
  normalize('Diarrhées et Déshydratation', [
    "Arrêt de l’alimentation habituelle",
    "BIOSEL (SRO) : 1 sachet dans 200 ml d’eau minérale",
    "Boire 30 ml/15 min au début puis augmenter",
    "Objectif : Boire 100 ml les 4 premières heures puis 150-200 ml/kg/24H"
  ]),
  normalize('Reflux Gastro-Œsophagien', [
    "Nourrisson < 3 mois : Coucher décubitus dorsal, tête relevé de 30°",
    "Lait épaissi ou Lait AR",
    "MOTILIUM : 1 dose/Poids, 3 fois par jour avant repas",
    "Si œsophagite : + GAVISCON suspension buvable",
    "Si érosive : + ULCEMAT"
  ]),
  normalize('Oreillons', [
    '-DOLIPRANE 15mg/kg/6h',
    '-Repos'
  ]),
  normalize('Varicelle (Symptomatique)', [
    '-PRIMALAN sirop (antihistaminique) : 1cam/5kg 2/j',
    '-DOLIPRANE : 15mg/kg/6h',
    '-HEXOMEDINE (antiseptique) : 1app 2/j'
  ]),
  normalize('Mycose du siège', [
    '-FUNGILYSE CREME : 1app 2/j pdt 15j',
    '-SAFORELLE SAVON : lavage 2/j pdt 15j',
    '-Eviter les lingettes parfumées'
  ]),
  normalize('Rougeole', [
    '-DOLIPRANE 15mg/kg/6h',
    '-STERIMAR (Sérum physiologique) : 1 lavage 4/j',
    '-Eviction scolaire'
  ]),
  normalize('Scarlatine', [
    '-ERY 50mg/kg/j en 3 prises pdt 10j',
    '-DOLIPRANE 15mg/kg/6h'
  ])
];

// 16. PSYCHIATRIE
const psychiatriePrescriptions = [
  normalize('Sevrage alcoolique', [
    "- VALIUM 10mg cp : 1 cp par 6H pendant 3 jours",
    "Puis dégression progressive jusqu'à arrêt en 7 jours",
    "- OU SERESTA 50mg cp : 1 cp matin, midi et soir",
    "Puis dégression progressive jusqu'à arrêt en 6 jours",
    "+ Apport hydrique",
    "+ AVT 500mg cp : 1 cp par jour (Thiamine)",
    "- Soutien psychothérapeutique"
  ]),
  normalize('Polynévrite alcoolique', [
    { type: 'header', content: 'Attaque' },
    "- AVT 200 mg suppositoire : matin, midi et soir",
    "+ MAGNE B : 1 ampoule buvable, 3 fois par jour",
    { type: 'header', content: 'Entretien' },
    "- AVT 500mg cp : 1cp par jour",
    "+ UVIMAG B6 500mg : 1cp par jour"
  ]),
  normalize('Anxiété généralisée', [
    "- EFFEXOR LP 37,5mg gélule : 2 gélules le matin pendant 2 semaines, puis adapter la posologie (max = 225mg par jour)",
    "- OU DEROXAT 20mg cp : Commencer par 1cp par jour pendant 3 semaines, puis augmenter la dose par paliers de 10mg",
    "Durée du traitement : 12 mois",
    "- Associer un anxiolytique au début du traitement : ALPRAZ 0,5mg cp (Schéma dégressif sur 4 semaines)"
  ]),
  normalize('Crise d’angoisse aiguë', [
    "- XANAX 0,5mg cp : 2 cp renouvelables 3 fois en 12H",
    { type: 'header', content: 'Si forte intensité' },
    "- VALIUM 10mg injectable : 1-2 ampoules en IM ou en IVL",
    "OU TRANXENE : 1 ampoule de 50mg en IM ou en IV"
  ]),
  normalize('Prévention des attaques de panique', [
    "- DEROXAT 20mg cp : 40mg par jour (max 60mg)",
    "- OU ANAFRANIL 25mg : 2-6 cp par jour en 3 prises. Instauration progressive",
    "+ XANAX 0,5 mg (sevrage progressif sur 4 semaines)"
  ]),
  normalize('État dépressif (1ère intention)', [
    "- DEROXAT 20mg cp : 1cp par jour le matin (max 60mg)",
    "- OU CYMBALTA 60mg gélule : 1 gélule par jour (max 2 gélules)",
    "- OU EFFEXOR LP 37,5mg : 2cp par jour en 2 prises pendant 15 jours, puis augmenter",
    "Si bonne réponse : Traitement pendant 6 mois à 1 an",
    "+ XANAX 0,5 mg cp (schéma dégressif sur 4 semaines)"
  ]),
  normalize('Dépression sévère (Hospitalisation)', [
    "- ANAFRANIL 25mg injectable : 75mg dans 500 cc de SG 5% (1h) le J1, 100mg J2, 125mg J3, puis 150mg/j",
    "+ Surveillance anti-suicidaire",
    "- Si sédation nécessaire : NOZINAN 100mg cp : 1cp par jour"
  ]),
  normalize('Ivresse pathologique', [
    "- LARGACTIL : 1 ampoule de 25mg en IM",
    "+/- contention en position allongée"
  ]),
  normalize('Manie', [
    { type: 'header', content: 'Attaque (Hospitalisation)' },
    "- HALDOL : 2 ampoules de 5mg en IM, 2 fois par jour pendant une semaine",
    "OU LARGACTIL : 1 ampoule de 25mg",
    { type: 'header', content: 'Initiation' },
    "- DEPAKINE CHRONO 500mg : 1cp matin, midi et soir",
    "OU ZYPREXA 10mg cp : 2 cp par jour (prise unique)",
    "- LARGACTIL 100mg cp : 1cp, 3 fois par jour"
  ]),
  normalize('Bouffée délirante aiguë', [
    "- RISPERDAL 4mg cp : 1cp le matin (ou 4mg matin et soir si attaque)",
    "OU ZYPREXA 10mg cp : 2cp en prise unique",
    "ET LARGACTIL 100mg cp : 1cp, 3 fois par jour",
    { type: 'header', content: 'Si agitation importante' },
    "- NOZINAN 25mg : 2 ampoules en IM matin et soir"
  ]),
  normalize('Schizophrénie paranoïde', [
    "- RISPERDAL 4mg cp : 1cp par jour (max 8mg)",
    "- OU ZYPREXA 10mg cp : 1cp le matin",
    "- OU ABILIFY 15mg cp : 1cp par jour"
  ]),
  normalize('Sevrage aux opiacés', [
    "- En milieu hospitalier",
    "- DOLIPRANE 1G : 1cp 4x/j OU VISCERALGINE 50mg (2-6 cp/j)",
    "- SPASFON 80mg : 2cp 4x/j",
    "- LARGACTIL 100mg : 1cp 3x/j",
    "- CATAPRESSAN cp : ½ cp toutes les 2-4H (si TAS > 90 et pouls > 50)"
  ]),
  normalize('Insomnie', [
    "- STILNOX 10mg cp : 1cp le soir au coucher pendant 3-4 semaines"
  ]),
  normalize('Troubles obsessionnels compulsifs', [
    "- SERDEP 20mg gélule : 20 à 60mg par jour",
    "OU ANAFRANIL 75mg : ½ cp J1, 1cp J2... jusqu'à 1cp-1cp (150mg)",
    "Durée : 1 à 2 ans",
    "+ ALPRAZ ou XANAX au début"
  ]),
  normalize('Crise hystérique', [
    '-Au moment de la crise : ISOLEMENT +++',
    '-Eviter de donner les TTT par VV: Essayez de NE RIEN DONNER, calmer le malade puis donner l\'ordonnance de sortie',
    '-OXYMAG: 1cp le soir pdt 8jrs'
  ]),
  normalize('Attaque de panique (Urgence)', [
    '-Xanax 0,5 mg cp: 2cp 3/12h',
    '-Eliminer une organicité : AVC, épilepsie, hypoglycémie, embolie pulmonaire, IDM, crise d\'asthme, sevrage, prise de toxique'
  ])
];

// 17. PNEUMOLOGIE
const pneumoPrescriptions = [
  normalize('Pneumothorax', [
    { type: 'header', content: 'Mauvaise tolérance (Suffocant)' },
    "- Oxygène 10-15 l/mn masque haute concentration",
    "- Décompression immédiate à l'aiguille (2ème EIC ligne médio-claviculaire)",
    "- Remplissage SS 0,9% (500ml)",
    { type: 'header', content: 'Bonne tolérance (<15%)' },
    "- Repos +++",
    "- Paracétamol ± codéine",
    "- Radio à la 24ème heure"
  ]),
  normalize('Crise d’asthme légère', [
    "- VENTOLINE Inhalation : 4 Bouffées à renouveler 3 fois pendant 1h.",
    "Si amélioration : 2 B/4H (24h) puis 2 B/6H (3j)",
    "Si échec : Voir crise modérée"
  ]),
  normalize('Asthme (Épisode modéré à sévère)', [
    "- VENTOLINE 10 B ch. inhal. / 20 min (1h)",
    "OU Nébulisation (1cc VENTOLINE + ATROVENT 0,5 + 3cc SS)",
    "+ CORTANCYL 60 mg per os ou SOLUMEDROL 40mg IVL",
    "Si amélioration : 4 B/30-60 min puis relais",
    "+ CORTANCYL 0,5 mg/kg/J pendant 10 jours"
  ]),
  normalize('Traitement de fond Asthme', [
    "Intermittent : VENTOLINE 2B demande",
    "Léger : CORTIVENT 250µ (4B/J) + VENTOLINE demande",
    "Modéré : CORTIVENT 250µ (4B/J) + SEREVENT 25µ (2B*2/J)",
    "Sévère : Corticothérapie orale + CORTIVENT + SEREVENT"
  ]),
  normalize('Bronchite obstructive', [
    "- Hydratation 1,5L/J",
    "- Kiné respi",
    "- VENTOLINE : 2B 4x/j",
    "- ATROVENT : 2B 4x/j",
    "- COTRIVENT 250µ : 2B 3-4x/j"
  ]),
  normalize('Bronchite surinfectée', [
    "- AMOXIL 1G, 3x/j (8-10j)",
    "Si échec 48H : AUGMENTIN 1G 3x/j OU TAVANIC 500mg",
    "+ Kiné + Hydratation + Bronchodilatateurs"
  ]),
  normalize('BPCO Exacerbations', [
    "- Repos",
    "- O2 prudente (0,5-2 L/min, obj > 90%)",
    "- VNI si besoin",
    "- VENTOLINE nébulisation (5mg / 4ml)",
    "- Corticothérapie : SOLU-MEDROL IV relais CORTANCYL 40mg/j (10j)",
    "- Antibiotiques si expectoration purulente (AUGMENTIN 4cp/j)"
  ]),
  normalize('Pneumopathie bactérienne sans gravité', [
    "- AMOXIL : 1G, 3 fois par jour pendant 8 jours",
    "Si allergie : PYOSTACINE 500mg (2cp 3x/j)"
  ]),
  normalize('Pneumopathie Atypique', [
    "- RULID 150mg cp : 1cp 2x/j",
    "OU JOSACINE 1G : 1cp 3x/j",
    "Durée : 10 jours (Légionelle 3 sem)"
  ]),
  normalize('Hémoptysies', [
    { type: 'header', content: 'Faible abondance' },
    "- EXACYL 1G : 4 ampoules buvables par jour",
    { type: 'header', content: 'Moyenne abondance' },
    "- EXACYL 0,5 G/5ml injectable : 1 ampoule 3x/J en IVL",
    { type: 'header', content: 'Abondante' },
    "- Hospitalisation",
    "- GLYPRESSINE 2mg en IVL"
  ]),
  normalize('Toux', [
    { type: 'header', content: 'Toux sèche gênante' },
    '-DRILL TOUX SÉCHE SIROP : 1 cas 3/j',
    { type: 'header', content: 'Toux productive' },
    '-MUXOL SIROP : 1 cas 3/j'
  ]),
  normalize('Tuberculose pulmonaire', [
    { type: 'header', content: 'Protocoles disponibles' },
    '-(RH) : Rifampicine 150 mg + Isoniazide 75mg',
    '-(RHZ) : Rifampicine 150 mg + Isoniazide 75 mg + Pyrazinamide 400 mg',
    '-(RHZE) : Rifampicine 150 mg + Isoniazide 75 mg + Pyrazinamide 400 mg + Ethambutol 275 mg',
    { type: 'header', content: 'Posologie (Prise unique à jeun)' },
    '30-37 kg : 2 cp',
    '38-54 kg : 3 cp',
    '>55 kg : 4 cp',
    { type: 'header', content: 'Exemple (Patient 50kg - TB pleuro-pulmonaire)' },
    '-ERIP-K4 (RHZE): 3cp le matin en 1 seul prise à jeun pdt 2mois',
    'PUIS',
    '-RIFINAH (RH): 3cp le matin en 1 seul prise à jeun pdt 4mois'
  ])
];

// 18. RHUMATOLOGIE
const rhumatoPrescriptions = [
  normalize('Les Antalgiques', [
    { type: 'header', content: 'Non opioïdes' },
    { drug: 'DOLIPRANE', dosage: '1G, 4 fois par jour' },
    { drug: 'PROFENID (AINS)', dosage: '100 mg/12 h IV ou PO' },
    { drug: 'ACUPAN', dosage: '20 mg/6 h SC' },
    { type: 'header', content: 'Opioïdes faibles' },
    { drug: 'NO-DOL CODEINE', dosage: '2cp, 3 fois par jour' },
    { drug: 'TRAMAL (Tramadol seul)', dosage: '50mg : 2 gélules, 3 fois par jour' }
  ]),
  normalize('Douleurs Neurologiques', [
    { drug: 'KLONOPIN 2mg', dosage: '¼ cp le matin et ½ cp le soir' },
    { drug: 'LAROXYL 25mg', dosage: '1 cp le soir' },
    { drug: 'LYRICA 75mg', dosage: '1 gel le matin et le soir pendant 1 semaine, puis adapter (max 600mg/j)' }
  ]),
  normalize('Sciatique / Polyarthrite rhumatoïde', [
    { drug: 'VOLTARENE 50mg', dosage: 'Matin, midi et soir' },
    { drug: 'PROTECTION GASTRIQUE', dosage: 'AINS + Oméprazole 20mg par jour' },
    { drug: 'ARTOTEC', dosage: '1cp, 3 fois par jour (Diclofénac + misoprostol)' }
  ]),
  normalize('Corticothérapie', [
    { drug: 'CORTANCYL 20mg', dosage: '1cp matin et soir (5 jours) puis 1cp matin (3 jours) puis arrêt' },
    { drug: 'DIFFU-K 600mg', dosage: '2 gélules par jour pendant 8 jours' },
    { drug: 'POTASSIUM Sirop', dosage: '3 cuillères à café par jour' }
  ]),
  normalize('Traitement de la Goutte', [
    { type: 'header', content: 'Crise aigue' },
    { drug: 'COLCHICINE OPACALCIUM 1mg', dosage: '1cp x 3/J (J1), 1cp matin/soir (J2), puis 1cp/J (10 jours)' },
    { type: 'header', content: 'Traitement de fond' },
    { drug: 'ZYLORIC 100mg', dosage: '1 cp par jour, à débuter 3 semaines après la crise' },
    { drug: 'COLCHICINE OPACALCIUM', dosage: '1mg par jour pendant 3 mois en association avec Zyloric' }
  ]),
  normalize('Arthrose (Poussée congestive)', [
    { drug: 'VOLTARENE 50 mg', dosage: '1cp, 3 fois par jour' },
    { drug: 'CELEBREX 200mg', dosage: 'Matin et soir (Alternative)' },
    { drug: 'DOLIPRANE 1G', dosage: '4 fois par jour' }
  ]),
  normalize('Ostéoporose', [
    { drug: 'CACIT 500mg', dosage: '1-2 cp par jour' },
    { drug: 'ACTONEL 5mg', dosage: '1 cp par jour (ou 35mg 1/semaine)' },
    { drug: 'FOSAMAX 70mg', dosage: '1 cp par semaine, à jeun' }
  ]),
  normalize('Cervicalgies', [
    '-MYOXOL : 2cp 2/j pdt 7j',
    '-PROFENID 100mg (AINS) : 1cp 2/j',
    '-PROTON 20mg (Oméprazole) : 1 cp/j matin pdt 10j'
  ]),
  normalize('Rachialgie (Sans signe d\'alarme)', [
    '-DOLIPRANE : 1cp 3/j pdt 10j',
    '-CELEBREX 200mg : 1cp 2/j pdt 10j',
    '-KALEST 20mg : 1cp le matin à jeun 7j'
  ]),
  normalize('Maladie de Horton', [
    '-Cortancyl: 0.7-1mg/kg/j',
    '-Anti-agrégant plaquettaire jusqu\'à normalisation du fibrinogène'
  ]),
  normalize('Névralgie cervico-brachiale', [
    '-COLTRAMYL : 2CP 2/J PDT 7J (Myorelaxants)',
    '-PROFENID 100mg (AINS) : 1cp 2/j',
    '-KALEST 20mg (Oméprazole) : 1cp/j matin pdt 10j'
  ]),
  normalize('Tendinopathies', [
    '-Repos 45j',
    '-Attelle d\'immobilisation',
    '-Doliprane: 3g 4/j',
    '-AINS topique: Ketum 2.5% 3 app/j',
    '-Rééducation',
    '-Infiltrations cortisoniques'
  ]),
  normalize('Algodystrophie', [
    { type: 'header', content: 'Phase chaude' },
    '-Doliprane: 1g 4/j',
    '-Cibacalcine 0.5mg en inj s/c au coucher pdt 10j',
    '-Primperan 10mg: 20mn av inj de cibacalcine',
    '-Atarax 25mg :20min av inj de cibacalcine',
    '-Si efficacité poursuivre 2-3 injection pdt 3 semaines',
    { type: 'header', content: 'Phase froide (12-18 mois)' },
    '-Doliprane: 1g 4/j',
    '-Mobilisation douce avec massage antalgique: 1-5 séances par semaine'
  ]),
  normalize('Arthrite septique', [
    '-Bilan infectieux, démarrer le ttt sans attendre les résultats',
    '-AUGMENTIN en IV 1g/8h relais par voie orale après apyrexie (6 semaines)',
    '-GENTAMYCINE 160mg 1inj IM/j pst 3j',
    '-Drainage chirurgical',
    '-Mise en décharge de l\'articulation + lovenox 0.4cc/j',
    '-PERFALGAN 1g/8h'
  ]),
  normalize('Torticolis', [
    '-MYOXOL : 2cp 2/j pdt 7j',
    '-PROFENID 100mg (AINS) : 1cp 2/j',
    '-PROTON 20mg (Oméprazole) : 1cp/j matin pdt 10j'
  ])
];

// 19. REANIMATION
const reaPrescriptions = [
  normalize('Arrêt Cardio-Respiratoire (ACR)', [
    { drug: 'ADRENALINE', dosage: '1mg IV toutes les 3 à 5 min (Rythme non choquable)' },
    { drug: 'CORDARONE', dosage: '300 mg IV (si FV/TV réfractaire après 3e CEE)' },
    { drug: 'ATROPINE', dosage: '1mg IVD (Asystolie/AESP)' },
    'MCE 30/2. Chocs électriques si FV/TV sans pouls (360J monophasique).'
  ]),
  normalize('Coma Non Traumatique', [
    { drug: 'NARCAN (Naloxone)', dosage: 'Antidote opiacés (si suspicion)' },
    { drug: 'ANEXATE (Flumazénil)', dosage: 'Antidote Benzodiazépines (si suspicion)' },
    { drug: 'GLUCOSE', dosage: 'Si Hypoglycémie (DEXTRO +++)' }
  ]),
  normalize('Choc Anaphylactique', [
    { drug: 'ADRENALINE', dosage: '0,5 à 1 mg SC ou IV (titrée)' },
    { drug: 'Remplissage', dosage: 'Cristalloïdes ou Colloïdes' }
  ]),
  normalize('Intoxication aux Opiacés', [
    { drug: 'NALOXONE (Narcan)', dosage: 'Bolus de 0,4 mg (1 Amp) IV répété 3 x /5 min' }
  ]),
  normalize('Hyperkaliémie sévère', [
    { drug: 'GLUCONATE DE CALCIUM', dosage: '1 amp de 1g en IVL' },
    { drug: 'BICAR 14 ‰', dosage: '500 ml à perfuser en 1h' },
    { drug: 'ACTRAPID + G30%', dosage: '30 UI dans 200 ml SG 30% en 1h' },
    { drug: 'KAYEXALATE', dosage: '20 à 60 g' },
    { drug: 'LASILIX', dosage: 'Diurétiques si possible' }
  ]),
  normalize('Brûlures Cutanées', [
    { drug: 'CODOLIPRANE 400mg', dosage: '1cp, 3 fois par jour' },
    { drug: 'BIAFINE', dosage: '4 applications/jour + pansement (1er degré)' },
    { drug: 'FLAMMAZINE 0,01%', dosage: 'Crème, à renouveler tous les 3j (2ème degré)' }
  ])
];

// 20. UROLOGIE
const urologiePrescriptions = [
  normalize('Incontinence Urinaire (Femme)', [
    { name: 'Rééducation périnéo-sphinctérienne', dosage: '15 séances' },
    { name: 'COLPOTROPHINE', dosage: '1 ovule le soir 1 jour sur 2' },
    { name: 'DITROPAN 5mg', dosage: '½ cp, 3 fois par jour (Si instabilité vésicale)' }
  ]),
  normalize('Colique Néphrétique', [
    { name: 'SPASFON injectable', dosage: '2 ampoules, 2 fois par jour' },
    { name: 'PROFENID 100mg injectable', dosage: 'Dans 200cc SS 0,9% sur 20min, 3x/j pdt 2 jours' },
    { name: 'PROFENID LP', dosage: 'Relais: 1cp par jour au repas' },
    { name: 'CODOLIPRANE', dosage: '1cp, 4 fois par jour' },
    { name: 'TAMSULOSINE 0,4mg', dosage: '1 gélule par jour (Si douleur non calmée)' }
  ]),
  normalize('Cystite Aiguë de la Femme', [
    { name: 'NOROXINE 400mg', dosage: '1cp, 2 fois par jour (3 jours)' },
    { name: 'ou BACTRIM FORTE', dosage: '3cp en prise unique' },
    { name: 'MONURIL ADULTE 3G', dosage: '1 sachet unique le soir' }
  ]),
  normalize('Cystite Récidivante', [
    { name: 'NOROXINE', dosage: 'Même dose curative (7-10 jours)' },
    { name: 'NOROXINE 400mg (Prophylaxie)', dosage: '1cp les lundis, mercredis, vendredis au coucher (6-12 mois)' }
  ]),
  normalize('Hypertrophie Bénigne Prostate (HBP)', [
    { name: 'TAMSULOSINE LP', dosage: '1cp par jour' },
    { name: 'ou UMAX 400µ', dosage: '1 gélule par jour' },
    { name: 'PERMIXON 160mg', dosage: '1 gélule matin et soir' }
  ]),
  normalize('Orchiépididimite', [
    { name: 'Suspension testiculaire', dosage: '' },
    { name: 'TAVANIC 500mg', dosage: '1cp par jour (21 jours)' },
    { name: 'Bi-PROFENID 150mg', dosage: '1cp matin et soir (4 jours)' }
  ]),
  normalize('Dysfonction Érectile', [
    { name: 'VIAGRA (25/50/100mg)', dosage: 'Commencer par 50mg, 1H avant rapport' },
    { name: 'ou LEVITRA (5/10/20mg)', dosage: '1cp, 1H avant rapport' },
    { name: 'ou CIALIS (10/20mg)', dosage: '1cp, 2H avant rapport' }
  ]),
  normalize('Prostatite bactérienne aiguë simple', [
    { type: 'header', content: 'Prise en charge ambulatoire' },
    '-Faire un ECBU sans en attendre les résultats',
    '-CIPROXINE 500 mg : 1cp 2/j pendant 2 à 4 semaines'
  ]),
  normalize('Balanite', [
    { type: 'header', content: 'MHD' },
    '-Hygiène intime, éviter des sous vêtements trop serrés, bien sécher après douche',
    { type: 'header', content: 'Traitement' },
    '-PEVARYL crème: 1app X2/j jusqu\'à disparition complète des lésions'
  ]),
  normalize('Infection Urinaire (Protocoles récents)', [
    { type: 'header', content: 'Cystite simple' },
    'En 1ère intention : MONURIL ADULTE (Fosfomycine) 1 sachet en dose unique',
    'En 2ème intention : SELEXID 200mg (Pivmécillinam) 1cp 2/j pdt 5j',
    'En 3ème intention : MEGAFLOX 500mg (Ciprofloxacine) 1cp 2/j pdt 3j',
    { type: 'header', content: 'Cystite à risque de complication' },
    { type: 'note', content: 'Différer l\'antibiothérapie si possible pour adapter à l\'antibiogramme' },
    'En 1ère intention : FURAZIDE 50mg (Nitrofurantoïne) 2cp 3/j pdt 5j',
    'En 2ème intention : MEGAFLOX 500mg (Ciprofloxacine) 1cp 2/j pdt 7j',
    { type: 'header', content: 'Pyélonéphrite sans signe de gravité' },
    { type: 'note', content: 'Différer l\'antibiothérapie si possible pour adapter à l\'antibiogramme' },
    '-OFLOCET 200mg (Ofloxacine) : 1cp 2/j pdt 10j',
    '-DOLIPRANE 1g (Paracétamol) : 1cp 3/j',
    '-Hospitalisation si critères de gravité'
  ])
];

// 21. TRAUMATOLOGIE
const traumatoPrescriptions = [
  normalize('Consignes Plâtre', [
    "1. Respecter le temps de séchage (24 à 48h) avant effort.",
    "2. Ne pas mouiller ou immerger.",
    "3. Ne pas introduire de corps étranger (aiguilles à tricoter...).",
    "4. Ne pas vernir le plâtre.",
    "5. Surélever le membre les premiers jours (oedème).",
    "6. Effectuer des contractions isométriques et mobiliser les articulations libres (prévention thromboembolique).",
    "7. Consulter au moindre signe anormal (douleur, paresthésie, changement couleur)."
  ]),
  normalize('Sutures', [
    { type: 'header', content: 'PLAIES DU CUIR CHEVELU' },
    "- Fil non résorbable gros calibre (1/0 ou 2/0).",
    "- Points de Blair-Donati + Pansement compressif.",
    { type: 'header', content: 'PLAIES DU VISAGE' },
    "- Simples : Stéristrip ou Fil fin (5/0 ou 6/0).",
    "- Front : Surjet intradermique.",
    "- Lèvres : Vicryl 4/0 (profond), Fil non résorbable (superficiel). Bien affronter la ligne rouge.",
    { type: 'header', content: 'ABLATION DES FILS' },
    "- Visage : 3 à 6 jours",
    "- Cuir chevelu : 7 à 10 jours",
    "- Membres : 10 à 15 jours"
  ]),
  normalize('Traumatisme du Coude', [
    "1. Fracture déplacée ? -> Oui -> Traitement chirurgical.",
    "2. Fracture non déplacée ? -> Oui -> BAB (Brachio-Anté-Brachial) 30 jours + AI + AA.",
    "3. Pas de fracture ? -> Chercher Luxation.",
    "- Oui -> Réduction (Coude stable) -> BAB 21 jours.",
    "- Non -> Entorse du coude -> Écharpe 30 jours + AI + AA."
  ]),
  normalize('Traumatisme du Genou', [
    "1. Fracture (Tibiale/Fémorale/Rotule) ? -> Oui -> Chirurgie ou Hospitalisation.",
    "2. Pas de fracture :",
    "- Genou douloureux et examen difficile +/- signes gravité ? -> Glaçage + Attelle + HBPM + Contrôle J7.",
    "- Pas de signe de gravité mais épanchement ? -> Ponction évacuatrice si tension."
  ]),
  normalize('Entorse de Cheville', [
    "BREF (Bandage, Repos, Élévation, Froid).",
    "Entorse grave -> Botte plâtrée J3 pdt 21j + HBPM.",
    "Entorse bénigne -> Strapping 15j + Appui progressif + Glaçage + AINS."
  ]),
  normalize('Soins des Escarres', [
    { name: 'Chlorure de sodium 0,9%', dosage: 'Évacuer débris nécrotiques, appliquer compresse imbibée' },
    { name: 'Pansement BIATAIN ESCARRE', dosage: '17,5 x 17,5' },
    { name: 'PROPOFAN', dosage: '1 à 2 cp, 6H avant soins (Douleur)' },
    { name: 'CUBITAN Bouteille', dosage: '1 bouteille matin et soir (Si dénutrition)' }
  ])
];

// 22. CERTIFICATS
const certificatsPrescriptions = [
  normalize('Certificat d\'Arrêt de Travail', [
    "Je soussigné, Docteur en médecine, certifie avoir examiné ce jour M/Mme [NOM] [PRENOM], né(e) le [DATE NAISSANCE].",
    "Je déclare que son état de santé nécessite un arrêt de travail de [NB] jours.",
    "À compter du [DATE DEBUT] avec reprise le [DATE FIN] sauf complications.",
    "Certificat établi à la demande de l’intéressé et remis en main propre pour servir et faire valoir ce que de droit.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Certificat de Reprise du Travail', [
    "Je soussigné, Docteur en médecine, certifie que l'état de santé de M/Mme [NOM] [PRENOM] demeurant [ADRESSE] lui permet de reprendre son travail à la date du [DATE DE REPRISE].",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Certificat de Présomption de Grossesse', [
    "Je soussigné, Docteur en médecine, certifie que Madame [NOM] [PRENOM] demeurant [ADRESSE] présente des signes de présomption de grossesse.",
    "La date présumée du début de celle-ci se situe aux environs du [DATE].",
    "Remise en main propre, à la demande de l’intéressée, pour lui valoir ce que de droit.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Certificat de Grossesse (Évolutive)', [
    "Je soussigné, Docteur en médecine, déclare, après avoir examiné Madame [NOM] [PRENOM] demeurant [ADRESSE].",
    "Que celle-ci présente les signes d'une grossesse évolutive dont le terme est prévu le [DATE TERME].",
    "Ce certificat est établi à la demande de l'intéressée et remis en main propre.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Certificat de Naissance', [
    "Le [DATE] à [LIEU] à [HEURE] est né(e), rue [ADRESSE], n°[NUMERO], du sexe [SEXE], prénommé(e) [PRENOM].",
    "Fils (ou fille) de [PERE] né à [LIEU] le [DATE] (profession) et de [MERE] née à [LIEU] le [DATE] (profession), son épouse, domiciliés à [ADRESSE].",
    "(Si père décédé : ajouter le lieu et la date du décès à la place de la profession)."
  ]),
  normalize('Certificat de Bonne Santé', [
    "Je soussigné, Docteur en médecine, certifie après avoir examiné ce jour M/Mme [NOM] [PRENOM].",
    "Celui-ci ne présente aucun signe d'affection cliniquement décelable ; il semble, ce jour, en bonne santé.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Retour en Classe (Après maladie contagieuse)', [
    "Je soussigné, Docteur en médecine, certifie que M/Mme [NOM] [PRENOM] né(e) le [DATE NAISSANCE] a présenté du [DATE DEBUT] au [DATE FIN] une [NOM MALADIE].",
    "Son état de santé actuel ne me paraît pas présenter de danger pour lui-même, ni, pour les personnes qui l'approcheraient, de risques de contagion.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Admission Scolaire', [
    "Je soussigné, Docteur en médecine, certifie avoir examiné le [DATE], l'enfant [NOM] [PRENOM] né(e) le [DATE NAISSANCE].",
    "Qui ne paraît atteint(e) d'aucun signe de maladies transmissibles, ni d'aucune affection susceptible de contre-indiquer son admission à [NOM ETABLISSEMENT].",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Non-Contagion (Colonie de vacances)', [
    "Je soussigné, Docteur en médecine, certifie après avoir examiné ce jour l'enfant [NOM] [PRENOM] né(e) le [DATE].",
    "N'avoir constaté aucun signe de maladie transmissible actuellement décelable ni d'affection cutanée pouvant présenter un danger de contamination.",
    "L'enfant ne paraît pas porteur d'une parasitose.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Exemption de Sport (Scolaire)', [
    "Je soussigné, Docteur en médecine, certifie après avoir examiné l'enfant [NOM] [PRENOM] né le [DATE], demeurant [ADRESSE].",
    "Que son état de santé ne lui permet pas de faire de la gymnastique (ou natation/sport) pendant [DUREE] (jours/semaines/mois).",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Aptitude Sportive (Compétition)', [
    "Je soussigné, Docteur en médecine, certifie avoir examiné le [DATE], M/Mme [NOM] [PRENOM] né(e) le [DATE NAISSANCE].",
    "Il (ou elle) ne présente pas de contre-indication à la pratique d’activités sportives en compétition.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Aptitude à un Emploi', [
    "Je soussigné, Docteur en médecine, certifie après avoir examiné le [DATE], M/Mme [NOM] [PRENOM].",
    "Qu'il (ou elle) ne présente aucun signe actuellement décelable de maladie en évolution, et semble posséder les aptitudes physiques compatibles avec un emploi de [EMPLOI].",
    "Remis à l'intéressé pour être transmis à son futur employeur.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Certificat de Vaccination', [
    "Je soussigné, Docteur en médecine, certifie avoir pratiqué la vaccination (ou la revaccination) [NOM VACCIN] sur la personne de M/Mme [NOM] [PRENOM].",
    "Lot N° : [NUMERO LOT]",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Certificat d\'Hospitalisation', [
    "Je soussigné, Docteur en médecine, certifie que l'état de santé de M/Mme [NOM] [PRENOM] demeurant [ADRESSE].",
    "Nécessite son hospitalisation (d'urgence) dans un service de [SERVICE], de l'hôpital de [HOPITAL].",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Constat de Coups et Blessures (Initial)', [
    "Je soussigné, Docteur en médecine, certifie avoir examiné le [DATE EXAMEN] à [HEURE], M/Mme [NOM] [PRENOM] (2), né(e) le [DATE NAISSANCE].",
    "Qui déclare avoir été victime de [ACCIDENT/AGRESSION] (3), le [DATE FAITS] à [HEURE] à [LIEU].",
    "Il (ou elle) présente :",
    "[DESCRIPTION PRECISE DES LESIONS : Localisation, dimensions, couleurs, profondeurs] (4).",
    "Ces blessures entraînent une Incapacité Totale de Travail (ITT) de [X] jours (ou n'entraînent pas d'ITT), sauf complications.",
    "Certificat établi à la demande de l'intéressé(e) et remis en main propre.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ], { notes: ["(2) Nom de jeune fille si mariée", "(4) Distinguer les dires du patient (entre guillemets) des constatations médicales."] }),
  normalize('Consolidation (Sans séquelles)', [
    "Je soussigné, Docteur en médecine, certifie que l'état de santé de M/Mme [NOM] [PRENOM].",
    "Victime d'un(e) [CAUSE] le [DATE ACCIDENT], peut être considéré comme consolidé à la date du [DATE CONSOLIDATION] (éventuellement avec soins d'entretien).",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Consolidation (Avec séquelles)', [
    "Je soussigné, Docteur en médecine, certifie avoir examiné le [DATE] M/Mme [NOM] [PRENOM], victime de [CAUSE] le [DATE ACCIDENT].",
    "A la suite de cet accident, il/elle a présenté : [DESCRIPTION LESIONS INITIALES].",
    "Evolution : [RESUME, REPRISE TRAVAIL].",
    "Doléances actuelles : [PLAINTES].",
    "Examen des séquelles : [DESCRIPTION MINUTIEUSE, CICATRICES, LIMITATIONS].",
    "CONCLUSIONS :",
    "- Date de consolidation : [DATE]",
    "- Taux d'Incapacité Permanente Partielle (IPP) : [TAUX] %",
    "- Souffrances endurées (Quantum Doloris) : [X]/7",
    "- Préjudice esthétique : [X]/7",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Constat de Violences Sexuelles', [
    "Je soussigné, Docteur en médecine, certifie avoir examiné le [DATE] à [HEURE] à [LIEU], une personne déclarant se nommer [NOM].",
    "Elle (ou il) déclare avoir subi des violences sexuelles le [DATE] à [LIEU].",
    "État général/Comportement : [DESCRIPTION EMOTIVITE, ETAT VETEMENTS...]",
    "Examen clinique général : [DESCRIPTION]",
    "Examen génital/anal : [DESCRIPTION HYMEN, POURTOUR ANAL, LESIONS...]",
    "Un prélèvement vaginal a été effectué.",
    "Prescription d'examens biologiques (Grossesse, MST).",
    "Ces lésions entraînent une ITT de [X] jours.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ]),
  normalize('Certificat d\'Embaumement', [
    "Je soussigné, Docteur en médecine, déclare que la mort de M/Mme [NOM] survenue le [DATE DECES] à [LIEU] était due à une cause naturelle.",
    "Délivré à la demande de la famille pour permettre l'embaumement du corps.",
    "Fait à [LIEU], le [DATE DU JOUR]."
  ])
];


export const specialties: Specialty[] = [
  { id: 'dermato', name: 'Dermatologie', icon: 'Activity', color: 'pink', prescriptions: dermatoPrescriptions },
  { id: 'cardio', name: 'Cardiologie', icon: 'Heart', color: 'red', prescriptions: cardioPrescriptions },
  { id: 'gastro', name: 'Gastro-Hépato-Entérologie', icon: 'Stethoscope', color: 'amber', prescriptions: gastroPrescriptions },
  { id: 'endocrino', name: 'Diabétologie-Endocrinologie', icon: 'TestTube', color: 'emerald', prescriptions: endocrinoPrescriptions },
  { id: 'gyneco', name: 'Gynécologie-Obstétrique', icon: 'Baby', color: 'fuchsia', prescriptions: gynecoPrescriptions },
  { id: 'infectio', name: 'Infectiologie', icon: 'Bug', color: 'yellow', prescriptions: infectioPrescriptions },
  { id: 'nephro', name: 'Néphrologie', icon: 'Droplet', color: 'cyan', prescriptions: nephroPrescriptions },
  { id: 'hemato', name: 'Hématologie', icon: 'Droplet', color: 'rose', prescriptions: hematoPrescriptions },
  { id: 'geriatrie', name: 'Gériatrie', icon: 'Users', color: 'slate', prescriptions: geriatriePrescriptions },
  { id: 'ophtalmo', name: 'Ophtalmologie', icon: 'Eye', color: 'indigo', prescriptions: ophtalmoPrescriptions },
  { id: 'neuro', name: 'Neurologie', icon: 'Brain', color: 'violet', prescriptions: neuroPrescriptions },
  { id: 'parasito', name: 'Parasitologie', icon: 'Bug', color: 'lime', prescriptions: parasitoPrescriptions },
  { id: 'orl', name: 'Oto-Rhino-Laryngologie', icon: 'Ear', color: 'sky', prescriptions: orlPrescriptions },
  { id: 'phlebo', name: 'Phlébologie', icon: 'Activity', color: 'teal', prescriptions: phleboPrescriptions },
  { id: 'pediatrie', name: 'Pédiatrie', icon: 'Baby', color: 'blue', prescriptions: pediatriePrescriptions },
  { id: 'psychiatrie', name: 'Psychiatrie', icon: 'Brain', color: 'purple', prescriptions: psychiatriePrescriptions },
  { id: 'pneumo', name: 'Pneumologie', icon: 'Wind', color: 'cyan', prescriptions: pneumoPrescriptions },
  { id: 'rhumato', name: 'Rhumatologie', icon: 'Bone', color: 'orange', prescriptions: rhumatoPrescriptions },
  { id: 'rea', name: 'Réanimation', icon: 'Siren', color: 'red', prescriptions: reaPrescriptions },
  { id: 'urologie', name: 'Urologie', icon: 'Droplet', color: 'blue', prescriptions: urologiePrescriptions },
  { id: 'traumato', name: 'Traumatologie', icon: 'Hammer', color: 'zinc', prescriptions: traumatoPrescriptions },
  { id: 'certificats', name: 'Certificats', icon: 'FileText', color: 'gray', prescriptions: certificatsPrescriptions }
];