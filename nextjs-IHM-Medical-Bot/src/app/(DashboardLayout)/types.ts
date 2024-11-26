export interface Capsule {
    content: string;
    id: string; // This should match the id you are using in your MongoDB document
    time: string;
    date: string;
    patient: string;
  }
  // types.ts

export interface Patient {
    id: string; // Unique identifier for the patient
    name: string; // Name of the patient
   description: string;  }
  