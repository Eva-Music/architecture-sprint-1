import React from "react";
import { register, login, checkToken } from "@mesto/auth";

import { Route, useHistory, Switch } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

function App() {


  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");
  //
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");


  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      checkToken(token)
        .then((res) => {
          setEmail(res.data.email);
          setIsLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          console.log(err);
        });
    }
  }, [history]);

  function closeAllPopups() {
    setIsInfoToolTipOpen(false);
  }


  function onRegister({ email, password }) {
    register(email, password)
      .then((res) => {
        setTooltipStatus("success");
        setIsInfoToolTipOpen(true);
        history.push("/signin");
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }

  function onLogin({ email, password }) {
    login(email, password)
      .then((res) => {
        setIsLoggedIn(true);
        setEmail(email);
        history.push("/");
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signin");
  }

  return (
    <>
      <div className="page__content">
        <Header email={email} onSignOut={onSignOut} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={isLoggedIn}
          />
          <Route path="/signup">
            <Register onRegister={onRegister} />
          </Route>
          <Route path="/signin">
            <Login onLogin={onLogin} />
          </Route>
        </Switch>
        <Footer />

        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
      </div>
    </>
  );
}

export default App;
