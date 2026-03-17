const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Complaint = require('../models/Complaint');

// Keep files in memory so we can parse them directly
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 1. Parse Excel file using xlsx from memory buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // 2. Convert rows into JSON
    // We use raw: false to let xlsx process dates based on cell formats
    // Otherwise we might get integer serial values for dates
    let data = xlsx.utils.sheet_to_json(sheet, { raw: false });

    // 3. Ensure dates are converted properly into JS Date objects
    const complaintsToInsert = data.map((row) => {
      return {
        department: row.department,
        status: String(row.status || 'PENDING').trim().toUpperCase(),
        createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
        resolvedAt: row.resolvedAt ? new Date(row.resolvedAt) : null,
        source: 'Upload',
      };
    });

    // 4. Insert all records into MongoDB using insertMany()
    await Complaint.insertMany(complaintsToInsert);

    res.status(200).json({ 
      message: 'File uploaded and data inserted successfully', 
      insertedCount: complaintsToInsert.length 
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Server error processing file upload' });
  }
});

module.exports = router;
