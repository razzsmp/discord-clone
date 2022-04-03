import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Login from "./Login";
import Register from "./Register";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import "./Auth.style.scss";
import firebase from "../../firebase";
import random from "simple-random-number-generator"

class Auth extends React.Component {
  state = {
    registerError: null,
    loginError: null
  };
  componentDidMount() {}

  login = (email, password) => {
    this.setState({ loginError: null });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(e => this.setState({ loginError: e }));
  };

  register = (email, password, username) => {
    let params = {
      min: 1000,
      max: 9999,
      integer: true
    };
    this.setState({ registerError: null });
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        user.user
          .updateProfile({
            displayName: username,
            photoURL: `https://www.discordstudio.live/logo512.png`
          })
          .then(() => {
            firebase
              .database()
              .ref("users")
              .child(user.user.uid)
              .set({
                profile: {
                  name: user.user.displayName,
                  avatar: user.user.photoURL,
                  tag: random(params)
                }
              })
              .then(() => console.log("success"));
          })
          .catch(e => console.log(e));
      })
      .catch(e => this.setState({ registerError: e }));
  };

  render() {
    return (
      <div className="auth">
        <div className="wrapper">
          <TransitionGroup>
            <CSSTransition
              key={this.props.location.key}
              timeout={500}
              classNames="alert"
            >
              <Switch>
                <Route exact path="/register">
                  <Register
                    register={this.register}
                    error={this.state.registerError}
                  />
                </Route>
                <Route path="/login">
                  <Login login={this.login} error={this.state.loginError} />
                </Route>
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

export default withRouter(Auth);
