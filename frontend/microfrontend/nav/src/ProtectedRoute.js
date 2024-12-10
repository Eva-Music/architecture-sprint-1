import React from 'react';
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props  }) => {
  return (
    <Route exact>
      {
        () => props.loggedIn ? <Redirect to="/" /> : <Redirect to="./signin" />
      }
    </Route>
)}

export default ProtectedRoute;