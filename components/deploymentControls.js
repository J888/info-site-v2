import styles from "../sass/components/DeploymentControls.module.scss";
import React, { useState } from "react";
import axios from "axios";
import { Button, Tag } from "react-bulma-components";

const DeploymentControls = () => {
  const [deploymentId, setDeploymentId] = useState(null);
  const [deploymentDetails, setDeploymentDetails] = useState(null);

  return (
    <div>
      <Button
        color="warning"
        style={{ marginRight: "0.4rem" }}
        onClick={async () => {
          let confirmed = confirm(
            `are you sure you want to rebuild the site? This will start a new deployment`
          );

          if (confirmed === true) {
            let deployRes = await axios.post(`api/application/deploy`, {});
            console.log(deployRes.data);

            setDeploymentId(deployRes.data.deploymentId);
          }
        }}
      >
        Rebuild App
      </Button>

      <Button
        color="info"
        disabled={deploymentId === null}
        onClick={async () => {
          let deployRes = await axios.get(
            `api/application/getDeployment?deploymentId=${deploymentId}`
          );
          console.log(deployRes.data);
          setDeploymentDetails(JSON.stringify(deployRes.data, null, 2));
        }}
      >
        Deployment Details
      </Button>

      <Tag.Group hasAddons className={styles.tagGroup}>
        <Tag color="black">DeploymentId</Tag>
        <Tag>
          {deploymentId !== null ? deploymentId : "No deployment started"}
        </Tag>
      </Tag.Group>

      <div>
        {deploymentDetails === null && <span>No deployment details</span>}
        {deploymentDetails !== null && <pre>{deploymentDetails}</pre>}
      </div>
    </div>
  );
};

export default DeploymentControls;
