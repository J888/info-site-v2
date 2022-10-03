import React, { useState } from "react";
import { Button } from "react-bulma-components";
import styles from "../sass/components/Configuration.module.scss";
import { getSiteConfig } from "../util/s3Util";
var _ = require("lodash");
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'; // https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/473#issuecomment-1144052994
import Divider from "../components/divider";
import { NavBackground, NavLink } from "../interfaces/Nav";
import axios from "axios";

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

const TextInput = ({ config, configKey, label, onChangeHandler }) => (
  <React.Fragment>
    <label>{label}: </label>
    <input
      placeholder="Subject"
      value={_.get(config, configKey)}
      onChange={(e) => {
        onChangeHandler(e.target.value);
      }}
    />
  </React.Fragment>
);

const SaveButton = ({onClickHandler}) => {
  return (<Button colorVariant={'light'} onClick={() => { onClickHandler() }}>Save</Button>);
}

const Configuration = ({ config }) => {
  const [modifiedConfig, setModifiedConfig] = useState(config);
  const [showRawConfig, setShowRawConfig] = useState(true);

  const saveConfiguration = async() => {
    if (confirm('Are you sure you want to save this configuration?')) {
      let response = await axios.put('/api/config/update', modifiedConfig)
    }
  }
  const handleTextInputChanged = (key, value) => {
    let newConfig = {};
    Object.assign(newConfig, modifiedConfig);

    console.log(`handleTextInputChanged - key: ${key}, value: ${value}`);
    _.set(newConfig, key, value);
    setModifiedConfig(newConfig);
    console.log(`the new val is: `, _.get(newConfig, key));
  };
  return (
    <div className={styles.wrapper}>
      <SaveButton onClickHandler={saveConfiguration}/>

      <Divider size={'sm'}/>

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

      <Divider size={'m'}/>
      
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
        <Divider size={'xxs'}/>

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

      <Divider size={'m'}/>

      {/* Begin `About Page` Description */}
      <h2 className={styles.sectionHeading}><u>About Page</u></h2>
      <div className={styles.inputsSectionGeneral}>
        {[
          { key: "pageData.about.description", label: "Description" },
        ].map((item, i) => (
 
          <textarea
            className={styles.tallTextAreaInput}
            key={`about-page-${i}`}
            placeholder="Description"
            value={_.get(modifiedConfig, item.key)}
            onChange={(e) => {
              handleTextInputChanged(
                item.key,
                e.target.value
              );
            }}
          />
        ))}
      </div>
      {/* End `About Page` Description */}

      <Divider size={'m'}/>

      {/* Begin `Featured Section` */}
      <h2 className={styles.sectionHeading}><u>Featured Section</u></h2>
      <div className={styles.inputsSectionGeneral}>
        {[
          { key: "featuredSection.titleText", label: "Title of Featured Section" },
        ].map((item, i) => (
          <TextInput
            key={`feat-sect-text-input-item-${i}`}
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
        <Divider size={'xxs'}/>
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

      <Divider size={'m'}/>

      {/* Begin NavBar configuration  */}
      <h2 className={styles.sectionHeading}><u>Navigation</u></h2>
      <div className={styles.inputsSectionGeneral}>
        {[
          { key: "nav.logoUrl", label: "Logo URL" },
          { key: "nav.background.url", label: "Background Image Url" },
          { key: "nav.background.size", label: "Size" },
        ].map((item, i) => (
          <TextInput
            key={`text-input-item-${i}`}
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
        <Divider size={'xxs'}/>
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

      <Divider size={'sm'}/>

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

      <Divider size={'l'}/>

      <SaveButton onClickHandler={saveConfiguration}/>
    </div>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const config = await getSiteConfig();

  return {
    props: {
      config,
    },
  };
}

export default Configuration;
