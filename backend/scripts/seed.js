import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Lead from '../models/Lead.js';
import Account from '../models/Account.js';
import Contact from '../models/Contact.js';
import Deal from '../models/Deal.js';
import Task from '../models/Task.js';
import Campaign from '../models/Campaign.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Organization.deleteMany({});
    await Lead.deleteMany({});
    await Account.deleteMany({});
    await Contact.deleteMany({});
    await Deal.deleteMany({});
    await Task.deleteMany({});
    await Campaign.deleteMany({});

    console.log('Creating users...');
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@crm.com',
      mobile: '+1234567890',
      password: 'admin123',
      role: 'System Admin',
      isActive: true,
    });

    const salesManager = await User.create({
      firstName: 'John',
      lastName: 'Manager',
      email: 'manager@crm.com',
      mobile: '+1234567891',
      password: 'manager123',
      role: 'Sales Manager',
      isActive: true,
    });

    const salesExec1 = await User.create({
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@crm.com',
      mobile: '+1234567892',
      password: 'sales123',
      role: 'Sales Executive',
      isActive: true,
    });

    const salesExec2 = await User.create({
      firstName: 'Mike',
      lastName: 'Davis',
      email: 'mike@crm.com',
      mobile: '+1234567893',
      password: 'sales123',
      role: 'Sales Executive',
      isActive: true,
    });

    const marketingExec = await User.create({
      firstName: 'Emily',
      lastName: 'Wilson',
      email: 'emily@crm.com',
      mobile: '+1234567894',
      password: 'marketing123',
      role: 'Marketing Executive',
      isActive: true,
    });

    const supportExec = await User.create({
      firstName: 'David',
      lastName: 'Brown',
      email: 'david@crm.com',
      mobile: '+1234567895',
      password: 'support123',
      role: 'Support Executive',
      isActive: true,
    });

    console.log('Creating organization...');
    const organization = await Organization.create({
      companyName: 'CRM Corporation',
      companyEmail: 'info@crm.com',
      companyPhone: '+1-800-CRM-HELP',
      address: {
        street: '123 Business Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      currency: 'USD',
      timezone: 'America/New_York',
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
    });

    console.log('Creating campaigns...');
    const campaign1 = await Campaign.create({
      name: 'Summer Sale 2024',
      type: 'Email',
      status: 'Active',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      budget: 50000,
      currency: 'USD',
      description: 'Summer promotional campaign',
      createdBy: marketingExec._id,
      leadsGenerated: 150,
      leadsConverted: 45,
      revenue: 250000,
    });

    const campaign2 = await Campaign.create({
      name: 'Webinar Series',
      type: 'Webinar',
      status: 'Completed',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      budget: 30000,
      currency: 'USD',
      description: 'Educational webinar series',
      createdBy: marketingExec._id,
      leadsGenerated: 200,
      leadsConverted: 60,
      revenue: 180000,
    });

    console.log('Creating accounts...');
    const account1 = await Account.create({
      name: 'Tech Solutions Inc.',
      email: 'contact@techsolutions.com',
      phone: '+1-555-0101',
      website: 'https://techsolutions.com',
      industry: 'Technology',
      type: 'Customer',
      assignedTo: salesExec1._id,
      annualRevenue: 5000000,
      employeeCount: 150,
    });

    const account2 = await Account.create({
      name: 'Global Enterprises',
      email: 'info@globalent.com',
      phone: '+1-555-0102',
      website: 'https://globalent.com',
      industry: 'Manufacturing',
      type: 'Customer',
      assignedTo: salesExec2._id,
      annualRevenue: 10000000,
      employeeCount: 500,
    });

    console.log('Creating contacts...');
    const contact1 = await Contact.create({
      firstName: 'Robert',
      lastName: 'Smith',
      email: 'robert.smith@techsolutions.com',
      mobile: '+1-555-0201',
      phone: '+1-555-0202',
      jobTitle: 'CEO',
      account: account1._id,
      assignedTo: salesExec1._id,
    });

    const contact2 = await Contact.create({
      firstName: 'Jennifer',
      lastName: 'Martinez',
      email: 'jennifer.martinez@globalent.com',
      mobile: '+1-555-0203',
      phone: '+1-555-0204',
      jobTitle: 'VP of Sales',
      account: account2._id,
      assignedTo: salesExec2._id,
    });

    console.log('Creating leads...');
    const lead1 = await Lead.create({
      firstName: 'Alice',
      lastName: 'Williams',
      email: 'alice.williams@example.com',
      mobile: '+1-555-0301',
      company: 'Startup Co.',
      jobTitle: 'Founder',
      status: 'New',
      source: campaign1._id,
      assignedTo: salesExec1._id,
      value: 50000,
    });

    const lead2 = await Lead.create({
      firstName: 'Bob',
      lastName: 'Anderson',
      email: 'bob.anderson@example.com',
      mobile: '+1-555-0302',
      company: 'Innovation Labs',
      jobTitle: 'CTO',
      status: 'Contacted',
      source: campaign2._id,
      assignedTo: salesExec2._id,
      value: 75000,
    });

    const lead3 = await Lead.create({
      firstName: 'Carol',
      lastName: 'Taylor',
      email: 'carol.taylor@example.com',
      mobile: '+1-555-0303',
      company: 'Digital Solutions',
      jobTitle: 'Director',
      status: 'Qualified',
      assignedTo: salesExec1._id,
      value: 100000,
    });

    console.log('Creating deals...');
    const deal1 = await Deal.create({
      name: 'Tech Solutions - Enterprise Package',
      account: account1._id,
      contact: contact1._id,
      stage: 'Negotiation',
      value: 250000,
      currency: 'USD',
      expectedCloseDate: new Date('2024-12-31'),
      probability: 75,
      assignedTo: salesExec1._id,
      source: campaign1._id,
      description: 'Enterprise software package deal',
    });

    const deal2 = await Deal.create({
      name: 'Global Enterprises - Annual Contract',
      account: account2._id,
      contact: contact2._id,
      stage: 'Proposal',
      value: 500000,
      currency: 'USD',
      expectedCloseDate: new Date('2024-11-30'),
      probability: 60,
      assignedTo: salesExec2._id,
      source: campaign2._id,
      description: 'Annual service contract',
    });

    const deal3 = await Deal.create({
      name: 'Startup Co. - Starter Package',
      stage: 'Closed Won',
      value: 50000,
      currency: 'USD',
      actualCloseDate: new Date('2024-09-15'),
      probability: 100,
      assignedTo: salesExec1._id,
      description: 'Starter package deal - closed',
    });

    console.log('Creating tasks...');
    await Task.create({
      title: 'Follow up with Tech Solutions',
      description: 'Schedule meeting to discuss proposal',
      type: 'Meeting',
      priority: 'High',
      status: 'Pending',
      dueDate: new Date('2024-10-20'),
      assignedTo: salesExec1._id,
      relatedTo: {
        entityType: 'Deal',
        entityId: deal1._id,
      },
      reminder: {
        enabled: true,
        reminderDate: new Date('2024-10-19'),
      },
    });

    await Task.create({
      title: 'Send proposal to Global Enterprises',
      description: 'Prepare and send detailed proposal',
      type: 'Email',
      priority: 'Urgent',
      status: 'In Progress',
      dueDate: new Date('2024-10-18'),
      assignedTo: salesExec2._id,
      relatedTo: {
        entityType: 'Deal',
        entityId: deal2._id,
      },
    });

    await Task.create({
      title: 'Call Alice Williams',
      description: 'Initial qualification call',
      type: 'Call',
      priority: 'Medium',
      status: 'Pending',
      dueDate: new Date('2024-10-22'),
      assignedTo: salesExec1._id,
      relatedTo: {
        entityType: 'Lead',
        entityId: lead1._id,
      },
    });

    console.log('✅ Seed data created successfully!');
    console.log('\n📋 Default Login Credentials:');
    console.log('Admin: admin@crm.com / admin123');
    console.log('Sales Manager: manager@crm.com / manager123');
    console.log('Sales Executive: sarah@crm.com / sales123');
    console.log('Sales Executive: mike@crm.com / sales123');
    console.log('Marketing Executive: emily@crm.com / marketing123');
    console.log('Support Executive: david@crm.com / support123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
