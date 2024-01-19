import mongoose from 'mongoose';

class Database {
  private readonly uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  async connect() {
    try {
      await mongoose.connect(this.uri);
      console.log('Connected to MongoDB');
    } catch (error: any) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error: any) {
      console.error('Error disconnecting from MongoDB:', error.message);
    }
  }
}

const mongodbUri = process.env.MONGODB_URI || '';

const database = new Database(mongodbUri);

export default database;
