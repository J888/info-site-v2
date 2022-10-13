import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Heading } from "react-bulma-components";
import AddNewUserForm from "../../components/forms/AddNewUserForm";
import Spacer from "../../components/utility/spacer";
import styles from "../../sass/pages/configuration/Setup.module.scss";


const Setup = ({}) => {
  const [inviteCode, setInviteCode] = useState('');
  const [inviteVerified, setInviteVerified] = useState(false);
  const [adminUsername, setAdminUsername] = useState<string>();
  const [adminPW, setAdminPW] = useState<string>();
  const [adminPWReconf, setAdminPWReconf] = useState<string>();
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <Heading>Looks like your site is brand new!</Heading>
      <p>Before you start publishing, you'll need to take care of some paperwork.</p>
      <Spacer size={'sm'} />
      
      {!inviteVerified &&
        <React.Fragment>
          <label>1. Enter your invite key: </label>
          <input onChange={(e) => { setInviteCode(e.target.value)}} />
          <Button size="small" style={{margin: '0 0 0 1rem'}} onClick={async () => {

            try {
              let inviteVerifyRes = await axios.post(`/api/invites/verify`, {  code: inviteCode });
              console.log(inviteVerifyRes);
              setInviteVerified(inviteVerifyRes.status === 200);
            } catch (err) {
              alert('invalid')
            }
            
          }}>Confirm</Button>
        </React.Fragment>
      }

      <Spacer size={'sm'} />
      {inviteVerified && <p>Invite Verified!</p> }
      {inviteVerified &&
        <div>
          <p>2. Create an admin user that you'll use to do things like publish content and create additional users.</p>
          <AddNewUserForm
            forceAdmin
            handleUsernameUpdate={setAdminUsername}
            handlePasswordUpdate={setAdminPW}
            handleRetypedPasswordUpdate={setAdminPWReconf}
            handleSaveClick={
              async () => {
                if (confirm(`are you sure you want to create new user ${adminUsername}?`)) {
                  try {
                    let createUserResponse = await axios.post(`/api/users/create`, {
                      user: {
                        username: adminUsername,
                        password: adminPW,
                        isAdmin: true,
                      },
                      invite: {
                        code: inviteCode
                      },
                    });

                    if (createUserResponse.status === 201) {
                      alert(`${adminUsername} created successfully!`);
                      router.push(`/configuration`)
                    }
                  } catch (err) {
                    // handleApiError(err);
                  }
                }
              }
            }
            handleCancelClick={
              () => {
                setAdminUsername(undefined);
                setAdminPW(undefined);
                setAdminPWReconf(undefined);
              }
            }
            handleAdminCheckboxChange={
              () => {
                // do nothing, not applicable
              }
            }
            saveButtonDisabled={adminPW !== adminPWReconf}
          />
        </div>
      }
    </div>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  return {
    props: {
    },
  };
}

export default Setup;
