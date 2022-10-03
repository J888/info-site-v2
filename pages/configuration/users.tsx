import { Button, Table } from "react-bulma-components";
import React, { useState } from "react";
import { getSiteUsers } from "../../util/s3Util";
import styles from "../../sass/pages/configuration/Users.module.scss";
import Divider from "../../components/divider";
import AuthenticationWrapper from "../../components/authentication/AuthenticationWrapper";
import axios from "axios";

type User = {
  admin: boolean;
  type?: string;
  hash: string;
  salt: string;
};

type Props = {
  users: {
    [key: string]: User;
  };
};

const UserActions = ({ isAdmin, handleEditClick }) => {
  return (
    <div className={styles.userActionsButtonGroup}>
      <Button.Group>
        <Button
          size={"small"}
          color="link"
          renderAs="span"
          onClick={() => {
            handleEditClick();
          }}
        >
          Edit
        </Button>
        <Button
          size={"small"}
          color="danger"
          renderAs="span"
          disabled={isAdmin}
        >
          Delete
        </Button>
      </Button.Group>
    </div>
  );
};

const Users = ({ users }: Props) => {
  const [editingUser, setEditingUser] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [newPasswordRetyped, setNewPasswordRetyped] = useState<string>();

  return (
    <div className={styles.wrapper}>
      <AuthenticationWrapper>
        <h1>Configure Users</h1>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Username</th>
              <th>Admin?</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {Object.keys(users).map((username, i) => (
              <tr key={`user-row-${username}`}>
                <td>{i + 1}.</td>
                <td>{username}</td>
                <td>{users[username].admin ? "Yes" : "No"}</td>
                <td>{users[username].type || "-"}</td>
                <td>
                  <UserActions
                    isAdmin={users[username].admin}
                    handleEditClick={() => {
                      setEditingUser(username);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {!!editingUser && (
          <div className={styles.editUserForm}>
            <h3>
              Editing <u>{editingUser}</u>
            </h3>
            <Divider size={'xs'} />
            <label>Change password: </label>
            <input placeholder="New password" type="password" onChange={(e) => { setNewPassword(e.target.value) }}/>
            <input placeholder="Type new password again" type="password" onChange={(e) => { setNewPasswordRetyped(e.target.value) }}/>
            <Divider size={"xxs"} />
            { newPassword !== newPasswordRetyped && <p>Passwords do not match</p> }
            <Divider size={"xxs"} />
            <Button
              onClick={async () => {
                if (confirm('Please confirm that you want to change the password')) {
                  let res = await axios.put('/api/users/update', {
                    user: {
                      username: editingUser,
                      password: newPassword,
                    }
                  });

                  if (res.status === 200) {
                    alert('update was successful');
                  }
                }
              }}
              style={{ width: "fit-content" }}
              size={"sm"}
              disabled={newPassword !== newPasswordRetyped}
            >
              Save
            </Button>

            <Button
              onClick={() => {
                setEditingUser(null);
              }}
              style={{ width: "fit-content" }}
              size={"sm"}
            >
              Cancel
            </Button>
          </div>
        )}
      </AuthenticationWrapper>
    </div>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  let users = await getSiteUsers();
  return {
    props: {
      users,
    },
  };
}

export default Users;
