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
      (today.getMonth() + 1 < 10
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1) +
      "-" +
      (today.getDate() + 1 < 10
        ? "0" + (today.getDate() + 1)
        : today.getDate() + 1);

    this.state = {
      token: null,
      etablissements: [],
      date: date,
      nombreResultRequeteTotal: 0,
      nombreDebutRequete: 0,
      nombreResultRequete: 1000,
      typeVoie: [
        { court: "ALL", long: "Allée" },
        { court: "AV", long: "Avenue" },
        { court: "BD", long: "Boulevard" },
        { court: "CAR", long: "Carrefour" },
        { court: "CHE", long: "Chemin" },
        { court: "CHS", long: "Chaussée" },
        { court: "CITE", long: "Cité" },
        { court: "COR", long: "Corniche" },
        { court: "CRS", long: "Cours" },
        { court: "DOM", long: "Domaine" },
        { court: "DSC", long: "Descente" },
        { court: "ECA", long: "Ecart" },
        { court: "ESP", long: "Esplanade" },
        { court: "FG", long: "Faubourg" },
        { court: "GR", long: "Grande Rue" },
        { court: "HAM", long: "Hameau" },
        { court: "HLE", long: "Halle" },
        { court: "IMP", long: "Impasse" },
        { court: "LD", long: "Lieu-dit" },
        { court: "LOT", long: "Lotissement" },
        { court: "MAR", long: "Marché" },
        { court: "MTE", long: "Montée" },
        { court: "PAS", long: "Passage" },
        { court: "PL", long: "Place" },
        { court: "PLN", long: "Plaine" },
        { court: "PLT", long: "Plateau" },
        { court: "PRO", long: "Promenade" },
        { court: "PRV", long: "Parvis" },
        { court: "QUA", long: "Quartier" },
        { court: "QUAI", long: "Quai" },
        { court: "RES", long: "Résidence" },
        { court: "RLE", long: "Ruelle" },
        { court: "ROC", long: "Rocade" },
        { court: "RPT", long: "Rond-point" },
        { court: "RTE", long: "Route" },
        { court: "RUE", long: "Rue" },
        { court: "SEN", long: "Sente - Sentier" },
        { court: "SQ", long: "Square" },
        { court: "TPL", long: "Terre-plein" },
        { court: "TRA", long: "Traverse" },
        { court: "VLA", long: "Villa" },
        { court: "VLGE", long: "Village" },
      ],
    };
  }

  componentDidMount() {
    const { codeDep, codeNaf } = this.props;
    const {
      date,
      nombreResultRequete,
      nombreDebutRequete,
      nombreResultRequeteTotal,
    } = this.state;
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

        do {
          console.log("je boucle");
          const sirene = axios.create({
            baseURL: "https://api.insee.fr/entreprises/sirene/V3",
          });
          sirene.defaults.headers.common["Authorization"] =
            "Bearer " + this.state.token;
          sirene.defaults.headers.common["Accept"] = "application/json";
          const params = {
            params: {
              q:
                "activitePrincipaleUniteLegale:" +
                codeNaf +
                " AND etatAdministratifUniteLegale:A",
              date: date,
              tri: "siret",
              debut: nombreDebutRequete,
              nombre: nombreResultRequete,
              champs:
                "siret,denominationUniteLegale,numeroVoieEtablissement,typeVoieEtablissement,libelleVoieEtablissement,codePostalEtablissement,libelleCommuneEtablissement",
            },
          };
          sirene
            .get("/siret", params)
            .then((response) => {
              const tmpEtablissements = this.state.etablissements.concat(
                response.data.etablissements
              );
              console.log(response.data.header.total);
              this.setState({
                etablissements: tmpEtablissements,
                nombreResultRequeteTotal: response.data.header.total,
                nombreDebutRequete:
                  this.state.nombreDebutRequete + nombreResultRequete,
              });

              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
          console.log(
            "test : nb: " +
              nombreDebutRequete +
              " < total: " +
              nombreResultRequeteTotal +
              " => " +
              (nombreDebutRequete < nombreResultRequeteTotal)
          );
        } while (nombreDebutRequete < nombreResultRequeteTotal);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { token, etablissements, nombreResultRequeteTotal } = this.state;
    const { codeDep, codeNaf } = this.props;
    var id = 0;
    /*const listEtablissements = etablissements.map((etablissement) => {
      if (etablissement.uniteLegale.denominationUniteLegale != null) {
        id++;
        return (
          <p key={id}>{etablissement.uniteLegale.denominationUniteLegale}</p>
        );
      } else {
        id++;
        return <p key={id}>Sans nom</p>;
      }
        <p>{listEtablissements}</p>
    });*/

    return (
      <Fragment>
        <p>{nombreResultRequeteTotal}</p>
        <p>{codeNaf}</p>
        <p>{codeDep}</p>
        <p>{token}</p>
        <p>{etablissements.length}</p>
        {etablissements.map((etablissement, index) => {
          return <p key={index}>{index}</p>;
        })}
      </Fragment>
    );
  }
}

export default ListResults;
