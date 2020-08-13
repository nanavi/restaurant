import React, { useContext } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Link as RLink } from "react-router-dom";
import { Box, Button } from "@material-ui/core";
import { UserContext } from "../UserContext";

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function AppHeaderBar() {
  // const { user } = useContext(UserContext);
  const { user, setUser } = useContext(UserContext);
  const classes = useStyles();

  const showBtn = () => {
    if (user !== null) {
      return (
        <Button
          variant="outlined"
          // color="secondary"
          onClick={() => {
            // auth.signOut();
            setUser(null);
            localStorage.setItem("session", JSON.stringify(user));
            console.log("signing out ..");
          }}
        >
          SIGN OUT
        </Button>
      );
    } else {
      return (
        <RLink to="/test/SignIn" style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            onClick={() => {
              console.log("signing in ..");
            }}
          >
            SIGN IN
          </Button>
        </RLink>
      );
    }
  };

  const showName = () => {
    if (user != null) {
      return (
        <Button style={{ color: "#4dabf5" }} disabled>
          {user.username}
        </Button>
      );
    } else {
      return (
        <Button style={{ color: "#f50057" }} disabled>
          offline
        </Button>
      );
    }
  };

  const menuId = "primary-search-account-menu";

  return (
    <div className={classes.grow}>
      <React.Fragment>
        <AppBar position="fixed" style={{ background: "#333333" }}>
          <Toolbar>
            <RLink to="/" style={{ textDecoration: "none" }}>
              {/* <Box color="text.primary"> */}
              <Typography variant="h5" style={{ color: "#FFFFFF" }}>
                <span role="img" aria-label="food">
                  🍲
                </span>
                Restaurant
              </Typography>
              {/* </Box> */}
            </RLink>
            {/* <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div> */}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                // onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              {showName()}
            </div>

            <Box m={1}>
              <RLink to="/shop" style={{ textDecoration: "none" }}>
                <Button variant="outlined" style={{ color: "#ff9800" }}>
                  Menu
                </Button>
              </RLink>
            </Box>
            <Box m={1}>{showBtn()}</Box>
          </Toolbar>
        </AppBar>

        <div className={classes.offset} />
      </React.Fragment>
    </div>
  );
}
