const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://abdurrahmanjhelum_db_user:MedicarePass1234@cluster0.vyuewxj.mongodb.net/medicare?retryWrites=true&w=majority');
  
  const Appointment = mongoose.model('Appointment', new mongoose.Schema({}, { strict: false, collection: 'appointments' }));
  const Doctor = mongoose.model('Doctor', new mongoose.Schema({}, { strict: false, collection: 'doctors' }));
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
  
  try {
    console.log('=== CHECKING DATABASE ===\n');
    
    // Check total appointments
    const totalAppointments = await Appointment.countDocuments({});
    console.log('Total appointments in DB:', totalAppointments);
    
    // Get all appointments
    const appointments = await Appointment.find({}).limit(10).lean();
    console.log('\nSample appointments (first 10):');
    appointments.forEach((apt, i) => {
      console.log(`${i + 1}. ID: ${apt._id}`);
      console.log(`   Patient ID: ${apt.patientId}`);
      console.log(`   Doctor ID: ${apt.doctorId}`);
      console.log(`   Patient Name: ${apt.patientName}`);
      console.log(`   Doctor Name: ${apt.doctorName}`);
      console.log(`   Date: ${apt.date}`);
      console.log(`   Status: ${apt.status}`);
      console.log('');
    });
    
    // Check doctors
    const doctors = await Doctor.find({}).lean();
    console.log(`\nTotal doctors in DB: ${doctors.length}`);
    doctors.forEach((doc, i) => {
      console.log(`${i + 1}. Doctor ID: ${doc._id}`);
      console.log(`   User ID: ${doc.userId}`);
      console.log(`   Name: ${doc.clinic || 'N/A'}`);
      console.log('');
    });
    
    // Check users
    const users = await User.find({}).select('_id name email role').lean();
    console.log(`\nTotal users in DB: ${users.length}`);
    users.forEach((user, i) => {
      console.log(`${i + 1}. User ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    });
    
    // Check if any appointments match doctor userIds
    console.log('=== CHECKING MATCHES ===');
    for (const doctor of doctors) {
      if (doctor.userId) {
        const matchingAppointments = await Appointment.countDocuments({ doctorId: doctor.userId });
        console.log(`Doctor userId: ${doctor.userId} -> Matching appointments: ${matchingAppointments}`);
      }
    }
    
  } catch (e) {
    console.error('Error:', e);
  }
  process.exit(0);
}

run();
