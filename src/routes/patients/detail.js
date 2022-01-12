import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
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
  ButtonDropdown,
  Input,
  Label
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
    getPatientsList,
    getDischargedPatientsList
} from "Redux/actions";

import "react-datepicker/dist/react-datepicker.css";
import { database } from '../../firebase'

const surveyData = [];


class PatientsDetail extends Component {
  constructor(props) {
    super(props);


    this.patientId = this.props.match.params.patientId;
    this.date = this.props.match.params.date;
    this.status = this.props.match.params.status;

    this.toggleTab = this.toggleTab.bind(this);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.handleSurveyAssessmentClick = this.handleSurveyAssessmentClick.bind(this);
    this.handleSaveSurvey = this.handleSaveSurvey.bind(this);
    this.handleSavePlanner = this.handleSavePlanner.bind(this);
    this.handlePlannerSumbit = this.handlePlannerSubmit.bind(this);
    // this.handleDeleteSurvey = this.handleDeleteSurvey.bind(this);
    // this.handleDeletePlanner = this.handleDeletePlanner.bind(this);

    this.state = {
      activeTab: "1",
      dropdownSplitOpen: false,
      surveyData: surveyData,
      embeddedDate: moment(this.date, "YYYY-MM-DD"),
      defaultSurvey: {
        1: 'na',
        2: 'na',
        3: 'na',
        4: 'na',
        5: 'na',
        6: 'na',
        7: 'na',
        8: 'na',
        9: 'na',
        10: 'na',
        11: 'na',
        "S": 'na'
      },
      survey: {
        1: 'na',
        2: 'na',
        3: 'na',
        4: 'na',
        5: 'na',
        6: 'na',
        7: 'na',
        8: 'na',
        9: 'na',
        10: 'na',
        11: 'na',
        "S": 'na'
      },
      warningMessage: '',
      defaultPlannerItem: {issue: '', action: '', complete: false},
      defaultPlannerItems: [
        {issue: '', action: '', complete: false}
      ],
      plannerItems: [
        {issue: '', action: '', complete: false}
      ]
    };
  }

  componentDidMount() {
    this.props.getSurveyDetail();
    if (this.status === "Active") {
      this.props.getPatientsList();
    } else if (this.stats === "Discharged") {
      this.props.getDischargedPatientsList();
    }
  }

  componentDidUpdate() {
    this.date = this.props.match.params.date;
    // update survey
    const patientSurvey = this.getSurvey();
    if (!this.patientSurveyUpdated) {
      this.setState({
        warningMessage: "",
        embeddedDate: moment(this.date, "YYYY-MM-DD"),
        survey: patientSurvey ? patientSurvey.answers : this.state.defaultSurvey
      });
      this.patientSurveyUpdated = true
    }
    // update planner
    const patientPlanner = this.getPlanner();
    if (!this.patientPlannerUpdated) {
      this.setState({
        warningMessage: "",
        embeddedDate: moment(this.date, "YYYY-MM-DD"),
        plannerItems: patientPlanner ? patientPlanner.data : this.state.defaultPlannerItems
      });
      this.patientPlannerUpdated = true
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
    //console.log(patient)
    if (patient) {
      const date = this.getDate();
      //console.log(date)
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

      if (this.state.survey.S === 'na') {
        this.setState({
          warningMessage: `Please decide for "Overall Tract Assessment"!`,
        });
        return;
      } else {
        this.setState({
          warningMessage: ``,
        });
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
  }

  handleDeleteSurvey() {
    console.log(this.patientId);
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
        activeTab: tab
      });
      this.patientSurveyUpdated = false;
      this.patientPlannerUpdated = false;
    }
  }

  toggleSplit() {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  }
  
  getPlanner() {
    const patient = this.getPatient();
    if (patient) {
      const date = this.getDate();
      if (date) {
        return patient.planners && patient.planners[date] ? patient.planners[date] : null
      }
    }
    return null
  }

  handleSavePlanner() {
    //console.log(this.patientId);
    if (this.patientId) {
      const plannerId = this.getDate();
      const plannerPath = `${localStorage.getItem('user_id')}/patients/${this.patientId}/planners/${plannerId}`;


      let isPlannerEmpty = true;
      for (let i = 0; i < this.state.plannerItems.length; i++) {
        let plannerItem = this.state.plannerItems[i];
        if (plannerItem.issue || plannerItem.action) {
          isPlannerEmpty = false;
          break;
        }
      }
      if (isPlannerEmpty) {
        this.setState({
          warningMessage: `Cannot save an empty planner!`,
        });
        return;
      } else {
        this.setState({
          warningMessage: ``,
        });
        return database.ref(plannerPath).set({
          data: this.state.plannerItems
        }).then(response => {
          this.props.getPatientsList();
        }).catch(error => error);
      }
    }
  }

  handleDeletePlanner() {
    if (this.patientId) {
      const plannerId = this.getDate();
      const plannerPath = `${localStorage.getItem('user_id')}/patients/${this.patientId}/planners/${plannerId}`;

      return database.ref(plannerPath).remove()
        .then(response => {
        this.props.getPatientsList();
      }).catch(error => error);
    }
  }
  
  handlePlannerChange(i, type, event) {
    //let plannerItems = [...this.state.plannerItems];
    let plannerItems = JSON.parse(JSON.stringify(this.state.plannerItems))
    if (type === 'issue') {
      plannerItems[i].issue = event.target.value;
    } else if (type === 'action') {
      plannerItems[i].action = event.target.value;
    }
    this.setState({ plannerItems }); 
  }

  addPlannerItemClick() {
    this.setState(prevState => ({ plannerItems: [...prevState.plannerItems, this.state.defaultPlannerItem]}))
  }

  removePlannerItemClick(i)  {
    //let plannerItems = [...this.state.plannerItems];
    let plannerItems = JSON.parse(JSON.stringify(this.state.plannerItems))
    plannerItems.splice(i, 1);
    this.setState({ plannerItems });
  }

  handlePlannerSubmit(event) {
    alert('A planner was submitted: ' + this.state.plannerItems.join(', '));
    event.preventDefault();
  }

  createPlannerUI(){
    return this.state.plannerItems.map((plannerItem, i) => 
        <div key={i}>
           <Card className="question d-flex mb-3">
             <div className="d-flex flex-grow-1 min-width-zero">
               <div className="card-body align-self-center d-flex flex-column justify-content-between min-width-zero">
                 <Label>
                   Issue
                 </Label>
                 <Input
                   type="text"
                   value={plannerItem.issue}
                   onChange={this.handlePlannerChange.bind(this, i, 'issue')}
                 />
                  
                 <Label className="mt-4">
                     Action
                 </Label>
                 <Input
                   type="text"
                   value={plannerItem.action}
                   onChange={this.handlePlannerChange.bind(this, i, 'action')}
                 />
                 <Button
                  color="secondary"
                  outline
                  onClick={this.removePlannerItemClick.bind(this, i)}
                  >
                  <IntlMessages id="todo.delete-planneritem" />
                </Button>
               </div>
             </div>

           </Card>
          
        </div>          
    )
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

    let highlightAssessmentDates = [];
    if (patient && patient.surveys) {
      for (let k in patient.surveys) {
        highlightAssessmentDates.push(moment(k, "YYYY-MM-DD"))
      }
    }

    const AssessmentDatePicker = withRouter(({history}) => (
      <DatePicker
        calendarClassName="embedded"
        inline
        selected={this.state.embeddedDate}
        onChange={(date) => {
          this.patientSurveyUpdated = false
          history.push(`/app/patients/detail/${this.patientId}/${date.format("YYYY-MM-DD")}/${this.status}`)
        }}
        highlightDates={highlightAssessmentDates}
      />
    ));

    let highlightPlannerDates = [];
    if (patient && patient.planners) {
      for (let k in patient.planners) {
        highlightPlannerDates.push(moment(k, "YYYY-MM-DD"))
      }
    }

    const PlannerDatePicker = withRouter(({history}) => (
      <DatePicker
        calendarClassName="embedded"
        inline
        selected={this.state.embeddedDate}
        onChange={(date) => {
          this.patientPlannerUpdated = false
          history.push(`/app/patients/detail/${this.patientId}/${date.format("YYYY-MM-DD")}/${this.status}`)
        }}
        highlightDates={highlightPlannerDates}
      />
    ));

    let saveAssessmentButton;
    if (this.status === 'Active') {
      saveAssessmentButton = <ButtonDropdown
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
                          onClick={() => this.handleDeleteSurvey()}
                        >
                          DELETE
                        </DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
    } else {
      saveAssessmentButton = null;
    }

    let savePlannerButton;
    if (this.status === 'Active') {
      savePlannerButton = <ButtonDropdown
                      className="top-right-button top-right-button-single"
                      isOpen={this.state.dropdownSplitOpen}
                      toggle={this.toggleSplit}
                    >
                      <Button
                        outline
                        className="flex-grow-1"
                        size="lg"
                        color="primary"
                        onClick={this.handleSavePlanner}
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
                          onClick={() => this.handleDeletePlanner()}
                        >
                          DELETE
                        </DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
    } else {
      savePlannerButton = null;
    }

    let warningBox;
    let warningStyle = { 
      "textAlign": "center",
      "fontWeight": "bolder"
    };
    if (this.state.warningMessage.length > 0) {
      warningBox = 
      <div className="notification-error mb-2" style={warningStyle}>
        {this.state.warningMessage}
      </div>
    } else {
      warningBox = null;
    }
    

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
            

            <BreadcrumbItems match={this.props.match} />
            {loading ?
            <Fragment>
            <Nav tabs className="separator-tabs ml-0 mb-5">
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "1",
                    "nav-link": true
                  })}
                  onClick={() => {
                    this.toggleTab("1");
                  }}
                  to="#"
                >
                  ASSESSMENT
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "2",
                    "nav-link": true
                  })}
                  onClick={() => {
                    this.toggleTab("2");
                  }}
                  to="#"
                >
                  PLANNER
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={this.state.activeTab}>
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
                        <AssessmentDatePicker/>
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
                          <Colxx><div className="badge badge-pill badge-outline-primary">Overall Tract Assessment</div></Colxx>
                          <Colxx>{ getOverAllBadge(patientSurvey) }</Colxx>
                        </Row>
                      </CardBody>
                    </Card>

                  </Colxx>

                  <Colxx xxs="12" lg="8">
                    <ul className="list-unstyled mb-4">
                        {survey && survey.survey ? survey.survey.map((item, index) => {
                          //console.log(this.state.survey)
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
                    {warningBox}
                    <div className="float-sm-right mb-4">
                      {saveAssessmentButton}
                    </div>
                  </Colxx>
                </Row>
              </TabPane>
              <TabPane tabId="2">
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
                        <PlannerDatePicker/>
                      </CardBody>
                    </Card>
                  </Colxx>
                  <Colxx xxs="12" lg="8">
                    <form className="mb-4" onSubmit={this.handlePlannerSubmit}>
                      <div className="mb-2">
                        {this.createPlannerUI()}     
                      </div>
                      <div className="mb-4">
                        <Button
                          className="mr-2"
                          color="primary"
                          onClick={this.addPlannerItemClick.bind(this)}
                          >
                          <IntlMessages id="todo.add-planneritem" />
                        </Button>
                      </div>
                    </form>
                    {warningBox}
                    <div className="float-sm-right mb-4">
                      {savePlannerButton}
                    </div>
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
                  <NavLink to="#">
                    <i className="simple-icon-check" />
                    Completed Planners
                    <span className="float-right">{patient && patient.planners ? Object.keys(patient.planners).length : 0 }</span>{" "}
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
      getPatientsList,
      getDischargedPatientsList
  }
)(PatientsDetail);
