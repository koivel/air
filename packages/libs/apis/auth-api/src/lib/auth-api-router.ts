import {
  KJwt,
  KJwtBody,
  KUser,
  KUserLoginReq,
  KUserRegisterReq,
  KUserResetPasswordReq,
  KUserUpdatePasswordReq,
} from '@air/shared-api-spec';
import { AuthUtil, JwtUtil, Logger } from '@air/shared-utils';
import sgMail from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import * as fs from 'fs';
import { singleton } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import { UserDao } from './user-dao';

@singleton()
export class AuthApiRouter {
  private static readonly REFRESH_PERM: string = 'koivel:refresh';

  constructor(private userApiDao: UserDao) {}

  public attachRoutes(router: Router): Router {
    router.get('/user/current', async (req, res) => {
      const userId = JwtUtil.assertAccessToken(req);
      const user: KUser = await this.userApiDao.findOneById(userId);
      Logger.info('get user by id : %s : %j', userId, user);
      res.send(user);
    });

    router.post('/user/login', async (req, res) => {
      const body: KUserLoginReq = req.body;

      const user: KUser = await this.userApiDao.findOneByEmail(body.email);
      if (!user || !bcrypt.compareSync(body.password, user.passwordHash)) {
        res.status(500).send({ message: 'invaid login' });
        return;
      }

      const kTokenBody: KJwtBody = {
        userId: user._id,
        generationUuid: uuidv4(),
        perms: [{ perm: AuthApiRouter.REFRESH_PERM }],
      };
      const jwt: string = JwtUtil.sign(kTokenBody);

      const result: KJwt = { result: jwt };
      res.send(result);
    });

    router.post('/user/register', async (req, res) => {
      const body: KUserRegisterReq = req.body;

      try {
        const userId: string = await this.userApiDao.register(body);
        const koivelWriteToken: KJwtBody = {
          userId: userId,
          generationUuid: uuidv4(),
          perms: [{ perm: AuthApiRouter.REFRESH_PERM }],
        };
        const jwt: string = JwtUtil.sign(koivelWriteToken);

        //enabled: 1653757794824
        sgMail.setApiKey(process.env['SENDGRID_API_KEY']);
        const msg = {
          to: body.email,
          from: 'koivel@koivel.com',
          subject: 'Welcome to Koivel!',
          html: fs.readFileSync(
            __dirname + '/assets/email-templates/welcome-email.html',
            'utf8'
          ),
        };
        await sgMail.send(msg);

        const result: KJwt = { result: jwt };
        res.send(result);
      } catch (err) {
        if (err['code'] === 11000) {
          res
            .status(500)
            .send({ message: 'An account with the email already exists.' });
        } else {
          res.status(500).send({ message: err['message'] });
        }
      }
    });

    router.post('/user/update-password', async (req, res) => {
      const body: KUserUpdatePasswordReq = req.body;
      const jwtBody: KJwtBody = JwtUtil.extractFromString(body.jwt.trim());

      AuthUtil.assertPermsAllow(
        [`auth-api:reset-password:userId:${jwtBody.userId}`],
        jwtBody.perms.map((p) => p.perm)
      );

      await this.userApiDao.updatePassword(jwtBody.userId, body.password);
      res.send({ success: true });
    });

    router.post('/user/send-reset-password', async (req, res) => {
      const body: KUserResetPasswordReq = req.body;

      const user: KUser = await this.userApiDao.findOneByEmail(body.email);
      if (user) {
        const koivelWriteToken: KJwtBody = {
          userId: user._id,
          generationUuid: uuidv4(),
          perms: [{ perm: `auth-api:reset-password:userId:${user._id}` }],
        };
        const jwt: string = JwtUtil.sign(koivelWriteToken, {
          expiresIn: '15m',
        });

        sgMail.setApiKey(process.env['SENDGRID_API_KEY']);
        const msg = {
          to: user.email,
          from: 'koivel@koivel.com',
          subject: 'Koivel Password Reset',
          html: `Click <a href="https://koivel.com/update-password?jwt=${jwt}">here</a> to reset your password. If you did not request a password reset ignore this email. This link will expire in 15 mins.`,
        };

        await sgMail.send(msg);
        res.send({ success: true });
      }
    });

    router.get('/api-keys/generate/user-access', async (req, res) => {
      const decoded: KJwtBody = JwtUtil.extractFromReq(req);
      JwtUtil.assertIncludesPerm(decoded, AuthApiRouter.REFRESH_PERM);

      const koivelWriteToken: KJwtBody = {
        userId: decoded.userId,
        generationUuid: uuidv4(),
        perms: [{ perm: JwtUtil.ACCESS_PERM }],
      };
      const jwt: string = JwtUtil.sign(koivelWriteToken, { expiresIn: '15m' });

      const result: KJwt = { result: jwt };
      res.send(result);
    });

    router.get('/api-keys/generate/events-write', async (req, res) => {
      const userId = JwtUtil.assertAccessToken(req);

      const koivelWriteToken: KJwtBody = {
        userId: userId,
        generationUuid: uuidv4(),
        perms: [{ perm: 'event-api:write:' + userId }],
      };
      const jwt: string = JwtUtil.sign(koivelWriteToken);

      const result: KJwt = { result: jwt };
      res.send(result);
    });

    return router;
  }
}
