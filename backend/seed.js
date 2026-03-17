require('dotenv').config();
const mongoose = require('mongoose');
const Complaint = require('./models/Complaint');

const sampleData = [
  { department: 'Water', status: 'resolved', createdAt: new Date('2023-10-01T10:00:00Z'), resolvedAt: new Date('2023-10-01T15:00:00Z') },
  { department: 'Water', status: 'pending', createdAt: new Date('2023-10-02T09:00:00Z') },
  { department: 'Water', status: 'resolved', createdAt: new Date('2023-10-03T08:00:00Z'), resolvedAt: new Date('2023-10-04T08:00:00Z') }, // 24 hours
  { department: 'Roads', status: 'resolved', createdAt: new Date('2023-10-01T11:00:00Z'), resolvedAt: new Date('2023-10-03T11:00:00Z') }, // 48 hours
  { department: 'Roads', status: 'resolved', createdAt: new Date('2023-10-02T12:00:00Z'), resolvedAt: new Date('2023-10-10T12:00:00Z') }, // 192 hours
  { department: 'Roads', status: 'pending', createdAt: new Date('2023-10-05T09:00:00Z') },
  { department: 'Electricity', status: 'resolved', createdAt: new Date('2023-10-01T08:00:00Z'), resolvedAt: new Date('2023-10-01T10:00:00Z') }, // 2 hours
  { department: 'Electricity', status: 'resolved', createdAt: new Date('2023-10-02T14:00:00Z'), resolvedAt: new Date('2023-10-02T18:00:00Z') }, // 4 hours
  { department: 'Electricity', status: 'resolved', createdAt: new Date('2023-10-03T10:00:00Z'), resolvedAt: new Date('2023-10-03T16:00:00Z') }, // 6 hours
  { department: 'Electricity', status: 'pending', createdAt: new Date('2023-10-04T10:00:00Z') },
  
  // More data
  { department: 'Water', status: 'resolved', createdAt: new Date('2023-10-05T08:00:00Z'), resolvedAt: new Date('2023-10-05T18:00:00Z') }, // 10 hours
  { department: 'Water', status: 'resolved', createdAt: new Date('2023-10-06T09:00:00Z'), resolvedAt: new Date('2023-10-06T15:00:00Z') }, // 6 hours
  { department: 'Roads', status: 'resolved', createdAt: new Date('2023-10-07T10:00:00Z'), resolvedAt: new Date('2023-10-12T10:00:00Z') }, // 120 hours
  { department: 'Electricity', status: 'resolved', createdAt: new Date('2023-10-08T11:00:00Z'), resolvedAt: new Date('2023-10-08T14:00:00Z') }, // 3 hours
  { department: 'Sewage', status: 'resolved', createdAt: new Date('2023-10-09T08:00:00Z'), resolvedAt: new Date('2023-10-10T08:00:00Z') }, // 24 hours
  { department: 'Sewage', status: 'resolved', createdAt: new Date('2023-10-10T09:00:00Z'), resolvedAt: new Date('2023-10-12T09:00:00Z') }, // 48 hours
  { department: 'Sewage', status: 'pending', createdAt: new Date('2023-10-11T10:00:00Z') },
  { department: 'Parks', status: 'resolved', createdAt: new Date('2023-10-12T07:00:00Z'), resolvedAt: new Date('2023-10-13T07:00:00Z') }, // 24 hours
  { department: 'Parks', status: 'resolved', createdAt: new Date('2023-10-13T08:00:00Z'), resolvedAt: new Date('2023-10-16T08:00:00Z') }, // 72 hours
  { department: 'Health', status: 'resolved', createdAt: new Date('2023-10-14T09:00:00Z'), resolvedAt: new Date('2023-10-14T12:00:00Z') }, // 3 hours
  { department: 'Health', status: 'resolved', createdAt: new Date('2023-10-15T10:00:00Z'), resolvedAt: new Date('2023-10-15T16:00:00Z') }, // 6 hours
];

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/complaints")
  .then(async () => {
    console.log('Connected to MongoDB. Clearing old data...');
    await Complaint.deleteMany({});
    
    console.log('Inserting sample data...');
    await Complaint.insertMany(sampleData);
    
    console.log('Sample data inserted successfully!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
