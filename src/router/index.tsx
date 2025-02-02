import React from 'react';
import { Route, Routes } from 'react-router-dom';
import darkLogo from 'assets/Logo_Dark_Mode.svg';
import lightLogo from 'assets/Logo_Light_Mode.svg';
import { useAuth } from 'contexts/AuthProvider';

const Layout = React.lazy(() => import('layout'));
const Login = React.lazy(() => import('pages/LoginPage'));

const Router = () => {
  const { token } = useAuth();

  return (
    <Routes>
      {token !== '' ? (
        <Route path="/*" element={<Layout />} />
      ) : (
        <Route path="/*" element={<Login lightLogo={lightLogo} darkLogo={darkLogo} />} />
      )}
    </Routes>
  );
};

export default Router;
