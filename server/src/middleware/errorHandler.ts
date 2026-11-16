import type { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || (err as any).status || 500;
  const message = (process.env.NODE_ENV === 'production' && statusCode === 500)
    ? 'Internal Server Error'
    : (err.message || 'Internal Server Error');

  console.error(`[Error] ${req.method} ${req.path} - ${statusCode}:`, err);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
