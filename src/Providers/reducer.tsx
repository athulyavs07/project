import React from "react";
import jwt_decode from "jwt-decode";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const reducer = (state: any, action: any) => {
  console.log(action.payload);
  switch (action.type) {
    case "LOGIN":
      //JSON.stringify(localStorage.setItem("user", action.payload));
      var decoded: any;
      decoded = jwt_decode(action.payload.accessToken);
      console.log(decoded.username);
      JSON.stringify(localStorage.setItem("user", decoded.username));
      JSON.stringify(localStorage.setItem("token", action.payload.accessToken));
      console.log(localStorage.getItem("token"));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};
