import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";

import axios from "axios";
import querystring from "query-string";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import { Select, InputLabel, MenuItem, Button, Input } from "@material-ui/core";

class ListDepartements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      departements: [],
      address: "",
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

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log("Success", latLng))
      .catch((error) => console.error("Error", error));
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
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <Input
                  {...getInputProps({
                    placeholder: "Search Places ...",
                    className: "location-search-input",
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: "#fafafa", cursor: "pointer" }
                      : { backgroundColor: "#ffffff", cursor: "pointer" };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
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
