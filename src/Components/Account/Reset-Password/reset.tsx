import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../../Shared/urls";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import { loaderService } from "../../../Services/loaderService";
import { useLocation } from "react-router-dom";
const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password should match"),
});
const useStyles = makeStyles((theme) => ({
  root: { color: "white" },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  container: {
    marginTop: "2rem",
    padding: "10px",
  },
  loginBtn: {
    marginTop: "300px",
    marginLeft: "980px",
    color: "white",
    margin: "2rem",
    border: "1px solid #FF5454 !important",
    borderRadius: "24px !important",
    width: "190px",
    backgroundColor: "rgb(20, 16, 16) !important",
  },
  textSize: {
    "& .MuiOutlinedInput-root ": {
      width: "320px",
      borderRadius: "22px",
      color: "white",
      top: "250px",
      left: "920px",
      border: "1px solid  #908E8E",
    },
    "& .MuiOutlinedInput-input": {
      paddingTop: "10.5px",
      paddingBottom: "10.5px",
    },
    "& .MuiFormHelperText-contained": {
      position: "inherit",
      left: "920px",
      top: "250px",
    },
  },
}));
const Reset = () => {
  const { addToast } = useToasts();
  const classes = useStyles();
  var message = "";
  const [error, setError] = useState("");
  const search = useLocation().search;
  let token: any;
  React.useEffect(() => {
    token = new URLSearchParams(search).get("token");
    console.log(token);
  });
  const redirect = () => {
    history.push("/login");
  };
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: any) => {
      loaderService.sendMessage(true);
      setError("");
      const payload = {
        token: token,
        username: values.username,
        password: values.password,
      };
      axios
        .post(API_URL + "/api/reset/reset-password", payload)
        .then((res: any) => {
          loaderService.sendMessage(false);
          message = res.data.Response;
          if (values.password == values.confirmpassword) {
            addToast(message, {
              appearance: "success",
              autoDismiss: true,
            });
            console.log(res);
            history.push("/login");
          } else {
            addToast("password incorrect", {
              appearance: "error",
              autoDismiss: true,
            });
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
        });
    },
  });
  return (
    <div className="background">
      <div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container className={classes.container}>
            <Grid item xs={6}>
              <TextField
                className={classes.textSize}
                type="text"
                id="outlined-basic"
                variant="outlined"
                placeholder="New password"
                margin="dense"
                name="password"
                box-sizing="border-box"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.textSize}
                name="confirmpassword"
                margin="dense"
                id="outlined-basic"
                variant="outlined"
                placeholder="Confirm Password"
                type="password"
                box-sizing="border-box"
                fullWidth
                value={formik.values.confirmpassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmpassword &&
                  Boolean(formik.errors.confirmpassword)
                }
                helperText={
                  formik.touched.confirmpassword &&
                  formik.errors.confirmpassword
                }
              />
            </Grid>
            <button type="submit" className={classes.loginBtn}>
              Submit
            </button>
          </Grid>
        </form>
      </div>
    </div>
  );
};
export default Reset;
