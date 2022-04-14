import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import {
  Row,
  Card,
  CardBody,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Collapse,
  Badge,
  Col
} from "reactstrap";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";

import DatePicker from "react-datepicker";
import {
  getPatientsList,
  getSurveyDetail,
  getPatientsListSearch
} from 'Redux/actions'

import { connect } from 'react-redux'
import SummaryTable from "Components/SummaryTable";
import moment from 'moment';

import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';

import { ThemeColors } from "Util/ThemeColors";

class Factors extends Component {
  constructor(props) {
    super(props);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const endDate = new Date();
    const defaultPatient = {
      id: 'A',
      name: 'All Patients'
    }

    this.state = {
      startDateRange: moment(startDate),
      endDateRange: moment(endDate),
      selectedPatient: defaultPatient
    };

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.selectPatient = this.selectPatient.bind(this);
  }

  handleChangeStart(date) {
    this.setState({
      startDateRange: date
    });
  }

  handleChangeEnd(date) {
    this.setState({
      endDateRange: date
    });
  }

  selectPatient(item) {
    console.log(item);
    this.setState({selectedPatient: item});
  }

  componentDidMount() {
    this.props.getSurveyDetail();
    this.props.getPatientsList();
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.props.getPatientsListSearch(e.target.value);
    }
  }

  handleSearchChange(e) {
    this.props.getPatientsListSearch(e.target.value);
  }

  onCapture = (id) =>{
    var data = document.getElementsByClassName(id)
    for (var i = 0; i < data.length; i++) {
      htmlToImage.toPng(data[i])
      .then((dataUrl) => {
        saveAs(dataUrl, 'Factors Data.png');
      });
    }
  }

  render() {

    const {
      allPatientsItems,
      patientsItems,
      searchKeyword
    } = this.props.patientsApp;

    const { survey } = this.props.surveyDetailApp;

    let rowHeaders = survey && survey.survey
      ? survey.survey.filter((i) => i.id !== "S").map((i) => {return {id: i.id, name: i.factor}})
      : [];
    let data = {};

    if (survey && survey.survey) {
      for (let s of survey.survey) {
        if (s.id === "S")
          continue;
        data[s.id] = {}
      }
    }

    if (allPatientsItems && this.state.selectedPatient) {
      for (let patient of allPatientsItems) {
        if (this.state.selectedPatient.id === "A") {
          for (let date in patient.surveys) {
            for (let id in patient.surveys[date].answers) {
              if (id === "S")
                continue;
              if (typeof data[id][date] === "undefined") {
                data[id][date] = [];
              }
              data[id][date].push(patient.surveys[date].answers[id]);
            }
          }
        } else {
          if (patient.id === this.state.selectedPatient.id) {
            for (let date in patient.surveys) {
              for (let id in patient.surveys[date].answers) {
                if (id === "S")
                  continue;
                data[id][date] = patient.surveys[date].answers[id];
              }
            }
          }
        }
      }
    }

    // set up badge colours
    function setupColor(id) {
      let resultClass = "mr-2 mb-1 badge badge-pill " + id;
      let resultStyle = {
        border: "1px transparent solid",
        backgroundColor: ThemeColors()[id + 'Color'],
        color: ThemeColors().primaryColor
      };
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

    let title = <IntlMessages id="menu.factors" />

    return (
      <div className="mainfragment">
        <Fragment>
          <Row>
            <Colxx xxs="12">
              <div className="mb-2">
                <h1>
                  {title}
                </h1>
              </div>
              {/* <div className="mb-2">
                <BreadcrumbContainer
                  heading={title}
                  match={this.props.match}
                />
              </div> */}
              <div className="mb-4 mr-2 float-sm-right">
                <Row>
                  <div className="ml-3 mr-2">Heatmap:</div>
                  <Col>
                    <Row>
                      <div className={naClass} style={naStyle}>N/A</div>
                      <div className={verylowClass} style={verylowStyle}>VERY LOW</div>
                      <div className={lowClass} style={lowStyle}>LOW</div>
                      <div className={mediumClass} style={mediumStyle}>MEDIUM</div>
                      <div className={highClass} style={highStyle}>HIGH</div>
                      <div className={veryhighClass} style={veryhighStyle}>VERY HIGH</div>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="mb-2">
                <Button
                  color="empty"
                  id="displayOptions"
                  className="pt-0 pl-0 d-inline-block d-md-none"
                  onClick={this.toggleDisplayOptions}
                >
                  <IntlMessages id="todo.display-options" />{" "}
                  <i className="simple-icon-arrow-down align-middle" />
                </Button>
                <Collapse
                  className="d-md-block"
                  isOpen={true}
                >
                  <div className="mb-2">
                    <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                      <DropdownToggle caret color="outline-dark" size="xs">
                        { this.state.selectedPatient ? this.state.selectedPatient.name : 'Select Patient ...'}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          key="A"
                          onClick={() => this.selectPatient({id: "A", name: "All Patients"})}
                        >
                          All Patients
                        </DropdownItem>
                        {
                          patientsItems ?
                            patientsItems.map((item) =>
                              <DropdownItem
                                key={ item.id }
                                onClick={() => this.selectPatient(item)}
                              >
                                { item.name }
                              </DropdownItem>
                          ) : <DropdownItem
                              key={0}
                              onClick={() => this.selectPatient(null)}
                            />
                        }
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <div className="search-sm d-inline-block mb-1 align-top">
                      <input
                        type="text"
                        name="keyword"
                        id="search"
                        placeholder="Filter"
                        defaultValue=''
                        onKeyPress={e => this.handleKeyPress(e)}
                        onChange={e => this.handleSearchChange(e)}
                      />
                    </div>
                  </div>
                  <div className="d-block mb-2 d-md-inline-block">
                    <div className="calendar-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                      <DatePicker
                        dateFormat='DD/MM/YYYY'
                        selected={this.state.startDateRange}
                        selectsStart
                        startDate={this.state.startDateRange}
                        endDate={this.state.endDateRange}
                        onChange={this.handleChangeStart}
                        placeholderText="From"
                        locale="en-GB"
                      />
                    </div>
                  </div>
                  <div className="d-block mb-2 d-md-inline-block">
                    <div className="calendar-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                      <DatePicker
                        dateFormat='DD/MM/YYYY'
                        selected={this.state.endDateRange}
                        selectsEnd
                        startDate={this.state.startDateRange}
                        endDate={this.state.endDateRange}
                        onChange={this.handleChangeEnd}
                        placeholderText="To"
                        locale="en-GB"
                      />
                    </div>
                  </div>
                </Collapse>
              </div>
              <Separator className="mb-5" />
            </Colxx>
          </Row>
          {
            this.state.startDateRange && this.state.endDateRange && this.state.selectedPatient ?
              <Row>
                <Colxx lg="12">
                  <Card>
                    <CardBody>
                      <SummaryTable
                        leftUp="TRACT Factor"
                        startDateRange={this.state.startDateRange}
                        endDateRange={this.state.endDateRange}
                        rowHeaders={rowHeaders}
                        data={data}
                      />
                    </CardBody>
                  </Card>
                </Colxx>
              </Row>
              : null
          }
          <div className="float-sm-right mt-3">
            <Button 
              className="mb-4"
              color="primary"
              onClick={() => this.onCapture('mainfragment')}
              >
              <IntlMessages id="todo.exportimage" />
            </Button>
          </div>
        </Fragment>
      </div>

    );
  }
}

const mapStateToProps = ({ patientsApp, surveyDetailApp }) => {
  return {
    patientsApp,
    surveyDetailApp
  };
};

export default connect(
  mapStateToProps,
  {
    getSurveyDetail,
    getPatientsList,
    getPatientsListSearch
  }
)(Factors);
