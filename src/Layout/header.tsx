import "./header.css";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import SettingsIcon from "@material-ui/icons/Settings";
import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { userContext } from "../Providers/userContext";
import { API_URL } from "../Shared/urls";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { loaderService } from "../Services/loaderService";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  saveBtn: {
    "&.MuiButton-root": {
      color: "red",
      border: "1px solid  #FF5454",
      borderRadius: "22px",
      height: "20px",
    },
    "&:hover": {
      backgroundColor: "#FF5454",
      color: "white",
    },
  },
  cancelBtn: {
    "&.MuiButton-root": {
      color: "red",
      border: "1px solid  #FF5454",
      borderRadius: "22px",
      height: "20px",
    },
    "&:hover": {
      backgroundColor: "#FF5454",
      color: "white",
    },
  },
  pass: {
    "& .MuiOutlinedInput-root ": {
      borderRadius: "22px",
      width: "20rem",
      height: "2rem",
      border: "1px solid  #908E8E",
    },
  },
  dialogContainer: {
    "& .MuiDialog-paperWidthSm": {
      maxWidth: "370px",
    },
  },
});

const validationSchema = Yup.object({
  oldpassword: Yup.string()
    .min(8, "Invalid password")
    .required("Password is required"),
  newpassword: Yup.string()
    .notOneOf(
      [Yup.ref("oldpassword"), null],
      "Old password and New password cannot be same"
    )
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("newpassword"), null], "Passwords must match")
    .required("Confirmation is required"),
});
function Header() {
  var message;
  const { addToast } = useToasts();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { user, setUser } = useContext(userContext);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const history = useHistory();

  const handleClickClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const formik = useFormik({
    initialValues: {
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
    },

    validationSchema: validationSchema,

    onSubmit: (values: { newpassword: any }) => {
      setAnchorEl(null);
      const payload = {
        username: localStorage.getItem("user"),
        password: values.newpassword,
      };
      axios
        .post(API_URL + "/api/change/change-password", payload, {
          headers: {
            "content-type": "application/json ",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res: any) => {
          message = res.data.Response;
          if (message == "Password resetted") {
            addToast(message, {
              appearance: "success",
              autoDismiss: true,
            });
            setOpen(false);
          }
        })
        .catch((err: any) => {
          if (err.res) {
            addToast(err.res.data.message, {
              appearance: "error",
              autoDismiss: true,
            });
          }
        });
    },
  });
  const logoOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
    setUser(null);
  };
  const handleAddEmployee = () => {
    history.push("/addnew-employee");
  };
  return (
    <div className="logo">
      <img
        src={process.env.PUBLIC_URL + "/B! logo Box 1.png"}
        className="App-logo"
        alt="logo"
      />
      <div className="settings2">
        <SettingsIcon
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        ></SettingsIcon>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClickOpen}>Change Password</MenuItem>
          <MenuItem onClick={handleAddEmployee}>Add Employee</MenuItem>

          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>

        <Dialog
          className={classes.dialogContainer}
          open={open}
          onClose={handleClickClose}
          aria-labelledby="form-dialog-title"
        >
          <form className="" onSubmit={formik.handleSubmit}>
            <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
              Change Password?
            </DialogTitle>
            <DialogContent>
              <TextField
                className={classes.pass}
                name="oldpassword"
                margin="dense"
                variant="outlined"
                placeholder="Old Password"
                type="password"
                box-sizing="border-box"
                fullWidth
                value={formik.values.oldpassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.oldpassword &&
                  Boolean(formik.errors.oldpassword)
                }
                helperText={
                  formik.touched.oldpassword && formik.errors.oldpassword
                }
              />
              <TextField
                className={classes.pass}
                name="newpassword"
                margin="dense"
                variant="outlined"
                placeholder="New Password"
                type="password"
                box-sizing="border-box"
                fullWidth
                value={formik.values.newpassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.newpassword &&
                  Boolean(formik.errors.newpassword)
                }
                helperText={
                  formik.touched.newpassword && formik.errors.newpassword
                }
              />
              <TextField
                className={classes.pass}
                name="confirmpassword"
                margin="dense"
                variant="outlined"
                placeholder="Confirm Password"
                type="text"
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
            </DialogContent>
            <DialogActions>
              <Button className={classes.cancelBtn} onClick={handleClickClose}>
                Cancel
              </Button>
              <Button className={classes.saveBtn} type="submit">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
      <div className="settings1">
        {" "}
        <PowerSettingsNewIcon onClick={logoOut}></PowerSettingsNewIcon>{" "}
      </div>
    </div>
  );
}
export default Header;
