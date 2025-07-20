import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { restoreUser, logout } from "../redux/authSlice";

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        // Check if remember me was enabled
        const rememberMe = !!localStorage.getItem('user');
        
        dispatch(restoreUser({ 
          user: userData, 
          isAuthenticated: true,
          rememberMe: rememberMe
        }));

        // Store in appropriate storage based on remember me preference
        if (rememberMe || localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          sessionStorage.setItem('user', JSON.stringify(userData));
          sessionStorage.setItem('isAuthenticated', 'true');
        }
      } else {
        // User is signed out
        dispatch(logout());
      }
      
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-beige dark:bg-dark-beige">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-blush dark:border-dark-blush"></div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;