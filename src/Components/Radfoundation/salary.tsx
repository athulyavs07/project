import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { loaderService } from "../../Services/loaderService";
import { useToasts } from "react-toast-notifications";
import {
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { API_URL } from "../../Shared/urls";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Select } from "@material-ui/core";
import { useEffect } from "react";
const validationSchema = Yup.object({
  salary: Yup.string().required("Salary is required"),
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
    padding: "10px",
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
    borderColor: "red",
    backgroundColor: "white",
    width: "250px",
    paddingTop: "10.5px",
    paddingBottom: "10.5px",
  },
  closeicon: {
    content: "x",
    cursor: "pointer",
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
  textArea: {
    width: "530px",
    margin: "20px 4px",
  },
}));
const SalaryUpdate = (props: any) => {
  var message;
  const { addToast } = useToasts();
  const [State, setState] = useState("");
  const classes = useStyles();
  const [Open, setOpen] = useState(true);
  const [Data, setData] = useState([]);
  const [SelectedOption, setSelectedOption] = useState("");
  var token = localStorage.getItem("token");
  const change = (e: any) => {
    const Values = e.target.value.split(",");
    const type = Values[1];
    const id = Values[0];
    setSelectedOption(id);
    console.log(type);
    console.log(id);
    setState(type);
  };
  useEffect(() => {
    axios
      .get(API_URL + "/api/RAD/miscellaneous", {})
      .then((res: any) => {
        setData(res.data.miscellaneous);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
    props.click("false");
    console.log(props.click);
    //reload();
  };
  const formik = useFormik({
    initialValues: {
      emp_id: "",
      salary: props.values.salary,
      mislea_amount: "",
      remark: "",
      mdate: null,
      mis_id: "",
      emp_role_status: "",
      mis_type: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values: any) => {
      loaderService.sendMessage(true);
      const payload = {
        remark: values.remark,
        salary: parseInt(values.salary),
        mis_type: State,
        mislea_amount: parseInt(values.mislea_amount),
        mis_id: parseInt(SelectedOption),
        emp_id: props.values.emp_id,
        emp_role_status: props.values.roleStatus,
        mdate: values.mdate,
      };
      axios
        .put(API_URL + "/api/overview/updateSalary", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res: any) => {
          console.log(res);
          loaderService.sendMessage(false);
          message = res.data.Response;

          addToast(message, {
            appearance: "success",
            autoDismiss: true,
          });
          setOpen(false);
          props.load();
        })
        .catch((err: any) => {
          loaderService.sendMessage(false);
          if (err.response) {
            addToast(err.response.data.message, {
              appearance: "error",
              autoDismiss: true,
            });
            setOpen(true);
          }
        });
    },
  });
  return (
    <div>
      <Dialog open={Open} onClose={handleClose}>
        <div>
          <DialogTitle className={classes.dialoghead}>
            Update Salary
          </DialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <Grid container className={classes.container}>
              <Grid item xs={6}>
                <TextField
                  className={classes.textSize}
                  type="number"
                  id="outlined-basic"
                  variant="outlined"
                  placeholder="Enter the Salary"
                  name="salary"
                  box-sizing="border-box"
                  value={formik.values.salary}
                  onChange={formik.handleChange}
                  error={formik.touched.salary && Boolean(formik.errors.salary)}
                  helperText={formik.touched.salary && formik.errors.salary}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" className={classes.textSize}>
                  <Select
                    native
                    onChange={(e) => {
                      change(e);
                    }}
                    placeholder="miscellaneous"
                  >
                    <option value="" disabled selected>
                      {" "}
                      Select Miscellaneous
                    </option>
                    <InputLabel>miscellaneous</InputLabel>
                    {Data.map((item: any, on: any) => (
                      <option value={[item.mis_id, item.mis_type]}>
                        {item.mis_type}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} style={{ marginTop: ".5rem" }}>
                <TextField
                  className={classes.textSize}
                  type="number"
                  id="outlined-basic"
                  variant="outlined"
                  name="mislea_amount"
                  placeholder="Miscellaneous Salary"
                  box-sizing="border-box"
                  value={formik.values.mislea_amount}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.mislea_amount &&
                    Boolean(formik.errors.mislea_amount)
                  }
                  helperText={
                    formik.touched.mislea_amount && formik.errors.mislea_amount
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.textSize}
                  type="date"
                  id="outlined-basic "
                  name="mdate"
                  variant="outlined"
                  margin="dense"
                  box-sizing="border-box"
                  label="Miscellaneous Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formik.values.mdate}
                  onChange={formik.handleChange}
                  error={formik.touched.mdate && Boolean(formik.errors.mdate)}
                  helperText={formik.touched.mdate && formik.errors.mdate}
                />
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  className={classes.textArea}
                  name="remark"
                  aria-label="empty textarea"
                  placeholder="Enter the remarks here"
                  minRows={3}
                  onChange={formik.handleChange}
                  value={formik.values.remark}
                />
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button type="submit" className={classes.loginBtn}>
                  Update
                </button>
              </Grid>
            </Grid>
            <span className={classes.closeicon} onClick={handleClose}>
              x
            </span>
          </form>
        </div>
      </Dialog>
    </div>
  );
};
export default SalaryUpdate;
