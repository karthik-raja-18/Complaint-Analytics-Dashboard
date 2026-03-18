const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const { source } = req.query;
    const baseMatch = source ? { source } : {};

    // --- Pipeline 1: Volume ---
    const volumePipeline = [
      { $match: baseMatch },
      {
        $group: {
          _id: '$department',
          totalComplaints: { $sum: 1 },
          assignedCount: { $sum: { $cond: [{ $ne: ['$status', 'RESOLVED'] }, 1, 0] } }
        }
      }
    ];

    // --- Pipeline 2: Resolution ---
    const resolutionPipeline = [
      {
        $match: {
          ...baseMatch,
          status: 'RESOLVED',
          resolvedAt: { $ne: null, $type: 'date' },
          createdAt: { $type: 'date' }
        }
      },
      {
        $project: {
          department: 1,
          resolutionTime: { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 1000 * 60 * 60] }
        }
      },
      {
        $group: {
          _id: '$department',
          avgResolutionTime: { $avg: '$resolutionTime' }
        }
      }
    ];

    // --- Pipeline 3: Trends ---
    const trendsPipeline = [
      { $match: baseMatch },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ];

    const [volume, resolution, trends] = await Promise.all([
      Complaint.aggregate(volumePipeline),
      Complaint.aggregate(resolutionPipeline),
      Complaint.aggregate(trendsPipeline)
    ]);

    const resMap = {};
    resolution.forEach(r => resMap[r._id] = r.avgResolutionTime);

    const summary = volume.map(v => ({
      _id: v._id,
      totalComplaints: v.totalComplaints,
      assignedCount: v.assignedCount,
      avgResolutionTime: resMap[v._id] ?? null
    })).sort((a,b) => (a.avgResolutionTime || 999) - (b.avgResolutionTime || 999));

    res.json({ summary, trends });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/reset', async (req, res) => {
  try {
    await Complaint.deleteMany({});
    res.json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
