const BASE = '/api';

export async function fetchServices() {
  const res = await fetch(`${BASE}/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function fetchSlots(date: string, duration: number) {
  const res = await fetch(`${BASE}/slots/available?date=${date}&duration=${duration}`);
  if (!res.ok) throw new Error('Failed to fetch slots');
  return res.json();
}

export async function createAppointment(data: {
  service_id: number;
  client_name: string;
  phone: string;
  client_source: string;
  appt_date: string;
  appt_time: string;
  is_first_visit: boolean;
  notes?: string;
}) {
  const res = await fetch(`${BASE}/appointments/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Booking failed');
  return json;
}
