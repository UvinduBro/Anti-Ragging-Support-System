export interface Incident {
  id: string;
  type: string;
  description: string;
  location: string;
  date: string;
  time?: string;
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