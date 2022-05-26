import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardCard from '../components/dashboard/dashboard-card';
import DashboardControlCard from '../components/dashboard/control-card/dashboard-control-card';
import { KoivelDashboard } from '../contexts/koivel-dashboard-context';

export function Dashboard() {
  const { dashboardId } = useParams<'dashboardId'>();

  const { setDashboardId, dashboardConfig } = React.useContext(KoivelDashboard);

  React.useEffect(() => {
    setDashboardId(dashboardId);
  }, [dashboardId, setDashboardId]);

  if (!dashboardConfig?.cards) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-4 mx-4 flex flex-col gap-4 text-white">
      <DashboardControlCard />
      <div className="grid auto-rows-[400px] grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
        {dashboardConfig?.cards?.map((card, index) => {
          return <DashboardCard key={index} cardConfig={card} />;
        })}
      </div>
    </div>
  );
}

export default Dashboard;
