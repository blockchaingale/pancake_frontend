import { createGlobalStyle } from 'styled-components'
import { PancakeTheme } from '@pancakeswap/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Relative', sans-serif;
    // letter-spacing: 1px;
    // font-family: Poppins, sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    background: url('/images/back-image.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    img {
      height: auto;
      max-width: 100%;
    }
  }
  @font-face {
    font-family: "Relative";
    font-style: normal;
    font-weight: 400;
    src: url("/fonts/relative/relative-book-pro.eot"); /* IE9 Compat Modes */
    src: local(""), url("/fonts/relative/relative-book-pro.eot?#iefix") format("embedded-opentype"),
      /* IE6-IE8 */ url("/fonts/relative/relative-book-pro.woff2") format("woff2"),
      /* Super Modern Browsers */ url("/fonts/relative/relative-book-pro.woff") format("woff"),
      /* Modern Browsers */ url("/fonts/relative/relative-book-pro.ttf") format("truetype"); /* Safari, Android, iOS */
  }
  
  @font-face {
    font-family: "Relative";
    src: url("/fonts/roboto/roboto-v30-latin-regular.eot"); /* IE9 Compat Modes */
    src: local(""), url("/fonts/roboto/roboto-v30-latin-regular.eot?#iefix") format("embedded-opentype"),
      /* IE6-IE8 */ url("/fonts/roboto/roboto-v30-latin-regular.woff2") format("woff2"),
      /* Super Modern Browsers */ url("/fonts/roboto/roboto-v30-latin-regular.woff") format("woff"),
      /* Modern Browsers */ url("/fonts/roboto/roboto-v30-latin-regular.ttf") format("truetype"); /* Safari, Android, iOS */
  
    /* apply this font only for numbers */
    unicode-range: U+30-39;
  }
  
  @font-face {
    font-family: "Relative";
    src: url("/fonts/inter/inter-v12-latin-regular.eot"); /* IE9 Compat Modes */
    src: local(""), url("/fonts/inter/inter-v12-latin-regular.eot?#iefix") format("embedded-opentype"),
      /* IE6-IE8 */ url("/fonts/inter/inter-v12-latin-regular.woff2") format("woff2"),
      /* Super Modern Browsers */ url("/fonts/inter/inter-v12-latin-regular.woff") format("woff"),
      /* Modern Browsers */ url("/fonts/inter/inter-v12-latin-regular.ttf") format("truetype"); /* Safari, Android, iOS */
  
    /* apply this font for commas and full-stops */
    unicode-range: U+002C, U+002E;
  }
  
  /* for certain components like inputs, don't overwrite the number font */
  @font-face {
    font-family: "RelativeNumber";
    font-style: normal;
    font-weight: 400;
    src: url("/fonts/relative/relative-book-pro.eot"); /* IE9 Compat Modes */
    src: local(""), url("/fonts/relative/relative-book-pro.eot?#iefix") format("embedded-opentype"),
      /* IE6-IE8 */ url("/fonts/relative/relative-book-pro.woff2") format("woff2"),
      /* Super Modern Browsers */ url("/fonts/relative/relative-book-pro.woff") format("woff"),
      /* Modern Browsers */ url("/fonts/relative/relative-book-pro.ttf") format("truetype"); /* Safari, Android, iOS */
  }

  @font-face {
    font-family: "Museo-Moderno";
    font-style: normal;
    font-weight: 400;
    src: url("/fonts/museomoderno/museo-moderno.woff2") format("woff2"); /* IE9 Compat Modes */
  }

  @font-face {
    font-family: "Work-Sans";
    font-style: normal;
    font-weight: 400;
    src: url("/fonts/worksans/work-sans.woff2") format("woff2"); /* IE9 Compat Modes */
  }

  @font-face {
    font-family: "Helvetica-Light";
    font-style: normal;
    font-weight: 400;
    src: url("/fonts/helvetica/HelveticaNeue-Light.otf") format("opentype");
  }

  @font-face {
    font-family: "Helvetica-LightExt";
    font-style: normal;
    font-weight: 400;
    src: url("/fonts/helvetica/HelveticaNeue-LightExt.otf") format("opentype");
  }

  @font-face {
    font-family: "Helvetica-Medium";
    font-style: normal;
    font-weight: 400;
    src: url("/fonts/helvetica/HelveticaNeue-Medium.otf") format("opentype");
  }
  
`

export default GlobalStyle
