import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import * as newrelic from 'newrelic'

export default function Document() {
  
  function onScriptLoad() {
    console.log('Script Loaded From App Component: ');
  }

  function onPotreeScriptLoaded() {
    console.log('Potree Script loaded: ');
  }

  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/jsgantt-improved@2.8.5/dist/jsgantt.min.css"
          type="text/css"
        />
        {/* <link rel="stylesheet" type="text/css" href="../build/potree/potree.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/jquery-ui/jquery-ui.min.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/openlayers3/ol.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/spectrum/spectrum.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/jstree/themes/mixed/style.css"/> */}
        <script async type="text/javascript" src="/js/newrelic.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"
          onReady={onScriptLoad}
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/jquery/jquery-3.1.1.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/spectrum/spectrum.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/jquery-ui/jquery-ui.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/other/BinaryHeap.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/tween/tween.min.js"
          strategy="beforeInteractive"
        />
        <Script src="/potree/libs/d3/d3.js" strategy="beforeInteractive" />
        <Script
          src="/potree/libs/jquery/jquery-3.1.1.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/proj4/proj4.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/openlayers3/ol.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/i18next/i18next.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/jstree/jstree.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/build/potree/potree.js"
          onReady={onPotreeScriptLoaded}
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/plasio/js/laslaz.js"
          strategy="beforeInteractive"
        />
        <Script id="freshdeskChatWidget" strategy="beforeInteractive">
          {`
          function initFreshChat() {
            window.fcWidget.init({
              token: "5893aa59-0a4c-4454-b628-0c8fe1ec5485",
        host: "https://constructncorp.freshchat.com",
        config: {
          headerProperty: {
            hideChatButton: true
          },
          cssNames:{
            widget:'fcWidget-chat'
          }
        }
            });
          }
          function initialize(i,t){var e;i.getElementById(t)?
          initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,
          e.src="https://constructncorp.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))
          }
          function initiateCall(){initialize(document,"Freshchat-js-sdk")}



          window.addEventListener?window.addEventListener("load",initiateCall,!1):
          window.attachEvent("load",initiateCall,!1);
          `}
        </Script>
        <Script
          src="https://wchat.freshchat.com/js/widget.js"
          strategy="beforeInteractive"
        />
      </body>
    </Html>
  );
}
