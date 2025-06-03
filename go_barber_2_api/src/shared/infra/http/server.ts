/* eslint-disable import/prefer-default-export */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import morgan from 'morgan';
import 'express-async-errors';
import 'reflect-metadata';
import 'dotenv/config';
import { getMongoRepository, MongoRepository } from 'typeorm';

import routes from '@shared/infra/http/routes';
import uploadConfig from '@config/upload';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import AppError from '@shared/errors/AppError';

import '@shared/infra/typeorm';
import path from 'path';
import { connectMongoDB } from '@config/mongodb';

const app = express();

// Initialize MongoDB before starting server
connectMongoDB().then(() => {
  // Removed direct app.listen call that was causing EADDRINUSE before retry logic
});

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response
        .status(error.statusCode)
        .send({ status: 'error', message: error.message });
    }

    console.error(error);

    return response.status(500).send({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

const initializeServer = (port: number = 3000) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
  .on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} occupied, retrying on ${port + 1}`);
      server.close(() => initializeServer(port + 1));
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    server.close(() => process.exit(0));
  });

  return server;
};

// Start server with default port 3000 after MongoDB connection is established
// The initializeServer function contains the port retry logic.
initializeServer(Number(process.env.PORT) || 3000);

export const forgotPasswordTemplate = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'modules',
  'users',
  'views',
  'forgot_password.hbs',
);
