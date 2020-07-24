import React, { useState, useMemo } from "react";
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";

import { UserContext } from "./UserContext";
import Products from "./components/Products";
import Ani from "./components/Ani";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("session")));
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/test/Products">test products</Link>
          </li>
          <li>
            <Link to="/test/Ani">test ani-api</Link>
          </li>
          <li>
            <Link to="/test/Login">test login</Link>
          </li>
        </ul>
      </nav>
      <div className="App">
        <p>User:</p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <h1>Restaurante xyz </h1>
      </div>
      <UserContext.Provider value={value}>
        <Switch>
          <Route path="/test/Ani" component={Ani}></Route>
          <Route path="/test/Products" component={Products}></Route>
          <Route path="/test/Login" component={Login}></Route>
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

// export default App;
