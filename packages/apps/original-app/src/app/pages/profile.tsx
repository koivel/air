import React from 'react';
import { environment } from '../../environments/environment';
import { useKAuth } from '../contexts/koivel-auth';
import useJwtFetch from '../hooks/useJwtFetch';
import Gravatar from 'react-gravatar';

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

  return (
    user && (
      <div className='px-10 pt-3 lg:w-1/6'>
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="password"
        >
          Api key
        </label>
        <input
          className="shadow appearance-none border select-all rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          value={response?.result}
        ></input>
      </div>
    )
  );
};

export default Profile;
