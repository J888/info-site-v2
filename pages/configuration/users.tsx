import { Box, Button, Columns, Form, Table } from "react-bulma-components";
import React, { useEffect, useState } from "react";
import styles from "../../sass/pages/configuration/Users.module.scss";
import Spacer from "../../components/utility/spacer";
import axios from "axios";
import ConfigurationPagesWrapper from "../../components/configuration/ConfigurationPagesWrapper";

const MAX_USERNAME_LENGTH = 16;

type User = {
  admin: boolean;
  type?: string;
  hash: string;
  salt: string;
};

const handleApiError = (error) => {
  if (error?.response?.status === 401) {
    alert("Request failed. You are not authorized to complete this action.");
  } else {
    alert("Request failed.")
  }
}

const AddNewUser = ({
  handleUsernameUpdate, handlePasswordUpdate,
  handleRetypedPasswordUpdate, handleSaveClick,
  handleCancelClick, handleAdminCheckboxChange,
  saveButtonDisabled }) => {
  return (
    <Box className={styles.editForm}>
      <h1><u>Add New User</u></h1>
      <Spacer size={'xxs'} />
      <label>Username (Max {MAX_USERNAME_LENGTH} chars):</label>
      <input placeholder="username" maxLength={MAX_USERNAME_LENGTH}
             onChange={(e) => { handleUsernameUpdate(e.target.value) }}/>
      <Spacer size={'xxs'} />
      <label>Password: </label>
      <input placeholder="password" type="password" onChange={(e) => { handlePasswordUpdate(e.target.value) }}/>
      <input placeholder="type password again" type="password" onChange={(e) => { handleRetypedPasswordUpdate(e.target.value) }}/>
      <Spacer size={'xxs'} />
      <Form.Checkbox onChange={(e) => handleAdminCheckboxChange(e.target.checked) }>
        make user an admin
      </Form.Checkbox>
      <Spacer size={'xxs'} />
      <Button.Group>
        <Button onClick={handleSaveClick} disabled={saveButtonDisabled} color='success'>Save</Button>
        <Button onClick={handleCancelClick} color='danger'>Cancel</Button>
      </Button.Group>
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
    try {
      let response = await axios.get(`/api/users/all`);
      if (response.status === 200) {
        setUsersMap(response.data.users);
      }
    } catch (err) {
      //catch the 401
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
      <ConfigurationPagesWrapper activePage={"users"}>
        <Columns>
          <Columns.Column>
            <Box>
              <Table>
                <thead>
                  <tr>
                    <th>
                      <Button onClick={() => {setCreatingNewUser(!creatingNewUser)}}
                              disabled={!!creatingNewUser}>
                        +
                      </Button>
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
            </Box>
          </Columns.Column>

          {!!editingUser && (
              <Columns.Column>
                <Box className={styles.editForm}>
                  <h3>
                    Editing <u>{editingUser}</u>
                  </h3>
                  <Spacer size={"xs"} />
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
                  <Spacer size={"xxs"} />
                  {newPassword !== newPasswordRetyped && (
                    <p>Passwords do not match</p>
                  )}
                  <Spacer size={"xxs"} />
                  <Button.Group>
                    <Button
                      onClick={async () => {
                        if (
                          confirm("Please confirm that you want to change the password")
                        ) {
                          try {
                            let res = await axios.put("/api/users/update", {
                              user: {
                                username: editingUser,
                                password: newPassword,
                              },
                            });
  
                            if (res.status === 200) {
                              alert("update was successful");
                            }
                          } catch (err) {
                            handleApiError(err);
                          }
                        }
                      }}
                      style={{ width: "fit-content" }}
                      size={"sm"}
                      disabled={newPassword !== newPasswordRetyped}
                      color='success'
                    >
                      Save
                    </Button>

                    <Button
                      onClick={() => {
                        setEditingUser(null);
                      }}
                      style={{ width: "fit-content" }}
                      size={"sm"}
                      color='danger'
                    >
                      Cancel
                    </Button>
                  </Button.Group>
                </Box>
              </Columns.Column>
          )}

          {
            creatingNewUser && 
              <Columns.Column>
                <AddNewUser
                  handleUsernameUpdate={setNewUserUsername}
                  handlePasswordUpdate={setNewUserNewPassword}
                  handleRetypedPasswordUpdate={setNewUserNewPasswordRetyped}
                  handleAdminCheckboxChange={setNewUserIsAdmin}
                  handleSaveClick={async () => {
                    if (confirm(`are you sure you want to create new user ${newUserUsername}, admin:${newUserIsAdmin}`)) {

                      try {
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
                      } catch (err) {
                        handleApiError(err);
                      }
                    }
                  }}
                  handleCancelClick={
                    () => {
                      setCreatingNewUser(false);
                    }
                  }
                  saveButtonDisabled={
                    (!newUserNewPassword && !newUserNewPasswordRetyped) ||
                    (newUserNewPassword !== newUserNewPasswordRetyped)
                  }
                  
                />
              </Columns.Column>
          }
        </Columns>
      </ConfigurationPagesWrapper>
    </div>
  );
};

export default Users;
