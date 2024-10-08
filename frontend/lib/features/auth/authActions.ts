// authActions.js
import axios, { AxiosError } from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const backendURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

interface ErrorResponse {
  message: string;
  // Add other fields if your error response contains more data  
}

// Async thunk for user registration  
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, password2 }: { name: string, email: string, password: string, password2: string }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.post(
        `${backendURL}/api/users/register`,
        { name, email, password, password2 },
        config
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError

      // return custom error message from backend if present
      if (axiosError.response) {
        const errorData = axiosError.response.data as ErrorResponse;
        return rejectWithValue(errorData)
      } else {
        return rejectWithValue(axiosError.message)
      }
    }
  }
)

// Async thunk for user login  
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendURL}/api/users/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data; // Assuming the response contains user info and token  
    } catch (error) {
      const axiosError = error as AxiosError;
      
      // return custom error message from backend if present
      if (axiosError.response) {
        const errorData = axiosError.response.data as ErrorResponse;
        return rejectWithValue(errorData);
      } else {
        return rejectWithValue(axiosError.message);
      }
    }
  }
);  