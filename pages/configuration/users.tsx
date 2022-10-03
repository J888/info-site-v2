import { Box, Button, Form, Table } from "react-bulma-components";
import React, { useEffect, useState } from "react";
import styles from "../../sass/pages/configuration/Users.module.scss";
import Divider from "../../components/divider";
import axios from "axios";
import ConfigurationPagesWrapper from "../../components/configuration/ConfigurationPagesWrapper";

const MAX_USERNAME_LENGTH = 16;

type User = {
  admin: boolean;
  type?: string;
  hash: string;
  salt: string;
};

const AddNewUser = ({
  handleUsernameUpdate, handlePasswordUpdate,
  handleRetypedPasswordUpdate, handleSaveClick, handleAdminCheckboxChange,
  saveButtonDisabled }) => {
  return (
    <Box className={styles.editForm}>
      <h1><u>Add New User</u></h1>
      <Divider size={'xxs'} />
      <label>Username (Max {MAX_USERNAME_LENGTH} chars):</label>
      <input placeholder="username" maxLength={MAX_USERNAME_LENGTH}
             onChange={(e) => { handleUsernameUpdate(e.target.value) }}/>
      <Divider size={'xxs'} />
      <label>Password: </label>
      <input placeholder="password" type="password" onChange={(e) => { handlePasswordUpdate(e.target.value) }}/>
      <input placeholder="type password again" type="password" onChange={(e) => { handleRetypedPasswordUpdate(e.target.value) }}/>
      <Divider size={'xxs'} />
      <Form.Checkbox onChange={(e) => handleAdminCheckboxChange(e.target.checked) }>
        make user an admin
      </Form.Checkbox>
      <Divider size={'xxs'} />
      <Button onClick={handleSaveClick} disabled={saveButtonDisabled}>Save</Button>
    </Box>
  )
}

const UserActions = ({ isAdmin, handleEditClick, handleDeleteClick }) => {
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
          onClick={handleDeleteClick}
        >
          Delete
        </Button>
      </Button.Group>
    </div>
  );
};

interface UserKeyedByUsername {
  [key: string]: User
}

const Users = ({}) => {

  const [usersMap, setUsersMap] = useState<UserKeyedByUsername>();
  const [editingUser, setEditingUser] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [newPasswordRetyped, setNewPasswordRetyped] = useState<string>();
  const [creatingNewUser, setCreatingNewUser] = useState<boolean>(false);
  const [newUserNewPassword, setNewUserNewPassword] = useState<string>();
  const [newUserNewPasswordRetyped, setNewUserNewPasswordRetyped] = useState<string>();
  const [newUserUsername, setNewUserUsername] = useState<string>();
  const [newUserIsAdmin, setNewUserIsAdmin] = useState<boolean>(false);

  const fetchAllUsers = async () => {
    let response = await axios.get(`/api/users/all`);
    if (response.status === 200) {
      setUsersMap(response.data.users);
    }
  }

  const deleteUser = async (username) => {
    let response = await axios.post(`/api/users/delete`, {
      username
    });
    if (response.status === 204) {
      alert(`${username} was successfully deleted`);
    }
  }

  useEffect(() => {
    if (!usersMap) {
      fetchAllUsers();
    }
  });

  return (
    <div>
      <ConfigurationPagesWrapper>
        <h1>Configure Users</h1>
        <Table>
          <thead>
            <tr>
              <th>
                <Button onClick={() => {setCreatingNewUser(!creatingNewUser)}}>+</Button>
              </th>
              <th>Username</th>
              <th>Admin?</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          {
            usersMap &&
              <tbody>
              {Object.keys(usersMap).map((username, i) => (
                <tr key={`user-row-${username}`}>
                  <td>{i + 1}.</td>
                  <td>{username}</td>
                  <td>{usersMap[username].admin ? "Yes" : "No"}</td>
                  <td>{usersMap[username].type || "-"}</td>
                  <td>
                    <UserActions
                      isAdmin={usersMap[username].admin}
                      handleEditClick={() => {
                        setEditingUser(username);
                      }}
                      handleDeleteClick={async () => {
                        await deleteUser(username);
                        await fetchAllUsers();
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          }

        </Table>

        {!!editingUser && (
          <div className={styles.editForm}>
            <h3>
              Editing <u>{editingUser}</u>
            </h3>
            <Divider size={"xs"} />
            <label>Change password: </label>
            <input
              placeholder="New password"
              type="password"
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            <input
              placeholder="Type new password again"
              type="password"
              onChange={(e) => {
                setNewPasswordRetyped(e.target.value);
              }}
            />
            <Divider size={"xxs"} />
            {newPassword !== newPasswordRetyped && (
              <p>Passwords do not match</p>
            )}
            <Divider size={"xxs"} />
            <Button
              onClick={async () => {
                if (
                  confirm("Please confirm that you want to change the password")
                ) {
                  let res = await axios.put("/api/users/update", {
                    user: {
                      username: editingUser,
                      password: newPassword,
                    },
                  });

                  if (res.status === 200) {
                    alert("update was successful");
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

        {
          creatingNewUser && 
            <AddNewUser
              handleUsernameUpdate={setNewUserUsername}
              handlePasswordUpdate={setNewUserNewPassword}
              handleRetypedPasswordUpdate={setNewUserNewPasswordRetyped}
              handleAdminCheckboxChange={setNewUserIsAdmin}
              handleSaveClick={async () => {
                if (confirm(`are you sure you want to create new user ${newUserUsername}, admin:${newUserIsAdmin}`)) {
                  let createUserResponse = await axios.post(`/api/users/create`, {
                    user: {
                      username: newUserUsername,
                      password: newUserNewPassword,
                      isAdmin: newUserIsAdmin,
                    },
                  });

                  if (createUserResponse.status === 201) {
                    alert(`${newUserUsername} created successfully!`);
                    setNewUserNewPassword(undefined);
                    setNewUserNewPasswordRetyped(undefined);
                    setNewUserUsername(undefined);
                    setNewUserIsAdmin(false);
                    setCreatingNewUser(false);
                    await fetchAllUsers();
                  }
                }
              }}
              saveButtonDisabled={
                (!newUserNewPassword && !newUserNewPasswordRetyped) ||
                (newUserNewPassword !== newUserNewPasswordRetyped)
              }
            />
        }

      </ConfigurationPagesWrapper>
    </div>
  );
};

// export async function getServerSideProps({ params, preview = false, previewData }) {
//   let users = await getSiteUsers();
//   return {
//     props: {
//       users,
//     },
//   };
// }

export default Users;
