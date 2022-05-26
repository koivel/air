import React from 'react';
import { KoivelDashboard } from '../../../contexts/koivel-dashboard-context';
import {
  easepick,
  RangePlugin,
  TimePlugin,
  PresetPlugin,
} from '@easepick/bundle';

export default function DashboardTimeRangeSelector() {
  const { setStartDateEpochMs, setEndDateEpochMs } =
    React.useContext(KoivelDashboard);

  const onChange = (startDate: Date, endDate: Date) => {
    if (startDate?.getTime() === endDate?.getTime()) {
        endDate = null;
    }
    setStartDateEpochMs(startDate?.getTime());
    setEndDateEpochMs(endDate?.getTime());
  };

  React.useEffect(() => {
    new easepick.create({
      element: '#datepicker',
      css: [
        'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.1.6/dist/index.css',
      ],
      zIndex: 10,
      format: 'HH:mm, DD/MM/YY',
      plugins: [RangePlugin, PresetPlugin, TimePlugin],
      setup: (picker) => {
        picker.on('select', (event) => {
          const { start, end } = event.detail;
          onChange(start, end);
        });
      },
    });
  }, []);

  return <input className="bg-slate-500" id="datepicker" />;
}
