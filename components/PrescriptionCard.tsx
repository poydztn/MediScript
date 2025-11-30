import React from 'react';
import { Prescription } from '../types';
import { Printer, Copy, Check, AlertCircle } from 'lucide-react';

interface PrescriptionCardProps {
  prescription: Prescription;
  color?: string;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription, color = 'blue' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = prescription.lines.map(l => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-medical-paper border border-gray-300 shadow-lg relative overflow-hidden mb-8 break-inside-avoid print:shadow-none print:border-0 print:w-full rounded-sm print:break-inside-avoid w-full max-w-full">
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-prescription-pattern opacity-10 pointer-events-none"></div>

      {/* Top colored bar */}
      <div className={`h-3 w-full top-0 left-0 absolute print:hidden bg-${color}-600`}></div>
      
      <div className="p-4 md:p-8 relative">
        {/* Header Area */}
        <div className={`flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6 border-b-2 border-${color}-100 pb-4`}>
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl md:text-2xl font-serif font-bold mb-1 leading-tight text-${color}-700 break-words`}>
              {prescription.title}
            </h3>
            {prescription.subtitle && (
              <p className="text-slate-500 font-medium italic text-sm mt-1 break-words">
                {prescription.subtitle}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 self-end md:self-start print:hidden shrink-0">
            <button 
              onClick={handleCopy}
              className={`p-2 text-gray-400 hover:text-${color}-600 transition-colors rounded-full hover:bg-${color}-50 border border-gray-100 md:border-0`}
              title="Copier l'ordonnance"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
            <button 
              onClick={handlePrint}
              className={`p-2 text-gray-400 hover:text-${color}-600 transition-colors rounded-full hover:bg-${color}-50 border border-gray-100 md:border-0`}
              title="Exporter en PDF (Imprimer)"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prescription Body - Handwriting style */}
        <div className="font-hand text-xl md:text-2xl text-gray-800 space-y-2 leading-relaxed relative min-h-[180px]">
           
           <ul className="relative z-10 w-full">
            {prescription.lines.map((line, idx) => {
              if (line.isHeader) {
                return (
                   <li key={idx} className={`mt-6 mb-3 font-bold text-${color}-700 font-sans text-xs md:text-sm uppercase tracking-widest border-b border-gray-300 pb-1 break-words`}>
                    {line.text}
                  </li>
                );
              }
              if (line.isNote) {
                return (
                   <li key={idx} className="mt-2 mb-2 text-base md:text-lg text-slate-500 font-sans italic pl-4 border-l-4 border-gray-300 bg-gray-50/50 p-2 break-words">
                    {line.text}
                  </li>
                );
              }
              return (
                <li key={idx} className="flex items-start gap-2 md:gap-3 mb-2 pl-1 md:pl-2 w-full">
                  <span className={`text-${color}-400 mt-1 md:mt-2 select-none text-base shrink-0`}>▪</span>
                  <span className="break-words w-full min-w-0">{line.text}</span>
                </li>
              );
            })}
           </ul>

           {/* Footer Notes & Warnings */}
           {(prescription.notes || prescription.warnings) && (
             <div className="mt-8 pt-4 border-t border-dashed border-gray-300 font-sans text-xs md:text-sm w-full">
                {prescription.notes?.map((n, i) => (
                  <p key={`note-${i}`} className="text-gray-600 italic mb-1 break-words">
                    <span className="font-bold text-slate-500">Note:</span> {n}
                  </p>
                ))}
                {prescription.warnings?.map((w, i) => (
                  <p key={`warn-${i}`} className="text-red-600 font-medium mb-1 flex items-start gap-2 bg-red-50 p-2 rounded break-words">
                    <span className="text-base md:text-lg shrink-0">⚠</span> <span className="break-words">{w}</span>
                  </p>
                ))}
             </div>
           )}
        </div>

        {/* Bottom Signature & Date placeholders */}
        <div className="mt-12 flex justify-between items-end print:mt-24">
          <div className="text-[10px] md:text-xs text-gray-400 font-mono">
            Fait le : ____ / ____ / ________
          </div>
          <div className="text-center">
            <div className="h-16 md:h-20 w-40 md:w-56 border-b border-gray-800 mb-2 flex items-end justify-center relative">
               {/* Signature removed as requested */}
            </div>
            <span className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest">Signature & Cachet</span>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="mt-8 pt-4 border-t-2 border-dotted border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-400 bg-gray-50/80 p-2 rounded text-center">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest font-bold break-words">Modèle à but pédagogique uniquement</p>
              <p className="text-[9px] break-words">Ce document ne constitue pas une ordonnance médicale valide et ne doit pas être utilisé pour la délivrance de médicaments.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};