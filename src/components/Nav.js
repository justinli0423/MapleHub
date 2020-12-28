import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function Nav() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Updates</Link>
            </li>
            <li>
              <Link to="/about">Reminders</Link>
            </li>
            <li>
              <Link to="/users">Legion Board</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Updates</h2>;
}

function About() {
  return <h2>Reminders</h2>;
}

function Users() {
  return <h2>Legion Board</h2>;
}