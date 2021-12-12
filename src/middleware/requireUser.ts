import { Request, Response, NextFunction } from 'express';

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user

  if (!user) {
    return res.status(403).json({ error: 'You must be logged in to access this route' })
  }
  
  next()
}


export default requireUser