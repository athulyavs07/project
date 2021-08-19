import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Shared/urls";
import SearchBar from "material-ui-search-bar";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import EmployeeDetails from "../Employee-Details/employeeDetails";
import { escapeRegExp } from "@material-ui/data-grid";
import SalaryUpdate from "./salary";
import Delete from "./delete";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
interface Data {
  photo: string;
  name: string;
  role: string;
  rolestatus: string;
  radID: string;
  joiningDate: string;
  department: string;
  Project: string;
  salary: number;
  Action: any;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
  active: boolean;
}
const headCells: HeadCell[] = [
  { id: "photo", numeric: false, active: true, label: "" },
  { id: "name", numeric: false, active: false, label: "Name" },
  { id: "role", numeric: false, active: false, label: "Role" },
  { id: "rolestatus", numeric: false, active: false, label: "Role Status" },
  { id: "radID", numeric: false, active: false, label: "RAD ID" },
  { id: "joiningDate", numeric: false, active: false, label: "Joining Date" },
  { id: "department", numeric: false, active: false, label: "Department" },
  { id: "Project", numeric: false, active: false, label: "Project" },
  { id: "salary", numeric: true, active: false, label: "Salary" },
  { id: "Action", numeric: false, active: true, label: "" },
  // { id: 'Action', numeric: false,active:true, label: '' },
];
interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <TableHead style={{ background: "#525252" }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              style={{ color: "white" }}
              hideSortIcon={headCell.active ? true : false}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    rowStyle: {
      cursor: "pointer",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 700,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    margin: {
      marginLeft: "20px",
    },
  })
);
export default function BasicTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("name");
  var token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  const [IsSalary, setSalary] = useState(false);
  const [employeeDetails, showEmployeeDetails] = useState([]);
  const [radEmployeeList, setData] = useState([]);
  const [orginalRows, setList] = useState([]);
  const [searched, setSearched] = useState<string>("");
  const requestSearch = (searchedVal: string) => {
    const searchRegex = new RegExp(escapeRegExp(searchedVal), "i");
    const filteredRows = orginalRows.filter((row: any) => {
      return Object.keys(row).some((field: any) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setData(filteredRows);
  };
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };
  const [isDelete, setIsdelete] = useState(false);
  const [itemDetails, setCellValue] = useState([]);
  const getCell = (item: any) => {
    setCellValue(item);
    setIsdelete(true);
  };
  const getCellValue = (item: any) => {
    setCellValue(item);
    setSalary(true);
  };
  const getEmployeeDetails = (item: any) => {
    showEmployeeDetails(item);
    setIsOpen(true);
    console.log(isOpen);
  };
  useEffect(() => {
    console.log(radEmployeeList);
    if (radEmployeeList.length != 0) {
      return;
    }
    axios
      .get(API_URL + "/api/RAD/searchRADDetails", {
        params: { department: "RAD" },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: any) => {
        setData(res.data.radTeamDetails);
        setList(res.data.radTeamDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const updateSalary = (e: any) => {
    setSalary(e);
    console.log(e);
  };
  const deleteEmp = (e: any) => {
    setIsdelete(e);
  };
  const empDetails = (e: any) => {
    setIsOpen(e);
  };
  const reload = (e: any) => {
    window.location.reload();
  };
  return (
    <div className="tablecontainer">
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer style={{ maxHeight: 500, overflow: "auto" }}>
            <SearchBar
              className="searchbar"
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="small"
              stickyHeader
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {isDelete == true ? (
                  <Delete
                    values={itemDetails}
                    click={deleteEmp}
                    load={reload}
                  />
                ) : (
                  ""
                )}
                {IsSalary == true ? (
                  <SalaryUpdate
                    values={itemDetails}
                    click={updateSalary}
                    load={reload}
                  />
                ) : (
                  ""
                )}

                {isOpen == true ? (
                  <EmployeeDetails
                    values={employeeDetails}
                    click={empDetails}
                  />
                ) : (
                  ""
                )}

                {stableSort(radEmployeeList, getComparator(order, orderBy)).map(
                  (item: any) => {
                    return (
                      <TableRow className={classes.rowStyle} key={item.id}>
                        <TableCell
                          align="left"
                          onClick={() => getEmployeeDetails(item)}
                        >
                          <img
                            src={`data:image/png;base64,${item.photo}`}
                            width="50"
                            height="50"
                          ></img>
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => getEmployeeDetails(item)}
                        >
                          {item.name}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => getEmployeeDetails(item)}
                        >
                          {item.role}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => getEmployeeDetails(item)}
                        >
                          {item.roleStatus}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => getEmployeeDetails(item)}
                        >
                          {item.radID}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => getEmployeeDetails(item)}
                        >
                          {item.joiningDate}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => getEmployeeDetails(item)}
                        >
                          {item.department}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => getEmployeeDetails(item)}
                        >
                          {item.Project}
                        </TableCell>
                        <TableCell align="left">
                          {item.emp_status == 1 ? (
                            <EditIcon onClick={() => getCellValue(item)} />
                          ) : (
                            <span className={classes.margin}>&nbsp;</span>
                          )}
                          {item.salary}
                        </TableCell>
                        <TableCell align="left">
                          {item.emp_status == 1 ? (
                            <DeleteIcon onClick={() => getCell(item)} />
                          ) : (
                            "Inactive"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}
