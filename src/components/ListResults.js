import React, { Component, Fragment } from "react";

import axios from "axios";
import querystring from "query-string";

//import './App.css';

class ListResults extends Component {
  constructor(props) {
    super(props);
    this.state = { token: null, etablissements: [] };
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

        const sirene = axios.create({
          baseURL: "https://api.insee.fr/entreprises/sirene/V3",
        });
        sirene.defaults.headers.common["Authorization"] =
          "Bearer " + this.state.token;
        sirene.defaults.headers.common["Accept"] = "application/json";
        const params = {
          params: {
            q: "codePostalEtablissement:[59000 TO 59999] AND activitePrincipaleUniteLegale:62.01Z AND etatAdministratifUniteLegale:A",
            date: "2021-06-21",
          },
        };
        sirene
          .get("/siret", params)
          .then((response) => {
            this.setState({
              etablissements: response.data.etablissements,
            });
            console.log(response);
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
    const { token, etablissements } = this.state;
    const { codeDep, codeNaf } = this.props;
    var id = 0;
    const listEtablissements = etablissements.map((etablissement) => {
      if (etablissement.uniteLegale.nomUniteLegale != null) {
        id++;
        return <p key={id}>{etablissement.uniteLegale.nomUniteLegale}</p>;
      } else {
        id++;
        return <p key={id}>Sans nom</p>;
      }
    });

    return (
      <Fragment>
        <p>{codeNaf}</p>
        <p>{codeDep}</p>
        <p>{token}</p>
        <p>{listEtablissements}</p>
      </Fragment>
    );
  }
}

export default ListResults;
