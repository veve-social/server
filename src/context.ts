import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

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
