import { Request, Response, NextFunction } from 'express';
import User from '../entities/user';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: User;
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET ?? "aytyt", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as User;
    next();
  });
}

export default authenticateToken;