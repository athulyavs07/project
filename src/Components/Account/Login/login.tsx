import { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./login.css";
import axios from "axios";
import { Button } from "@material-ui/core";
import { userContext } from "../../../Providers/userContext";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../../Shared/urls";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Forget from "../Forget-Password/forget";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { loaderService } from "../../../Services/loaderService";
import { ToastProvider, useToasts } from "react-toast-notifications";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});
const useStyles = makeStyles({
  root: {
    color: "white",
    "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "gray !important",
      borderRadius: "12px !important",
    },
  },
  textSize: {
    "&.MuiOutlinedInput-inputMarginDense": {
      paddingTop: "10.5px",
      paddingBottom: "10.5px",
    },
  },
  box: { backgroundColor: "white" },
  input: {
    root: { backgroundColor: "white", color: "black" },
  },
  size: {
    marginLeft: "10rem",
  },
  gridSize: {
    "& .MuiInputBase-root": {
      width: "320px",
    },
  },
  pswIcon: {
    "&.MuiIconButton-root": {
      color: "gray",
    },
  },
  display: {
    display: "flex",
    flexDirection: "row",
    marginTop: "8px",
  },
  loginBtn: {
    "&.MuiButton-root": {
      color: "white",
      margin: "2rem",
      border: "1px solid #FF5454 !important",
      borderRadius: "24px !important",
      width: "260px",
      backgroundColor: "rgb(20, 16, 16) !important",
    },
  },
});

const Login = () => {
  const { addToast } = useToasts();
  const classes = useStyles();
  const { dispatch } = useContext(userContext);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: { email: any; password: any }) => {
      loaderService.sendMessage(true);
      setError("");
      setSubmitted(true);
      const payload = {
        username: values.email,
        password: values.password,
      };
      axios
        .post(API_URL + "/signin", payload, {
          headers: {
            "content-type": "application/json ",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res: any) => {
          loaderService.sendMessage(false);
          if (res) {
            dispatch({
              type: "LOGIN",
              payload: res.data,
            });
            history.push("/home");
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
        });
    },
  });
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <div className="background">
      <Grid container>
        <Grid item xs={12}>
          <div _ngcontent-pop-c53="" className="logo-container">
            <img
              src={process.env.PUBLIC_URL + "image3.png"}
              className=""
              alt="logo"
            />
          </div>
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={8} className={classes.size}>
          <div className="textwhat">What's Next ?</div>
        </Grid>
        <Grid item xs={7}></Grid>
        <Grid item xs={5}>
          <div>
            <form className="" onSubmit={formik.handleSubmit}>
              <Grid container>
                <Grid item xs={12} className={classes.gridSize}>
                  <TextField
                    type="text"
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="User Name"
                    margin="dense"
                    name="email"
                    InputProps={{ className: classes.root }}
                    box-sizing="border-box"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12} className={classes.gridSize}>
                  <TextField
                    type={showPassword ? "text" : "password"}
                    id="outlined-basic "
                    variant="outlined"
                    name="password"
                    placeholder="Password"
                    margin="dense"
                    box-sizing="border-box"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    InputProps={{
                      // <-- This is where the toggle button is added.
                      className: classes.root,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            className={classes.pswIcon}
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Grid>
                <Grid item xs={9} className={classes.display}>
                  <div className="iconremember">
                    <input
                      type="checkbox"
                      value="lsRememberMe"
                      id="rememberMe"
                    />{" "}
                    <label htmlFor="rememberMe">Remember me </label>
                  </div>
                  <div className="iconforget">
                    <Forget />
                    Forgot password?
                  </div>
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={12}>
                  {/* <p className="error">{error}</p> */}
                  <Button
                    variant="contained"
                    type="submit"
                    className={classes.loginBtn}
                    disabled={submitted}
                  >
                    Log in
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>{" "}
        </Grid>
      </Grid>
    </div>
  );
};
export default Login;
