import { FastifyRequest, FastifyReply } from 'fastify';

import * as admin from 'firebase-admin';

// import { firebaseConfig } from '../../config/firebase-conf';
import RequestContext from '../utils/request-context';

export const parser = async (
  authHeader: string,
  mimicId: string,
): Promise<admin.auth.DecodedIdToken> => {
  if (!authHeader && process.env.NODE_ENV === 'development') {
    const user = await admin.auth().getUser(mimicId);
    return {
      uid: user.uid,
      email: user.email,
      ...user.customClaims,
    } as any;
  } else if (!authHeader) {
    throw new Error('Token not Found!');
  }

  const split = authHeader?.split('Bearer ');
  if (split?.length !== 2) {
    throw new Error('No Token Found!');
  }

  try {
    const token = split[1];
    return await admin.auth().verifyIdToken(token);
  } catch (err) {
    throw new Error('Invalid token found!');
  }
};

export const parseToken: any = async (
  req: FastifyRequest,
  _res: FastifyReply,
  next: () => void,
) => {
  const Authorization = req.headers['Authorization'] as string;
  const mimicId = req.headers['x-mimic-user-id'] as string;

  if (!Authorization && !mimicId) {
    return next();
  }

  try {
    const decodedToken: admin.auth.DecodedIdToken = await parser(
      Authorization,
      mimicId,
    );
    RequestContext.set('user', decodedToken);
    next();
  } catch (err) {
    console.log(`Error parsing token: `, { Authorization, err });
    next();
  }
};
