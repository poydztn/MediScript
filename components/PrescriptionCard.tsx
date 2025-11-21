import React from 'react';
import { Prescription } from '../types';
import { Printer, Copy, Check } from 'lucide-react';

interface PrescriptionCardProps {
  prescription: Prescription;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription }) => {
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
    <div className="bg-medical-paper border border-gray-300 shadow-lg relative overflow-hidden mb-8 break-inside-avoid print:shadow-none print:border-0 print:w-full rounded-sm print:break-inside-avoid">
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-prescription-pattern opacity-10 pointer-events-none"></div>

      {/* Top colored bar */}
      <div className="h-3 bg-medical-primary w-full top-0 left-0 absolute print:hidden"></div>
      
      <div className="p-4 md:p-8 relative">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6 border-b-2 border-medical-primary/20 pb-4">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-serif text-medical-primary font-bold mb-1 leading-tight">
              {prescription.title}
            </h3>
            {prescription.subtitle && (
              <p className="text-medical-secondary font-medium italic text-sm mt-1">
                {prescription.subtitle}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 self-end md:self-start print:hidden shrink-0">
            <button 
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-medical-primary transition-colors rounded-full hover:bg-blue-50 border border-gray-100 md:border-0"
              title="Copier l'ordonnance"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
            <button 
              onClick={handlePrint}
              className="p-2 text-gray-400 hover:text-medical-primary transition-colors rounded-full hover:bg-blue-50 border border-gray-100 md:border-0"
              title="Exporter en PDF (Imprimer)"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prescription Body - Handwriting style */}
        <div className="font-hand text-xl md:text-2xl text-gray-800 space-y-2 leading-relaxed relative min-h-[180px]">
           
           <ul className="relative z-10">
            {prescription.lines.map((line, idx) => {
              if (line.isHeader) {
                return (
                   <li key={idx} className="mt-6 mb-3 font-bold text-medical-primary font-sans text-xs md:text-sm uppercase tracking-widest border-b border-gray-300 pb-1">
                    {line.text}
                  </li>
                );
              }
              if (line.isNote) {
                return (
                   <li key={idx} className="mt-2 mb-2 text-base md:text-lg text-medical-secondary/80 font-sans italic pl-4 border-l-4 border-gray-300 bg-gray-50/50 p-2">
                    {line.text}
                  </li>
                );
              }
              return (
                <li key={idx} className="flex items-start gap-2 md:gap-3 mb-2 pl-1 md:pl-2">
                  <span className="text-medical-primary/40 mt-1 md:mt-2 select-none text-base">▪</span>
                  <span className="break-words w-full">{line.text}</span>
                </li>
              );
            })}
           </ul>

           {/* Footer Notes & Warnings */}
           {(prescription.notes || prescription.warnings) && (
             <div className="mt-8 pt-4 border-t border-dashed border-gray-300 font-sans text-xs md:text-sm">
                {prescription.notes?.map((n, i) => (
                  <p key={`note-${i}`} className="text-gray-600 italic mb-1">
                    <span className="font-bold text-medical-secondary">Note:</span> {n}
                  </p>
                ))}
                {prescription.warnings?.map((w, i) => (
                  <p key={`warn-${i}`} className="text-red-600 font-medium mb-1 flex items-start gap-2 bg-red-50 p-2 rounded">
                    <span className="text-base md:text-lg">⚠</span> {w}
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
            <div className="h-16 md:h-20 w-32 md:w-48 border-b border-gray-800 mb-2 flex items-end justify-center relative">
               <span className="font-hand text-3xl md:text-4xl text-blue-900 opacity-40 absolute -rotate-12 top-4">Dr. MediScript</span>
            </div>
            <span className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest">Signature & Cachet</span>
          </div>
        </div>
      </div>
    </div>
  );
};