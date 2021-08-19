import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../Login/login.css";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import { loaderService } from "../../../Services/loaderService";
import { useToasts } from "react-toast-notifications";
import {
  Dialog,
  DialogContentText,
  DialogTitle,
  Link,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../../Shared/urls";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});
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
    position: "absolute",
    width: "335px",
    height: "39px",
    left: "50px",
    top: "40px",

    fontFamily: "Roboto",
    fontstyle: "normal",
    fontweight: "bold",
    fontsize: "26px",
    lineheight: "30px",
    textAlign: "center",
    color: " #4C4C4C",
  },
  dialogContent: {
    position: "absolute",
    width: "335px",
    height: "39px",
    left: "70px",
    top: "109px",
    fontFamily: "Roboto",
    fontstyle: "normal",
    fontweight: "normal",
    fontsize: "16px",
    lineheight: "19px",
    textAlign: "center",
    color: " #918E8E",
  },
  MuiDialogpaperWidthSm: {
    width: "800",
  },
  texSize: {
    "& .MuiDialog-paperWidthSm  ": {
      width: "500px",
      borderRadius: "20px",
      height: "350px",
    },
  },
  textSize: {
    "& .MuiOutlinedInput-root ": {
      position: "relative",
      borderRadius: "22px",
      top: "12rem",
      left: "5rem",
      width: "20rem",
      height: "2rem",
    },
    "& .MuiFormControl-root  ": {
      position: "initial",
      width: " 500px ",
      top: "400 px",
    },
    "& MuiDialog-container  ": {
      height: "550px",
    },
    "& .MuiFormHelperText-contained": {
      position: "inherit",
      left: "80px",
      top: "190px",
    },
  },
  loginBtn: {
    borderRadius: "4rem",
    width: "10rem",
    borderColor: "red",
    backgroundColor: "white",
    marginTop: "14rem",
    marginLeft: "10rem",
  },
  closeicon: {
    content: "x",
    cursor: "pointer",
    position: "absolute",
    right: "calc(29% - 143px)",
    top: "calc(110vh - 108vh - 7px)",
    background: "#ededed",
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    lineHeight: "25px",
    textAlign: "center",
    border: "1px solid #999",
    fontSize: "20px",
  },
}));
const Forget = () => {
  var message;
  const { addToast } = useToasts();

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const redirect = () => {
    setOpenReset(false);
    history.push("/login");
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = () => {
    setOpenReset(false);
  };
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values: any) => {
      loaderService.sendMessage(true);
      setError("");
      setSubmitted(true);
      const payload = {
        username: values.email,
      };
      axios
        .post(API_URL + "/api/reset/forget-password", payload, {})
        .then((res: any) => {
          loaderService.sendMessage(false);
          message = res.data.Response;
          if (message == "Email sent for resetting the password") {
            addToast(message, {
              appearance: "success",
              autoDismiss: true,
            });
            setOpen(false);
            setOpenReset(true);
          } else {
            addToast("Something went wrong!!!", {
              appearance: "error",
              autoDismiss: true,
            });
            setOpen(true);
          }
        })
        .catch((err: any) => {
          loaderService.sendMessage(false);
          if (err.response) {
            addToast(err.response.data.message, {
              appearance: "error",
              autoDismiss: true,
            });
          }
          setSubmitted(false);
          setError("Something went wrong");
        });
    },
  });
  return (
    <div>
      {
        <Link
          href={"#"}
          onClick={() => {
            setOpen(true);
          }}
          className="forgot-pass"
        >
          {" "}
          Forgot password?
        </Link>
      }
      <Dialog open={open} onClose={handleClose} className={classes.texSize}>
        <DialogTitle className={classes.dialoghead}>
          Forget Password?
        </DialogTitle>
        <DialogContentText className={classes.dialogContent}>
          Enter your email content to request a password reset
        </DialogContentText>
        <form className={classes.texSize} onSubmit={formik.handleSubmit}>
          <TextField
            className={classes.textSize}
            type="text"
            id="outlined-basic"
            variant="outlined"
            name="email"
            placeholder="Email Address"
            box-sizing="border-box"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <span className={classes.closeicon} onClick={handleClose}>
            x
          </span>
          <button type="submit" className={classes.loginBtn}>
            {" "}
            Request
          </button>
        </form>
      </Dialog>
      <div>
        <form>
          <Dialog open={openReset} className={classes.texSize}>
            <DialogTitle className={classes.dialoghead}>
              Password Reset Email Sent
            </DialogTitle>
            <DialogContentText className={classes.dialogContent}>
              An Email has been send to your rescue email address
              *************@gmail.in .Follow the directions in the email to
              reset the password
            </DialogContentText>
            <Grid item xs={6}>
              <button
                type="submit"
                className={classes.loginBtn}
                onClick={redirect}
              >
                Done
              </button>
            </Grid>
            <span className={classes.closeicon} onClick={handleClick}>
              x
            </span>
          </Dialog>
        </form>
      </div>
    </div>
  );
};
export default Forget;
