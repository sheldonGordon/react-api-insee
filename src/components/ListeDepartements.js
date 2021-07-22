import React, { Component, Fragment } from "react";

import axios from "axios";
import querystring from "query-string";
import { Select, InputLabel, MenuItem } from "@material-ui/core";

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
      .post("https://api.insee.fr/token", querystring.stringify(data), headers)
      .then((response) => {
        let token = response.data.access_token;
        this.setState({
          token: token,
        });

        const geo = axios.create({
          baseURL: "https://api.insee.fr/metadonnees/V1/geo",
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

  render() {
    const { departements } = this.state;
    return (
      <Fragment>
        <InputLabel id="niv1">Liste des départements</InputLabel>
        <Select
          labelId="niv1"
          id="selectNiv1"
          autoWidth={true}
          onChange={this.handleSelectNiv1}
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
      </Fragment>
    );
  }
}

export default ListDepartements;
