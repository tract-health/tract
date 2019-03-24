import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';

import TopNav from 'Containers/TopNav'
import Sidebar from 'Containers/Sidebar';

import Ward from './ward';
import Factors from './factors';
import Patients from './patients';
import PatientsDetail from './patients/detail'

import { connect } from 'react-redux';


class MainApp extends Component {
	render() {
		const { match, containerClassnames} = this.props;
		return (
			<div id="app-container" className={containerClassnames}>
				<TopNav history={this.props.history} />
				<Sidebar/>
				<main>
					<div className="container-fluid">
						<Switch>
              <Route path={`${match.url}/ward`} component={Ward} />
              <Route path={`${match.url}/factors`} component={Factors} />
              <Route
                path={`${match.url}/patients/detail/:patientId/:date`}
                component={PatientsDetail}
                isExact
              />
              <Route path={`${match.url}/patients`} component={Patients} />
							<Redirect to="/error" />
						</Switch>
					</div>
				</main>
			</div>
		);
	}
}

const mapStateToProps = ({ menu }) => {
	const { containerClassnames} = menu;
	return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(MainApp));
