import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
    function onScriptLoad() {
        console.log("Script Loaded From App Component: ");
    }

    function onPotreeScriptLoaded() {
      console.log("Potree Script loaded: ")
    }
    
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css" type="text/css"/>
        {/* <link rel="stylesheet" type="text/css" href="../build/potree/potree.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/jquery-ui/jquery-ui.min.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/openlayers3/ol.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/spectrum/spectrum.css"/>
        <link rel="stylesheet" type="text/css" href="../libs/jstree/themes/mixed/style.css"/> */}
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js" 
          onLoad={onScriptLoad} 
          strategy="beforeInteractive"/>
        <Script
          src="potree/libs/jquery/jquery-3.1.1.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/spectrum/spectrum.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/jquery-ui/jquery-ui.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/other/BinaryHeap.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/tween/tween.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/d3/d3.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/jquery/jquery-3.1.1.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/proj4/proj4.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/openlayers3/ol.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/i18next/i18next.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/jstree/jstree.js"
          strategy="beforeInteractive"
        />
        <Script
          src="potree/build/potree/potree.js"
          onLoad={onPotreeScriptLoaded}
          strategy="beforeInteractive"
        />
        <Script
          src="potree/libs/plasio/js/laslaz.js"
          strategy="beforeInteractive"
        />
      </body>
    </Html>
  )
}