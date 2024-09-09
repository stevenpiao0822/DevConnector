'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import Input from '@/app/components/Input'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { loginUser } from '@/lib/features/auth/authActions'
import { RootState } from '@/lib/store'

const Login: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state: RootState) => state.auth)

  //state variable for inputs
  const [email, setEmail] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")

  //Handle change event for state variables
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value); // Update the name state
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value); // Update the name state
  };

  //Handle form submit event
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // Redirect to login page after successful registration  
      router.push('/profiles');
      // Optionally reset form fields  
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Registration failed:", error);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="w-full h-screen">
      <div className="mx-10 lg:mx-60 mt-28">
        <h1 className="font-semibold text-3xl md:text-4xl xl:text-5xl text-blue-500 my-5">Sign In</h1>
        <div className='flex items-center my-3'>
          <FontAwesomeIcon icon={faUser} className="text-sm md:text-xl lg:text-2xl xl:text-3xl" />
          <p className='ml-2 text-sm md:text-xl lg:text-2xl xl:text-4xl'>Sign into Your Account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            id='email'
            type='email'
            placeholder='Email Address'
            required={true}
            value={email}
            onChange={handleEmailChange}
          />
          <Input
            id='password'
            type='password'
            placeholder='Password'
            required={true}
            value={password}
            onChange={handlePasswordChange}
          />

          <button type='submit' className='text-white bg-emerald-600 p-2 hover:bg-emerald-400 cursor-pointer my-3' disabled={loading}>Login</button>
          <p>
            Don't have an account?
            <Link href="/register" className='text-emerald-600 cursor-pointer ml-2'>Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login