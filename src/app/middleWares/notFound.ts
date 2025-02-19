/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import  HttpStatus  from 'http-status';

const NotFound = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!!",
    error: '',
  });
};

export default NotFound;