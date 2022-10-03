import React from "react";
import AuthenticationWrapper from "../authentication/AuthenticationWrapper";
import { Box, Columns } from "react-bulma-components";
import Link from "next/link";
import styles from "../../sass/components/configuration/ConfigurationPagesWrapper.module.scss";
import Divider from "../divider";

interface NavOptionBoxProps {
  label: string;
  href: string;
  color?: string;
}
const NavOptionBox = ({ label, href, color }: NavOptionBoxProps) => (
  <Link href={href} passHref>
    <Box className={color ? styles[`navigationOptionBox--${color}`] : styles.navigationOptionBox}>
      {label}
    </Box>
  </Link>
);

const ConfigurationPagesWrapper = ({children}) => {

  return (
    <AuthenticationWrapper>
      <div className={styles.wrapper}>
        <div>
          <p>Welcome to your website management dashboard.</p>
        </div>
        <Divider size="sm"/>
        <Columns>
          <Columns.Column>
            <NavOptionBox label={'Publish Content'} href={'/publish'} color={'blue'}/>
          </Columns.Column>
          <Columns.Column>
            <NavOptionBox label={'Configure'} href={'/configuration'} color={'red'}/>
          </Columns.Column>
          <Columns.Column>
            <NavOptionBox label={'Manage Users'} href={'/configuration/users'} color={'orange'}/>
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
