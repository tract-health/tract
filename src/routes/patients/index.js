import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { injectIntl} from 'react-intl';
import {
  Row,
  Card,
  CardBody,
  NavItem,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Badge,
  Collapse,
  ButtonDropdown,
  CustomInput,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";

import { Colxx, Separator } from "Components/CustomBootstrap";
import { BreadcrumbItems } from "Components/BreadcrumbContainer";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import ApplicationMenu from "Components/ApplicationMenu";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import {
  getPatientsList,
  getPatientsListWithFilter,
  getPatientsListWithOrder,
  getPatientsListSearch,
  addPatientsItem,
  removePatientsItem,
  selectedPatientsItemsChange,
  dischargePatientsItem,
  getDischargedPatientsList,
  admitPatientsItem,
  removeDischargedPatientsItem
} from "Redux/actions";

import { assessmentLevelToColor } from "../../constants/defaultValues"

class Patients extends Component {
  constructor(props) {
    super(props);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);

    this.state = {
      dropdownSplitOpen: false,
      modalOpen: false,
      lastChecked: null,

      id: "",
      name: "",
      label: {},
      category: {},
      status: "PENDING",
      displayOptionsIsOpen:false,
      selectedItems: [],
      showOptions: ['Active', 'Discharged'],
      showOptionCurrent: "Active"
    };
  }

  componentDidMount() {
    this.setState({
      showOptionCurrent: "Active"
    });
    this.props.getPatientsList();
  }

  toggleDisplayOptions() {
    this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  toggleSplit() {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  }

  addFilter(column, value) {
    this.props.getPatientsListWithFilter(column, value);
  }

  changeShow(value) {
    this.setState({
      showOptionCurrent: value
    });
    if (value === 'Active') {
      this.props.getPatientsList();
    } else if (value === "Discharged") {
      this.props.getDischargedPatientsList();
    }
  }

  changeOrderBy(column) {
    this.props.getPatientsListWithOrder(column);
  }

  addNetItem() {
    if ((this.state.id.length === 0) || (this.state.name.length === 0)) {
      return;
    }
    const newItem = {
      id: this.state.id,
      name: this.state.name,
    };
    this.props.addPatientsItem(newItem);
    this.toggleModal();
    this.setState({
      id: "",
      name: "",
      showOptionCurrent: 'Active'
    });
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.props.getPatientsListSearch(e.target.value);
    }
  }

  handleModalKeyPress(e) {
    if (e.key === "Enter") {
      this.addNetItem()
    }
  }

  handleCheckChange(event, id) {
    if (this.state.lastChecked == null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedItems = Object.assign([], this.props.patientsApp.selectedItems);
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.props.selectedPatientsItemsChange(selectedItems);

    if (event.shiftKey) {
      let items = this.props.patientsApp.patientsItems;
      const start = this.getIndex(id, items, "id");
      const end = this.getIndex(this.state.lastChecked, items, "id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map(item => {
          return item.id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.props.selectedPatientsItemsChange(selectedItems);
    }

    this.setState({
      selectedItems: selectedItems
    });

    return;
  }

  handleChangeSelectAll() {
    if (this.props.patientsApp.loading) {
      if (
        this.props.patientsApp.selectedItems.length >=
        this.props.patientsApp.patientsItems.length
      ) {
        this.props.selectedPatientsItemsChange([]);
        this.setState({
          selectedItems: this.state.selectedItems.splice(0, this.state.selectedItems.length)
        });
      } else {
        this.props.selectedPatientsItemsChange(
          this.props.patientsApp.patientsItems.map(x => x.id)
        );
        this.setState({
          selectedItems: this.props.patientsApp.patientsItems.map(x => x.id)
        });
      }
    }
  }

  handleDeleteAll() {
    for (let item of this.state.selectedItems) {
      this.props.removePatientsItem(item);
    }
    // null selected items list
    this.props.selectedPatientsItemsChange([]);
    this.setState({
      selectedItems: this.state.selectedItems.splice(0, this.state.selectedItems.length)
    });
  }

  // function to discharge all selected patients
  handleDischargeAll() {
    // check if anything selected
    if (this.state.selectedItems.length === 0) {
      return;
    }
    // discharge one by one
    for (let item of this.state.selectedItems) {
      this.props.dischargePatientsItem(item);
    }
    // null selected items list
    this.props.selectedPatientsItemsChange([]);
    this.setState({
      selectedItems: this.state.selectedItems.splice(0, this.state.selectedItems.length)
    });
  }

  // function to admit all selected discharged patients
  handleAdmitAll() {
    // check if anything selected
    if (this.state.selectedItems.length === 0) {
      return;
    }
    // discharge one by one
    for (let item of this.state.selectedItems) {
      this.props.admitPatientsItem(item);
    }
    // null selected items list and move to active list
    this.props.selectedPatientsItemsChange([]);
    this.setState({
      selectedItems: this.state.selectedItems.splice(0, this.state.selectedItems.length),
      showOptionCurrent: 'Active'
    });
  }

  handleDeleteDischargedAll() {
    for (let item of this.state.selectedItems) {
      this.props.removeDischargedPatientsItem(item);
    }
    // null selected items list
    this.props.selectedPatientsItemsChange([]);
    this.setState({
      selectedItems: this.state.selectedItems.splice(0, this.state.selectedItems.length)
    });
    this.props.getDischargedPatientsList();
  }

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }

  render() {
    const {
      allPatientsItems,
      patientsItems,
      filter,
      loading,
      orderColumn,
      orderColumns,
      selectedItems,
    } = this.props.patientsApp;

    let dropdownMenu;
    let patientListButtons;
    if (this.state.showOptionCurrent === 'Active') {
      dropdownMenu = <DropdownMenu right>
                      <DropdownItem onClick={() => this.handleDeleteAll()}>
                        Delete
                      </DropdownItem>
                      {/* <DropdownItem onClick={() => this.handleDischargeAll()}>
                        Discharge
                      </DropdownItem> */}
                    </DropdownMenu>
      patientListButtons = <div className="float-sm-right mb-2">
                            <Button
                              color="primary"
                              size="sm"
                              className="mr-2"
                              onClick={this.toggleModal}
                            >
                              <IntlMessages id="todo.admit" />
                            </Button>
                            <Button
                              color="primary"
                              size="sm"
                              className="mr-2"
                              onClick={() => this.handleDischargeAll()}
                            >
                              <IntlMessages id="todo.discharge" />
                            </Button>
                            {/* <div className="btn btn-primary pl-3 pr-2 mr-2 check-button">
                              <Label
                                for="checkAll"
                                className="custom-control custom-checkbox mb-0 d-inline-block"
                              >
                                <Input
                                  className="custom-control-input"
                                  type="checkbox"
                                  id="checkAll"
                                  checked={
                                    loading
                                      ? selectedItems.length >= patientsItems.length
                                      : false
                                  }
                                  onChange={() => this.handleChangeSelectAll()}
                                />
                                <span
                                  className={`custom-control-label ${
                                    loading &&
                                    selectedItems.length > 0 &&
                                    selectedItems.length < patientsItems.length
                                      ? "indeterminate"
                                      : ""
                                    }`}
                                />
                              </Label>
                            </div> */}
                            <Modal
                              isOpen={this.state.modalOpen}
                              toggle={this.toggleModal}
                              wrapClassName="modal-right"
                              backdrop="static"
                            >
                              <ModalHeader toggle={this.toggleModal}>
                                Admit new patient
                              </ModalHeader>
                              <ModalBody>

                                <Label className="mt-4">
                                  ID
                                </Label>
                                <Input
                                  type="text"
                                  defaultValue={this.state.id}
                                  onChange={event => {
                                    this.setState({ id: event.target.value });
                                  }}
                                  onKeyPress={e => this.handleModalKeyPress(e)}
                                />

                                <Label className="mt-4">
                                  Full Name
                                </Label>
                                <Input
                                  type="text"
                                  defaultValue={this.state.name}
                                  onChange={event => {
                                    this.setState({ name: event.target.value });
                                  }}
                                  onKeyPress={e => this.handleModalKeyPress(e)}
                                />

                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  color="secondary"
                                  outline
                                  onClick={this.toggleModal}
                                >
                                  <IntlMessages id="todo.cancel" />
                                </Button>
                                <Button color="primary" onClick={() => this.addNetItem()}>
                                  <IntlMessages id="todo.submit" />
                                </Button>
                              </ModalFooter>
                            </Modal>
                            <ButtonDropdown
                              size="sm"
                              isOpen={this.state.dropdownSplitOpen}
                              toggle={this.toggleSplit}
                            >
                              <div className="btn btn-primary pl-4 pr-0 check-button">
                                <Label
                                  for="checkAll"
                                  className="custom-control custom-checkbox mb-0 d-inline-block"
                                >
                                  <Input
                                    className="custom-control-input"
                                    type="checkbox"
                                    id="checkAll"
                                    checked={
                                      loading
                                        ? selectedItems.length >= patientsItems.length
                                        : false
                                    }
                                    onChange={() => this.handleChangeSelectAll()}
                                  />
                                  <span
                                    className={`custom-control-label ${
                                      loading &&
                                      selectedItems.length > 0 &&
                                      selectedItems.length < patientsItems.length
                                        ? "indeterminate"
                                        : ""
                                      }`}
                                  />
                                </Label>
                              </div>
                              <DropdownToggle
                                caret
                                color="primary"
                                className="dropdown-toggle-split pl-2 pr-2"
                              />
                              {dropdownMenu}
                            </ButtonDropdown>
                          </div>
    } else if (this.state.showOptionCurrent === 'Discharged') {
      dropdownMenu = <DropdownMenu right>
                      <DropdownItem onClick={() => this.handleDeleteDischargedAll()}>
                        Delete
                      </DropdownItem>
                      {/* <DropdownItem onClick={() => this.handleAdmitAll()}>
                        Admit
                      </DropdownItem> */}
                    </DropdownMenu>
      patientListButtons = <div className="float-sm-right mb-2">
                              <Button
                                color="primary"
                                size="sm"
                                className="mr-2"
                                onClick={() => this.handleAdmitAll()}
                              >
                                <IntlMessages id="todo.admit" />
                              </Button>
                              <div className="btn btn-primary btn-sm pl-3 pr-2 mr-2 check-button">
                                <Label
                                  for="checkAll"
                                  className="custom-control custom-checkbox mb-0 d-inline-block"
                                >
                                  <Input
                                    className="custom-control-input"
                                    type="checkbox"
                                    id="checkAll"
                                    checked={
                                      loading
                                        ? selectedItems.length >= patientsItems.length
                                        : false
                                    }
                                    onChange={() => this.handleChangeSelectAll()}
                                  />
                                  <span
                                    className={`custom-control-label ${
                                      loading &&
                                      selectedItems.length > 0 &&
                                      selectedItems.length < patientsItems.length
                                        ? "indeterminate"
                                        : ""
                                      }`}
                                  />
                                </Label>
                              </div>
                            </div>
    }



    return (
      <Fragment>
        <Row className="app-row survey-app">
          <Colxx xxs="12">
            <div className="mb-2">
              <h1>
                <IntlMessages id="menu.patients" />
              </h1>

              {patientListButtons}
              
              <BreadcrumbItems match={this.props.match} />
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
                <div className="d-block mb-2 d-md-inline-block">
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
                  <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                    <DropdownToggle caret color="outline-dark" size="xs">
                      <IntlMessages id="todo.orderby" />
                      {orderColumn ? orderColumn.label : ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {orderColumns.map((o, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            onClick={() => this.changeOrderBy(o.column)}
                          >
                            {o.label}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <div className="search-sm d-inline-block mr-1 mb-1 align-top">
                    <input
                      type="text"
                      name="keyword"
                      id="search"
                      placeholder="Search"
                      defaultValue=''
                      onKeyPress={e => this.handleKeyPress(e)}
                    />
                  </div>
                </div>
              </Collapse>
            </div>
            <Separator className="mb-5" />
            <Row>
              {loading ? (
                patientsItems.map((item, index) => {
                  return (
                    <Colxx xxs="12" key={index}>
                      <Card className="card d-flex mb-3">
                        <div className="d-flex flex-grow-1 min-width-zero">
                          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                            <NavLink
                              to={`/app/patients/detail/${item.id}/${moment().format("YYYY-MM-DD")}/${this.state.showOptionCurrent}`}
                              id={`toggler${item.id}`}
                              className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
                            >
                              <i className="heading-icon iconsmind-Administrator"/>
                              <span className="align-middle d-inline-block ml-20">{item.name}</span>
                            </NavLink>
                            <p className="list-item-heading mb-1 text-muted w-15 w-xs-100">
                              {item.id}
                            </p>
                            <p className="list-item-heading mb-1 text-muted w-15 w-xs-100">
                              {item.createDate}
                            </p>
                            <div className="list-item-heading w-15 w-xs-100">
                              {
                                item.assessmentLevel ?
                                  <Badge color={assessmentLevelToColor(item.assessmentLevel)} pill>
                                    {item.assessmentLevel.toUpperCase()}
                                  </Badge>
                                  : null
                              }
                            </div>
                          </CardBody>
                          <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                            <CustomInput
                              className="itemCheck mb-0"
                              type="checkbox"
                              id={`check_${item.id}`}
                              checked={
                                loading
                                  ? selectedItems.includes(item.id)
                                  : false
                              }
                              onChange={event =>
                                this.handleCheckChange(event, item.id)
                              }
                              label=""
                            />
                          </div>
                        </div>
                      </Card>
                    </Colxx>
                  );
                })
              ) : (
                <div className="loading" />
              )}
            </Row>
          </Colxx>
        </Row>

        <ApplicationMenu>
          <PerfectScrollbar
            option={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div className="p-4">
              <p className="text-muted text-small">
                <span>Status</span>
              </p>
              <ul className="list-unstyled mb-5">
                <NavItem className={classnames({ active: !filter })}>
                  <NavLink to="#" onClick={e => this.addFilter("", "")}>
                    <i className="simple-icon-people" />
                    All {this.state.showOptionCurrent} Patients
                    <span className="float-right">
                      {loading && allPatientsItems.length}
                    </span>
                  </NavLink>
                </NavItem>
              </ul>
            </div>
          </PerfectScrollbar>
        </ApplicationMenu>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ patientsApp }) => {
  return {
    patientsApp
  };
};

export default injectIntl(connect(
  mapStateToProps,
  {
    getPatientsList,
    getPatientsListWithFilter,
    getPatientsListWithOrder,
    getPatientsListSearch,
    addPatientsItem,
    removePatientsItem,
    selectedPatientsItemsChange,
    dischargePatientsItem,
    getDischargedPatientsList,
    admitPatientsItem,
    removeDischargedPatientsItem
  }
)(Patients));
