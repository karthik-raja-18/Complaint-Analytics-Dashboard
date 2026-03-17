const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const { source } = req.query;
    
    // Build match object for filtering
    const baseMatch = {};
    if (source) {
      baseMatch.source = source;
    }

    // --- Pipeline 1: totalComplaints + assignedCount per department (all records) ---
    const volumePipeline = [
      { $match: baseMatch },
      {
        $group: {
          _id: '$department',
          totalComplaints: { $sum: 1 },
          // Count non-resolved (PENDING, IN_PROGRESS, etc.)
          assignedCount: {
            $sum: {
              $cond: [{ $ne: ['$status', 'RESOLVED'] }, 1, 0]
            }
          }
        }
      }
    ];

    // --- Pipeline 2: avgResolutionTime only for RESOLVED with valid dates ---
    const resolutionMatch = { 
      ...baseMatch,
      status: 'RESOLVED',
      resolvedAt: { $ne: null, $type: 'date' },
      createdAt: { $type: 'date' }
    };

    const resolutionPipeline = [
      { $match: resolutionMatch },
      {
        $project: {
          department: 1,
          resolutionTime: {
            $divide: [
              { $subtract: ['$resolvedAt', '$createdAt'] },
              1000 * 60 * 60  // ms → hours
            ]
          }
        }
      },
      {
        $group: {
          _id: '$department',
          avgResolutionTime: { $avg: '$resolutionTime' }
        }
      }
    ];

    const [volumeData, resolutionData] = await Promise.all([
      Complaint.aggregate(volumePipeline),
      Complaint.aggregate(resolutionPipeline)
    ]);

    // Build a lookup map for resolution times
    const resolutionMap = {};
    resolutionData.forEach((r) => {
      resolutionMap[r._id] = r.avgResolutionTime;
    });

    // Merge into single array, sort by avgResolutionTime ascending (null last)
    const merged = volumeData.map((v) => ({
      _id: v._id,
      totalComplaints: v.totalComplaints,
      assignedCount: v.assignedCount,
      avgResolutionTime: resolutionMap[v._id] ?? null
    }));

    merged.sort((a, b) => {
      if (a.avgResolutionTime === null) return 1;
      if (b.avgResolutionTime === null) return -1;
      return a.avgResolutionTime - b.avgResolutionTime;
    });

    console.log('[DASHBOARD] Aggregation output:', JSON.stringify(merged, null, 2));

    res.json(merged);
  } catch (error) {
    console.error('[DASHBOARD] Error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

module.exports = router;

