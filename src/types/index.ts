export interface Ticket {
  id: string;
  name: string;
  font: string;
  icon: string | null;
  status: 'pending' | 'processing' | 'processed' | 'error';
  qrCode: string;
  createdAt: string;
  processedAt?: string;
  outputFile?: string;
  error?: string;
}

export interface Font {
  name: string;
  sample: string;
  category: string;
}

export interface Icon {
  symbol: string;
  name: string;
}

export interface CreateTicketData {
  name: string;
  font: string;
  icon: string;
}

export interface TicketResponse {
  success: boolean;
  ticketId: string;
  qrCode: string;
  ticket: Ticket;
}

export type TicketStatus = Ticket['status'];
