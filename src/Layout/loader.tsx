import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  overlay: {
    position: "fixed",
    display: "block",
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    backgroundColor: "rgba(74,74,74,.8)",
    zIndex: 10001,
  },
}));

export default function CircularIndeterminate() {
  const classes = useStyles();

  return (
    <div className={classes.overlay}>
      <div className={classes.root}>
        <CircularProgress color="secondary" />
      </div>
    </div>
  );
}
