import React, { useState, useMemo } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { UserContext } from "./UserContext";
import Ani from "./components/Ani";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Menu from "./components/Menu";
import Checkout from "./components/Checkout";
import AppHeaderBar from "./components/AppHeaderBar";
import Grid from "@material-ui/core/Grid";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("session")));
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>
      <UserContext.Provider value={value}>
        <Grid container direction="column">
          <Grid item>
            <AppHeaderBar />
          </Grid>
          {/* <div className="App">
            <p>User:</p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div> */}
        </Grid>
        <Switch>
          <Route path="/test/Ani" component={Ani}></Route>
          <Route path="/test/SignIn" component={SignIn}></Route>
          <Route path="/test/SignUp" component={SignUp}></Route>
          <Route path="/Checkout" component={Checkout}></Route>
          <Route exact path="/" component={Menu}></Route>
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

// export default App;
