const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/medicare');
  const Doctor = mongoose.model('Doctor', new mongoose.Schema({}, { strict: false, collection: 'doctors' }));
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
  
  try {
    const doctors = await Doctor.find({});
    console.log("Doctors found:", doctors.length);
    for (let doc of doctors) {
      console.log("Doctor id:", doc._id, "userId:", doc.userId);
      if (doc.userId) {
        try {
          const user = await User.findById(doc.userId);
          console.log("Found user:", user ? user.name : "null");
        } catch (err) {
          console.error("Error finding user by ID:", err.message);
        }
      }
    }
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}
run();
