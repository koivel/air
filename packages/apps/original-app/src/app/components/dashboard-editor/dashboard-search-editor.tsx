import { useContext, useEffect, useRef, useState } from 'react';

import { KoivelDashboardEditor } from '../../contexts/koivel-dashboard-editor';
import DashboardOptionsEditor from './dashboard-options-editor';

const DashboardSearchEditor = (props) => {
  const { dashboardJson, setDashboardJson } = useContext(KoivelDashboardEditor);

  const index = props.index;
  const search = props.search;

  const SearchFilterEditor = (props) => {
    const filter = props.filter;
    const filterIndex = props.index;

    const onOptionsUpdate = (options) => {
      filter['options'] = options;
      const updatedDashboard = { ...dashboardJson };
      updatedDashboard['searches'][index]['must'][filterIndex] = filter;
      setDashboardJson(updatedDashboard);
    };

    return (
      <div className="flex flex-col gap-2">
        <span>
          {filterIndex}: {filter.type}
        </span>
        <DashboardOptionsEditor
          onChange={onOptionsUpdate}
          options={filter.options}
        />
      </div>
    );
  };

  return (
    <div>
      <span>{search.key}</span>
      {(search['must'] || []).map((filter, i) => {
        return <SearchFilterEditor key={i} index={i} filter={filter} />;
      })}
    </div>
  );
};

export default DashboardSearchEditor;
