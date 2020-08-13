import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#90CAF9",
      // contrastText: "#fff",
    },
    secondary: {
      main: "#F48FB1",
      // contrastText: "fff",
    },
  },
});
export default theme;
