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

import { getWardsList } from 'Redux/actions'

import { connect } from 'react-redux'

import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import IntlMessages from "Util/IntlMessages";
import { ThemeColors } from "Util/ThemeColors";

class Guidance extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    
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

  render() {

    let title = `User guidance`;

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
              <Separator className="mb-5" />
            </Colxx>

          </Row>
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

const mapStateToProps = ({ wardsApp }) => {
  return {
    wardsApp
  };
};
export default connect(
  mapStateToProps,
  {
    getWardsList
  }
)(Guidance);
