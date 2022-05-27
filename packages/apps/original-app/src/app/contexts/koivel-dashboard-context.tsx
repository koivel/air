import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { environment } from '../../environments/environment';
import { useKAuth } from './koivel-auth';

const initalContext = {
  loading: true,
  dashboardId: null,
  setDashboardId: null,
  dashboardConfig: null,
  searchResults: null,
  potentialAccounts: null,
  selectedAccount: null,
  setSelectedAccount: null,
  startDateEpochMs: null,
  setStartDateEpochMs: null,
  endDateEpochMs: null,
  setEndDateEpochMs: null,
  setLastRefreshEpochMs: null,
};
export const KoivelDashboard = React.createContext(initalContext);

export const KoivelDashboardProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const { authenticated, accessTokenRef, user } = useKAuth();

  const [dashboardId, setDashboardId] = useState(null);
  const [dashboardConfig, setDashboardConfig] = useState(null);

  const [potentialAccounts, setPotentialAccounts] = useState();
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [startDateEpochMs, setStartDateEpochMs] = useState(null);
  const [endDateEpochMs, setEndDateEpochMs] = useState(null);

  const [searchResults, setSearchResults] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [lastRefreshEpochMs, setLastRefreshEpochMs] = useState(
    new Date().getTime()
  );

  const [lastSearchHash, setLastSearchHash] = useState(null);
  const [searchHash, setSearchHash] = useState(null);

  React.useEffect(() => {
    const userId: string = searchParams.get('userId');
    if (!userId && user?._id) {
      setSearchParams({ userId: user?._id }, { replace: true });
    }
  }, [searchParams, setSearchParams, user]);

  React.useEffect(() => {
    if (
      searchParams &&
      selectedAccount?.accountId &&
      dashboardConfig?.searches
    ) {
      setSearchHash(
        `${searchParams.get('userId')}/${
          selectedAccount.accountId
        }/${startDateEpochMs}/${endDateEpochMs}/${lastRefreshEpochMs}`
      );
    }
  }, [
    searchParams,
    selectedAccount?.accountId,
    startDateEpochMs,
    endDateEpochMs,
    setSearchHash,
    lastRefreshEpochMs,
    dashboardConfig?.searches,
  ]);

  React.useEffect(() => {
    async function executeSearches() {
      let fullResults = {};
      for (const search of dashboardConfig.searches) {
        const response = await fetch(
          environment.koivelApiUrl + '/event-api/events/search',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + accessTokenRef.current,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...search,
              ...{
                controlMeta: {
                  userId: searchParams.get('userId'),
                  accountIds: [selectedAccount.accountId],
                  startDateEpochMs: startDateEpochMs,
                  endDateEpochMs: endDateEpochMs,
                },
              },
            }),
          }
        );
        const json = await response.json();

        if (json.success) {
          fullResults = { ...fullResults, ...json.result };
        }
      }

      setSearchResults(fullResults);
      setLoading(false);
    }

    if (searchHash && searchHash !== lastSearchHash) {
      setLastSearchHash(searchHash);
      executeSearches();
    }
  }, [
    searchHash,
    lastSearchHash,
    authenticated,
    selectedAccount?.accountId,
    accessTokenRef,
    startDateEpochMs,
    endDateEpochMs,
    setLastSearchHash,
    searchParams,
    dashboardConfig?.searches,
  ]);

  React.useEffect(() => {
    async function loadDashboard() {
      const response = await fetch(
        environment.koivelApiUrl + `/dashboard-api/dashboard/${dashboardId}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessTokenRef.current,
            'Content-Type': 'application/json',
          },
        }
      );
      const dash = await response.json();
      if (dash.success) {
        setDashboardConfig(dash.result);

        const accountResponse = await fetch(
          environment.koivelApiUrl + '/event-api/events/search/accounts',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + accessTokenRef.current,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              collectionId: dash.result.collectionId,
              userId: searchParams.get('userId'),
            }),
          }
        );
        const accounts = await accountResponse.json();
        setPotentialAccounts(accounts.result);
        setSelectedAccount(
          accounts.result?.length > 0 ? accounts.result[0] : null
        );
      }
    }

    if (
      dashboardId &&
      dashboardConfig?._id !== dashboardId &&
      authenticated !== null
    ) {
      setLoading(true);
      loadDashboard();
    }
  }, [
    dashboardId,
    searchParams,
    authenticated,
    accessTokenRef,
    dashboardConfig?._id,
  ]);

  const value = {
    loading,
    dashboardId,
    setDashboardId,
    dashboardConfig,
    searchResults,
    potentialAccounts,
    selectedAccount,
    setSelectedAccount,
    startDateEpochMs,
    setStartDateEpochMs,
    endDateEpochMs,
    setEndDateEpochMs,
    setLastRefreshEpochMs,
  };

  return (
    <KoivelDashboard.Provider value={value}>
      {children}
    </KoivelDashboard.Provider>
  );
};
