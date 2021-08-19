import React from "react";
import { Bar } from "react-chartjs-2";
import "./Head.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Shared/urls";
import Box from '@material-ui/core/Box'

export default function Charts() {
  const [ux, setUx] = useState([]);
  const [mobile, setMobile] = useState([]);
  const [back, setBack] = useState([]);
  const [front, setFront] = useState([]);
  var token=localStorage.getItem("token");
  useEffect(() => {
    axios
      .get(API_URL + "/api/RAD/roleStatusBar", {
        params: { department: "RAD" },
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      .then((res: any) => {
        setUx(res.data.UX);
        setMobile(res.data.mobileDevelopers);
        setBack(res.data.backendDevelopers);
        setFront(res.data.frontendDevelopers);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="chart-container">
     
      <canvas id="chart"> </canvas>
      <Bar
        type="bar"
        data={{
          labels: ["UX design", "Mobile", "Backend", "Frontend"],
          datasets: [
            {
              label: "Rad Team Count by Role Description",
              backgroundColor: " #C4C4C4",
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 2,
              borderRadius: 6,
              barThickness: 35,
              data: [ux, mobile, back, front],
            },
          ],
        }}
        options={{
                 responsive: true,
                 maintainAspectRatio:false,
                 cutoutPercentage: 90,
          title: {
            display: true,
            text: "Rad Team Count by Role Description",
            fontSize: 20,
          },
          legend: {
            display: true,
            position: "right",
          },
        }}
      />
      </div>
  );
}
