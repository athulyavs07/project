import React, { useState, useContext } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CreateEmployee  from "../Components/employee/createEmployee";
import { useHistory } from "react-router-dom";




const useStyles = makeStyles({
  saveBtn: {
    "&.MuiButton-root": {
      color: "red",
      border: "1px solid  #FF5454",
      borderRadius: "22px",
      marginLeft:"1100px",
      marginTop:"50px",
  },
},
})

const Home = ({ children }: any) => {
  const classes = useStyles();
  const history = useHistory();
  const redirect = () => {
    history.push("/addnew-employee");
  };
  return (
    <>
      <div>
        <Sidebar />
        <Header />
        
      </div>
     
      <main>{children}</main>
   </>
  );
};
export default Home;
