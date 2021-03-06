import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";

import {
  Select,
  InputLabel,
  MenuItem,
  Button,
  Container,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

class ListeMetiers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      niv1: [],
      niv2: [],
      niv3: [],
      niv4: [],
      niv5: [],
      niv5All: [],
      nivx: [],
    };
  }

  componentDidMount() {
    const niveau1 = require("../resources/xls/naf2008_liste_n1.csv");
    const niveau5 = require("../resources/xls/naf2008_liste_n5.csv");
    const niveaux = require("../resources/xls/naf2008_5_niveaux.csv");

    fetch(niveau1.default)
      .then((r) => r.text())
      .then((text) => {
        text.split("\n").forEach((line) => {
          const lineSplit = line.split(":");
          const tmpNiv1 = {
            id: lineSplit[0],
            value: lineSplit[1],
          };
          this.setState({
            niv1: [...this.state.niv1, tmpNiv1],
          });
        });
      });

    fetch(niveau5.default)
      .then((r) => r.text())
      .then((text) => {
        text.split("\n").forEach((line) => {
          const lineSplit = line.split(":");
          const tmpNiv5All = {
            id: lineSplit[0],
            value: lineSplit[1],
          };
          this.setState({
            niv5All: [...this.state.niv5All, tmpNiv5All],
          });
        });
      });

    fetch(niveaux.default)
      .then((r) => r.text())
      .then((text) => {
        text.split("\n").forEach((line) => {
          const lineSplit = line.split(":");
          const tmpNivx = {
            niv5: lineSplit[0],
            niv4: lineSplit[1],
            niv3: lineSplit[2],
            niv2: lineSplit[3],
            niv1: lineSplit[4].charAt(0),
          };
          this.setState({
            nivx: [...this.state.nivx, tmpNivx],
          });
        });
      });
  }

  handleSelectNiv1 = (event) => {
    const niveau2 = require("../resources/xls/naf2008_liste_n2.csv");

    this.setState({
      niv2: [],
      niv3: [],
      niv4: [],
      niv5: [],
      selectNaf: "",
    });
    this.props.updateCodeNaf("");
    const listIdNiv2 = [
      ...new Set(
        this.state.nivx
          .filter((nivx) => nivx.niv1 === event.target.value)
          .map((nivx) => nivx.niv2)
      ),
    ];

    fetch(niveau2.default)
      .then((r) => r.text())
      .then((text) => {
        text.split("\n").forEach((line) => {
          const lineSplit = line.split(":");
          if (listIdNiv2.indexOf(lineSplit[0]) !== -1) {
            const tmpNiv2 = {
              id: lineSplit[0],
              value: lineSplit[1],
            };
            this.setState({
              niv2: [...this.state.niv2, tmpNiv2],
            });
          }
        });
      });
  };

  handleSelectNiv2 = (event) => {
    const niveau3 = require("../resources/xls/naf2008_liste_n3.csv");

    this.setState({
      niv3: [],
      niv4: [],
      niv5: [],
      selectNaf: "",
    });
    this.props.updateCodeNaf("");
    const listIdNiv3 = [
      ...new Set(
        this.state.nivx
          .filter((nivx) => nivx.niv2 === event.target.value)
          .map((nivx) => nivx.niv3)
      ),
    ];

    fetch(niveau3.default)
      .then((r) => r.text())
      .then((text) => {
        text.split("\n").forEach((line) => {
          const lineSplit = line.split(":");
          if (listIdNiv3.indexOf(lineSplit[0]) !== -1) {
            const tmpNiv3 = {
              id: lineSplit[0],
              value: lineSplit[1],
            };
            this.setState({
              niv3: [...this.state.niv3, tmpNiv3],
            });
          }
        });
      });
  };

  handleSelectNiv3 = (event) => {
    const niveau4 = require("../resources/xls/naf2008_liste_n4.csv");

    this.setState({
      niv4: [],
      niv5: [],
      selectNaf: "",
    });
    this.props.updateCodeNaf("");
    const listIdNiv4 = [
      ...new Set(
        this.state.nivx
          .filter((nivx) => nivx.niv3 === event.target.value)
          .map((nivx) => nivx.niv4)
      ),
    ];

    fetch(niveau4.default)
      .then((r) => r.text())
      .then((text) => {
        text.split("\n").forEach((line) => {
          const lineSplit = line.split(":");
          if (listIdNiv4.indexOf(lineSplit[0]) !== -1) {
            const tmpNiv4 = {
              id: lineSplit[0],
              value: lineSplit[1],
            };
            this.setState({
              niv4: [...this.state.niv4, tmpNiv4],
            });
          }
        });
      });
  };

  handleSelectNiv4 = (event) => {
    this.setState({
      niv5: [],
      selectNaf: "",
    });
    this.props.updateCodeNaf("");
    const listIdNiv5 = [
      ...new Set(
        this.state.nivx
          .filter((nivx) => nivx.niv4 === event.target.value)
          .map((nivx) => nivx.niv5)
      ),
    ];

    this.state.niv5All.forEach((niv5) => {
      if (listIdNiv5.indexOf(niv5.id) !== -1) {
        const tmpNiv5 = {
          id: niv5.id,
          value: niv5.value,
        };
        this.setState({
          niv5: [...this.state.niv5, tmpNiv5],
        });
      }
    });
  };

  handleSelectNaf = (event) => {
    this.props.updateCodeNaf(event.target.value);
  };

  handleSelectNafAuto = (event, value) => {
    if (value != null) {
      this.props.updateCodeNaf(value.id);
    } else {
      this.props.updateCodeNaf("");
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.history.push("/listeDepartements");
  };

  render() {
    const { niv1, niv2, niv3, niv4, niv5, niv5All } = this.state;
    const codeNaf = this.props.codeNaf;
    return (
      <Fragment>
        <Container style={{ textAlign: "center" }}>
          <form onSubmit={this.handleSubmit}>
            <InputLabel id="niv1">Liste des sections</InputLabel>
            <Select
              labelId="niv1"
              id="selectNiv1"
              autoWidth={true}
              onChange={this.handleSelectNiv1}
              defaultValue="default"
            >
              <MenuItem value="default" disabled>
                S??lectionner une sections
              </MenuItem>
              {niv1.map((niv) => (
                <MenuItem key={niv.id} value={niv.id}>
                  {niv.value}
                </MenuItem>
              ))}
            </Select>

            {niv2.length !== 0 ? (
              <Fragment>
                <InputLabel id="niv2">Liste des divisions</InputLabel>
                <Select
                  labelId="niv2"
                  id="selectNiv2"
                  autoWidth={true}
                  onChange={this.handleSelectNiv2}
                  defaultValue="default"
                >
                  <MenuItem value="default" disabled>
                    S??lectionner une divisions
                  </MenuItem>
                  {niv2.map((niv) => (
                    <MenuItem key={niv.id} value={niv.id}>
                      {niv.value}
                    </MenuItem>
                  ))}
                </Select>
              </Fragment>
            ) : null}

            {niv3.length !== 0 ? (
              <Fragment>
                <InputLabel id="niv3">Liste des groupes</InputLabel>
                <Select
                  labelId="niv3"
                  id="selectNiv3"
                  autoWidth={true}
                  onChange={this.handleSelectNiv3}
                  defaultValue="default"
                >
                  <MenuItem value="default" disabled>
                    S??lectionner un groupe
                  </MenuItem>
                  {niv3.map((niv) => (
                    <MenuItem key={niv.id} value={niv.id}>
                      {niv.value}
                    </MenuItem>
                  ))}
                </Select>
              </Fragment>
            ) : null}

            {niv4.length !== 0 ? (
              <Fragment>
                <InputLabel id="niv4">Liste des classes</InputLabel>
                <Select
                  labelId="niv4"
                  id="selectNiv4"
                  autoWidth={true}
                  onChange={this.handleSelectNiv4}
                  defaultValue="default"
                >
                  <MenuItem value="default" disabled>
                    S??lectionner une classe
                  </MenuItem>
                  {niv4.map((niv) => (
                    <MenuItem key={niv.id} value={niv.id}>
                      {niv.value}
                    </MenuItem>
                  ))}
                </Select>
              </Fragment>
            ) : null}

            {niv5.length !== 0 ? (
              <Fragment>
                <InputLabel id="niv5">Liste des sous-classes</InputLabel>
                <Select
                  labelId="niv5"
                  id="selectNiv5"
                  autoWidth={true}
                  onChange={this.handleSelectNaf.bind(this)}
                  defaultValue="default"
                >
                  <MenuItem value="default" disabled>
                    S??lectionner une sous-classe
                  </MenuItem>
                  {niv5.map((niv) => (
                    <MenuItem key={niv.id} value={niv.id}>
                      {niv.value}
                    </MenuItem>
                  ))}
                </Select>
              </Fragment>
            ) : null}
            <br />
            <br />
            <p>OU</p>
            <br />
            <br />
            <div style={{textAlign: "center"}}>
              <Autocomplete
                options={niv5All}
                getOptionLabel={(niv) => niv.value}
                style={{ width: 500 }}
                onChange={this.handleSelectNafAuto.bind(this)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Rechercher un m??tier"
                    variant="outlined"
                  />
                )}
              />
            </div>
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={codeNaf === ""}
            >
              Valider
            </Button>
          </form>
        </Container>
      </Fragment>
    );
  }
}

export default withRouter(ListeMetiers);
