import React, { useState } from "react";
import { Box, Button } from "react-bulma-components";
import styles from "../sass/components/LoginForm.module.scss";
import Spacer from "./utility/spacer";

type Props = {
  loginHandler: (username: string, password: string) => void;
};

const LoginForm = ({ loginHandler }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Box className={styles.wrapper}>
      <h1>Log In</h1>
      <Spacer size="xxs"/>

      <input
        placeholder="Username"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      ></input>
      <Spacer size="xxs"/>
      <input
        placeholder="Password"
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      ></input>
      <Spacer size="xs"/>

      <Button
        color="primary"
        size={'small'}
        onClick={() => {
          loginHandler(username, password);
        }}
      >
        Log in
      </Button>

    </Box>
  );
};

export default LoginForm;
