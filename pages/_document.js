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
        {/* <link rel="stylesheet" type="text/css" href="../build/potree/potree.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/jquery-ui/jquery-ui.min.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/openlayers3/ol.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/spectrum/spectrum.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/jstree/themes/mixed/style.css"/> */}
      </Head>
      {<Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
            for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
            MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
            mixpanel.init('${process.env.MIX_PANEL_TOKEN}', {debug: true});
            // mixpanel.track('Sign up')`,
        }}
      />}
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
