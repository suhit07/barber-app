import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://bhumi:bhumi123123@bhumi.yfdsvwk.mongodb.net/')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err);
  });
