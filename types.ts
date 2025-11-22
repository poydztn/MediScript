export interface PrescriptionLine {
  text: string;
  isHeader?: boolean;
  isNote?: boolean;
}

export interface Prescription {
  id: string;
  title: string;
  subtitle?: string;
  lines: PrescriptionLine[];
  notes?: string[];
  warnings?: string[];
}

export interface Specialty {
  id: string;
  name: string;
  icon: string; // Icon name for Lucide
  color: string; // Tailwind color name (e.g., 'rose', 'blue')
  prescriptions: Prescription[];
}

export type SearchResult = {
  specialtyId: string;
  specialtyName: string;
  specialtyColor: string;
  prescription: Prescription;
};