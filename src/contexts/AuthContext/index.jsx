import { createContext, useState, useEffect } from 'react';
import { auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, initializeUser);
    return unsubcribe
  }, [])

  async function initializeUser(user) {
    if(user) {
        setCurrentUser({ ...user })
        setUserLoggedIn(true)
    } else {
        setCurrentUser(null)
        setUserLoggedIn(false)
    }
    setLoading(false)
  }
  
  const value = {
    currentUser,
    userLoggedIn,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
