import 'react-datepicker/dist/react-datepicker.css';

import { Popover } from '@headlessui/react';
import { RefreshIcon } from '@heroicons/react/solid';
import { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { usePopper } from 'react-popper';

import { KoivelDashboard } from '../../../contexts/koivel-dashboard-context';

export default function DashboardRangeSelector() {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  const now: number = new Date().getTime();
  const [startDate, setStartDate] = useState(
    new Date(now - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date(now + 60 * 60 * 1000));

  const { setStartDateEpochMs, setEndDateEpochMs, setLastRefreshEpochMs } =
    useContext(KoivelDashboard);

  useEffect(() => {
    setStartDateEpochMs(startDate.getTime());
    setEndDateEpochMs(endDate.getTime());
  }, [startDate, endDate, setStartDateEpochMs, setEndDateEpochMs]);

  return (
    <div className="flex gap-2">
      <button
        className='hover:bg-blue'
        onClick={() => {
          setLastRefreshEpochMs(new Date().getTime());
        }}
      >
       <RefreshIcon className="h-6 w-6 text-white hover:text-indigo-200"/>
      </button>
      <Popover>
        <Popover.Button className="align-middle" ref={setReferenceElement}>
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </Popover.Button>

        <Popover.Panel
          ref={setPopperElement}
          className="z-50"
          style={styles['popper']}
          {...attributes['popper']}
        >
          <div className="z-50 mt-5 mr-10 grid grid-cols-3">
            <div></div>
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              inline
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              inline
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
}
