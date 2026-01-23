export type UserRole = 
  | 'System Admin'
  | 'Sales Manager'
  | 'Sales Executive'
  | 'Marketing Executive'
  | 'Support Executive'
  | 'Customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  enabled: boolean;
  lastLogin?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: string;
  assignedTo: string;
  value?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  accountId?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  employees?: number;
  annualRevenue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  accountId?: string;
  contactId?: string;
  value: number;
  stage: 'Prospecting' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'Task' | 'Call' | 'Meeting' | 'Follow-up';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  assignedTo: string;
  relatedTo?: {
    type: 'Lead' | 'Contact' | 'Deal' | 'Account';
    id: string;
  };
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

export interface Communication {
  id: string;
  type: 'Email' | 'Call' | 'Note' | 'Document';
  subject: string;
  content: string;
  relatedTo: {
    type: 'Lead' | 'Contact' | 'Deal' | 'Account';
    id: string;
  };
  createdBy: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'Planning' | 'Active' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate?: string;
  budget?: number;
  leadsGenerated: number;
  conversionRate: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface OrganizationSettings {
  companyName: string;
  currency: string;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  holidays: string[];
}
