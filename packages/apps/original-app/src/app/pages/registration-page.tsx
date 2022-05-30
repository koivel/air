import { apm } from '@elastic/apm-rum';
import { withTransaction } from '@elastic/apm-rum-react';
import { LockClosedIcon } from '@heroicons/react/solid';
import { Field, Form, Formik } from 'formik';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useKAuth } from '../contexts/koivel-auth';

export function RegisterPage() {
  useEffect(() => {
    const tr = apm.getCurrentTransaction();
    if (tr && tr.type === 'route-change') {
      // bear in mind that a transaction needs at least one span
      const span = tr.startSpan('route change span');

      // transaction needs duration otherwise it will be discarded
      setTimeout(() => {
        span.end();
        tr.end();
      }, 1);
    }
  });

  const { register } = useKAuth();
  const navigate = useNavigate();

  const displayError = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
            Register your account
          </h2>
        </div>
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={async (values) => {
            const err: string = await register(
              values.email,
              values.password,
              values.confirmPassword
            );
            if (!err) {
              navigate('/');
            } else {
              displayError(err);
            }
          }}
        >
          <Form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <Field
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
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

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Sign up
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default withTransaction('/register', 'route-change')(RegisterPage);
