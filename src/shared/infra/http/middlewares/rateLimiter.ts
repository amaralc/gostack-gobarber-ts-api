import redis from 'redis';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 10, // 5 requests
  duration: 2, // per 1 second by IP
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    /** Avalia requisicoes do ip */
    await limiter.consume(request.ip);

    /** Se nao ultrapassarem limitacoes do limitador, segue requisicao */
    return next();

    /** Se  limiter retornar erro */
  } catch (error) {
    /** Retorna mensagem de erro */
    throw new AppError('Too many requests', 429);
  }
}
