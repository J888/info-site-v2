import React, { useEffect, useState } from "react";
import AuthenticationWrapper from "../authentication/AuthenticationWrapper";
import { Box, Columns, Heading } from "react-bulma-components";
import Link from "next/link";
import styles from "../../sass/components/configuration/ConfigurationPagesWrapper.module.scss";
import { getCurrentUser } from "../../lib/user";
import Head from "next/head";

const CurrentUserInfo = ({currentUser}) => {
  return (<div>
    <span>{"Logged in as"} <b>{currentUser.username}</b></span>
    {' '}{currentUser.admin ? <img src="/icons/badge-icon.png" style={{maxWidth: '16px'}}/> : ''}
  </div>);
}

interface NavOptionBoxProps {
  label: string;
  href: string;
  color?: string;
  isActive?: boolean;
}
const NavOptionBox = ({ label, href, color, isActive }: NavOptionBoxProps) => {
  const activeStyling = {
    borderBottom: "solid rgb(172, 172, 172) 0.3rem",
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

const NavOptionGroup = ({ activePage }) => {
  return (
    <Columns>
      <Columns.Column>
        <NavOptionBox
          label={"Publish Content"}
          href={"/publish"}
          color={"blue"}
          isActive={activePage === "publish"}
        />
      </Columns.Column>
      <Columns.Column>
        <NavOptionBox
          label={"Configure"}
          href={"/configuration"}
          color={"red"}
          isActive={activePage === "configuration"}
        />
      </Columns.Column>
      <Columns.Column>
        <NavOptionBox
          label={"Manage Users"}
          href={"/configuration/users"}
          color={"orange"}
          isActive={activePage === "users"}
        />
      </Columns.Column>
      <Columns.Column>
        <NavOptionBox label={"Website Front Page"} href={"/"} />
      </Columns.Column>
    </Columns>
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
      <Head>
        <link rel="icon" href={'https://nftblog1-images.s3.us-east-2.amazonaws.com/assets/wrench-favicon.ico'} />
      </Head>
      <div className={styles.wrapper}>
        <Columns>
          <Columns.Column>
            <Heading>/{activePage}</Heading>
          </Columns.Column>
          <Columns.Column>
          </Columns.Column>
          <Columns.Column className={styles.currenUserInfo}>
            { currentUser && <CurrentUserInfo currentUser={currentUser}/> }
          </Columns.Column>
        </Columns>
        <NavOptionGroup activePage={activePage}/>
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
