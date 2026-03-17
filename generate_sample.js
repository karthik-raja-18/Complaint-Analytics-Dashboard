const xlsx = require('xlsx');
const path = require('path');

// Sample data
const sampleData = [
  {
    department: 'Water Supply',
    status: 'RESOLVED',
    createdAt: '2024-03-01T10:00:00Z',
    resolvedAt: '2024-03-02T15:30:00Z'
  },
  {
    department: 'Street Lights',
    status: 'PENDING',
    createdAt: '2024-03-10T08:45:00Z',
    resolvedAt: ''
  },
  {
    department: 'Road Maintenance',
    status: 'IN_PROGRESS',
    createdAt: '2024-03-12T14:20:00Z',
    resolvedAt: ''
  },
  {
    department: 'Sanitation',
    status: 'RESOLVED',
    createdAt: '2024-03-05T09:00:00Z',
    resolvedAt: '2024-03-05T17:00:00Z'
  },
  {
    department: 'Waste Management',
    status: 'PENDING',
    createdAt: '2024-03-15T11:15:00Z',
    resolvedAt: ''
  }
];

// Create workbook and worksheet
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(sampleData);

// Add worksheet to workbook
xlsx.utils.book_append_sheet(wb, ws, 'Complaints');

// Define file path
const filePath = path.join(__dirname, 'sample_complaints.xlsx');

// Write file
xlsx.writeFile(wb, filePath);

console.log(`\n✅ Sample Excel data generated successfully!`);
console.log(`📁 File created at: ${filePath}`);
console.log(`\nYou can now use this file in the 'Manual Upload' section of your dashboard.`);
