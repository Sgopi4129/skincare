'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
export default function SignupPage() {
  const router=useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        setSuccess('User registered successfully!');
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        alert("Registration is successfull !");
        console.log(success)
        setTimeout(()=>{
          router.push('/dashboard');
        },4000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to register user');
        alert("Failed to Register")
        console.error(error)
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };
  
  return (
    <div className="grid grid-cols-2 min-h-screen items-center bg-blue-200">
      <div className=" text-black items-centern flex flex-col items-center text-2xl">
        <div className='flex'>
          <Image height={50} width={20} alt="shield" src="/shield.svg"  />
          <h1 className="text-xl font-bold">Skin Health App</h1>
        </div>
        <div className='flex'>
          <h3>AI-powered Skin Disease Detection</h3>
          <Image height={50} width={20} alt="microscope" src="/microscope.svg" />
        </div>
      </div>
      <div className="bg-blue-200 flex items-center justify-center">
        <div className="flex items-center justify-center bg-gray-100 rounded-md">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Join Our Skin Health Community
            </h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-orange-500 text-white font-bold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Start Your Skin Health Journey
              </button>
              <p className='text-bold text-red-500'>{error}</p>
            </form>
            <div className='space-y-5'>
                <div className='text-blue-800 grid-flow-col-dense md:grid-flow-col space-x-40 text-xs'>
                  <Link href="/forgname" className='col-span-2 gap-10 hover:text-yellow-400'>Forget Username?</Link>
                  <Link href="/forgpassword" className='col-span-2 gap-10 hover:text-yellow-400'>Forget Password?</Link>
                </div>
                <div className='text-blue-800 text-xs'>
                  <Link href="/login" className='hover:text-yellow-400'>Already a memeber? Log in</Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
