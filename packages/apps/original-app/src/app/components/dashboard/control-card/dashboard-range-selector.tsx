import { Popover } from '@headlessui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
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

  const { setStartDateEpochMs, setEndDateEpochMs } =
    useContext(KoivelDashboard);

  useEffect(() => {
    setStartDateEpochMs(startDate.getTime());
    setEndDateEpochMs(endDate.getTime());
  }, [startDate, endDate, setStartDateEpochMs, setEndDateEpochMs]);

  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>
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
  );
}
