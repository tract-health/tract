import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "Components/CustomBootstrap";
import { connect } from "react-redux";
import { loginUser } from "Redux/actions";


class LoginLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  onUserLogin(e) {
    e.preventDefault();
    if (this.state.email !== "" && this.state.password !== "") {
      this.props.loginUser(this.state, this.props.history);
    }
  }

  onEmailChange(e) {
    this.setState({email: e.target.value});
  }

  onPasswordChange(e) {
    this.setState({password: e.target.value});
  }

  componentDidMount() {
    document.body.classList.add("background");
  }

  componentWillUnmount() {
    document.body.classList.remove("background");
  }

  render() {
    return (
      <Fragment>
        <div className="fixed-background" />
        <main>
          <div className="container">
            <Row className="h-100">
              <Colxx xxs="12" md="10" className="mx-auto my-auto">
                <Card className="auth-card">
                  <div className="position-relative image-side ">
                    <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
                    <p className="white mb-0">
                      Please use your credentials to login.
                    </p>
                  </div>
                  <div className="form-side">
                    <CardTitle className="mb-4">
                      <span>Login</span>
                    </CardTitle>
                    <Form onSubmit={this.onUserLogin.bind(this)}>
                      <Label className="form-group has-float-label mb-4">
                        <Input
                          type="email"
                          defaultValue={this.state.email}
                          onChange={this.onEmailChange.bind(this)}
                        />
                        <span>Email</span>
                      </Label>
                      <Label className="form-group has-float-label mb-4">
                        <Input
                          type="password"
                          onChange={this.onPasswordChange.bind(this)}
                        />
                        <span>Password</span>
                      </Label>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          type="submit"
                          color="primary"
                          className="btn-shadow"
                          size="lg"
                        >
                          <span>LOGIN</span>
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(
  mapStateToProps,
  {
    loginUser
  }
)(LoginLayout);
