import { JwtPayload } from 'jsonwebtoken';
import prisma from '@repo/db/client';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: number;
      };
    }
  }
}

interface DecodeToken extends JwtPayload {
  userId: number;
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.jwt;

    if (!token || token === undefined) {
      throw new ApiError(401, 'Unauthorized');
    }
    const decodedData = (await jwt.verify(
      token,
      process.env.JWT_SECRET!
    )) as DecodeToken;
    if (!decodedData) {
      throw new ApiError(403, 'forbidden');
    }
    const user = await prisma.user.findUnique({
      where: { id: decodedData?.userId },
      select: { id: true },
    });
    if (!user) {
      throw new ApiError(401, 'Unauthorized');
    }
    req.user = user;
    next();
  } catch (error: any) {
    console.log(`error in middleware :${error?.message}`);
    return res.status(500).json(new ApiError(500));
  }
};

export default protectRoute;
