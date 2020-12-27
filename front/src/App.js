import React from "react";
import Designer from "./pages/design";
import {
  createMuiTheme,
  MuiThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import { green, teal } from "@material-ui/core/colors";
import { ReactFlowProvider } from "react-flow-renderer";
import { TableDispatchContext } from "./context/tables";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(() => {
    const theme = createMuiTheme({
      palette: {
        primary: {
          // Purple and green play nicely together.
          main: teal[300],
          contrastText: "#151515",
        },
        secondary: {
          // This is green.A700 as hex.
          main: green.A700,
          contrastText: "#fff",
        },
        type: prefersDarkMode ? "dark" : "light",
        background: {
          paperAlt: prefersDarkMode ? "#272727" : "#f5f5f5",
        },
      },
    });
    theme.overrides = {
      MuiListItem: {
        root: {
          color: theme.palette.text.primary,
        },
      },
      MuiListSubheader: {
        root: {
          fontWeight: 600,
        },
      },
      MuiFormControlLabel: {
        root: {
          color: theme.palette.text.secondary,
        },
      },
    };
    return theme;
  }, [prefersDarkMode]);
  return (
    <MuiThemeProvider theme={theme}>
      <ReactFlowProvider>
        <Designer />
      </ReactFlowProvider>
    </MuiThemeProvider>
  );
}

export default App;
