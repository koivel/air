import { LockClosedIcon } from '@heroicons/react/solid';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import { environment } from '../../environments/environment';
import { toast } from 'react-toastify';

export default function PasswordUpdatePage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const requestPasswordUpdate = async (password, confirmPassword) => {
    if(password !== confirmPassword) {
      toast.error('Passwords do not match.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const jwt: string = searchParams.get('jwt');
    const res = await fetch(
      environment.koivelApiUrl + '/auth-api/user/update-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: jwt, password: password }),
      }
    );
    if (res.status === 200) {
      toast.success('Password reset', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/login');
    } else {
      toast.error('Error resetting password', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-200 p-8 rounded-md">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/assets/logo.svg"
            alt="Koivel"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Request a password reset
          </h2>
        </div>
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          onSubmit={async (values) => {
            await requestPasswordUpdate(
              values.password,
              values.confirmPassword
            );
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Confirm Password
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                  </span>
                  Request Reset
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
