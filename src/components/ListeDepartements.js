import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";

import axios from "axios";
import querystring from "query-string";

import { Select, InputLabel, MenuItem, Button } from "@material-ui/core";

class ListDepartements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      departements: [],
    };
  }

  componentDidMount() {
    const data = {
      grant_type: "client_credentials",
      validity_period: 604800,
    };
    const headers = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Basic c3hlNGZQOTFERzFZZDZQZGlBZUdQZm92aUt3YTpEcUxEQklTT1JhbHhpeGRmWVJFMW1oTFVWUW9h",
      },
    };

    axios
      .post("https://cors-anywhere.herokuapp.com/https://api.insee.fr/token", querystring.stringify(data), headers)
      .then((response) => {
        let token = response.data.access_token;
        this.setState({
          token: token,
        });

        const geo = axios.create({
          baseURL: "https://cors-anywhere.herokuapp.com/https://api.insee.fr/metadonnees/V1/geo",
        });
        geo.defaults.headers.common["Authorization"] =
          "Bearer " + this.state.token;
        geo.defaults.headers.common["Accept"] = "application/json";
        geo
          .get("/departements")
          .then((response) => {
            this.setState({
              departements: response.data,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSelectDep = (event) => {
    this.props.updateCodeDep(event.target.value);
  };

  handleSelectCom = (event, value) => {
    if (value != null) {
      this.props.updateCodeCom(value.code);
    } else {
      this.props.updateCodeCom("");
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.history.push("/listeResults");
  };

  render() {
    const { departements } = this.state;
    const { codeDep } = this.props.codeDep;
    return (
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <InputLabel id="dep">Liste des départements</InputLabel>
          <Select
            labelId="dep"
            id="selectDep"
            autoWidth={true}
            onChange={this.handleSelectDep.bind(this)}
            defaultValue="default"
          >
            <MenuItem value="default" disabled>
              Sélectionner un départements
            </MenuItem>
            {departements.map((departement) => (
              <MenuItem key={departement.code} value={departement.code}>
                {departement.code} - {departement.intitule}
              </MenuItem>
            ))}
          </Select>
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={codeDep === ""}
          >
            Valider
          </Button>
        </form>
      </Fragment>
    );
  }
}

export default withRouter(ListDepartements);
