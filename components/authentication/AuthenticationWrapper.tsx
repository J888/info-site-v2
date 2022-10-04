import React, { useEffect, useState } from "react";
import LoginForm from "../loginForm";
import { loginHandler } from "../../lib/handlers/login";
import { LoginStatus } from "../../interfaces/LoginStatus";
import { getCurrentUser } from "../../lib/user";

const AuthenticationWrapper = ({children}) => {
  const [loginStatus, setLoginStatus] = useState<LoginStatus>({
    success: false,
    isAdmin: false,
    unauthorized: false,
  });

  useEffect(() => {
    async function callGetCurrentUser() {
      let user = await getCurrentUser();
      if (user) {
        setLoginStatus({
          success: !!user,
          isAdmin: user?.admin
        })
      }
    }

    if (!loginStatus.success) {
      callGetCurrentUser();
    }

  }, [loginStatus]);

  return (
    <React.Fragment>
      {!loginStatus.success && <LoginForm loginHandler={async (username, password) => { 
        let loginResult = await loginHandler(username, password);
        setLoginStatus(loginResult)
      }} />}
      {loginStatus.success && children}
      {loginStatus.unauthorized && <p>unauthorized.</p>}
    </React.Fragment>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  return {
    props: {},
  };
}

export default AuthenticationWrapper;
