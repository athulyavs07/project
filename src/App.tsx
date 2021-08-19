import React, { useState } from "react";
import "./App.css";
import Login from "./Components/Account/Login/login";
import { userContext } from "./Providers/userContext";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Radfoundation from "./Components/Radfoundation/radfoundationhome";
import { reducer } from "./Providers/reducer";
import Home from "./Layout/home";
import Forget from "./Components/Account/Forget-Password/forget";
import Reset from "./Components/Account/Reset-Password/reset";
import CreateEmployee from "./Components/employee/createEmployee";
import CircularIndeterminate from "./Layout/loader";
import { loaderService } from "./Services/loaderService";
import { ToastProvider } from "react-toast-notifications";

function App() {
  let accessToken;
  const [token, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
  };
  const [state, dispatch] = React.useReducer(reducer, initialState);
  accessToken = localStorage.getItem("token");
  React.useEffect(() => {
    console.log(JSON.stringify(localStorage.getItem("user")));
    setUser(localStorage.getItem("token"));
    const subscription = loaderService.onMessage().subscribe((message: any) => {
      console.log(message.message);
      if (message.message == true) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });
    // return subscription.unsubscribe;
  }, [token]);
  return (
    <div className="App">
      {loading ? <CircularIndeterminate></CircularIndeterminate> : ""}
      <div className="App-header">
        <userContext.Provider
          value={{
            state,
            dispatch,
          }}
        >
          <ToastProvider>
            <Router>
              <>
                <Route path="/home" component={Home} />
                <Route path="/addnew-employee" component={CreateEmployee} />
                <Route exact path="/" render={() => <Redirect to="/login" />} />
                <Route path="/radfoundationhome" component={Radfoundation} />
                <Route path="/Forget" component={Forget} />
                <Route path="/reset" component={Reset} />
                <Route path="/update-employee/:id" component={CreateEmployee} />
              </>
              <Route path="/login" component={Login} />
            </Router>
          </ToastProvider>
        </userContext.Provider>
      </div>
    </div>
  );
}
export default App;
