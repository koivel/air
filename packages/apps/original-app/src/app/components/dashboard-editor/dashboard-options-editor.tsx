import { useEffect, useRef, useState } from 'react';

const DashboardOptionsEditor = (props) => {
  const options = props.options;

  const updateOptionValue = (e) => {
    options[e.target.id] = e.target.value;
    props.onChange(options);
  };

  const updateOptionKey = (e) => {
    const oldValue = options[e.target.id];
    delete options[e.target.id];
    options[e.target.value] = oldValue;
    props.onChange(options);
  };

  const addOption = () => {
    options['new'] = '';
    props.onChange(options);
  };

  return (
    <div className="flex flex-col gap-2">
      {Object.keys(options).map((key, i) => {
        return (
          <div key={i} className="flex gap-2">
            <input key={'k/' + i} id={key} defaultValue={key} onBlur={updateOptionKey} />
            <input key={'v/' + i} id={key} defaultValue={options[key]} onBlur={updateOptionValue} />
          </div>
        );
      })}
      <button type="button" onClick={addOption}>
        +
      </button>
    </div>
  );
};

export default DashboardOptionsEditor;
