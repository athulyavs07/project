import './Head.css';
import React from 'react';
import axios from 'axios';
import { useState,useEffect } from 'react';
import { API_URL } from "../../Shared/urls";
import Box from '@material-ui/core/Box'
import Piecharts from "./piechart";

function HeadCount() {
  const [headCount,setheadCount]=useState([]); 
  const [radCount,setradCount]=useState([]); 
  const [internCount,setinternCount]=useState([]); 
  const [foulCount,setfoulCount]=useState([]); 
  var token=localStorage.getItem("token");
  useEffect(() => {
    axios
      .get(API_URL + "/api/RAD/radInternCount", {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      .then((response: any) => {
      const responseOne = response.data.totalRAD;
      const responseTwo = response.data.radEngineer;
      const responesThree = response.data.radIntern;
      const responesFour = response.data.furlough;
      setheadCount(responseOne);
      setradCount(responseTwo) ;
      setinternCount(responesThree);
      setfoulCount(responesFour);
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    
    <div className="hdcount" >
       <p className="hd">Head Count</p>
       
      <Box display="flex" flexDirection="row" p={1}>
     
      <Box  p={1}>
      <div className="headcounter">
        <span className="text1">{headCount}</span>
        <p className="text2">Head Count</p>
      </div>
      </Box>
      <Box p={1}>
      <div className="radf">
        <span className="rad1">{radCount}</span>
        <p className="rad2">Rad Engineers</p>
      </div>
      </Box>
      <Box p={1}>
      <div className="interns">
        <span className="interns1">{internCount}</span>
        <p className="interns2">Interns</p>
      </div>
      </Box>
      <Box p={1}>
      <div className="foul">
        <span className="foul1">{foulCount}</span>
        <p className="foul2">Furlough</p>
      </div>
     
     </Box>
      <Box p={1}>
      {/* <p className="pielabel"><span className="pielabel1">Intern</span><span className="pielabel2"> vs</span><span className="pielabel3"> RAD Engineer</span><span className="pielabel4"> Ratio</span></p> */}
      <Piecharts /> 
      </Box> 
      </Box>
    </div>
    
        );
    }
export default HeadCount;
