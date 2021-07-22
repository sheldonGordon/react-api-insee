import React, { Component } from "react";

import ListeMetiers from "./components/ListeMetiers";
import ListResults from "./components/ListResults";
import ListDepartements from "./components/ListeDepartements";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/listeResults">Liste des results</Link>
                </li>
              </ul>
            </nav>

            <Switch>
              <Route exact path="/">
                <ListeMetiers />
              </Route>
              <Route exact path="/listeDepartements">
                <ListDepartements />
              </Route>
              <Route exact path="/listeResults">
                <ListResults />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
