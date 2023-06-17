import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import RequestContext from '../utils/request-context';
import { getEnvVariable } from 'src/common/utils/env';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = context.getArgByIndex(2);
    const user = RequestContext.get('user') || gqlContext?.extra?.user;
    return Boolean(user);
  }
}

@Injectable()
export class APIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const API_KEY = getEnvVariable('API_KEY');
    const gqlContext = context.getArgByIndex(2);
    const apiKey = RequestContext.get('x-api-key') || gqlContext?.extra?.apiKey;
    return apiKey === API_KEY;
  }
}
