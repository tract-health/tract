import React, { Component, Fragment } from "react";
import {
  Row,
  Card,
  CardBody,
  Collapse,
  Badge,
  Button
} from "reactstrap";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";

import DatePicker from "react-datepicker";
import {getPatientsList, getSurveyDetail} from 'Redux/actions'

import { connect } from 'react-redux'
import SummaryTable from "Components/SummaryTable";
import moment from 'moment';

import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import IntlMessages from "Util/IntlMessages";

class Ward extends Component {
  constructor(props) {
    super(props);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const endDate = new Date();

    this.state = {
      startDateRange: moment(startDate),
      endDateRange: moment(endDate),
    };

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);

    this.heatMapXLabels = ['N/A', 'VERY LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'];
    this.heatMapYLabels = [''];
    this.heatMapData = [[100],[2],[3],[4],[88],[88]];
  }

  componentDidMount() {
    this.props.getSurveyDetail();
    this.props.getPatientsList();
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
        saveAs(dataUrl, 'Ward Data.png');
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

    let title = <IntlMessages id="menu.ward" />

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
              <div className="mb-4 mr-5 float-sm-right">
                <Row>
                  <div className="ml-3 mr-2">Heatmap:</div>
                  <div className="mr-2"><Badge color="verylow" pill>VERY LOW</Badge></div>
                  <div className="mr-2"><Badge color="low" pill>LOW</Badge></div>
                  <div className="mr-2"><Badge color="medium" pill>MEDIUM</Badge></div>
                  <div className="mr-2"><Badge color="high" pill>HIGH</Badge></div>
                  <div><Badge color="veryhigh" pill>VERY HIGH</Badge></div>
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
)(Ward);
