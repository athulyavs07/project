import React, { useState, useContext } from "react";
import {useFormik, validateYupSchema } from "formik";
import * as Yup from "yup";
import "./createEmployee.css";
import Home from "../../Layout/home";
import TextField from "@material-ui/core/TextField";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  Button,
  createStyles,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  InputLabel,
  Link,
  NativeSelect,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Theme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Attachment from "@material-ui/icons/Attachment";
import { loaderService } from "../../Services/loaderService";
import axios from "axios";
import { API_URL } from "../../Shared/urls";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { userContext } from "../../Providers/userContext";
import { SettingsRemoteOutlined } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  cont: {
    justifyContent: "center",
    margin: theme.spacing(10),
  },
  margin: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  iconGen: {
    "&.MuiFormGroup-root": {
      flexDirection: "row",
    },
  },
  textSize: {
    "& .MuiOutlinedInput-root ": {
      position: "relative",
      borderRadius: "22px",
      top: "20px",
      left: "1px",
      width: "20rem",
      height: "2.8rem",
      border: "1px solid  #908E8E",
      color: "gray",
    },
    "& .MuiInputLabel-formControl ": {
      position: "relative",
    },
  },
  textSizess: {
    "& .MuiOutlinedInput-root ": {
      position: "relative",
      borderRadius: "22px",
      top: "0px",
      left: "1px",
      width: "20rem",
      height: "2.8rem",
      border: "1px solid  #908E8E",
      color: "gray",
    },
  },
  gridSizes: {
    marginTop: "20px",
  },
  sav: {
    "&.MuiButton-root": {
      textAlign: "center",
      color: "red",
      marginLeft: "170px",
      top: "100px",
      width: "50%",
      border: "1px solid red !important",
      textTransform: "capitalize",
      borderRadius: "24px !important",
    },
  },
  dateBirth: {
    "&.MuiInputLabel-formControl": {
      position: "relative",
    },
  },
  canc: {
    textAlign: "center",
    color: "#068FF2",
    marginLeft: "170px",
    top: "105px",
    width: "50%",
    border: "none",
    textTransform: "capitalize",
  },
  phto: {
    color: "#FFB3B3",
  },
  poto:{
    color:"Gray",
  }
}));
const SignUpSchema = Yup.object({
  FirstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("First Name is required"),
  SecondName: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Second Name is required"),
  Contact: Yup.string()
    .required("Phone Number is required")
    .matches(/^[6789]\d{9}$/g, "Invalid Phone Number"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  AadharNumber: Yup.string()
    .required("Aadhar Number is required")
    .matches(/^[2-9]{1}[0-9]{11}$/g, "Invalid Aadhar Number"),
  bankaccount: Yup.string()
    .required("Account Number is required")
    .matches(/[0-9]{9,18}$/g, "Invalid Account Number"),
  IFSCCode: Yup.string()
    .required("IFSCCode is required")
    .matches(/^[A-Za-z]{4}0[A-Z0-9]{6}$/g, "Invalid IFSC Code"),
  BankName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("BankName is required"),
  Branch: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Branch is required"),
    /*Status: Yup.string().required("Select Status"),*/
    Status: Yup.string().required("Required"),
    Role:  Yup.string().required("Required"),
    RoleDescription:  Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    DOB: Yup.string().required("Required"),
    JoiningDate: Yup.string().required("Required"),
    file: Yup.mixed()
    .test(
      "fileSize",
      "File size too large, max file size is 1 Mb",
      (file) => file && file.size <= 1100000
    ),
    resume: Yup.mixed()
    .test(
      "fileSize",
      "File size too large, max file size is 1 Mb",
      (file) => file && file.size <= 1100000
    ),
    idproofattachment:  Yup.mixed()
    .test(
      "fileSize",
      "File size too large, max file size is 1 Mb",
      (file) => file && file.size <= 1100000
    ),
});
const CreateEmployee = () => {
  const { addToast } = useToasts();
  var message = "";
  const classes = useStyles();
  const { dispatch } = useContext(userContext);
  const [value, setValue] = React.useState("Male");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [roleDes, setRoleDes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [employeeDetail, setEmployeeDetail] = useState([] as any);
  const [id, setId] = useState("");
  var token = localStorage.getItem("token");
  const moment = require('moment');
  let d2=moment().subtract(18, 'years'); 
  let d1 = moment(d2).format('YYYY-MM-DD');  
  console.log(d1);
  let formData = new FormData();
  const location = useLocation();
  const change = (e: any) => {
    const Values = e.target.value.split(",");
    setDepartmentId(Values[0]);
    setDepartmentName(Values[1]);
  };
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };
  const editChange = (employeeDetails: any) => {
    console.log(employeeDetails);
    formik.setFieldValue("FirstName",employeeDetails.firstName);
    formik.setFieldValue("SecondName",employeeDetails.lastName);
    formik.setFieldValue("gender",employeeDetails.gender);
    formik.setFieldValue("RoleDescription",employeeDetails.roleStatus);
    formik.setFieldValue("Role",employeeDetails.role);
    formik.setFieldValue("Status",employeeDetails.status);
    formik.setFieldValue("OnProject",employeeDetails.project);
    formik.setFieldValue("Department",employeeDetails.department);
    formik.setFieldValue("TerminationDate",employeeDetails.TerminationDate);
    formik.setFieldValue("JoiningDate",employeeDetails.joiningDate);
    formik.setFieldValue("Branch",employeeDetails.branchName);
    formik.setFieldValue("BankName",employeeDetails.bankName);
    formik.setFieldValue("IFSCCode",employeeDetails.ifscCode);
    formik.setFieldValue("bankaccount",employeeDetails.accountNumber);
    formik.setFieldValue("WorkMail",employeeDetails.WorkMail);
    formik.setFieldValue("AadharNumber",employeeDetails.aadharNumber);
   /* formik.setFieldValue("IdProof",employeeDetails.IdProof);*/
    formik.setFieldValue("email",employeeDetails.personalMail);
    formik.setFieldValue("Contact",employeeDetails.contactNumber);
    formik.setFieldValue("DOB",employeeDetails.dateOfBirth);
    formik.setFieldValue("resume",employeeDetails.resume);
    formik.setFieldValue("IdProof",employeeDetails.idProof);
    formik.setFieldValue("file",employeeDetails.photo);
};
  const formik = useFormik({
    initialValues: {
      FirstName: "",
      SecondName: "",
      Contact: "",
      email: "",
      AadharNumber: "",
      bankaccount: "",
      IFSCCode: "",
      BankName: "",
      Branch: "",
      WorkMail: "",
      JoiningDate: "",
      DOB: "",
      gender: "",
      Department: "",
      OnProject: "",
      Status: "",
      Role: "",
      RoleDescription: "",
      IdProof: "",
      file: File,
      resume: File,
      idproofattachment: File,
      TerminationDate: "",
      emp_status: "",
      dept_id: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: (values: any) => {
      console.log("onSubmit");
      if (id) {
        formData.append("emp_id", id);
      }
      loaderService.sendMessage(true);
      setError("");
      setSubmitted(true);
      formData.append("f_name", values.FirstName);
      formData.append("l_name", values.SecondName);
      formData.append("contact_number", values.Contact);
      formData.append("personal_mail", values.email);
      formData.append("aadhaar_number", values.AadharNumber);
      formData.append("account_number", values.bankaccount);
      formData.append("ifsc_code", values.IFSCCode);
      formData.append("bank_name", values.BankName);
      formData.append("branch_name", values.Branch);
      formData.append("workMail", values.WorkMail==""?values.email:values.WorkMail);
      formData.append("hiring_date", values.JoiningDate);
      formData.append("dob", values.DOB);
      formData.append("idproof", values.IdProof);
      formData.append("gender", values.gender);
      formData.append("on_project", values.OnProject);
      formData.append("role_status", values.RoleDescription);
      formData.append("role", values.Role);
      formData.append("department", departmentName);
      formData.append("resume", values.resume);
      formData.append("file", values.file);
      formData.append("idproofattachment", values.idproofattachment);
      formData.append("status", values.Status);
      formData.append("emp_status", "1");
      formData.append("terminationDate", values.TerminationDate);
      formData.append("dept_id", departmentId);
      axios
        .post(API_URL + "/api/RAD/insertRAD", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res: any) => {
          console.log(res);
          loaderService.sendMessage(false);
          message = res.data.Response.Response;
         /*console.log(message);*/
          addToast(message, {
            appearance: "success",
            autoDismiss: true,
          });
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
  useEffect(() => {
    let one = API_URL + "/api/RAD/roleDescription";
    let two = API_URL + "/api/RAD/department";
    let three = API_URL + "/api/RAD/role";
    let four = API_URL + "/api/overview/projects";
    /* let path = location.pathname;
      console.log(location.pathname);*/
      const path = location.pathname.split('/');
      const id = path[2];
      setId(path[2]);
      console.log(id);
     
      if(id){
        loaderService.sendMessage(true);
        axios
        .get(API_URL + "/api/RAD/id", {
          params: { emp_id: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res:any)=>{
            loaderService.sendMessage(false);
            setEmployeeDetail(res.data);
            editChange(res.data);
          })
          .catch((err) => {
            loaderService.sendMessage(false);
            console.log(err);
          });
      }
    const requestOne = axios.get(one, {
      params: { department: "RAD", role: "RADIntern" },
    });
    const requestTwo = axios.get(two);
    const requestThree = axios.get(three, { params: { department: "RAD" } });
    const requestFour = axios.get(four, { params: { prj_status: 1 } });
    /*api call*/
    axios
      .all([requestOne, requestTwo, requestThree, requestFour])
      .then(
        axios.spread((...res) => {
          const resOne = res[0].data.roleDescription;
          const resTwo = res[1].data.department;
          const resThree = res[2].data.roleList;
          const resFour = res[3].data.projectsName;
          /* const resFive = res[4].data;*/
          setRoleDes(resOne);
          setDepartments(resTwo);
          setRoles(resThree);
          setProjects(resFour);
        })
      )
      .catch((errors) => {});
  }, []);
  return (
    <Home>
      <form onSubmit={formik.handleSubmit}>
        <div className="container">
          <div>
            <div className={classes.textSize}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="First Name"
                    margin="dense"
                    name="FirstName"
                    box-sizing="border-box"
                    //className="textbox"
                    value={formik.values.FirstName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.FirstName &&
                      Boolean(formik.errors.FirstName)
                    }
                    helperText={
                      formik.touched.FirstName && formik.errors.FirstName
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="outlined-basic "
                    variant="outlined"
                    name="SecondName"
                    placeholder="Second Name"
                    margin="dense"
                    box-sizing="border-box"
                    value={formik.values.SecondName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.SecondName &&
                      Boolean(formik.errors.SecondName)
                    }
                    helperText={
                      formik.touched.SecondName && formik.errors.SecondName
                    }
                  />
                </Grid>
              </Grid>
            </div>
          </div>
          <br></br>
          <div>
            <div className={classes.iconGen}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <br></br>
                  <FormControl component="fieldset"  >
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      value={formik.values.gender}
                      row={true}
                      onChange={formik.handleChange}
                    >
                      <Grid item xs={2}>
                        <FormControlLabel
                          value="Male"
                          control={<Radio onClick={handleChange} />}
                          label="Male"
                          onChange={formik.handleChange}
                          defaultChecked={formik.values.gender === "Male"}
                        />
                      </Grid>
                      &emsp;&emsp;
                      <Grid item xs={2}>
                        <FormControlLabel
                          value="Female"
                          control={<Radio onClick={handleChange} />}
                          label="Female"
                          onChange={formik.handleChange}
                          defaultChecked={formik.values.gender === "Female"}
                        />
                      </Grid>
                      &emsp;&emsp;&emsp;
                      <Grid item xs={2}>
                        <FormControlLabel
                          value="Other"
                          control={<Radio onClick={handleChange} />}
                          label="Other"
                          onChange={formik.handleChange}
                          defaultChecked={formik.values.gender === "Other"}
                        />
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    id="outlined-basic "
                    variant="outlined"
                    name="DOB"
                    margin="dense"
                    box-sizing="border-box"
                    label="DOB"
                    InputProps={{ inputProps: { max: d1} }}
                    className={classes.textSize}
                    value={formik.values.DOB}
                    onChange={formik.handleChange}
                    error={formik.touched.DOB && Boolean(formik.errors.DOB)}
                    helperText={formik.touched.DOB && formik.errors.DOB}
                  />
                </Grid>
              </Grid>
            </div>
          </div>
          <div>
            <div className={classes.textSize}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="outlined-basic "
                    variant="outlined"
                    name="Contact"
                    placeholder="Contact #"
                    margin="dense"
                    box-sizing="border-box"
                    value={formik.values.Contact}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.Contact && Boolean(formik.errors.Contact)
                    }
                    helperText={formik.touched.Contact && formik.errors.Contact}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="outlined-basic "
                    variant="outlined"
                    name="email"
                    placeholder="Personal Email"
                    margin="dense"
                    box-sizing="border-box"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
              </Grid>
            </div>
          </div>
          <div className={classes.gridSizes}>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <label>Photo</label>
                <div className={classes.phto}>
                  <label htmlFor="photo">
                    <Icon>
                      {" "}
                      <Attachment />
                    </Icon>
                  </label>
                  <input
                    id="photo"
                    name="photo"
                    style={{ display: "none" }}
                    type="file"
                    accept="image/png, image/jpeg,image/jpg"
                    onChange={(e: any) => {
                      formik.setFieldValue("file", e.target.files[0]);
                    }}
                  />
                   &emsp;
                  <label className={classes.poto}>{formik.values.file?.name}</label>
                  {formik.errors["file"] && formik.touched["file"] && (
                  <div style={{ color: "red", fontSize: ".8rem" }}>
                    {formik.errors.file}
                  </div>
                )}
                  {id == id ? 
                   <img 
      src={`data:image/png;base64,${employeeDetail.photo}`}
      width="50"
      height="50"
    ></img>
    :""}
                </div>
              </Grid>
              <Grid item xs={3}>
                <label>Resume</label>
                <div className={classes.phto}>
                  <label htmlFor="resume">
                    <Icon>
                      {" "}
                      <Attachment />
                    </Icon>
                  </label>
                  <input
                    id="resume"
                    name="resume"
                    style={{ display: "none" }}
                    type="file"
                    accept="application/pdf"
                    onChange={(e: any) => {
                      console.log(e.target.files[0]);
                      formik.setFieldValue("resume", e.target.files[0]);
                    }}
                  />
                  &emsp;
                   <label className={classes.poto}>{formik.values.resume?.name}</label>
                   {formik.errors["file"] && formik.touched["file"] && (
                  <div style={{ color: "red", fontSize: ".8rem" }}>
                    {formik.errors.file}
                  </div>
                )}
                </div>
              </Grid>
              <Grid item xs={3}>
                <div>
                  <label>ID Proof</label>
                  <FormControl
                    variant="outlined"
                    className={classes.textSizess}
                  >
                    <Select
                      native
                      onChange={formik.handleChange}
                      value={formik.values.IdProof}
                      name="IdProof"
                    >
                      <option value="" disabled selected>
                        ID Proof
                      </option>
                      <option value="Aadhaar">Aadhaar</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Passport">Passport</option>
                      <option value="PAN Card">PAN Card</option>
                    </Select>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
          </div>
          <Grid item xs>
            <label>ID proof</label>
            <div className={classes.phto}>
              <label htmlFor="idproofattachment">
                <Icon>
                  {" "}
                  <Attachment />
                </Icon>
              </label>

              <input
                id="idproofattachment"
                name="idproofattachment"
                style={{ display: "none" }}
                type="file"
                accept="image/png, image/jpeg,image/jpg"
                onChange={(e: any) => {
                  console.log(e.target.files[0]);
                  formik.setFieldValue("idproofattachment", e.target.files[0]);
                  console.log(e.target.files[0].name);
                }}
              />
              &emsp;
              <label className={classes.poto}>{formik.values.idproofattachment?.name}</label>
              {formik.errors["file"] && formik.touched["file"] && (
                  <div style={{ color: "red", fontSize: ".8rem" }}>
                    {formik.errors.file}
                  </div>
                )}
              {id == "" ? 
                   <img 
      src={`data:image/png;base64,${employeeDetail.IdProof}`}
      width="50"
      height="50"
    ></img>
    :""}
            </div>
          </Grid>
          <div>
            <div className={classes.textSize}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="outlined-basic "
                    variant="outlined"
                    name="AadharNumber"
                    placeholder="Aadhar Number"
                    margin="dense"
                    box-sizing="border-box"
                    value={formik.values.AadharNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.AadharNumber &&
                      Boolean(formik.errors.AadharNumber)
                    }
                    helperText={
                      formik.touched.AadharNumber && formik.errors.AadharNumber
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="outlined-basic "
                    variant="outlined"
                    name="WorkMail"
                    placeholder="WorkMail"
                    margin="dense"
                    box-sizing="border-box"
                    value={formik.values.WorkMail}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.WorkMail && Boolean(formik.errors.WorkMail)
                    }
                    helperText={
                      formik.touched.WorkMail && formik.errors.WorkMail
                    }
                  />
                </Grid>
              </Grid>
            </div>
            <div className={classes.textSize}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="outlined-basic "
                    variant="outlined"
                    name="bankaccount"
                    placeholder="Bank Account#"
                    margin="dense"
                    box-sizing="border-box"
                    value={formik.values.bankaccount}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.bankaccount &&
                      Boolean(formik.errors.bankaccount)
                    }
                    helperText={
                      formik.touched.bankaccount && formik.errors.bankaccount
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="outlined-basic "
                    variant="outlined"
                    name="IFSCCode"
                    placeholder="IFSC Code"
                    margin="dense"
                    box-sizing="border-box"
                    value={formik.values.IFSCCode}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.IFSCCode && Boolean(formik.errors.IFSCCode)
                    }
                    helperText={
                      formik.touched.IFSCCode && formik.errors.IFSCCode
                    }
                  />
                </Grid>
              </Grid>
            </div>
          </div>
          <div className={classes.textSize}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  id="outlined-basic "
                  variant="outlined"
                  name="BankName"
                  placeholder="Bank Name"
                  margin="dense"
                  box-sizing="border-box"
                  value={formik.values.BankName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.BankName && Boolean(formik.errors.BankName)
                  }
                  helperText={formik.touched.BankName && formik.errors.BankName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  id="outlined-basic "
                  variant="outlined"
                  name="Branch"
                  placeholder="Branch"
                  margin="dense"
                  box-sizing="border-box"
                  value={formik.values.Branch}
                  onChange={formik.handleChange}
                  error={formik.touched.Branch && Boolean(formik.errors.Branch)}
                  helperText={formik.touched.Branch && formik.errors.Branch}
                />
              </Grid>
            </Grid>
          </div>
          <br></br>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                type="date"
                id="outlined-basic "
                variant="outlined"
                name="JoiningDate"
                label="Joining Date"
                margin="dense"
                className={classes.textSize}
                box-sizing="border-box"
                value={formik.values.JoiningDate}
                onChange={formik.handleChange}
                error={
                  formik.touched.JoiningDate &&
                  Boolean(formik.errors.JoiningDate)
                }
                helperText={
                  formik.touched.JoiningDate && formik.errors.JoiningDate
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="date"
                id="outlined-basic "
                variant="outlined"
                name="TerminationDate"
                label="Termination Date"
                margin="dense"
                box-sizing="border-box"
                className={classes.textSize}
                value={formik.values.TerminationDate}
                onChange={formik.handleChange}
                error={
                  formik.touched.TerminationDate &&
                  Boolean(formik.errors.TerminationDate)
                }
                helperText={
                  formik.touched.TerminationDate &&
                  formik.errors.TerminationDate
                }
              />
            </Grid>
          </Grid>
          <br></br>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl variant="outlined" className={classes.textSize}>
                <InputLabel htmlFor="outlined-department-native-simple"></InputLabel>
                <Select
                  native
                  placeholder="Department"
                  onChange={(e) => {
                    change(e);
                  }}
                >
                  <option value="" disabled selected>
                    Department
                  </option>
                  {departments.map((item: any, index) => (
                    <option key={item.dept_id} value={[item.dept_id,item.dept_name]} >
                      {item.dept_name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" className={classes.textSize}>
                <InputLabel htmlFor="outlined-onproject-native-simple"></InputLabel>
                <Select
                  native
                  onChange={formik.handleChange}
                  value={formik.values.OnProject}
                  inputProps={{
                    name: "OnProject",
                    id: "outlined-age-native-simple",
                  }}
                >
                  <option value="" disabled>
                    On-Project
                  </option>
                  {projects.map((item: any, index) => (
                    <option value={item.prj_name} key={item.dept_id}>
                      {item.prj_name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <br></br>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl variant="outlined" className={classes.textSize}>
                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                <Select
                  native
                  onChange={formik.handleChange}
                  value={formik.values.Status}
                  inputProps={{
                    name: "Status",
                    id: "outlined-status-native-simple",
                  }}
                >
                  <option value="" disabled>
                    Status
                  </option>
                  <option value="Permanent">Permanent</option>
                  <option value="Temporary">Temporary</option>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <br></br>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl variant="outlined" className={classes.textSize}>
                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                <Select
                  native
                  onChange={formik.handleChange}
                  value={formik.values.Role}
                  inputProps={{
                    name: "Role",
                    id: "outlined-role-native-simple",
                  }}
                >
                  <option value="" disabled>
                    Role
                  </option>
                  {roles.map((item: any, index) => (
                    <option value={item.roleList} key={item.dept_id}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" className={classes.textSize}>
                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                <Select
                  native
                  onChange={formik.handleChange}
                  value={formik.values.RoleDescription}
                  inputProps={{
                    name: "RoleDescription",
                    id: "outlined-age-native-simple",
                  }}
                >
                  <option value="" disabled>
                    Role Description
                  </option>
                  {roleDes.map((item: any, index) => (
                    <option value={item.roleDescription} key={item.dept_id}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit" className={classes.sav} disabled={submitted}>
            Save
          </Button>
          <Button className={classes.canc}>Cancel</Button>
        </div>
      </form>
    </Home>
  );
};
export default CreateEmployee;
