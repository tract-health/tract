import React, { Component, Fragment } from "react";
import { Row, Card, CardTitle,Button } from "reactstrap";
import { Colxx } from "Components/CustomBootstrap";

class Error404 extends Component {
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
                    <p className="white mb-0">Yes, it is indeed!</p>
                  </div>
                  <div className="form-side">
                    <CardTitle className="mb-4">
                      <span>Ooops... looks like an error occurred!</span>
                    </CardTitle>
                    <p className="mb-0 text-muted text-small mb-0">
                      <span>Error code</span>
                    </p>
                    <p className="display-1 font-weight-bold mb-5">404</p>
                    <Button
                      href="/app"
                      color="primary"
                      className="btn-shadow"
                      size="lg"
                    >
                      <span>GO BACK HOME</span>
                    </Button>
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
export default Error404;
