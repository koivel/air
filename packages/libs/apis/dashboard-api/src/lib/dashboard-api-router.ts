import { KDashboard } from '@air/shared-api-spec';
import { JwtUtil } from '@air/shared-utils';
import { Router } from 'express';
import { singleton } from 'tsyringe';
import { DashboardApiDao } from './dashboard-api-dao';

@singleton()
export class DashboardApiRouter {
  constructor(private dashboardApiDao: DashboardApiDao) {}

  public attachRoutes(router: Router): Router {
    router.get('/dashboard/:id', async (req, res) => {
      const dashboardId: string = req.params.id;
      const userId: string = JwtUtil.extractUserIdFromReq(req);
      const perms: string[] = [
        'dashboards:read:userId:*',
        `dashboards:read:userId:${userId}`,
      ];
      const dashboard: KDashboard = await this.dashboardApiDao.findOneById(
        dashboardId,
        perms
      );
      res.send({ success: dashboard != null, result: dashboard });
    });

    router.get('/dashboards', async (req, res) => {
      const userId: string = JwtUtil.extractUserIdFromReq(req);
      const perms: string[] = [
        'dashboards:read:userId:*',
        `dashboards:read:userId:${userId}`,
      ];
      const dashboards: KDashboard[] =
        await this.dashboardApiDao.findAllReadableThin(perms);
      res.send({ success: dashboards != null, result: dashboards });
    });

    return router;
  }
}
