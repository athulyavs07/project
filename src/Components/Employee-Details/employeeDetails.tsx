import React, { useState } from "react";
import axios from "axios";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import { Dialog } from "@material-ui/core";
import { API_URL } from "../../Shared/urls";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router";
import { loaderService } from "../../Services/loaderService";
import { useToasts } from "react-toast-notifications";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  multilineColor: {
    fontcolor: "black",
  },
  container: {
    marginTop: "0rem",
    padding: "60px",
  },
  dialogContainer: {
    "& .MuiDialog-paperWidthSm": {
      maxWidth: "200px",
    },
  },
  textSize: {
    fontSize: "14px",
    display: "flex",
    fontFamily: "Roboto",
    fontWeight: 500,
  },
  okBtn: {
    "&.MuiButton-root": {
      color: "red",
      border: "1px solid  #FF5454",
      borderRadius: "22px",
      height: "30px",
      left: "400px",
      marginTop: "20px",
    },
    "&:hover": {
      backgroundColor: "#FF5454",
      color: "white",
    },
  },
  textStyle: {
    fontSize: "12px",
    display: "flex",
    fontFamily: "Roboto",
    fontStyle: "italic",
    color: "gray",
  },
  head: {
    fontSize: "30px",
    display: "flex",
    fontFamily: "Roboto",
    marginTop: "33px",
    marginBottom: "55px",
  },
  editBtn: {
    marginTop: "22px",
    marginLeft: "290px",
    cursor: "pointer",
  },
  closeicon: {
    content: "x",
    position: "absolute",
    top: "calc(110vh - 108vh - 7px)",
    right: "calc(30% - 170px)",
    background: "#ededed",
    width: "25px",
    borderRadius: "50%",
    lineHeight: "25px",
    textAlign: "center",
    border: "1px solid #999",
    fontSize: "17px",
  },
}));
const EmployeeDetails = (props: any) => {
  const { addToast } = useToasts();
  const [open, setOpen] = useState(true);
  const classes = useStyles();
  const [employeeDetails, setEmployeeDetails] = useState([] as any);
  const [pdfUrl, setPdf] = useState("" as any);
  const history = useHistory();
  var token = localStorage.getItem("token");
  const handleClose = () => {
    setOpen(false);
    props.click("false");
  };
  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", "file.pdf");
    document.body.appendChild(link);
    link.click();
  };
  const datavalue = props.values.emp_id;
  const redirectUpdateEmployee = () => {
    history.push(`/update-employee/${datavalue}`);
  };

  useEffect(() => {
    let one = API_URL + "/api/RAD/id";
    let two = API_URL + "/api/RAD/resume/id";
    const requestOne = axios.get(one, {
      params: { emp_id: datavalue },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const requestTwo = axios.get(two, {
      params: { emp_id: datavalue },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
    loaderService.sendMessage(true);
    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...res) => {
          loaderService.sendMessage(false);
          const resOne = res[0].data;
          setEmployeeDetails(resOne);
          const resTwo = res[1].data;
          if (resTwo) {
            setPdf(window.URL.createObjectURL(new Blob([resTwo])));
          }
        })
      )
      .catch((err: any) => {
        loaderService.sendMessage(false);
        if (err.response) {
          addToast(err.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      });
  }, []);
  return (
    <div>
      <Dialog className="dialogContainer" open={open} onClose={handleClose}>
        <div>
          <form>
            <Grid container className={classes.container}>
              <Grid item xs={6} style={{ marginBottom: ".10rem" }}>
                {employeeDetails.photo ? (
                  <img
                    src={`data:image/png;base64,${employeeDetails.photo}`}
                    width="100"
                    height="100"
                  ></img>
                ) : (
                  <img src="/sample-image" width="100" height="100"></img>
                )}
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.head}>
                  <i>
                    <b>{employeeDetails.name}</b>
                  </i>
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>RAD ID</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.radID}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>FIRST NAME</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.firstName}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>LAST NAME</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.lastName}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>DATE OF BIRTH</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.dateOfBirth}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>GENDER</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.gender}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>STATUS</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.status}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>MODE OF EMPLOYEE</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.employeeStatus == 0 ? "InActive" : "Active"}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>BANK NAME</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.bankName}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>BRANCH NAME</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.branchName}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>IFSC CODE</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.ifscCode}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>ACCOUNT NUMBER</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.accountNumber}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>CONTACT NUMBER</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.contactNumber}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>PERSONAL MAIL</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.personalMail}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>WORK MAIL</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.totalSalary == ""
                    ? "W"
                    : employeeDetails.totalSalary}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>ID PROOF</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.idProof}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>ADHAAR NUMBER</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.aadharNumber}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>JOINING DATE</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.joiningDate}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>TERMINATION DATE</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.terminationDate}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>DEPARTMENT ID</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.deptID}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>DEPARTMENT</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.department}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>ROLE</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.role}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>ROLE STATUS</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.roleStatus}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>CURRENT SALARY</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {employeeDetails.salary == 0 ? "0" : employeeDetails.salary}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>TOTAL SALARY</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {" "}
                  {employeeDetails.totalSalary == 0
                    ? "0"
                    : employeeDetails.totalSalary}
                </label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textStyle}>RESUME</label>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <label className={classes.textSize}>
                  {pdfUrl != "" ? (
                    <a href="#" onClick={downloadResume}>
                      my resume
                    </a>
                  ) : (
                    "Resume Not Uploaded"
                  )}
                </label>
              </Grid>
              <Grid item xs={12} style={{ display: "flex" }}>
                <Button className={classes.okBtn} onClick={handleClose}>
                  OK
                </Button>
                <EditSharpIcon
                  className={classes.editBtn}
                  onClick={redirectUpdateEmployee}
                ></EditSharpIcon>
              </Grid>
            </Grid>
            <span className={classes.closeicon} onClick={handleClose}>
              <b>X</b>
            </span>
          </form>
        </div>
      </Dialog>
    </div>
  );
};
export default EmployeeDetails;
