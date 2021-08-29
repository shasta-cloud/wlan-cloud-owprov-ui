import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Footer, PageContainer, ToastProvider, useAuth } from 'ucentral-libs';
import routes from 'routes';
import Sidebar from './Sidebar';

const TheLayout = () => {
  const { t, i18n } = useTranslation();
  const { endpoints, currentToken, user, avatar, logout } = useAuth();
  const [showSidebar, setShowSidebar] = useState('responsive');

  return (
    <div className="c-app c-default-layout">
      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        logo="assets/OpenWiFi_LogoLockup_WhiteColour.svg"
        redirectTo="/inventory"
      />
      <div className="c-wrapper">
        <Header
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          routes={routes}
          t={t}
          i18n={i18n}
          logout={logout}
          logo="assets/OpenWiFi_LogoLockup_DarkGreyColour.svg"
          authToken={currentToken}
          endpoints={endpoints}
          user={user}
          avatar={avatar}
        />
        <div className="c-body">
          <ToastProvider>
            <PageContainer t={t} routes={routes} redirectTo="/inventory" />
          </ToastProvider>
        </div>
        <Footer t={t} version="0.8.17" />
      </div>
    </div>
  );
};

export default TheLayout;
