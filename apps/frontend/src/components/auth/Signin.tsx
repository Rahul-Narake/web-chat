import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import useSignin from '../../hooks/useSignin';
import axios from 'axios';

export interface ISigninData {
  username: string;
  password: string;
}

const Signin: React.FC = () => {
  const [signinData, setSigninData] = useState<ISigninData>({
    username: '',
    password: '',
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISigninData>();
  const { loading, signin } = useSignin();

  const onSubmit: SubmitHandler<ISigninData> = async (data) => {
    await signin(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl mb-6 text-center font-bold">Sign In</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register('username', {
              required: 'Username required',
              minLength: {
                value: 5,
                message: 'Username should be of minimum 5 length',
              },
            })}
            value={signinData?.username}
            onChange={(e) =>
              setSigninData((p) => {
                return { ...p, [e.target.name]: e.target.value };
              })
            }
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          {errors?.username && (
            <span className="text-sm text-red-500">
              {errors?.username.message}
            </span>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Password required',
              minLength: {
                value: 8,
                message: 'Password must be minimum of length 8',
              },
            })}
            value={signinData?.password}
            onChange={(e) =>
              setSigninData((p) => {
                return { ...p, [e.target.name]: e.target.value };
              })
            }
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          {errors?.password && (
            <span className="text-sm text-red-500">
              {errors?.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Signing..' : 'Sign in'}
        </button>

        <span className="text-sm ">
          Don't have account?{' '}
          <Link className="text-blue-600" to={'/signup'}>
            Signup here
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signin;
