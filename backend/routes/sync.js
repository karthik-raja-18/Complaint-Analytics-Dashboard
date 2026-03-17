const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// POST /api/sync
// Accepts a JSON array of complaint objects from Spring Boot
router.post('/', async (req, res) => {
  try {
    const incoming = req.body;

    // --- Basic validation ---
    if (!Array.isArray(incoming) || incoming.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty JSON array' });
    }

    console.log(`[SYNC] Received ${incoming.length} records from Spring Boot`);

    // --- Validate + transform each record ---
    const REQUIRED = ['department', 'status', 'createdAt'];
    const valid = [];
    const errors = [];

    incoming.forEach((item, idx) => {
      const missing = REQUIRED.filter((f) => !item[f]);
      if (missing.length) {
        errors.push({ index: idx, missing });
        return;
      }

      const createdAt = new Date(item.createdAt);
      const resolvedAt = item.resolvedAt ? new Date(item.resolvedAt) : null;

      if (isNaN(createdAt.getTime())) {
        errors.push({ index: idx, error: 'Invalid createdAt date' });
        return;
      }

      valid.push({
        department: String(item.department).trim(),
        status: String(item.status).trim().toUpperCase(), // normalise
        createdAt,
        resolvedAt: resolvedAt && !isNaN(resolvedAt.getTime()) ? resolvedAt : null,
        source: 'SpringBoot',
        externalReferenceId: item.id ? String(item.id) : null,
      });
    });

    if (errors.length) {
      console.warn('[SYNC] Validation errors:', errors);
    }

    if (valid.length === 0) {
      return res.status(400).json({ error: 'No valid records to insert', details: errors });
    }

    // --- Upsert Logic: Update if exists, Insert if not ---
    // We use externalReferenceId (Spring Boot ID) as the unique key
    const operations = valid.map((item) => {
      // If externalReferenceId is provided, we match on it.
      // If it's missing (shouldn't happen with Spring Boot now), we fall back to a 
      // heuristic match on department + createdAt + source to try and update instead of double-count.
      const query = item.externalReferenceId 
        ? { externalReferenceId: item.externalReferenceId }
        : { department: item.department, createdAt: item.createdAt, source: 'SpringBoot' };

      console.log(`[SYNC] Handling record with ext_id: ${item.externalReferenceId || 'NULL'}`);

      return Complaint.findOneAndUpdate(
        query, 
        item,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    });

    const results = await Promise.all(operations);
    console.log(`[SYNC] Upserted (Sync'd) ${results.length} records`);

    return res.status(201).json({
      message: 'Sync successful',
      received: incoming.length,
      upserted: results.length,
      skipped: errors.length,
      errors: errors.length ? errors : undefined,
    });
  } catch (err) {
    console.error('[SYNC] Error:', err);
    return res.status(500).json({ error: 'Server error during sync', details: err.message });
  }
});

module.exports = router;
