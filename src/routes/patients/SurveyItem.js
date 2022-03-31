import React from "react";
import {
  Card,
  Button,
  Collapse,
} from "reactstrap";

import { ThemeColors } from "Util/ThemeColors";

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
    
    // set up badge colours
    function setupColor(id) {
      let resultClass = "mb-1 badge badge-pill " + id;
      let resultStyle = {
        //color: ThemeColors()[id + 'Color'],
        //background: "unset",
        color: ThemeColors().primaryColor,
        backgroundColor: ThemeColors()[id + 'Color'] + '25',
        border: "1px solid",
        borderColor: ThemeColors()[id + 'Color']
      };
      if (surveyItem === id) {
        resultStyle = {
          border: "1px transparent solid",
          backgroundColor: ThemeColors()[id + 'Color'],
          color: ThemeColors().primaryColor
        };
      }
      return {
        "class": resultClass,
        "style": resultStyle
      }
    }
    let naClass = setupColor('na').class;
    let naStyle = setupColor('na').style;
    let verylowClass = setupColor('verylow').class;
    let verylowStyle = setupColor('verylow').style;
    let lowClass = setupColor('low').class;
    let lowStyle = setupColor('low').style;
    let mediumClass = setupColor('medium').class;
    let mediumStyle = setupColor('medium').style;
    let highClass = setupColor('high').class;
    let highStyle = setupColor('high').style;
    let veryhighStyle = setupColor('veryhigh').style;
    let veryhighClass = setupColor('veryhigh').class;

    let listItemCardClass
    if (this.props.order !== "S") {
      listItemCardClass = `question d-flex mb-3 ${this.state.mode}`;
    } else {
      listItemCardClass = `question d-flex mt-5 ${this.state.mode}`;
    }

    let listItemCardOverallClass;
    if (!this.state.collapse) {
      listItemCardOverallClass = "d-flex card-overallassessment flex-grow-1 min-width-zero";
    } else {
      listItemCardOverallClass = "d-flex card-overallassessmenttop flex-grow-1 min-width-zero";
    }

    let listItem;
    // if the item is not the overall score
    if (this.props.order !== "S") {
      listItem = 
        <div className="d-flex flex-grow-1 min-width-zero">
          <div className="card-body card-assessment">
            <div className="row align-items-center">
              <div className="col text-nowrap">
                <div className="list-item-heading mb-2 mt-1">
                  <span className="heading-number d-inline-block">
                    {this.props.order}
                  </span>
                  {this.state.title}
                </div>
              </div>
              <div className="col justify-content-center d-flex">
                <div className="list-item-heading d-flex">
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
    } else {
      // if the item is the overall score
      listItem = 
        <div className={listItemCardOverallClass}>
          <div className="card-body card-assessment d-flex">
            <div className="col">
              <div className="row align-items-center">
                <div className="col text-nowrap">
                  <div className="list-item-heading mb-2 mt-1">
                    {this.state.title}
                  </div>
                </div>
                <div className="col justify-content-center d-flex">
                  <div className="list-item-heading d-flex">
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
              </div>
              <div className="row ml-1 mt-3">
                <div className="list-item" style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                  {definition}
                </div>
              </div>
            </div>
            
          </div>
        </div>
    }

    let cardCollapseClass;
    if (this.state.collapse && this.props.order === "S") {
      cardCollapseClass = "card-body card-overallassessmentbottom pt-0";
    } else {
      cardCollapseClass = "card-body pt-0";
    }

    let cardItem;
    if (this.props.order !== "S") {
      cardItem = <div className="edit-mode">
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
    } else {
      cardItem = <div className="edit-mode">
                    <p>{definition}</p>
                  </div>
    }

    return (
      <Card className={listItemCardClass}>
        {listItem}
        <Collapse isOpen={this.state.collapse}>
          <div className={cardCollapseClass}>
            {cardItem}
          </div>
        </Collapse>
      </Card>
    );
  }
}
