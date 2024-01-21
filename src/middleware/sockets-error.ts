import { Server, Socket } from 'socket.io';
import logger from '../utils/logging/logger';

export class SocketApiError extends Error {
  constructor(message: string, public errorCode: number, public rawErrors?: string[] | unknown) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class SocketErrorHandler {
  static handle(socket: Socket) {
    return (err: SocketApiError) => {
      const errorCode = err.errorCode || 500;
      let message = err.message;
      let errorStack = {};

      if (process.env.DEBUG == 'True') {
        errorStack = { stack: err.stack };
      }

      logger.error(`An Error occured on the server.
       Message: ${err.message}, 
       Stack: ${err.stack}`);

      socket.emit('socketError', {
        message,
        success: false,
        errorCode,
        errorStack,
        rawErrors: err.rawErrors || [],
      });
    };
  }
}

// Usage in ioEvents:
// export const ioEvents = async (io: Server) => {
//   io.on('connection', (socket: Socket) => {
//     // Handle socket-specific events and errors here

//     // Example:
//     socket.on('someEvent', () => {
//       try {
//         // Some logic that may throw a SocketApiError
//       } catch (error: any) {
//         // Handle the error using SocketErrorHandler
//         SocketErrorHandler.handle(socket)(error);
//       }
//     });
//   });
// };
