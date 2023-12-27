import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

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
        <meta name="apple-itunes-app" content="app-id= 6449701613, app-argument=https://apps.apple.com/us/app/constructn/id6449701613"></meta>
        {/* <link rel="stylesheet" type="text/css" href="../build/potree/potree.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/jquery-ui/jquery-ui.min.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/openlayers3/ol.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/spectrum/spectrum.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/jstree/themes/mixed/style.css"/> */}
        {/* <Script
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                console.log('---------------------');
                (function (w, d, s) {
                  var a = d.getElementsByTagName('head')[0];
                  var r = d.createElement('script');
                  r.async = 1;
                  r.src = s;
                  r.setAttribute('id', 'usetifulScript');
                  r.dataset.token = "d6456ea63c3883fef420f8af5232530b";
                                      a.appendChild(r);
                })(window, document, "https://www.usetiful.com/dist/usetiful.js");`,
            }}
        /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://www.usetiful.com/dist/usetiful.js"
          id="usetifulScript"
          data-token="d6456ea63c3883fef420f8af5232530b"
          strategy="beforeInteractive"
        />
        <Script
          src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"
          onReady={onScriptLoad}
          id="forgeDev"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/jquery/jquery-3.1.1.min.js"
          id="potree_jquery"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/spectrum/spectrum.js"
          id="potree_spectrum"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/jquery-ui/jquery-ui.min.js"
          id="potree_jquery_ui"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/other/BinaryHeap.js"
          id="potree_bHeap"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/tween/tween.min.js"
          id="potree_tween"
          strategy="beforeInteractive"
        />
        <Script 
        src="/potree/libs/d3/d3.js" 
        id="potree_d3"
        strategy="beforeInteractive" 
        />
        <Script
          src="/potree/libs/proj4/proj4.js"
          id="potree_proj4"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/openlayers3/ol.js"
          id="potree_ol"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/i18next/i18next.js"
          id="potree_i18next"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/jstree/jstree.js"
          id="potree_jstree"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/build/potree/potree.js"
          id="potreeDev"
          onReady={onPotreeScriptLoaded}
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/plasio/js/laslaz.js"
          id="potree_laslaz"
          strategy="beforeInteractive"
        />
        {/* <Script id="freshdeskChatWidget" strategy="beforeInteractive">
          {`
          function initFreshChat() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            if (!userAgent.includes("iPhone")){
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
          }
          function initialize(i,t){var e;i.getElementById(t)?
          initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,
          e.src="https://constructncorp.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))
          }
          function initiateCall(){initialize(document,"Freshchat-js-sdk")}
          var userAgent = navigator.userAgent || navigator.vendor || window.opera;
          if (!userAgent.includes("iPhone")){
            window.addEventListener?window.addEventListener("load",initiateCall,!1):
            window.attachEvent("load",initiateCall,!1);
          }
          `}
        </Script>
        <Script
          src="https://wchat.freshchat.com/js/widget.js"
          strategy="beforeInteractive"
        /> */}
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"/>
        <Script id="deeplink_ios" strategy="beforeInteractive">
          {`window.onload = function() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        var g = document.getElementById("google_play");
        var a = document.getElementById("app_store");

        if (userAgent.includes("iPhone")){ 
            if(!(window.location.href.split('type').length>1)){
              window.location.replace("https://apps.apple.com/us/app/constructn/id6449701613");
            }
        }
        }`}
        </Script>
      </body>
    </Html>
  );
}
