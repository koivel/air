import { useContext, useEffect, useRef, useState } from 'react';

import { KoivelDashboardEditor } from '../../contexts/koivel-dashboard-editor';
import DashboardMetaEdtior from './dashboard-meta-editor';
import DashboardSearchEditor from './dashboard-search-editor';

const DashboardSideEditor = (props) => {
  const { dashboardJson, setDashboardJson } = useContext(KoivelDashboardEditor);

  if (!dashboardJson['_id']) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <DashboardMetaEdtior />
      {(dashboardJson['searches'] || []).map(function (search, i) {
        return <DashboardSearchEditor search={search} index={i} key={i} />;
      })}
    </div>
  );
};

export default DashboardSideEditor;
