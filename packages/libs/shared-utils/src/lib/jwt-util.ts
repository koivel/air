import { Request } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import * as jsonwebtoken from 'jsonwebtoken';
import { KJwtBody } from '@air/shared-api-spec';
import { Logger } from './logger';

export class JwtUtil {
  public static readonly ACCESS_PERM: string = 'koivel:access';

  public static sign(
    tokenBody: KJwtBody,
    options: { expiresIn?: string } = {}
  ): string {
    return jsonwebtoken.sign(
      tokenBody,
      process.env['KOIVEL_JWT_SECRET'],
      options
    );
  }

  public static extractFromReq(
    req: Request<any, any, any, ParsedQs, Record<string, any>>
  ): KJwtBody {
    try {
      const bearer: string = req.headers.authorization;
      const token: string = bearer?.split(' ')?.[1] || '';
      const decoded = JwtUtil.extractFromString(token);
      return decoded;
    } catch (e) {
      Logger.error(e);
    }
    return null;
  }

  public static extractFromString(token: string): KJwtBody {
    try {
      const decoded = jsonwebtoken.verify(
        token,
        process.env['KOIVEL_JWT_SECRET']
      );
      return decoded;
    } catch (e) {
      Logger.error(e);
    }
    return null;
  }

  public static extractUserIdFromReq(
    req: Request<any, any, any, ParsedQs, Record<string, any>>
  ): string {
    const decoded: KJwtBody = JwtUtil.extractFromReq(req);
    return decoded?.userId;
  }

  public static assertIncludesPerm(decoded: KJwtBody, perm: string) {
    if (!decoded.perms.some((p) => p.perm === perm)) {
      throw new Error('Missing perm: ' + perm);
    }
  }

  public static includesPerm(decoded: KJwtBody, perm: string) {
    return decoded.perms.some((p) => p.perm === perm);
  }

  public static assertAccessToken(
    req: Request<any, any, any, ParsedQs, Record<string, any>>
  ): string {
    const decoded = JwtUtil.extractFromReq(req);
    JwtUtil.assertIncludesPerm(decoded, JwtUtil.ACCESS_PERM);
    return decoded.userId;
  }
}
