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
} from "reactstrap";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";

import DatePicker from "react-datepicker";
import {getPatientsList, getSurveyDetail} from 'Redux/actions'

import { connect } from 'react-redux'
import SummaryTable from "Components/SummaryTable";

class Factors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDateRange: null,
      endDateRange: null,
      selectedPatient: null
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
    this.setState({selectedPatient: item});
  }

  componentDidMount() {
    this.props.getSurveyDetail();
    this.props.getPatientsList();
  }

  render() {

    const {
      allPatientsItems
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

    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <div className="mb-2">
              <BreadcrumbContainer
                heading="TRACT Factors"
                match={this.props.match}
              />
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
                <div className="d-block mb-2 d-md-inline-block">
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
                        allPatientsItems ?
                          allPatientsItems.map((item) =>
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
                </div>
                <div className="d-block mb-2 d-md-inline-block">
                  <div className="calendar-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                    <DatePicker
                      selected={this.state.startDateRange}
                      selectsStart
                      startDate={this.state.startDateRange}
                      endDate={this.state.endDateRange}
                      onChange={this.handleChangeStart}
                      placeholderText="From"
                    />
                  </div>
                </div>
                <div className="d-block mb-2 d-md-inline-block">
                  <div className="calendar-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                    <DatePicker
                      selected={this.state.endDateRange}
                      selectsEnd
                      startDate={this.state.startDateRange}
                      endDate={this.state.endDateRange}
                      onChange={this.handleChangeEnd}
                      placeholderText="To"
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
      </Fragment>
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
    getPatientsList
  }
)(Factors);
