export interface Incident {
  id: string;
  incidentType: string;
  description: string;
  location: string;
  date: string;
  time?: string;
  docId: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  optionalContact?: boolean;
  mediaFiles?: File[];
  mediaBase64?: string[];
} 