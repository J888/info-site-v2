import React, { useState } from "react";

const LoginForm = ({ loginHandler }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      Login
      <div>
        <input
          placeholder="username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        ></input>
        <input
          placeholder="password"
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            loginHandler(username, password);
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
