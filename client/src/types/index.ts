export interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  duration_min: number;
  price: number;
  is_active: number;
}

export interface ServicesGrouped {
  [category: string]: Service[];
}

export interface Appointment {
  id: number;
  service_id: number;
  client_name: string;
  phone: string;
  client_source?: string;
  appt_date: string;
  appt_time: string;
  duration_min: number;
  price: number;
  discount_applied: number;
  is_first_visit: boolean;
  status: string;
  notes?: string;
  created_at: string;
}

export interface BookingFormData {
  service_id: number | null;
  service?: Service;
  appt_date: string;
  appt_time: string;
  client_name: string;
  phone: string;
  client_source: string;
  is_first_visit: boolean;
  notes: string;
}

export interface PortfolioItem {
  id: number;
  src: string;
  thumb: string;
  category: string;
  type: string;
  bundles: number;
  duration: string;
  price: string;
}

export interface Review {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  text: string;
  rating: number;
  date: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export type BookingStep = 1 | 2 | 3 | 4;
