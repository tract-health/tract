import React, { Component, Fragment } from "react";
import {
  Row,
  Card,
  CardBody,
  Collapse
} from "reactstrap";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";

import DatePicker from "react-datepicker";
import {getPatientsList, getSurveyDetail} from 'Redux/actions'

import { connect } from 'react-redux'
import SummaryTable from "Components/SummaryTable";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDateRange: null,
      endDateRange: null,
    };

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
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

    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <div className="mb-2">
              <BreadcrumbContainer
                heading="Ward Case Load"
                match={this.props.match}
              />
            </div>
            <div className="mb-2">
              <Collapse
                className="d-md-block"
                isOpen={true}
              >
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
          this.state.startDateRange && this.state.endDateRange ?
            <Row>
              <Colxx lg="12">
                <Card>
                  <CardBody>
                    <SummaryTable
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
      </Fragment>
    );
  }
}

const mapStateToProps = ({  patientsApp, surveyDetailApp }) => {
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
)(Dashboard);
