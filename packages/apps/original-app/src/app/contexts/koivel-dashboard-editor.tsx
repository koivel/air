import { createContext, useState } from 'react';

const initalContext = {
  dashboardJson: null,
  setDashboardJson: null,
};
export const KoivelDashboardEditor = createContext(initalContext);

export const KoivelDashboardEditorProvider = ({ children }) => {
  const [dashboardJson, setDashboardJson] = useState({});

  const value = {
    dashboardJson,
    setDashboardJson,
  };

  return (
    <KoivelDashboardEditor.Provider value={value}>
      {children}
    </KoivelDashboardEditor.Provider>
  );
};
