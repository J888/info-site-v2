import React, { useState } from "react";
import { Button } from "react-bulma-components";
import styles from "../sass/components/Configuration.module.scss";
import { getSiteConfig } from "../util/s3Util";
var _ = require("lodash");
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'; // https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/473#issuecomment-1144052994
import Spacer from "../components/utility/spacer";
import { NavBackground, NavLink } from "../interfaces/Nav";
import axios from "axios";
import ConfigurationPagesWrapper from "../components/configuration/ConfigurationPagesWrapper";

interface SiteCategory {
  key?: string;
  label?: string;
  description?: string;
}
interface FeaturedSection {
  titleText: string;
  postIds: string[];
}

interface Nav {
  logoUrl: string;
  background: NavBackground;
  links: NavLink[];
}
interface SiteConfiguration {
  categories: Array<SiteCategory>;
  featuredSection?: FeaturedSection;
  nav: Nav;
}

/**
 * Removes null and empty values from the configuration.
 * @param conf the configuration to fix
 * @returns fixed configuration
 */
const repairedConfiguration = (conf: SiteConfiguration) => {
  let copy: SiteConfiguration = Object.assign({}, conf);
  copy.featuredSection.postIds = copy.featuredSection.postIds.filter(p => p);
  copy.nav.links = copy.nav.links.filter(l => l && Object.keys(l).length > 0);
  copy.categories = copy.categories.filter(c => c && Object.keys(c).length > 0);
  return copy;
}

const TextInput = ({
  config, configKey, label,
  onChangeHandler, inputType = 'input', className = undefined
}) => (
  <React.Fragment>
    <label>{label}: </label>
    { inputType === 'input' && <input placeholder={label}
                                      value={_.get(config, configKey)}
                                      onChange={(e) => {
                                        onChangeHandler(e.target.value);
                                      }}
                                />
    }

    { inputType === 'textarea' && <textarea placeholder={label}
                                            value={_.get(config, configKey)}
                                            onChange={(e) => {
                                              onChangeHandler(e.target.value);
                                            }}
                                            className={className}
                                  />
    }

    { inputType === 'checkbox' && <input type="checkbox"
                                         checked={_.get(config, configKey) === true}
                                         onChange={(e) => {
                                          onChangeHandler(e.target.checked)
                                         }}
                                         style={{maxWidth: 'fit-content'}}
                                  />
    }
  </React.Fragment>
);

const SaveButton = ({onClickHandler}) => {
  return (<Button colorVariant={'light'} onClick={() => { onClickHandler() }}>Save</Button>);
}

const Stats = ({ config }) => <div>
  <h3><u>What you have:</u></h3>
  <ul>
    <li>Featured posts: {config.featuredSection.postIds.length}</li>
    <li>Nav links: {config.nav.links.length}</li>
    <li>Categories: {config.categories.length}</li>
  </ul>
</div>

const PageDescription = () => <p>{"Modify your website's configuration."} <b>{"A rebuild is necessary for modifications to be reflected"}</b></p>;

const Configuration = ({ config }) => {
  const [modifiedConfig, setModifiedConfig] = useState(config);
  const [showRawConfig, setShowRawConfig] = useState(true);

  const saveConfiguration = async() => {
    if (confirm('Are you sure you want to save this configuration?')) {
      let modifiedConfigToSave = repairedConfiguration(modifiedConfig);
      let response = await axios.put('/api/config/update', modifiedConfigToSave);
      if (response.status == 200) {
        setModifiedConfig(modifiedConfigToSave);
        alert('config save successful');
      }
    }
  }
  
  const handleTextInputChanged = (key, value) => {
    let newConfig = {};
    Object.assign(newConfig, modifiedConfig);
    _.set(newConfig, key, value);
    setModifiedConfig(newConfig);
  };

  return (
    <div className={styles.wrapper}>
      <PageDescription/>
      <Spacer size={'sm'}/>
      <Stats config={modifiedConfig}/>
      <Spacer size={'sm'}/>
      <SaveButton onClickHandler={saveConfiguration}/>
      <Spacer size={'sm'}/>

      {/* Begin general section */}
      <h2 className={styles.sectionHeading}><u>General</u></h2>
      <div className={styles.inputsSectionGeneral}>
        {[
          { key: "site.subject", label: "Subject" },
          { key: "site.baseUrl", label: "Base Url" },
          { key: "site.name", label: "Name" },
          {
            key: "site.statements.purpose.short",
            label: "Purpose Statement (Short Version)",
          },
          {
            key: "site.statements.purpose.long",
            label: "Purpose Statement (Long Version)",
          },
          {
            key: "footer.tagline",
            label: "Footer Tagline",
          },
          {
            key: "socialMedia.username.twitter",
            label: "Twitter Username",
          },
          {
            key: "faviconUrl",
            label: "Favicon URL",
          },
        ].map((item, i) => (
          <TextInput
            key={`general-text-input-item-${i}`}
            config={modifiedConfig}
            configKey={item.key}
            label={item.label}
            onChangeHandler={(value) => {
              handleTextInputChanged(item.key, value);
            }}
          />
        ))}
      </div>
      {/* End general section */}

      <Spacer size={'m'}/>

      <h2 className={styles.sectionHeading}><u>Google Analytics</u></h2>
      <p>This information is used to integrate with Google for things like page views</p>
      <Spacer size={'xs'}/>
      <div className={styles.inputsSectionGoogleAnalytics}>
        {[
          { key: "integrations.google.analytics.enabled", label: "Enabled", inputType: 'checkbox' },
          { key: "integrations.google.analytics.viewId", label: "View ID (aka the property id used for retrieval of page views)" },
          { key: "integrations.google.analytics.clientEmail", label: "Client Email" },
          { key: "integrations.google.analytics.clientId", label: "Client ID" },
          { key: "integrations.google.analytics.propertyId", label: "Property Id (used for gtag)" },
        ].map((item, i) => (
          <TextInput
            key={`googleanalytics-text-input-item-${i}`}
            config={modifiedConfig}
            configKey={item.key}
            label={item.label}
            onChangeHandler={(value) => {
              handleTextInputChanged(item.key, value);
            }}
            inputType={item.inputType}
          />
        ))}
      </div>
      
      <Spacer size={'m'}/>

      <h2 className={styles.sectionHeading}><u>Disqus</u></h2>
      <p>Add commenting to your site</p>
      <Spacer size={'xs'}/>
      <div className={styles.inputsSectionGoogleAnalytics}>
        {[
          { key: "integrations.disqus.shortname", label: "Disqus Shortname" },
        ].map((item, i) => (
          <TextInput
            key={`disqus-text-input-item-${i}`}
            config={modifiedConfig}
            configKey={item.key}
            label={item.label}
            onChangeHandler={(value) => {
              handleTextInputChanged(item.key, value);
            }}
          />
        ))}
      </div>
      
      <Spacer size={'m'}/>
      
      
      {/* Begin Categories */}
      <h2 className={styles.sectionHeading}><u>Categories</u></h2>
      <div className={styles.inputsSectionCategories}>
        {modifiedConfig.categories.map((item, i) => {
          return (
            <div key={`category-item-${i}`} className={styles.categoryInputs}>
              {i + 1}.
  
              <div>
                <label>Slug: </label>
                <input
                  placeholder="Slug"
                  value={item.key}
                  onChange={(e) => {
                    handleTextInputChanged(
                      `categories[${i}].key`,
                      e.target.value
                    );
                  }}
                />
              </div>

              <div>
                <label>Label: </label>
                <input
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => {
                    handleTextInputChanged(
                      `categories[${i}].label`,
                      e.target.value
                    );
                  }}
                />
              </div>

              <div>
                <label>Description: </label>
                <textarea
                  className={styles.categoryDescriptionTextArea}
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    handleTextInputChanged(
                      `categories[${i}].description`,
                      e.target.value
                    );
                  }}
                />
              </div>
            </div>
          );
        })}
        <Spacer size={'xxs'}/>

        <Button
          className={styles.addItemButton}
          onClick={() => {
            let newConfig: SiteConfiguration = Object.assign({}, modifiedConfig);

            newConfig.categories.push({});

            setModifiedConfig(newConfig);
          }}
          disabled={
            modifiedConfig.categories[modifiedConfig.categories.length - 1].key === undefined
            && modifiedConfig.categories[modifiedConfig.categories.length - 1].label === undefined
            && modifiedConfig.categories[modifiedConfig.categories.length - 1].description === undefined
          }
        >
          + add category
        </Button>
      </div>
      {/* End Categories */}

      <Spacer size={'m'}/>

      {/* Begin `About Page` Description */}
      <h2 className={styles.sectionHeading}><u>About Page</u></h2>
      <div className={styles.inputsSectionGeneral}>
        {[
          { key: "pageData.about.description", label: "Description" },
        ].map((item, i) => (
          <TextInput
            key={`featuredsect-text-input-item-${i}`}
            config={modifiedConfig}
            configKey={item.key}
            label={item.label}
            onChangeHandler={(value) => {
              handleTextInputChanged(item.key, value);
            }}
            inputType='textarea'
            className={styles.tallTextAreaInput}
          />
        ))}
      </div>
      {/* End `About Page` Description */}

      <Spacer size={'m'}/>

      {/* Begin `Featured Section` */}
      <h2 className={styles.sectionHeading}><u>Featured Section</u></h2>
      <div className={styles.inputsSectionGeneral}>
        {[
          { key: "featuredSection.titleText", label: "Title of Featured Section" },
        ].map((item, i) => (
          <TextInput
            key={`featuredsect-text-input-item-${i}`}
            config={modifiedConfig}
            configKey={item.key}
            label={item.label}
            onChangeHandler={(value) => {
              handleTextInputChanged(item.key, value);
            }}
          />
        ))}
      </div>
      <p>Post ids:</p>
      <div className={styles.featuredSectionPostIdInputs}>
        {
          modifiedConfig.featuredSection.postIds.map(
            (postId, i) =>
              <div key={`featured-section-post-id-${i}`}>
                <label>{i+1}. </label>
                <input value={postId}
                  placeholder={'enter a post id'}
                  onChange={(e) => {
                    handleTextInputChanged(`featuredSection.postIds[${i}]`, e.target.value);
                  }}/>
              </div>
          )
        }
        <Spacer size={'xxs'}/>
        <Button
          className={styles.addItemButton}
          onClick={() => {
            let newConfig: SiteConfiguration = Object.assign({}, modifiedConfig);

            newConfig.featuredSection.postIds.push(undefined);

            setModifiedConfig(newConfig);
          }}
          disabled={
            modifiedConfig.featuredSection.postIds[modifiedConfig.featuredSection.postIds.length - 1] === undefined
          }
        >
          + add post id
        </Button>
      </div>
      {/* End `Featured Section` */}

      <Spacer size={'m'}/>

      {/* Begin NavBar configuration  */}
      <h2 className={styles.sectionHeading}><u>Navigation</u></h2>
      <div className={styles.inputsSectionGeneral}>
        {[
          { key: "nav.logoUrl", label: "Logo URL" },
          { key: "nav.background.url", label: "Background Image Url" },
          { key: "nav.background.size", label: "Size" },
        ].map((item, i) => (
          <TextInput
            key={`navigation-input-item-${i}`}
            config={modifiedConfig}
            configKey={item.key}
            label={item.label}
            onChangeHandler={(value) => {
              handleTextInputChanged(item.key, value);
            }}
          />
        ))}
      </div>
      <p>Links:</p>
      <div>
        {
          modifiedConfig.nav.links.map(
            (navLink, i) =>
              <div key={`navlink-${i}`}>
                <label>{i+1}. label: </label>
                <input value={navLink.label}
                  placeholder={'enter a label'}
                  onChange={(e) => {
                    handleTextInputChanged(`nav.links[${i}].label`, e.target.value);
                  }}/>

                <label>slug: </label>
                <input value={navLink.href}
                  placeholder={'enter an href'}
                  onChange={(e) => {
                    handleTextInputChanged(`nav.links[${i}].href`, e.target.value);
                  }}/>
              </div>
          )
        }
        <Spacer size={'xxs'}/>
        <Button
          className={styles.addItemButton}
          onClick={() => {
            let newConfig: SiteConfiguration = Object.assign({}, modifiedConfig);

            newConfig.nav.links.push({});

            setModifiedConfig(newConfig);
          }}
          disabled={
            modifiedConfig.nav.links[modifiedConfig.nav.links.length - 1].label === undefined
            && modifiedConfig.nav.links[modifiedConfig.nav.links.length - 1].href === undefined

          }
        >
          + add navbar link
        </Button>
      </div>
      {/* End NavBar configuration  */}

      <Spacer size={'sm'}/>

      {/* Begin Raw JSON section */}
      <h2 className={styles.sectionHeading}><u>Review raw configuration value</u></h2>

      <Button
        style={{fontSize: '0.7rem'}}
        onClick={() => {
          setShowRawConfig(!showRawConfig);
        }}
      >
        {showRawConfig ? "Hide" : "Show"}
      </Button>
      {showRawConfig &&
        <SyntaxHighlighter language="json" style={atomDark} customStyle={{lineHeight: "0.75",fontSize: "0.7rem", maxHeight: '20rem'}}>
        {JSON.stringify(modifiedConfig, null, 2)}
        </SyntaxHighlighter>
      }
      {/* End Raw JSON section */}

      <Spacer size={'l'}/>

      <SaveButton onClickHandler={saveConfiguration}/>
    </div>
  );
};

const ConfigurationWrapped = ({ config }) => (
  <ConfigurationPagesWrapper activePage={"configuration"}>
    <Configuration config={config} />
  </ConfigurationPagesWrapper>
);

export async function getStaticProps({ params, preview = false, previewData }) {
  const config = await getSiteConfig();
  console.log(`GETTING SITE CONFIG`)
  return {
    props: {
      config,
    },
  };
}

export default ConfigurationWrapped;
