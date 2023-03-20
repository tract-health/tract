import React, { Component } from "react";
import { injectIntl} from 'react-intl';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from "reactstrap";

import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  setContainerClassnames,
  clickOnMobileMenu,
  logoutUser,
  changeLocale
} from "Redux/actions";

import { searchPath } from "Constants/defaultValues";


class TopNav extends Component {
  constructor(props) {
    super(props);
    this.menuButtonClick = this.menuButtonClick.bind(this);
    this.mobileMenuButtonClick = this.mobileMenuButtonClick.bind(this);
    this.search = this.search.bind(this);
    this.handleChangeLocale = this.handleChangeLocale.bind(this);
    this.handleDocumentClickSearch = this.handleDocumentClickSearch.bind(this);
    this.addEventsSearch = this.addEventsSearch.bind(this);
    this.removeEventsSearch = this.removeEventsSearch.bind(this);
    this.state = {
      isInFullScreen: false,
      searchKeyword: ""
    };
  }
  
  handleChangeLocale = locale => {
    this.props.changeLocale(locale);
  };

  addEventsSearch() {
    document.addEventListener("click", this.handleDocumentClickSearch, true);
  }

  removeEventsSearch() {
    document.removeEventListener("click", this.handleDocumentClickSearch, true);
  }

  handleDocumentClickSearch(e) {
    let isSearchClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains("navbar") ||
        e.target.classList.contains("simple-icon-magnifier"))
    ) {
      isSearchClick = true;
      if (e.target.classList.contains("simple-icon-magnifier")) {
        this.search();
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains("search")
    ) {
      isSearchClick = true;
    }

    if (!isSearchClick) {
      const input = document.querySelector(".mobile-view");
      if (input && input.classList) input.classList.remove("mobile-view");
      this.removeEventsSearch();
      this.setState({
        searchKeyword: ""
      });
    }
  }

  search() {
    this.props.history.push(searchPath + "/" + this.state.searchKeyword);
    this.setState({
      searchKeyword: ""
    });
  }

  handleLogout = () => {
    this.props.logoutUser(this.props.history);
  };

  guideClick = () => {
    this.props.history.push('/app/guidance')
    // window.location.reload();
  }

  menuButtonClick(e, menuClickCount, containerClassnames) {
    e.preventDefault();

    setTimeout(() => {
      const event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
    }, 350);
    this.props.setContainerClassnames(++menuClickCount, containerClassnames);
  }
  mobileMenuButtonClick(e, containerClassnames) {
    e.preventDefault();
    this.props.clickOnMobileMenu(containerClassnames);
  }

  render() {
    const { containerClassnames, menuClickCount } = this.props;
    return (
      <nav className="navbar fixed-top">
        <NavLink
          to="#"
          className="menu-button d-none d-md-block"
          onClick={e =>
            this.menuButtonClick(e, menuClickCount, containerClassnames)
          }
        >
          <svg
            className="main"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 9 17"
          >
            <rect x="0.48" y="0.5" width="7" height="1" />
            <rect x="0.48" y="7.5" width="7" height="1" />
            <rect x="0.48" y="15.5" width="7" height="1" />
          </svg>
          <svg
            className="sub"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 17"
          >
            <rect x="1.56" y="0.5" width="16" height="1" />
            <rect x="1.56" y="7.5" width="16" height="1" />
            <rect x="1.56" y="15.5" width="16" height="1" />
          </svg>
        </NavLink>
        <NavLink
          to="#"
          className="menu-button-mobile d-xs-block d-sm-block d-md-none"
          onClick={e => this.mobileMenuButtonClick(e, containerClassnames)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 17">
            <rect x="0.5" y="0.5" width="25" height="1" />
            <rect x="0.5" y="7.5" width="25" height="1" />
            <rect x="0.5" y="15.5" width="25" height="1" />
          </svg>
        </NavLink>

        <a className="navbar-logo" href="/">
          {/* <h3>TRACT - TRAJECTORY COMPLEXITY ASSESSMENT TOOL</h3> */}
          <h3>TRACT: CARE TRAJECTORY MANAGEMENT TOOL</h3>
        </a>

        <div className="ml-auto">
          <div className="user d-inline-block">
            <UncontrolledDropdown className="dropdown-menu-right">
              <DropdownToggle className="p-0" color="empty">
                <span className="name mr-1">{localStorage.getItem('user_email')}</span>
              </DropdownToggle>
              <DropdownMenu className="mt-3" right>
                <DropdownItem onClick={() => this.guideClick()}>
                  User guide
                </DropdownItem>
                <DropdownItem onClick={() => this.handleLogout()}>
                  Sign out
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ menu, settings }) => {
  const { containerClassnames, menuClickCount } = menu;
  const { locale } = settings;
  return { containerClassnames, menuClickCount, locale };
};

export default injectIntl(connect(
  mapStateToProps,
  { setContainerClassnames, clickOnMobileMenu, logoutUser, changeLocale }
)(TopNav));
