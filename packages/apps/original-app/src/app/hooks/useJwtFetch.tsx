import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import { useKAuth } from '../contexts/koivel-auth';

const useFetch = (url, options = {}) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authenticated, accessTokenRef } = useKAuth();

  const optionsRef = useRef(options);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const doFetch = async () => {
      try {
        _.set(
          optionsRef.current,
          'headers.Authorization',
          'Bearer ' + accessTokenRef.current
        );

        const res = await fetch(url, optionsRef.current);
        const json = await res.json();
        if (!signal.aborted) {
          setResponse(json);
        }
      } catch (e) {
        if (!signal.aborted) {
          setError(e);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    if (authenticated) {
      doFetch();
    }
    return () => {
      abortController.abort();
    };
  }, [authenticated, url, accessTokenRef, optionsRef]);
  return { response, error, loading };
};
export default useFetch;
