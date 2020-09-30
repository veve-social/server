import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

interface User {
  uid: number;
}

declare module 'express' {
  interface Request {
    user?: User;
  }
}

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Context {
  return { prisma, req, res };
}
