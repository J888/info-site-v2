import React, { useEffect, useState } from "react";

const HorizontalGoogleAd = () => {

  useEffect(() => {
    var ads = document.getElementsByClassName("adsbygoogle").length;
    for (var i = 0; i < ads; i++) {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) { }
    }
}, []);

  return (
    <React.Fragment>
      {/* <!-- In-Article-Horizontal --> */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9518590056813467"
        data-ad-slot="8023871852"
        data-ad-format="auto"
        data-full-width-responsive="true"
        // data-adtest="on"
      ></ins>
    </React.Fragment>
  );
};

export default HorizontalGoogleAd;
