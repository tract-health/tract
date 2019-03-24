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
    this.lowOnClick = this.lowOnClick.bind(this);
    this.mediumOnClick = this.mediumOnClick.bind(this);
    this.highOnClick = this.highOnClick.bind(this);

    this.state = {
      collapse: this.props.expanded || false,
      title: this.props.title || "",
      low: false,
      medium: false,
      high: false
    };
  }

  toggleClick() {
    this.setState({ collapse: !this.state.collapse });
  }

  lowOnClick(e) {
    e.preventDefault();
    const value = !this.state.low;
    this.setState({
      low: value,
      medium: !value,
      high: !value
    })
  }

  mediumOnClick(e) {
    e.preventDefault();
    const value = !this.state.medium;
    this.setState({
      low: !value,
      medium: value,
      high: !value
    })
  }

  highOnClick(e) {
    e.preventDefault();
    const value = !this.state.high;
    this.setState({
      low: !value,
      medium: !value,
      high: value
    })
  }

  render() {
    const {definition, questions, surveyItem, onClick, id} = this.props;

    let lowClass = "mb-1 badge badge-outline-primary badge-pill low";
    let lowStyle = null;
    if (surveyItem === "low") {
      lowClass = "mb-1 badge badge-primary badge-pill low";
      lowStyle = { border: "1px transparent solid" }
    }

    let mediumClass = "mb-1 badge badge-outline-secondary badge-pill medium";
    let mediumStyle = null;
    if (surveyItem === "medium") {
      mediumClass = "mb-1 badge badge-secondary badge-pill medium";
      mediumStyle = { border: "1px transparent solid" }
    }

    let highClass = "mb-1 badge badge-outline-info badge-pill high";
    let highStyle = null;
    if (surveyItem === "high") {
      highClass = "mb-1 badge badge-info badge-pill high";
      highStyle = { border: "1px transparent solid" }
    }

    return (
      <Card className={`question d-flex mb-4 ${this.state.mode}`}>
        <div className="d-flex flex-grow-1 min-width-zero">
          <div className="card-body align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <div className="list-item-heading mb-0 truncate w-50 mb-1 mt-1">
              <span className="heading-number d-inline-block">
                {this.props.order}
              </span>
              {this.state.title}
            </div>
            <div className="list-item-heading">
              <a href="#" onClick={onClick}>
                <span className={lowClass} style={lowStyle} data-id={id}>LOW</span>
              </a>
              <a href="#" onClick={onClick} className="ml-2 mr-2">
                <span className={mediumClass} style={mediumStyle} data-id={id}>MEDIUM</span>
              </a>
              <a href="#" onClick={onClick}>
                <span className={highClass} style={highStyle} data-id={id}>HIGH</span>
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
