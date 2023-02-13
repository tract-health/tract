import React, { Component, Fragment } from "react";
import {
  Row,
  Card,
  CardBody,
  Collapse,
  Badge,
  Button,
  Col
} from "reactstrap";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";

import DatePicker from "react-datepicker";
import { getWardsList } from 'Redux/actions'

import { connect } from 'react-redux'
import SummaryTable from "Components/SummaryTable";
import moment from 'moment';

import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import IntlMessages from "Util/IntlMessages";
import { ThemeColors } from "Util/ThemeColors";

import { database } from '../../firebase'

class Wards extends Component {
  constructor(props) {
    super(props);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const endDate = new Date();

    this.state = {
      startDateRange: moment(startDate),
      endDateRange: moment(endDate)
    };

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);

    this.heatMapXLabels = ['N/A', 'VERY LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'];
    this.heatMapYLabels = [''];
    this.heatMapData = [[100],[2],[3],[4],[88],[88]];
  }

  componentDidMount() {
    this.props.getWardsList();
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
  
  onCapture = (id) =>{
    var data = document.getElementsByClassName(id)
    for (var i = 0; i < data.length; i++) {
      htmlToImage.toPng(data[i])
      .then((dataUrl) => {
        saveAs(dataUrl, `${localStorage.getItem('user_currentWard')}_wards.png`);
      });
    }
  }

  getWardsData = async () => {
    // get user wards list
    let userWardsList = []
    if (JSON.parse(localStorage.getItem('user_wards'))[0] === 'all' || localStorage.getItem('user_wards') == null) {
      userWardsList = JSON.parse(localStorage.getItem('wards_all'));
    } else {
      userWardsList = JSON.parse(localStorage.getItem('user_wards'));
    }

    // get all wards data
    const allWardsData = await this.getAllWardsListRequest();

    // collate data for user wards from all wards data
    let rowHeaders = [];
    let data = {};
    for (let i = 0; i < allWardsData.length; i++) {
      // check if ward is included in user wards access
      if (userWardsList.includes(allWardsData[i].name)) {
        // push row header
        rowHeaders.push({
          id: i,
          name: allWardsData[i].name
        });
        // aggregate data for ward and push it
        data[i] = {}
        // cycle through all the patients in that ward
        for (let patient_key in allWardsData[i].patients) {
          let patient = allWardsData[i].patients[patient_key];
          // cycle through all the surveys for that patient
          for (let survey_key in patient.surveys) {
            let survey = patient.surveys[survey_key];
            // check if date is already there for current ward
            if (data[i].hasOwnProperty(survey_key)) {
              // push the result into that array
              data[i][survey_key].push(survey.answers.S);
            } else {
              // if date is not there add it as a first element in array
              data[i][survey_key] = [survey.answers.S];
            }
          }
        }
      }
    }

    return {
      'data': data,
      'rowHeaders': rowHeaders
    }
  }

  getAllWardsListRequest = async () => {
    // path to wards in the database
    let wardsPath = 'wards/';
    // return all wards data as an array
    return database.ref(wardsPath)
      .once('value')
      .then(response => {
        response = response.val();
        const array = [];
        for (let k in response) {
          if (response.hasOwnProperty(k)) {
            let item = response[k];
            item.name = k;
            array.push(item)
          }
        }
        return array;
      })
      .catch(error => error);
  };

  render() {

    const {
      allWardsItems
    } = this.props.wardsApp;

    // collate data for user wards from all wards data
    let rowHeaders = [];
    let data = {};


    if (allWardsItems) {
      for (let i = 0; i < allWardsItems.length; i++) {
        // push row header
        rowHeaders.push({
          id: i,
          name: allWardsItems[i].name
        });
        // aggregate data for ward and push it
        data[i] = {}
        // cycle through all the patients in that ward
        for (let patient_key in allWardsItems[i].patients) {
          let patient = allWardsItems[i].patients[patient_key];
          // cycle through all the surveys for that patient
          for (let survey_key in patient.surveys) {
            let survey = patient.surveys[survey_key];
            // check if date is already there for current ward
            if (data[i].hasOwnProperty(survey_key)) {
              // push the result into that array
              data[i][survey_key].push(survey.answers.S);
            } else {
              // if date is not there add it as a first element in array
              data[i][survey_key] = [survey.answers.S];
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

    // let title = <IntlMessages id="menu.ward" />
    let title = `Wards heatmap`;

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
                <Collapse
                  className="d-md-block"
                  isOpen={true}
                >
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
                        popperPlacement="bottom-start"
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
                        popperPlacement="bottom-start"
                      />
                    </div>
                  </div>
                </Collapse>
              </div>
              <Separator className="mb-5" />
            </Colxx>

          </Row>
          {
            this.state.startDateRange && this.state.endDateRange ?
              <Row>
                <Colxx lg="12">
                  <Card>
                    <CardBody>
                      <SummaryTable
                        id='summary-table'
                        leftUp="Patient Name"
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

const mapStateToProps = ({ patientsApp, surveyDetailApp, wardsApp }) => {
  return {
    wardsApp
  };
};
export default connect(
  mapStateToProps,
  {
    getWardsList
  }
)(Wards);
