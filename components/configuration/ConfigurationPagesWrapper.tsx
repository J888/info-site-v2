import React, { useEffect, useState } from "react";
import AuthenticationWrapper from "../authentication/AuthenticationWrapper";
import { Box, Columns } from "react-bulma-components";
import Link from "next/link";
import styles from "../../sass/components/configuration/ConfigurationPagesWrapper.module.scss";
import Divider from "../divider";
import { getCurrentUser } from "../../lib/user";

interface NavOptionBoxProps {
  label: string;
  href: string;
  color?: string;
  isActive?: boolean;
}
const NavOptionBox = ({ label, href, color, isActive }: NavOptionBoxProps) => {
  const activeStyling = {
    borderBottom: "solid #565656 0.5rem",
    opacity: '0.6',
  }
  return (
    <Link href={href} passHref>
      <Box
        className={
          color
            ? styles[`navigationOptionBox--${color}`]
            : styles.navigationOptionBox
        }
        style={isActive ? activeStyling : {}}
      >
        {label}
      </Box>
    </Link>
  );
};

const fetchCurrentUser = async (setter) => {
  let data = await getCurrentUser();
  return setter(data);
}

interface CurrentUser {
  username: string;
  admin: boolean;
}

const ConfigurationPagesWrapper = ({children, activePage}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>();

  useEffect(() => {
    if (!currentUser) {
      fetchCurrentUser(setCurrentUser);
    }
  }, [currentUser]);

  return (
    <AuthenticationWrapper>
      <div className={styles.wrapper}>
        <div>
          {currentUser && <p>{"You're logged in as"} <b>{currentUser.username}</b> ({ currentUser.admin ? 'admin' : 'non-admin'})</p>}
          <p>Welcome to your website management dashboard.</p>
        </div>
        <Divider size="sm"/>
        <Columns>
          <Columns.Column>
            <NavOptionBox label={'Publish Content'} href={'/publish'} color={'blue'} isActive={activePage === 'publish'}/>
          </Columns.Column>
          <Columns.Column>
            <NavOptionBox label={'Configure'} href={'/configuration'} color={'red'} isActive={activePage === 'configuration'}/>
          </Columns.Column>
          <Columns.Column>
            <NavOptionBox label={'Manage Users'} href={'/configuration/users'} color={'orange'} isActive={activePage === 'users'}/>
          </Columns.Column>
          <Columns.Column>
            <NavOptionBox label={'Website Front Page'} href={'/'}/>
          </Columns.Column>
        </Columns>
        <Divider size="m"/>

        {children}
      </div>
    </AuthenticationWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  return {
    props: {},
  };
}

export default ConfigurationPagesWrapper;
