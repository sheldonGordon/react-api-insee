import React, { Component, Fragment } from "react";

import axios from "axios";
import querystring from "query-string";
import Geocode from "react-geocode";

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
      curseur: "*",
      nombreResultRequeteTotal: 0,
      nombreResultRequete: 1000,
      etablissementslatlng: [],
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

  handleGetEtablissement() {
    const { codeDep, codeNaf } = this.props;
    const { date, nombreResultRequete } = this.state;
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
              "activitePrincipaleUniteLegale:" +
              codeNaf +
              " AND etatAdministratifUniteLegale:A" +
              " AND codeCommuneEtablissement: [" +
              codeDep +
              "000 TO " +
              codeDep +
              "999]",
            date: date,
            tri: "siret",
            curseur: this.state.curseur,
            nombre: nombreResultRequete,
            champs:
              "siret,denominationUniteLegale,numeroVoieEtablissement,typeVoieEtablissement,libelleVoieEtablissement,codePostalEtablissement,libelleCommuneEtablissement",
          },
        };

        sirene
          .get("/siret", params)
          .then((response) => {
            this.setState((state) => ({
              etablissements: state.etablissements.concat(
                response.data.etablissements
              ),
              nombreResultRequeteTotal: response.data.header.total,
            }));
            if (
              response.data.header.curseurSuivant != null &&
              response.data.header.curseurSuivant !== this.state.curseur
            ) {
              this.setState({
                curseur: response.data.header.curseurSuivant,
              });
              this.handleGetEtablissement();
            } else {
              this.setState({
                curseur: "*",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    const typeVoie = this.state.typeVoie;
    this.state.etablissements.map((etablissement) => {
      const adr = etablissement.adresseEtablissement;
      const libelleVoieCourt = adr.libelleVoieEtablissement;
      let libelleVoieLong = "";
      typeVoie.map((voie) => {
        if (voie.court === libelleVoieCourt) {
          libelleVoieLong = voie.long;
        }
      });
      Geocode.fromAddress(
        adr.numeroVoieEtablissement +
          " " +
          libelleVoieLong +
          " " +
          adr.libelleVoieEtablissement +
          " " +
          adr.codePostalEtablissement +
          " " +
          adr.libelleCommuneEtablissement
      ).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log(lat, lng);
          const etablissementslatlng = {
            siret: etablissement.siret,
            lat: lat,
            lng: lng,
          };
          this.setState((state) => ({
            etablissementslatlng:
              state.etablissementslatlng.concat(etablissementslatlng),
          }));
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  handleInitGeoCode() {
    Geocode.setApiKey("AIzaSyAw-3bqrjsU25W8Ai06aTlRWZ4oCOvH_Ok");
    Geocode.setLanguage("fr");
    Geocode.setRegion("fr");
  }

  componentDidMount() {
    this.handleInitGeoCode();
    this.handleGetEtablissement();
  }

  render() {
    const {
      token,
      etablissements,
      nombreResultRequeteTotal,
      etablissementslatlng,
    } = this.state;
    const { codeDep, codeNaf } = this.props;
    return (
      <Fragment>
        <p>{nombreResultRequeteTotal}</p>
        <p>{codeNaf}</p>
        <p>{codeDep}</p>
        <p>{token}</p>
        <p>{etablissements.length}</p>
        <div>
          {etablissementslatlng.map((elatlng, index) => {
            return (
              <p key={index}>
                {elatlng.siret} {elatlng.lat} {elatlng.lng}
              </p>
            );
          })}
        </div>
      </Fragment>
    );
  }
}

export default ListResults;
