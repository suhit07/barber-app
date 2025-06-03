import { createConnection } from 'typeorm';

export const connectMongoDB = async () => {
  try {
    const connection = await createConnection({
      name: 'mongo',
      type: 'mongodb',
      url: process.env.MONGODB_URI,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      entities: [
        __dirname + '/../../modules/**/infra/typeorm/schemas/*{.ts,.js}'
      ],
      synchronize: true
    });

    console.log('MongoDB connected via TypeORM');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};