import React, { Component } from "react";

import ListeMetiers from "./components/ListeMetiers";
import ListResults from "./components/ListResults";
import ListDepartements from "./components/ListeDepartements";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      codeNaf: "",
      codeDep: "",
    };
  }

  updateCodeNaf(codeNaf) {
    this.setState({
      codeNaf: codeNaf,
    });
  }

  updateCodeDep(codeDep) {
    this.setState({
      codeDep: codeDep,
    });
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/">
              <ListeMetiers
                codeNaf={this.state.codeNaf}
                updateCodeNaf={this.updateCodeNaf.bind(this)}
              />
            </Route>
            <Route exact path="/listeDepartements">
              <ListDepartements
                codeDep={this.state.codeDep}
                updateCodeDep={this.updateCodeDep.bind(this)}
              />
            </Route>
            <Route exact path="/listeResults">
              <ListResults
                codeNaf={this.state.codeNaf}
                codeDep={this.state.codeDep}
              />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
