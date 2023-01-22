import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
    function onScriptLoad() {
        console.log("Script Loaded From App Component: ");
    }
    
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css" type="text/css"/>
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js" 
          onLoad={onScriptLoad} 
          strategy="beforeInteractive"/>
      </body>
    </Html>
  )
}