import { Link } from 'react-router-dom';
import { useKAuth } from '../contexts/koivel-auth';

const ButtonGroup = ({loggedIn}: {loggedIn: boolean}) => {
  return (
    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
      {
        !loggedIn ? <>
          <div className="rounded-md shadow">
            <Link to="/register">
              <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                Sign up
              </button>
            </Link>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <Link
              to="/dashboard/runelite-demo?userId=627e904615e08aef07420879"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
            >
              Live demo
            </Link>
          </div>
        </> :
          <Link to="/dashboards">
          <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
            See your Dashboards
          </button>
        </Link>
      }
      <div className="mt-3 sm:mt-0 sm:ml-3">
        <a
          href="https://discord.gg/SgcfNBJGpM"
          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
        >
          Discord
        </a>
      </div>
    </div>
  )
}

export function Landing() {
  const { user } = useKAuth();

  return (
    <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
      <div className="sm:text-center lg:text-left">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Give users</span>{' '}
          <span className="block text-indigo-600 xl:inline">their data</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          Easily build interactive dashboards using our API. Then quickly ship
          them to your users giving them flexabile access to their data. Allow
          them to share and compare these dashboards building community and
          competition.
        </p>
        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <ButtonGroup loggedIn={user != null && user.authenticated} />
        </div>
        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <img
            className=""
            src="https://user-images.githubusercontent.com/105302579/169170745-2eb3ddbf-dd99-46dd-a54b-c30dd3840d3b.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Landing;
