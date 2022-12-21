import mongoose from 'mongoose';
import 'dotenv/config';

const { CONNECTION_URL } = process.env;

// Connect to mongoose.
const dbConnection = () => {
  mongoose
    .connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    // Database Connected successfully
    .then(() => console.log('Database Connected successfully'))
    .catch((error) => console.log(`${error} did not connect`));
};

export default dbConnection;
