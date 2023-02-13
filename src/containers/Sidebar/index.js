import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import {
  setContainerClassnames,
  addContainerClassname,
  changeDefaultClassnames
} from "Redux/actions";

import { ThemeColors } from "Util/ThemeColors";

import IntlMessages from "Util/IntlMessages";

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.addEvents = this.addEvents.bind(this);
    this.removeEvents = this.removeEvents.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleProps = this.handleProps.bind(this);
    this.getContainer = this.getContainer.bind(this);
    this.getMenuClassesForResize = this.getMenuClassesForResize.bind(this);
    this.setSelectedLiActive = this.setSelectedLiActive.bind(this);

    const state = {
      selectedParentMenu: "",
      viewingParentMenu:"",
      selectedMenu: "",
      wardsList: [],
      currentWard: ''
    };

    if (props.location.pathname === "/app/ward") {
      state.selectedMenu = "ward";
    }
    if (props.location.pathname === "/app/factors") {
      state.selectedMenu = "factors";
    }
    if (props.location.pathname.includes("/app/patients")) {
      state.selectedMenu = "patients";
    }
    if (props.location.pathname.includes("/app/wards")) {
      state.selectedMenu = "wards";
    }

    if (JSON.parse(localStorage.getItem('user_wards'))[0] === 'all' || JSON.parse(localStorage.getItem('user_wards')).length === 0) {
      state.wardsList = JSON.parse(localStorage.getItem('wards_all'));
    } else {
      state.wardsList = JSON.parse(localStorage.getItem('user_wards'));
    }

    state.currentWard = localStorage.getItem('user_currentWard')

    this.state = state
  }

  handleWindowResize(event) {
    if (event && !event.isTrusted) {
      return;
    }
    const { containerClassnames } = this.props;
    let nextClasses = this.getMenuClassesForResize(containerClassnames);
    this.props.setContainerClassnames(0, nextClasses.join(" "));
  }

  handleDocumentClick(e) {
    const container = this.getContainer();
    let isMenuClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains("menu-button") ||
        e.target.classList.contains("menu-button-mobile"))
    ) {
      isMenuClick = true;
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      (e.target.parentElement.classList.contains("menu-button") ||
        e.target.parentElement.classList.contains("menu-button-mobile"))
    ) {
      isMenuClick = true;
    } else if (
      e.target.parentElement &&
      e.target.parentElement.parentElement &&
      e.target.parentElement.parentElement.classList &&
      (e.target.parentElement.parentElement.classList.contains("menu-button") ||
        e.target.parentElement.parentElement.classList.contains(
          "menu-button-mobile"
        ))
    ) {
      isMenuClick = true;
    }
    if (
      (container.contains(e.target) && container !== e.target) ||
      isMenuClick
    ) {
      return;
    }
    this.toggle(e);
    this.setState({
      viewingParentMenu:""
    })
  }

  getMenuClassesForResize(classes) {
    const { menuHiddenBreakpoint, subHiddenBreakpoint } = this.props;
    let nextClasses = classes.split(" ").filter(x => x !== "");

    const windowWidth = window.innerWidth;
    if (windowWidth < menuHiddenBreakpoint) {
      nextClasses.push("menu-mobile");
    } else if (windowWidth < subHiddenBreakpoint) {
      nextClasses = nextClasses.filter(x => x !== "menu-mobile");
      if (
        nextClasses.includes("menu-default") &&
        !nextClasses.includes("menu-sub-hidden")
      ) {
        nextClasses.push("menu-sub-hidden");
      }
    } else {
      nextClasses = nextClasses.filter(x => x !== "menu-mobile");
      if (
        nextClasses.includes("menu-default") &&
        nextClasses.includes("menu-sub-hidden")
      ) {
        nextClasses = nextClasses.filter(x => x !== "menu-sub-hidden");
      }
    }
    return nextClasses;
  }

  getContainer() {
    return ReactDOM.findDOMNode(this);
  }

  toggle() {
    const { containerClassnames, menuClickCount } = this.props;
    const currentClasses = containerClassnames
      ? containerClassnames.split(" ").filter(x => x !== "")
      : "";

    if (currentClasses.includes("menu-sub-hidden") && menuClickCount === 3) {
      this.props.setContainerClassnames(2, containerClassnames);
    } else if (
      currentClasses.includes("menu-hidden") ||
      currentClasses.includes("menu-mobile")
    ) {
      this.props.setContainerClassnames(0, containerClassnames);
    }
  }

  handleProps() {
    this.addEvents();
  }

  addEvents() {
    ["click", "touchstart"].forEach(event =>
      document.addEventListener(event, this.handleDocumentClick, true)
    );
  }

  removeEvents() {
    ["click", "touchstart"].forEach(event =>
      document.removeEventListener(event, this.handleDocumentClick, true)
    );
  }

  setSelectedLiActive() {
    const oldli = document.querySelector(".sub-menu  li.active");
    if (oldli != null) {
      oldli.classList.remove("active");
    }

    /* set selected parent menu */
    const selectedlink = document.querySelector(".sub-menu  a.active");
    if (selectedlink != null) {
      selectedlink.parentElement.classList.add("active");
      this.setState({
        selectedParentMenu: selectedlink.parentElement.parentElement.getAttribute(
          "data-parent"
        )
      });
    } else {
      let selectedParentNoSubItem = document.querySelector(".main-menu  li a.active");
      if(selectedParentNoSubItem!=null){
        this.setState({
          selectedParentMenu: selectedParentNoSubItem.getAttribute(
            "data-flag"
          )
        });
      } else if (this.state.selectedParentMenu === "") {
        this.setState({
          selectedParentMenu: "factors"
        });
      }

    } 
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setSelectedLiActive();
      this.toggle();
      window.scrollTo(0, 0);
    }
    //this.handleProps();
  }

  componentDidMount() {

    window.addEventListener("resize", this.handleWindowResize);
    this.handleWindowResize();
    //this.handleProps();
    this.setSelectedLiActive();
  }

  componentWillUnmount() {
    this.removeEvents();
    window.removeEventListener("resize", this.handleWindowResize);
  }

  changeWard(value) {
    this.setState({
      currentWard: value,
      selectedMenu: "patients"
    });
    localStorage.setItem('user_currentWard', value);
    window.location.reload();
  }

  render() {
    let menuStyle = {
      "textAlign": "center"
    };
    let highlightedMenuItem = {
      filter: "invert(0.10)"
      //"backgroundColor": ThemeColors().themeColor5,
    };
    let hightlightedMenuText = {
      fontWeight: "bold"
    };

    return (
      <div className="sidebar">
        <div className="main-menu">
          <div className="scroll">
            <PerfectScrollbar option={{ suppressScrollX: true, wheelPropagation: false }}>
              <Nav vertical className="list-unstyled">
                <div className="align-self-center mt-4">
                  <IntlMessages id="todo.ward" />
                </div>
                <UncontrolledDropdown className='align-self-center mb-2'>
                  <DropdownToggle caret color="outline-dark" size="xs">
                    {this.state.currentWard}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.wardsList.map((val, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => this.changeWard(val)}
                        >
                          {val}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem className={classnames({active: this.state.selectedMenu.toString() === "patients"})} style={highlightedMenuItem}>
                  <NavLink
                    to="/app/patients"
                    onClick={e => {this.setState({selectedMenu: "patients"})}}
                    style = {hightlightedMenuText}
                  >
                    <i className="iconsmind-MaleFemale" style={hightlightedMenuText}/>{" "}
                    <div style={menuStyle}>Patient<br />assessment</div>
                  </NavLink>
                </NavItem>

                <NavItem className={classnames({active: this.state.selectedMenu.toString() === "ward"})}>
                  <NavLink
                    to="/app/ward"
                    onClick={e => {this.setState({selectedMenu: "ward"})}}
                  >
                    <i className="iconsmind-Hospital" />{" "}
                    <div style={menuStyle}>Caseload</div>
                  </NavLink>
                </NavItem>

                <NavItem className={classnames({active: this.state.selectedMenu.toString() === "factors"})}>
                  <NavLink
                    to="/app/factors"
                    onClick={e => {this.setState({selectedMenu: "factors"})}}
                  >
                    <i className="iconsmind-Digital-Drawing" />{" "}
                    <div style={menuStyle}>TRACT factors</div>
                  </NavLink>
                </NavItem>

                <NavItem className={classnames({active: this.state.selectedMenu.toString() === "wards"})}>
                  <NavLink
                    to="/app/wards"
                    onClick={e => {this.setState({selectedMenu: "wards"})}}
                  >
                    <i className="iconsmind-Building" />{" "}
                    <div style={menuStyle}>Wards</div>
                  </NavLink>
                </NavItem>
              </Nav>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ menu }) => {
  const {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    
  } = menu;
  return {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { setContainerClassnames, addContainerClassname, changeDefaultClassnames }
  )(Sidebar)
);
