import { Link } from 'react-router-dom';

export function DashboardNavigationCard(props) {
  const dashboard = props.dashboard;

  return (
    <Link to={'/dashboard/' + dashboard._id}>
      <div className="hover:bg-slate-500 h-full bg-slate-600 rounded overflow-hidden shadow-lg">
        <img
          className="w-full"
          src={dashboard.backgroundImage}
          alt="No background"
        />
        <div className="px-6 py-4">
          <div className="font-bold text-white text-xl mb-2">
            {dashboard.displayName}
          </div>
          <p className="text-white text-base">{dashboard.description}</p>
        </div>
        <div className="px-6 pt-4 pb-2">
          {(dashboard.tags || []).map((tag: string) => {
            return (
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
}

export default DashboardNavigationCard;
