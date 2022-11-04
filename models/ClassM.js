import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  sport: { type: String, required: true },
  description: { type: String, required: false },
  tasks: [
    {
      name: { type: Array },
    },
  ],
  athlete: { type: Array },
});

const Class = mongoose.models.Class || mongoose.model('Class', classSchema);

module.exports = Class;
