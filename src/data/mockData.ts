import { User, Lead, Contact, Account, Deal, Task, Communication, Campaign, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@crm.com',
    role: 'System Admin',
    enabled: true,
    lastLogin: '2026-01-23T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'sarah@crm.com',
    role: 'Sales Manager',
    enabled: true,
    lastLogin: '2026-01-23T09:30:00Z'
  },
  {
    id: '3',
    name: 'Mike Sales',
    email: 'mike@crm.com',
    role: 'Sales Executive',
    enabled: true,
    lastLogin: '2026-01-23T09:00:00Z'
  },
  {
    id: '4',
    name: 'Emma Marketing',
    email: 'emma@crm.com',
    role: 'Marketing Executive',
    enabled: true,
    lastLogin: '2026-01-23T08:45:00Z'
  },
  {
    id: '5',
    name: 'David Support',
    email: 'david@crm.com',
    role: 'Support Executive',
    enabled: true,
    lastLogin: '2026-01-23T08:30:00Z'
  }
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1-555-0101',
    company: 'Acme Corp',
    status: 'Qualified',
    source: 'Website',
    assignedTo: '3',
    value: 50000,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-20T14:30:00Z',
    notes: 'Interested in enterprise package'
  },
  {
    id: '2',
    name: 'TechStart Inc',
    email: 'info@techstart.com',
    phone: '+1-555-0102',
    company: 'TechStart',
    status: 'Contacted',
    source: 'Referral',
    assignedTo: '3',
    value: 30000,
    createdAt: '2026-01-18T11:00:00Z',
    updatedAt: '2026-01-22T09:15:00Z'
  },
  {
    id: '3',
    name: 'Global Solutions',
    email: 'sales@globalsol.com',
    phone: '+1-555-0103',
    company: 'Global Solutions',
    status: 'New',
    source: 'LinkedIn',
    assignedTo: '3',
    value: 75000,
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-01-22T08:00:00Z'
  }
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@acme.com',
    phone: '+1-555-1001',
    accountId: '1',
    position: 'CEO',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-20T14:00:00Z'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techstart.com',
    phone: '+1-555-1002',
    accountId: '2',
    position: 'CTO',
    createdAt: '2026-01-12T11:00:00Z',
    updatedAt: '2026-01-21T10:00:00Z'
  }
];

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    industry: 'Technology',
    website: 'www.acme.com',
    phone: '+1-555-2001',
    employees: 500,
    annualRevenue: 50000000,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-20T14:00:00Z'
  },
  {
    id: '2',
    name: 'TechStart Inc',
    industry: 'Software',
    website: 'www.techstart.com',
    phone: '+1-555-2002',
    employees: 150,
    annualRevenue: 15000000,
    createdAt: '2026-01-12T11:00:00Z',
    updatedAt: '2026-01-21T10:00:00Z'
  }
];

export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Acme Enterprise Deal',
    accountId: '1',
    contactId: '1',
    value: 50000,
    stage: 'Negotiation',
    probability: 75,
    expectedCloseDate: '2026-02-15',
    assignedTo: '3',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-22T14:00:00Z',
    notes: 'Finalizing contract terms'
  },
  {
    id: '2',
    title: 'TechStart Premium Package',
    accountId: '2',
    contactId: '2',
    value: 30000,
    stage: 'Proposal',
    probability: 60,
    expectedCloseDate: '2026-02-28',
    assignedTo: '3',
    createdAt: '2026-01-18T11:00:00Z',
    updatedAt: '2026-01-21T09:00:00Z'
  },
  {
    id: '3',
    title: 'Global Solutions Enterprise',
    accountId: '1',
    value: 75000,
    stage: 'Prospecting',
    probability: 40,
    expectedCloseDate: '2026-03-10',
    assignedTo: '3',
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-01-22T08:00:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with Acme Corp',
    description: 'Discuss contract terms',
    type: 'Call',
    priority: 'High',
    dueDate: '2026-01-24T10:00:00Z',
    assignedTo: '3',
    relatedTo: { type: 'Deal', id: '1' },
    status: 'Pending',
    createdAt: '2026-01-22T10:00:00Z'
  },
  {
    id: '2',
    title: 'Send proposal to TechStart',
    description: 'Email proposal document',
    type: 'Task',
    priority: 'Medium',
    dueDate: '2026-01-25T14:00:00Z',
    assignedTo: '3',
    relatedTo: { type: 'Deal', id: '2' },
    status: 'In Progress',
    createdAt: '2026-01-21T09:00:00Z'
  },
  {
    id: '3',
    title: 'Meeting with Global Solutions',
    type: 'Meeting',
    priority: 'High',
    dueDate: '2026-01-26T11:00:00Z',
    assignedTo: '3',
    relatedTo: { type: 'Deal', id: '3' },
    status: 'Pending',
    createdAt: '2026-01-22T08:00:00Z'
  }
];

export const mockCommunications: Communication[] = [
  {
    id: '1',
    type: 'Email',
    subject: 'Contract Discussion',
    content: 'Discussed contract terms and pricing',
    relatedTo: { type: 'Deal', id: '1' },
    createdBy: '3',
    createdAt: '2026-01-20T14:00:00Z'
  },
  {
    id: '2',
    type: 'Call',
    subject: 'Initial Consultation',
    content: 'Had initial call to understand requirements',
    relatedTo: { type: 'Lead', id: '2' },
    createdBy: '3',
    createdAt: '2026-01-19T10:00:00Z'
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q1 2026 Product Launch',
    type: 'Email Campaign',
    status: 'Active',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    budget: 50000,
    leadsGenerated: 150,
    conversionRate: 12.5
  },
  {
    id: '2',
    name: 'LinkedIn Outreach',
    type: 'Social Media',
    status: 'Active',
    startDate: '2026-01-15',
    budget: 20000,
    leadsGenerated: 75,
    conversionRate: 8.3
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Lead Assigned',
    message: 'You have been assigned a new lead: Global Solutions',
    type: 'info',
    read: false,
    createdAt: '2026-01-22T08:00:00Z',
    link: '/leads/3'
  },
  {
    id: '2',
    title: 'Task Due Soon',
    message: 'Follow up with Acme Corp is due in 2 days',
    type: 'warning',
    read: false,
    createdAt: '2026-01-22T09:00:00Z',
    link: '/tasks/1'
  },
  {
    id: '3',
    title: 'Deal Stage Changed',
    message: 'Acme Enterprise Deal moved to Negotiation stage',
    type: 'success',
    read: true,
    createdAt: '2026-01-20T14:00:00Z',
    link: '/deals/1'
  }
];
