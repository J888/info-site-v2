import { Box, Button, Form } from "react-bulma-components";
import styles from "../../sass/components/forms/AddNewUserForm.module.scss";
import Spacer from "../utility/spacer";

const MAX_USERNAME_LENGTH = 16;

const AddNewUserForm = ({ handleUsernameUpdate, handlePasswordUpdate,
  handleRetypedPasswordUpdate, handleSaveClick,
  handleCancelClick, handleAdminCheckboxChange,
  saveButtonDisabled, forceAdmin}) => {
    return (
      <Box className={styles.wrapper}>
        <h1><u>New {forceAdmin ? 'Admin' : 'User'}</u></h1>
        <Spacer size={'xxs'} />
        <label>Username (Max {MAX_USERNAME_LENGTH} chars):</label>
        <input placeholder="username" maxLength={MAX_USERNAME_LENGTH}
               onChange={(e) => { handleUsernameUpdate(e.target.value) }}/>
        <Spacer size={'xxs'} />
        <label>Password: </label>
        <input placeholder="password" type="password" onChange={(e) => { handlePasswordUpdate(e.target.value) }}/>
        <input placeholder="type password again" type="password" onChange={(e) => { handleRetypedPasswordUpdate(e.target.value) }}/>
        <Spacer size={'xxs'} />
        {
          !forceAdmin &&
            <Form.Checkbox onChange={(e) => handleAdminCheckboxChange(e.target.checked) }>
              make user an admin
            </Form.Checkbox>
        }

        <Spacer size={'xxs'} />
        <Button.Group>
          <Button onClick={handleSaveClick} disabled={saveButtonDisabled} color='success'>Save</Button>
          <Button onClick={handleCancelClick} color='danger'>Cancel</Button>
        </Button.Group> 
        {saveButtonDisabled && <p>Passwords don't match!</p>}
      </Box>
    )
  };

export default AddNewUserForm;
