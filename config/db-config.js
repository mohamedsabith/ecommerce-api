import mongoose from 'mongoose';
import chalk from 'chalk';
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
    .then(() => console.log(chalk.blue('Database Connected successfully')))
    .catch((error) => console.log(chalk.red(`${error.message} did not connect`)));
};

export default dbConnection;
