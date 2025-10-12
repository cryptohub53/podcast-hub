"use client";

import { useEffect, useState } from "react";

interface UserSession {
  user: {
    name: string;
    email: string;
  },
  expires: string;
}

export function useAuth(){
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_API_URL || 'http://localhost:5000/auth'}/session`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_API_URL || 'http://localhost:5000/auth'}/signin/google`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        throw new Error('Failed to sign in');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signInEmail = async (email: string) => {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_API_URL || 'http://localhost:5000/auth'}/signin/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        throw new Error('Failed to sign in');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_API_URL || 'http://localhost:5000/auth'}/signout`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        setSession(null);
        window.location.href = '/';
      } else {
        throw new Error('Failed to sign out');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    session,
    loading,
    signInGoogle,
    signInEmail,
    signOut,
    isAuthenticated: !!session,
    user: session?.user,
  };
}