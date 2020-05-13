import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string; // id do usuario
}

export default function ensureAuthenticate(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('Token JWT is missing');
  }

  // authHeader terá o conteudo abaixo
  // authHeader = Barear adfasdfgasdfadqwer
  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    console.log('decodedToken ', decodedToken);

    const { sub } = decodedToken as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('JWT is invalid');
  }
}
