export type Status = 'open' | 'in_review' | 'quoted' | 'closed';
export type ContactMethod = 'email' | 'phone' | 'whatsapp';
export type Role = 'admin' | 'staff';

export type Ticket = {
  id: number;
  ref: string;
  parkTypes: string[];
  budget: number;
  currency: string;
  location: string;
  siteArea: string | null;
  expectedVisitors: number | null;
  timeline: string;
  contactMethod: ContactMethod;
  notes: string | null;
  status: Status;
  emailSent: boolean;
  createdAt: string;
  statusChangedAt: string | null;
  statusChangedBy: string | null;
  requester: { id: number; name: string; email: string; phone: string };
};

export type TicketEvent = { by: string; staffId: number | null; from: Status | null; to: Status; at: string };
export type TicketWithHistory = Ticket & { history: TicketEvent[] };

export type Staff = {
  id: number | null;
  name: string;
  email: string | null;
  role: Role;
  active?: boolean;
  builtin?: boolean;
  createdAt?: string;
  lastLoginAt?: string | null;
};

export type Catalog = {
  parkTypes: Record<string, string>;
  timelines: Record<string, string>;
  contactMethods: Record<ContactMethod, string>;
  currencies: string[];
  statuses: Record<Status, string>;
  roles: Record<Role, string>;
};

export type Kpis = {
  generatedAt: string;
  totalTickets: number;
  ticketsLast7Days: number;
  ticketsLast30Days: number;
  openOlderThan7Days: number;
  verifiedClients: number;
  byStatus: Record<Status, number>;
  byParkType: Record<string, number>;
  byTimeline: Record<string, number>;
  byContactMethod: Record<ContactMethod, number>;
  byCurrency: { currency: string; count: number; totalBudget: number }[];
  perWeek: { weekEnding: string; count: number }[];
};
