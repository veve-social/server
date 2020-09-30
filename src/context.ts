import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

import { redis } from './config/redis';

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
  redis: Redis.Redis;
}

export function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Context {
  return { prisma, req, res, redis };
}
