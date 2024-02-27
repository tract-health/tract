import React, { Component, Fragment } from "react";
import {
  Row,
  Card,
  CardBody,
  Collapse,
  Badge,
  Button,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";

import DatePicker from "react-datepicker";
import {getPatientsList, getSurveyDetail, getDischargedPatientsList, getAllPatientsList} from 'Redux/actions'

import { connect } from 'react-redux'
import SummaryTable from "Components/SummaryTable";
import moment from 'moment';

import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import IntlMessages from "Util/IntlMessages";
import { ThemeColors } from "Util/ThemeColors";

import { CSVLink } from "react-csv";

class Ward extends Component {
  constructor(props) {
    super(props);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const endDate = new Date();

    this.state = {
      startDateRange: moment(startDate),
      endDateRange: moment(endDate),
      displayOptionsIsOpen: false,
      showOptions: ['All', 'Active', 'Discharged'],
      showOptionCurrent: "All"
    };

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);

    this.heatMapXLabels = ['N/A', 'VERY LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'];
    this.heatMapYLabels = [''];
    this.heatMapData = [[100],[2],[3],[4],[88],[88]];
  }

  toggleDisplayOptions() {
    this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
  }

  changeShow(value) {
    this.setState({
      showOptionCurrent: value
    });
    if (value === 'Active') {
      this.props.getPatientsList();
    } else if (value === "Discharged") {
      this.props.getDischargedPatientsList();
    } else if (value === "All") {
      this.props.getAllPatientsList();
    }
  }

  componentDidMount() {
    this.setState({
      showOptionCurrent: "All"
    });
    this.props.getSurveyDetail();
    this.props.getAllPatientsList();
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
        saveAs(dataUrl, `${localStorage.getItem('user_currentWard')}_Caseload.png`);
      });
    }
  }

  render() {

    const {
      allPatientsItems
    } = this.props.patientsApp;

    let rowHeaders = allPatientsItems ? allPatientsItems.map((i) => {return {id: i.id, name: i.name}}) : [];
    let data = {};

    if (allPatientsItems) {
      for (let patient of allPatientsItems) {
        data[patient.id] = {};
        for (let date in patient.surveys) {
          data[patient.id][date] = patient.surveys && patient.surveys[date] && patient.surveys[date].answers
            && patient.surveys[date].answers["S"] ? patient.surveys[date].answers["S"] : null
        }
      }
    }

    // get data for csv
    // define score values
    const scores  = {
      "na": 0,
      "verylow": 1,
      "low": 2,
      "medium": 3,
      "high": 4,
      "veryhigh": 5
    };
    // first headers are "Patient Name" and dates between start date and end date
    let csvData = [];
    let dates = [];
    let datesForFilename = [];
    let csv_data_headers = ['Patient Name'];
    let currentDate = this.state.startDateRange.clone();
    let endDate = this.state.endDateRange.clone();
    // push first date
    csv_data_headers.push(currentDate.clone().format('DD/MM/YYYY').toString());
    dates.push(currentDate.clone().format('YYYY-MM-DD').toString());
    datesForFilename.push(currentDate.clone().format('DD-MM-YYYY').toString());
    // push each subsequent date
    while(currentDate.add(1, "days").diff(endDate) <= 0) {
      csv_data_headers.push(currentDate.clone().format('DD/MM/YYYY').toString())
      dates.push(currentDate.clone().format('YYYY-MM-DD').toString());
      datesForFilename.push(currentDate.clone().format('DD-MM-YYYY').toString());
    }
    csvData.push(csv_data_headers)
    // now form data based on the date range
    for(const [patientID, surveys] of Object.entries(data)) {
      // form an entry
      let csv_data_entry = [];
      // find name by id and push it into the data entry
      let patientIdNamePair = rowHeaders.find(val => val.id.toString() === patientID);
      let patientName = patientIdNamePair.name;
      csv_data_entry.push(patientName);
      // push data based on necessary dates
      for(let currDate of dates) {
        if (surveys[currDate] === undefined) {
          csv_data_entry.push('undefined');
        } else {
          csv_data_entry.push(scores[surveys[currDate]]);
        }

      }
      // push entry to array of arrays
      csvData.push(csv_data_entry);
    }
    // generate csv filename
    let csvFilename = `${localStorage.getItem('user_currentWard')}_Caseload_${datesForFilename[0]}_${datesForFilename[datesForFilename.length - 1]}.csv`

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
    // let title = `Caseload heatmap: ${localStorage.getItem('user_currentWard')}`
    let title = `TRACT Caseload Data: ${localStorage.getItem('user_currentWard')}`

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
                  isOpen={this.state.displayOptionsIsOpen}
                >
                  <div className="mb-2">
                    <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                      <DropdownToggle caret color="outline-dark" size="xs">
                        <IntlMessages id="todo.show" />
                        {this.state.showOptionCurrent}
                      </DropdownToggle>
                      <DropdownMenu>
                        {this.state.showOptions.map((val, index) => {
                          return (
                            <DropdownItem
                              key={index}
                              onClick={() => this.changeShow(val)}
                            >
                              {val}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </UncontrolledDropdown>
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
                        popperPlacement="bottom-start"
                      />
                    </div>
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
            <CSVLink 
              data={csvData}
              filename={csvFilename}
            >
              <Button 
                className="ml-2 mb-4"
                color="primary">
                <IntlMessages id="todo.exportdata" />
              </Button>
            </CSVLink>
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
    getDischargedPatientsList,
    getAllPatientsList
  }
)(Ward);
