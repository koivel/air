import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { environment } from '../../environments/environment';
import { useKAuth } from '../contexts/koivel-auth';
import useJwtFetch from '../hooks/useJwtFetch';

const Profile = () => {
  const { user } = useKAuth();

  const { response } = useJwtFetch(
    environment.koivelApiUrl + '/auth-api/api-keys/generate/events-write',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!user) {
    return <div>Loading ...</div>;
  }

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(response?.result);
    toast.success('Copied!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    user && (
      <div className="px-10 pt-3 lg:w-1/2">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="password"
        >
          Api key
        </label>
        <div className=" flex flex-col lg:flex-row gap-0">
          <input
            readOnly
            className="shadow appearance-none border select-all rounded-l-md lg:w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            onClick={copyKeyToClipboard}
            value={response?.result}
          ></input>

          <button
            className="rounded-r-md text-indigo-700 font-medium bg-indigo-100 hover:bg-indigo-200 p-2"
            onClick={copyKeyToClipboard}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  );
};

export default Profile;
