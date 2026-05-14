import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Livescore from './components/Livescore';
import Navbar from './components/Navbar';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Loading from './components/Loading';
import useAuth from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Livescore />
          </>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
