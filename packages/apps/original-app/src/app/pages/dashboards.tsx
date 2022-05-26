import { environment } from '../../environments/environment';
import DashboardNavigationCard from '../components/dashboard/dashboard-navigation-card';
import useJwtFetch from '../hooks/useJwtFetch';

export function Dashbaords() {
  const { response } = useJwtFetch(
    environment.koivelApiUrl + '/dashboard-api/dashboards',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-4 pt-4">
      {response?.result?.map((dashboard, index) => {
        return <DashboardNavigationCard key={index} dashboard={dashboard} />;
      })}
    </div>
  );
}

export default Dashbaords;
