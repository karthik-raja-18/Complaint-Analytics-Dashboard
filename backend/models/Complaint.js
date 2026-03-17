const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      uppercase: true, // normalize: "resolved" → "RESOLVED"
    },
    createdAt: {
      type: Date,
      required: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      default: 'manual', // 'manual', 'springboot', etc.
    },
    externalReferenceId: {
      type: String,
      default: null, // Stores the ID from Spring Boot to avoid duplicates
    }
  },
  { timestamps: false }
);

module.exports = mongoose.model('Complaint', complaintSchema);
