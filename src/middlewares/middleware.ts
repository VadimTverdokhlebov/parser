import { Request, Response, NextFunction } from 'express';

export default async function valadition(req: Request, res: Response, next: NextFunction) {
  try {
    next();
  } catch (err) {
    return next(err);
  }
}
