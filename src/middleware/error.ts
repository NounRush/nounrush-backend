import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logging/logger';

export class ApiError extends Error {
  constructor(message: string, public statusCode: number, public rawErrors?: string[] | unknown) {
    super(message);
    Error.captureStackTrace(this, this.constructor); // captures errors from every part of the application
  }
}

export class ErrorHandler {
  static handle() {
    return (err: ApiError, req: Request, res: Response, next: NextFunction) => {
      const statusCode = err.statusCode || 500;
      let message = err.message;
      let errorStack = {};
      if(process.env.DEBUG=="False" && statusCode == 500){
        message = "Something went wrong, Please try again later!"
        logger.error(`An Error occured on the server.
         Message: ${err.message}, 
         Stack: ${err.stack}` );

      }
      if (process.env.DEBUG == "True") {
        errorStack = { stack: err.stack };
      }

      res.status(statusCode).json({
        message,
        success: false,
        errorStack,
        rawErrors: err.rawErrors ?? [],
      });
    };
  }

  static pagenotFound() {
    return (req: Request, res: Response, next: NextFunction) => {
      throw new NotFoundError(req.path);
    };
  }

  static exceptionRejectionHandler() {
    process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
      console.log(reason.name, reason.message);
      console.log('UNHANDLED REJECTION!.. Shutting down Server');
      throw reason;
    });

    process.on('uncaughtException', (err: Error) => {
      console.log(err.name, err.message);
      console.log('UNCAUGHT EXCEPTION!');
      process.exit(1);
    });
  }
}

export class NotFoundError extends ApiError {
  constructor(path: string) {
    super(`Requested Path ${path} is not found`, 404);
  }
}

export class AuthError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class NotAuthorizedError extends ApiError {
  constructor(message:string = "Not Authorized!"){
    super(message, 403)
  }
}

export class BadTokenError extends ApiError {
  constructor(message: string = "Bad Token Provided!") {
    super(message, 401);
  }
}

export class BadRequestError extends ApiError {
  constructor(public message: string, public errors?: string[]) {
    super(message, 400, errors);
  }
}

export class InternalServerError extends ApiError{
  constructor(public errors?: unknown) {
    super("Internal Server Error", 500, errors);
  }
}

export class ConflictError extends ApiError{
  constructor(message:string){
    super(message, 409)
  }
}
