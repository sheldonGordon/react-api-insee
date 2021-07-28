import React, { Component, Fragment } from "react";

import axios from "axios";
import querystring from "query-string";

//import './App.css';

class ListResults extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      ((today.getMonth() + 1)<10?"0"+(today.getMonth() + 1) : (today.getMonth() + 1)) +
      "-" +
      today.getDate();

    this.state = {
      token: null,
      etablissements: [],
      header: {},
      date: date,
      nombre: 1000,
    };
  }

  componentDidMount() {
    const { codeDep, codeNaf } = this.props;
    const { date, nombre } = this.state;
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
            q:
              "codePostalEtablissement:[" +
              codeDep +
              "000 TO " +
              codeDep +
              "999] AND activitePrincipaleUniteLegale:" +
              codeNaf +
              " AND etatAdministratifUniteLegale:A",
            date: date,
            nombre: nombre,
          },
        };
        sirene
          .get("/siret", params)
          .then((response) => {
            this.setState({
              etablissements: response.data.etablissements,
              header: response.data.header,
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
    const { token, etablissements, header } = this.state;
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
        <p>{header.total}</p>
        <p>{codeNaf}</p>
        <p>{codeDep}</p>
        <p>{token}</p>
        <p>{listEtablissements}</p>
      </Fragment>
    );
  }
}

export default ListResults;
