import React, { Component, Fragment } from "react";
import {
  Row,
  Card,
  CardBody,
  Nav,
  NavItem,
  Button,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  TabContent,
  TabPane,
  Badge,
  ButtonDropdown
} from "reactstrap";
import { Colxx } from "Components/CustomBootstrap";
import { BreadcrumbItems } from "Components/BreadcrumbContainer";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import SurveyItem from "./SurveyItem";
import moment from "moment";
import ApplicationMenu from "Components/ApplicationMenu";
import PerfectScrollbar from "react-perfect-scrollbar";
import DatePicker from "react-datepicker";
import { withRouter } from 'react-router-dom'

import { connect } from "react-redux";
import {
    getSurveyDetail,
    deleteSurveyQuestion,
    saveSurvey,
    getPatientsList
} from "Redux/actions";

import "react-datepicker/dist/react-datepicker.css";
import { database } from '../../firebase'

const surveyData = [];


class PatientsDetail extends Component {
  constructor(props) {
    super(props);

    this.patientId = this.props.match.params.patientId;
    this.date = this.props.match.params.date;

    this.toggleTab = this.toggleTab.bind(this);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.handleSurveyAssessmentClick = this.handleSurveyAssessmentClick.bind(this);
    this.handleSaveSurvey = this.handleSaveSurvey.bind(this);

    this.state = {
      activeFirstTab: "1",
      dropdownSplitOpen: false,
      surveyData: surveyData,
      embeddedDate: moment(this.date, "YYYY-MM-DD"),
      defaultSurvey: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        "S": 0
      },
      survey: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        "S": 0
      }
    };
  }

  componentDidMount() {
    this.props.getSurveyDetail();
    this.props.getPatientsList();
  }

  componentDidUpdate() {
    this.date = this.props.match.params.date;
    const patientSurvey = this.getSurvey();
    if (!this.patientSurveyUpdated) {
      this.setState({
        embeddedDate: moment(this.date, "YYYY-MM-DD"),
        survey: patientSurvey ? patientSurvey.answers : this.state.defaultSurvey
      });

      this.patientSurveyUpdated = true
    }
  }

  getPatient() {
    if (this.props.patientsApp.allPatientsItems) {
      return this.props.patientsApp.allPatientsItems.find(x => x.id === this.patientId)
    }
    return null
  }

  getSurvey() {
    const patient = this.getPatient();
    console.log(patient)
    if (patient) {
      const date = this.getDate();
      console.log(date)
      if (date) {
        return patient.surveys && patient.surveys[date] ? patient.surveys[date] : null
      }
    }
    return null
  }

  getDate() {
    return this.date
  }

  getSum(assessmentLevel) {
    let result = 0;
    for(let k in this.state.survey) {
      if (k === "S")
        continue;
      let val = this.state.survey[k];
      if (val === assessmentLevel)
        result++
    }
    return result;
  }

  handleSaveSurvey() {
    if (this.patientId) {
      const surveyId = this.getDate();
      const surveyPath = `${localStorage.getItem('user_id')}/patients/${this.patientId}/surveys/${surveyId}`;

      return database.ref(surveyPath).set({
        answers: this.state.survey,
        na: this.getSum("na"),
        verylow: this.getSum("verylow"),
        low: this.getSum("low"),
        medium: this.getSum("medium"),
        high: this.getSum("high"),
        veryhigh: this.getSum("veryhigh")
      }).then(response => {
        this.props.getPatientsList();
      }).catch(error => error);
    }
  }

  handleDeleteSurvey() {
    if (this.patientId) {
      const surveyId = this.getDate();
      const surveyPath = `${localStorage.getItem('user_id')}/patients/${this.patientId}/surveys/${surveyId}`;

      return database.ref(surveyPath).remove()
        .then(response => {
        this.props.getPatientsList();
      }).catch(error => error);
    }
  }

  handleSurveyAssessmentClick(e) {
    e.preventDefault();

    const id = e.target.getAttribute('data-id');
    let className = null;
    if (e.target.classList.contains("na")) {
      className = "na"
    }
    if (e.target.classList.contains("verylow")) {
      className = "verylow"
    }
    if (e.target.classList.contains("low")) {
      className = "low"
    }
    if (e.target.classList.contains("medium")) {
      className = "medium"
    }
    if (e.target.classList.contains("high")) {
      className = "high"
    }
    if (e.target.classList.contains("veryhigh")) {
      className = "veryhigh"
    }

    this.setState((prevState) => ({
      ...prevState,
      survey: {
        ...prevState.survey,
        [id]: prevState.survey[id] !== className ? className: null
      }
    }))
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeFirstTab: tab
      });
    }
  }

  toggleSplit() {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  }

  render() {
    const { survey, loading } = this.props.surveyDetailApp;

    const patient = this.getPatient();
    const patientSurvey = this.getSurvey();

    const getOverAllBadge = (patientSurvey) => {
      const s = patientSurvey && patientSurvey.answers && patientSurvey.answers['S'] ? patientSurvey.answers['S'] : null;

      if (s === 'na') {
        return <Badge color="na" pill>N/A</Badge>
      }
      if (s === 'verylow') {
        return <Badge color="verylow" pill>VERY LOW</Badge>
      }
      if (s === 'low') {
        return <Badge color="low" pill>LOW</Badge>
      }
      if (s === 'medium') {
        return <Badge color="medium" pill>MEDIUM</Badge>
      }
      if (s === 'high') {
        return <Badge color='high' pill>HIGH</Badge>
      }
      if (s === 'veryhigh') {
        return <Badge color='veryhigh' pill>VERY HIGH</Badge>
      }
    };

    let highlightDates = [];
    if (patient && patient.surveys) {
      for (let k in patient.surveys) {
        highlightDates.push(moment(k, "YYYY-MM-DD"))
      }
    }

    const MyDatePicker = withRouter(({history}) => (
      <DatePicker
        calendarClassName="embedded"
        inline
        selected={this.state.embeddedDate}
        onChange={(date) => {
          this.patientSurveyUpdated = false
          history.push(`/app/patients/detail/${this.patientId}/${date.format("YYYY-MM-DD")}`)
        }}
        highlightDates={highlightDates}
      />
    ));

    return (
      <Fragment>
        <style>{`
          .react-datepicker__day--today {
            color: #000 !important;
          }
          .react-datepicker__day--today.react-datepicker__day--selected {
            color: #fff !important;
          }
        `}</style>
        <Row className="app-row survey-app">
          <Colxx xxs="12">
            <h1>
              <span className="align-middle d-inline-block pt-1">Patient TRACT Assessment</span>
            </h1>
            <div className="float-sm-right mb-2">
              <ButtonDropdown
                className="top-right-button top-right-button-single"
                isOpen={this.state.dropdownSplitOpen}
                toggle={this.toggleSplit}
              >
                <Button
                  outline
                  className="flex-grow-1"
                  size="lg"
                  color="primary"
                  onClick={this.handleSaveSurvey}
                >
                  SAVE
                </Button>
                <DropdownToggle
                  size="lg"
                  className="pr-4 pl-4"
                  caret
                  outline
                  color="primary"
                />
                <DropdownMenu right>
                  <DropdownItem
                    header
                    onClick={() => this.handleDeleteSurvey()}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </div>

            <BreadcrumbItems match={this.props.match} />
            {loading ?
            <Fragment>
            <Nav tabs className="separator-tabs ml-0 mb-5">
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeFirstTab === "1",
                    "nav-link": true
                  })}
                  onClick={() => {
                    this.toggleTab("1");
                  }}
                  to="#"
                >
                  DETAILS
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={this.state.activeFirstTab}>
              <TabPane tabId="1">
   
                <Row>
                  <Colxx xxs="12" lg="4" className="mb-4">
                    <Card className="mb-4">
                      <CardBody>

                        <p className="text-muted text-small mb-2">ID</p>
                        <p className="mb-3">{patient ? patient.id : null}</p>

                        <p className="text-muted text-small mb-2">Name</p>
                        <p className="mb-3">{patient ? patient.name: null}</p>

                        <p className="text-muted text-small mb-2">Created Date</p>
                        <p className="mb-3">{patient ? patient.createDate: null}</p>

                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <MyDatePicker/>
                      </CardBody>
                    </Card>

                    <Card className="mt-4">
                      <CardBody>
                        <Row>
                          <Colxx><Badge color="na" pill>N/A</Badge></Colxx>
                          <Colxx>{patientSurvey ? patientSurvey.na : 0}</Colxx>
                        </Row>
                        <Row className="mt-1 mb-1">
                          <Colxx><Badge color="verylow" pill>VERY LOW</Badge></Colxx>
                          <Colxx>{patientSurvey ? patientSurvey.verylow : 0}</Colxx>
                        </Row>
                        <Row className="mt-1 mb-1">
                          <Colxx><Badge color="low" pill>LOW</Badge></Colxx>
                          <Colxx>{patientSurvey ? patientSurvey.low : 0}</Colxx>
                        </Row>
                        <Row className="mt-1 mb-1">
                          <Colxx><Badge color="medium" pill>MEDIUM</Badge></Colxx>
                          <Colxx>{patientSurvey ? patientSurvey.medium : 0}</Colxx>
                        </Row>
                        <Row className="mt-1 mb-1">
                          <Colxx><Badge color="high" pill>HIGH</Badge></Colxx>
                          <Colxx>{patientSurvey ? patientSurvey.high : 0}</Colxx>
                        </Row>
                        <Row>
                          <Colxx><Badge color="veryhigh" pill>VERY HIGH</Badge></Colxx>
                          <Colxx>{patientSurvey ? patientSurvey.veryhigh : 0}</Colxx>
                        </Row>
                      </CardBody>
                    </Card>

                    <Card className="mt-4">
                      <CardBody>
                        <Row>
                          <Colxx>Overall Tract Assessment</Colxx>
                          <Colxx>{ getOverAllBadge(patientSurvey) }</Colxx>
                        </Row>
                      </CardBody>
                    </Card>

                  </Colxx>

                  <Colxx xxs="12" lg="8">
                    <ul className="list-unstyled mb-4">
                        {survey && survey.survey ? survey.survey.map((item, index) => {
                          console.log(this.state.survey)
                          return (
                            <li data-id={item.id} key={item.id}>
                              <SurveyItem
                                key={item.id}
                                id={item.id}
                                order={item.id}
                                definition={item.definition}
                                questions={item.questions}
                                title={item.factor}
                                onClick={this.handleSurveyAssessmentClick}
                                surveyItem={this.state.survey[item.id]}
                              />
                            </li>
                          );
                        }) : null}
                    </ul>
                  </Colxx>
                </Row>
              </TabPane>
            </TabContent>
            </Fragment>
             :<div className="loading"></div>
            }
          </Colxx>
        </Row>

        <ApplicationMenu>
          <PerfectScrollbar
            option={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div className="p-4">
              <p className="text-muted text-small">Status</p>
              <ul className="list-unstyled mb-5">
                <li>
                  <NavLink to="#">
                    <i className="simple-icon-check" />
                    Completed Surveys
                    <span className="float-right">{patient && patient.surveys ? Object.keys(patient.surveys).length : 0 }</span>{" "}
                  </NavLink>
                </li>
              </ul>
            </div>
          </PerfectScrollbar>
        </ApplicationMenu>
     
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
      deleteSurveyQuestion,
      saveSurvey,
      getPatientsList
  }
)(PatientsDetail);
