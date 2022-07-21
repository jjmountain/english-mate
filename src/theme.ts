import { createTheme, responsiveFontSizes } from "@mui/material/styles";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    gradient: true;
  }
}

const theme = createTheme({
  palette: {
    background: {
      paper: "#fff",
      default: "#FAFAFA",
    },
    primary: {
      main: "#0091ea",
      contrastText: "#e3f2fd",
      light: "#64c1ff",
      dark: "#0064b7",
    },
    secondary: {
      main: "#fbc02d",
      light: "#ffff6b",
      dark: "#c6a700",
      contrastText: "#263238",
    },
    error: {
      main: "#f44336",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      //   hint: "rgba(255, 255, 255, 0.38)",
    },
  },
  components: {
    // Name of the component
    MuiButton: {
      variants: [
        {
          props: { variant: "gradient" },
          style: {
            color: "white",
            backgroundImage:
              "linear-gradient(to right top, #0064b7, #1e7bca, #3592dc, #4ca9ee, #64c1ff)",
          },
        },
      ],
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
    fontFamily: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji",
    ].join(","),
    h1: {
      fontSize: "4rem",
      fontWeight: 900,
      lineHeight: 1,
    },
    h2: {
      letterSpacing: "-.025em",
      fontWeight: 700,
      fontSize: "2.5rem",
      // lineHeight: 2.5,
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.75,
    },
    h5: {
      color: "#27272a",
      fontWeight: 800,
      fontSize: "1.25rem",
      lineHeight: 1.75,
      fontFamily: "Open Sans",
    },
    body1: {
      fontSize: "1rem",
      // lineHeight: 1.75,
      color: "rgba(0, 0, 0, 0.87)",
    },
    body2: {
      fontSize: "1rem",
      lineHeight: 1.75,
      color: "rgba(0, 0, 0, 0.54)",
    },
  },
});

// https://material-ui.com/customization/theming/#responsivefontsizes-theme-options-theme
export default responsiveFontSizes(theme);
