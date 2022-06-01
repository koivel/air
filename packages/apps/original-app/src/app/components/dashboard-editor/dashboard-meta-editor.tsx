import { useContext, useEffect, useRef, useState } from 'react';

import { KoivelDashboardEditor } from '../../contexts/koivel-dashboard-editor';

const DashboardMetaEdtior = (props) => {
  const { dashboardJson, setDashboardJson } = useContext(KoivelDashboardEditor);

  const handleBasicUpdate = (event) => {
    const updated = { ...dashboardJson };
    updated[event.target.id] = event.target.value;
    setDashboardJson(updated);
  };

  const handleTagsUpdate = (event) => {
    const updated = { ...dashboardJson };
    updated['tags'] = event.target.value.split(',');
    setDashboardJson(updated);
  };

  return (
    <div className="flex flex-col">
      <input
        type="text"
        id="_id"
        value={dashboardJson['_id']}
        onChange={handleBasicUpdate}
      />
      <input
        type="text"
        id="displayName"
        value={dashboardJson['displayName']}
        onChange={handleBasicUpdate}
      />
      <input
        type="text"
        id="collectionId"
        value={dashboardJson['collectionId']}
        onChange={handleBasicUpdate}
      />
      <input
        type="text"
        id="description"
        value={dashboardJson['description']}
        onChange={handleBasicUpdate}
      />
      <input
        type="text"
        id="backgroundImage"
        value={dashboardJson['backgroundImage']}
        onChange={handleBasicUpdate}
      />
      <input
        type="text"
        id="tags"
        value={dashboardJson['tags']}
        onChange={handleTagsUpdate}
      />
    </div>
  );
};

export default DashboardMetaEdtior;
