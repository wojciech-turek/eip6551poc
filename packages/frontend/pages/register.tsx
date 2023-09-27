import { useRouter } from 'next/router';
import React from 'react';

const Signup = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const router = useRouter();

  const handleSignup = async () => {
    try {
      await fetch('http://localhost:5002/account/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      router.push('/');
    } catch {
      console.log('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-w-md mx-auto">
      <div className="">
        <label htmlFor="email" className="block text-sm font-medium leading-6 ">
          Username
        </label>
        <div className="mt-2">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="email" className="block text-sm font-medium leading-6 ">
          Password
        </label>
        <div className="mt-2">
          <input
            type="email"
            name="email"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleSignup}
          className="rounded-md flex items-center justify-center bg-white py-2.5 px-3.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Signup;
