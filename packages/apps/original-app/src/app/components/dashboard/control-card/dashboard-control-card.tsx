import DashboardAccountSelector from './dashboard-account-selector';
import DashboardRangeSelector from './dashboard-range-selector';

export default function DashboardControlCard() {
  return (
    <div className="flex flex-col lg:flex-row bg-slate-500 p-2 gap-2">
      <div className="flex basis-1/5 flex-col lg:flex-row">
        <div className="py-2 gap-2 pr-2 font-medium text-base text-gray-darker pt-2 pl-2">
          Account
        </div>
        <DashboardAccountSelector />
      </div>
      <div className="basis-3/5"></div>
      <div className="basis-1/5 w-full flex justify-end pt-2 pl-2">
        <DashboardRangeSelector />
      </div>
    </div>
  );
}
