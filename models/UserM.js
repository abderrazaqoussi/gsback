import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
  emailVerified: { type: Boolean },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
