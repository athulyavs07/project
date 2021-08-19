import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { loaderService } from "../../Services/loaderService";
import { useToasts } from "react-toast-notifications";
import { Button, Dialog, DialogTitle } from "@material-ui/core";
import { DialogContentText } from "@material-ui/core";
import { API_URL } from "../../Shared/urls";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  multilineColor: {
    fontcolor: "black",
  },
  dialoghead: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto",
    fontstyle: "normal",
    fontweight: "bold",
    fontsize: "26px",
    lineheight: "30px",
    fontSize: "1.5rem",
  },
  container: {
    marginTop: "2rem",
    width: "600px",
    height: "150px",
  },
  textSize: {
    "& .MuiOutlinedInput-root ": {
      width: "250px",
      borderRadius: "22px",
    },
    "& .MuiOutlinedInput-input": {
      paddingTop: "10.5px",
      paddingBottom: "10.5px",
    },
  },
  loginBtn: {
    borderRadius: "4rem",
    border: "1px solid red",
    backgroundColor: "lightblue",
    width: "100px",
    top: "120px",
    left: "450px",
  },
  loginBt: {
    borderRadius: "4rem",
    border: "1px solid red",
    backgroundColor: "lightred",
    width: "100px",
    bottom: "30px",
    left: "340px",
  },
  closeicon: {
    content: "x",
    cursor: "pointer",
    position: "absolute",
    top: "calc(110vh - 108vh - 7px)",
    right: "calc(17% - 100px)",
    background: "#ededed",
    width: "25px",
    borderRadius: "50%",
    lineHeight: "25px",
    textAlign: "center",
    border: "1px solid #999",
    fontSize: "17px",
  },
  textArea: {
    width: "530px",
    margin: "20px 4px",
  },
  dialogContent: {
    position: "absolute",

    height: "39px",
    left: "80px",
    top: "109px",
    fontFamily: "Roboto",
    fontstyle: "normal",
    fontweight: "normal",
    fontsize: "16px",
    lineheight: "19px",
    textAlign: "center",
    color: " #918E8E",
  },
}));
const Delete = (props: any) => {
  var message;
  const { addToast } = useToasts();
  const classes = useStyles();
  let formData = new FormData();
  const [open, setOpen] = useState(true);
  var token = localStorage.getItem("token");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
    props.click("false");
  };
  const formik = useFormik({
    initialValues: {
      emp_id: "",
      empStatus: 0,
    },
    onSubmit: (values: any) => {
      loaderService.sendMessage(true);
      formData.append("emp_id", props.values.emp_id);
      formData.append("empStatus", values.empStatus);
      axios
        .put(API_URL + "/api/RAD/delete/id", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res: any) => {
          setOpen(false);
          loaderService.sendMessage(false);
          message = "Deleted";
         
          addToast(message, {
            appearance: "success",
            autoDismiss: true,
          });
          props.load();
        })
        .catch((err: any) => {
          loaderService.sendMessage(false);
          if (err.response) {
            addToast(err.response.data.message, {
              appearance: "error",
              autoDismiss: true,
            });
          }
        });
    },
  });
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <div>
          <DialogTitle className={classes.dialoghead}>
            Delete Employee
          </DialogTitle>
          <DialogContentText className={classes.dialogContent}>
            Are you sure you want to make the Employee Inactive?
          </DialogContentText>
          <form onSubmit={formik.handleSubmit}>
            <Grid container className={classes.container}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  type="submit"
                  className={classes.loginBtn}
                >
                  Yes
                </Button>
              </Grid>

              <span className={classes.closeicon} onClick={handleClose}>
                x
              </span>
            </Grid>
          </form>
          <Grid item xs={6}>
            <Button
              variant="contained"
              type="submit"
              className={classes.loginBt}
              onClick={handleClose}
            >
              No
            </Button>
          </Grid>
        </div>
      </Dialog>
    </div>
  );
};
export default Delete;
