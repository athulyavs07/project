import React from "react";
import { Doughnut } from "react-chartjs-2";
import "./Head.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Shared/urls";

export default function Piecharts() {
  const [internCount, setinternCount] = useState([]);
  const [radCount, setradCount] = useState([]);
  var token=localStorage.getItem("token");
  useEffect(() => {
    axios
      .get(API_URL + "/api/RAD/radInternCount", {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      .then((response: any) => {
      const responseOne = response.data.radIntern;
      const responseTwo = response.data.radEngineer;
      setinternCount(responseOne);
      setradCount(responseTwo) ;
      console.log(response);
    })
    .catch((err) => {
    });
  }, []);

  return (
   <div className="doughnut-container">
        <canvas id="doug"></canvas>
        <Doughnut
          type="Doughnut"
          data={{
            datasets: [
              {
                data: [internCount,radCount],
                backgroundColor: [" #FF0000"," #525252"],
              },
            ],
          labels: [
          'Intern',
          'RAD Engineer'
          ]
          }}
          options={{
               responsive: true,
               maintainAspectRatio:false,
           legend: {
              display: false, 
            },
              
          }}
        />
        </div>
  );
}
