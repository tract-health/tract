import React from "react";
import {
  Card,
  Button,
  Collapse,
} from "reactstrap";

export default class SurveyItem extends React.Component {
  constructor(...params) {
    super(...params);
    this.toggleClick = this.toggleClick.bind(this);
    this.naOnClick = this.naOnClick.bind(this);
    this.verylowOnClick = this.verylowOnClick.bind(this);
    this.lowOnClick = this.lowOnClick.bind(this);
    this.mediumOnClick = this.mediumOnClick.bind(this);
    this.highOnClick = this.highOnClick.bind(this);
    this.veryhighOnClick = this.veryhighOnClick.bind(this);

    this.state = {
      collapse: this.props.expanded || false,
      title: this.props.title || "",
      na: false,
      verylow: false,
      low: false,
      medium: false,
      high: false,
      veryhigh: false
    };
  }

  toggleClick() {
    this.setState({ collapse: !this.state.collapse });
  }
  
  naOnClick(e) {
    e.preventDefault();
    const value = !this.state.na;
    this.setState({
      na: value,
      verylow: !value,
      low: !value,
      medium: !value,
      high: !value,
      veryhigh: !value
    })
  }

  verylowOnClick(e) {
    e.preventDefault();
    const value = this.state.verylow;
    this.setState({
      na: !value,
      verylow: value,
      low: !value,
      medium: !value,
      high: !value,
      veryhigh: !value
    })
  }

  lowOnClick(e) {
    e.preventDefault();
    const value = !this.state.low;
    this.setState({
      na: !value,
      verylow: !value,
      low: value,
      medium: !value,
      high: !value,
      veryhigh: !value
    })
  }

  mediumOnClick(e) {
    e.preventDefault();
    const value = !this.state.medium;
    this.setState({
      na: !value,
      verylow: !value,
      low: !value,
      medium: value,
      high: !value,
      veryhigh: !value
    })
  }

  highOnClick(e) {
    e.preventDefault();
    const value = !this.state.high;
    this.setState({
      na: !value,
      verylow: !value,
      low: !value,
      medium: !value,
      high: value,
      veryhigh: !value
    })
  }

  veryhighOnClick(e) {
    e.preventDefault();
    const value = !this.state.veryhigh;
    this.setState({
      na: !value,
      verylow: !value,
      low: !value,
      medium: !value,
      high: !value,
      veryhigh: value
    })
  }

  render() {
    const {definition, questions, surveyItem, onClick, id} = this.props;

    let naClass = "mb-1 badge badge-outline-na badge-pill na";
    let naStyle = null;
    if (surveyItem === "na") {
      naClass = "mb-1 badge badge-na badge-pill na";
      naStyle = { border: "1px transparent solid" }
    }

    let verylowClass = "mb-1 badge badge-outline-verylow badge-pill verylow";
    let verylowStyle = null;
    if (surveyItem === "verylow") {
      verylowClass = "mb-1 badge badge-verylow badge-pill verylow";
      verylowStyle = { border: "1px transparent solid" }
    }

    let lowClass = "mb-1 badge badge-outline-low badge-pill low";
    let lowStyle = null;
    if (surveyItem === "low") {
      lowClass = "mb-1 badge badge-low badge-pill low";
      lowStyle = { border: "1px transparent solid" }
    }

    let mediumClass = "mb-1 badge badge-outline-medium badge-pill medium";
    let mediumStyle = null;
    if (surveyItem === "medium") {
      mediumClass = "mb-1 badge badge-medium badge-pill medium";
      mediumStyle = { border: "1px transparent solid" }
    }

    let highClass = "mb-1 badge badge-outline-high badge-pill high";
    let highStyle = null;
    if (surveyItem === "high") {
      highClass = "mb-1 badge badge-high badge-pill high";
      highStyle = { border: "1px transparent solid" }
    }

    let veryhighClass = "mb-1 badge badge-outline-veryhigh badge-pill veryhigh";
    let veryhighStyle = null;
    if (surveyItem === "veryhigh") {
      veryhighClass = "mb-1 badge badge-veryhigh badge-pill veryhigh";
      veryhighStyle = { border: "1px transparent solid" }
    }

    return (
      <Card className={`question d-flex mb-3 ${this.state.mode}`}>
        <div className="d-flex flex-grow-1 min-width-zero">
          <div 
            className="card-body card-assessment align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <div className="list-item-heading mb-0 truncate w-50 mb-1 mt-1">
              <span className="heading-number d-inline-block">
                {this.props.order}
              </span>
              {this.state.title}
            </div>
            <div className="list-item-heading align-self-center d-flex justify-content-between align-items-md-center">
              <a href="#" onClick={onClick}>
                <span className={naClass} style={naStyle} data-id={id}>N/A</span>
              </a>
              <a href="#" onClick={onClick} className="ml-2">
                <span className={verylowClass} style={verylowStyle} data-id={id}>VERY LOW</span>
              </a>
              <a href="#" onClick={onClick} className="ml-2">
                <span className={lowClass} style={lowStyle} data-id={id}>LOW</span>
              </a>
              <a href="#" onClick={onClick} className="ml-2">
                <span className={mediumClass} style={mediumStyle} data-id={id}>MEDIUM</span>
              </a>
              <a href="#" onClick={onClick} className="ml-2 mr-2">
                <span className={highClass} style={highStyle} data-id={id}>HIGH</span>
              </a>
              <a href="#" onClick={onClick}>
                <span className={veryhighClass} style={veryhighStyle} data-id={id}>VERY HIGH</span>
              </a>
            </div>
          </div>
          <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">

            <Button
              outline
              color={"theme-3"}
              className={`icon-button ml-1 rotate-icon-click ${
                this.state.collapse ? "rotate" : ""
              }`}
              onClick={this.toggleClick}
            >
              <i className="simple-icon-arrow-down" />
            </Button>

          </div>
        </div>

        <Collapse isOpen={this.state.collapse}>
          <div className="card-body pt-0">
            <div className="edit-mode">
              <h5>Definition</h5>
              <p>{definition}</p>
              <br />
              <h5>Questions</h5>
              <ul>
                {
                  questions.map((item, idx) => {
                    return <li key={idx}>{item}</li>
                  })
                }
              </ul>
            </div>
          </div>
        </Collapse>
      </Card>
    );
  }
}
