import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import NumberFormat from "react-number-format";
import MaterialTable, { MTableToolbar } from "material-table";
import {
  makeStyles,
  withStyles,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { Typography, Grid, Paper, TextField, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import SendIcon from "@material-ui/icons/Send";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Formik, Form, Field } from "formik";
import { red, green, purple } from "@material-ui/core/colors/";
import * as loginActions from "./../../../actions/login.action";
import * as prnumberActions from "./../../../actions/prnumber.action";
import * as prheadActions from "./../../../actions/prhead.action";
import * as prdetailActions from "./../../../actions/prdetail.action";
import * as warehouseActions from "./../../../actions/warehouse.action";
import * as buActions from "./../../../actions/bu.action";
import * as departmentActions from "./../../../actions/department.action";
import * as costcenterActions from "./../../../actions/costcenter.action";
import * as approveActions from "./../../../actions/approve.action";
import * as buyerActions from "./../../../actions/buyer.action";
import * as itemActions from "./../../../actions/item.action";
import * as itemunitActions from "./../../../actions/itemunit.action";
import * as phgroupActions from "./../../../actions/phgroup.action";
import * as phbuyerActions from "./../../../actions/phbuyer.action";
import * as supplierActions from "./../../../actions/supplier.action";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 60,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  margin: {
    marginTop: "0.4rem",
    marginRight: "0.4rem",
    margin: theme.spacing(0.3),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  row: {
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
    borderTop: 1,
    borderColor: "#E0E0E0",
    borderStyle: "solid",
  },
}));

const theme = createMuiTheme({
  palette: {
    // primary: {
    //   500: "#0FF",
    // },
    fourth: {
      500: "#0FF",
    },
  },
});

const accent = purple["A200"]; // #E040FB
// const accent = purple.A200; // #E040FB (alternative method)

export default (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const prnumberReducer = useSelector(({ prnumberReducer }) => prnumberReducer);
  const prheadReducer = useSelector(({ prheadReducer }) => prheadReducer);
  const prdetailReducer = useSelector(({ prdetailReducer }) => prdetailReducer);
  const warehouseReducer = useSelector(
    ({ warehouseReducer }) => warehouseReducer
  );
  const buReducer = useSelector(({ buReducer }) => buReducer);
  const departmentReducer = useSelector(
    ({ departmentReducer }) => departmentReducer
  );
  const costcenterReducer = useSelector(
    ({ costcenterReducer }) => costcenterReducer
  );
  const approveReducer = useSelector(({ approveReducer }) => approveReducer);
  const buyerReducer = useSelector(({ buyerReducer }) => buyerReducer);
  const itemReducer = useSelector(({ itemReducer }) => itemReducer);
  const itemunitReducer = useSelector(({ itemunitReducer }) => itemunitReducer);
  const phgroupReducer = useSelector(({ phgroupReducer }) => phgroupReducer);
  const phbuyerReducer = useSelector(({ phbuyerReducer }) => phbuyerReducer);
  const supplierReducer = useSelector(({ supplierReducer }) => supplierReducer);
  const [prnumber, setPRNumber] = useState({ vPRSelectNumber: "" });
  const initialStatePRHead = {
    vPRNumber: "",
    vDate: moment(new Date()).format("YYYY-MM-DD"),
    vWarehouse: "",
    vDepartment: "",
    vMonth: "",
    vPlanUnPlan: "",
    vBU: "",
    vBuyer: "",
    vGroup: "",
    vCAPNo: "",
    vRequestor: "",
    vRemark: "",
    vApprove1: "",
    vApprove2: "",
    vApprove3: "",
    vApprove4: "",
    vStatus: "",
  };
  const [prhead, setPRHead] = useState(initialStatePRHead);
  const initialStateItemPRDetail = {
    vItemLine: "",
    vItemNo: "",
    vItemDesc1: "",
    vItemDesc2: null,
    vQty: "",
    vUnit: "",
    vDateDetail: moment(new Date()).format("YYYY-MM-DD"), //"2018-12-01"
    vSupplierNo: "",
    vSupplierName: "",
    vSupplierDesc: null,
    vPrice: "",
    vVat: "",
    vCurrency: "",
    vOrdertype: "",
    vTotal: "",
    vCostcenterDetail: "",
    vPHGroupDetail: "",
    vBuyerDetail: "",
    vRemarkDetail: "",
  };
  const [itemprdetail, setItemPRDetail] = useState(initialStateItemPRDetail);
  const [searchdisable, setSearchDisable] = useState(false);
  const [newdisable, setNewDisable] = useState(false);
  const [editdisable, setEditDisable] = useState(true);
  const [createdisable, setCreateDisable] = useState(true);
  const [cancelprdisable, setCancelPRDisable] = useState(true);
  const [savedisable, setSaveDisable] = useState(false);
  const [confirmdisable, setConfirmDisable] = useState(false);
  const [editnamedisable, setEditNameDisable] = useState(false);
  const [newpr, setNewPR] = useState(false);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [copy, setCopy] = useState(false);
  const [whsdisable, setWhsDisable] = useState(true);
  const [deptdisable, setDeptDisable] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [data, setData] = useState([
    { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
    { name: "Zerya Betül", surname: "Baran", birthYear: 2017, birthCity: 34 },
  ]);

  useEffect(() => {
    // console.log("dispatch prnumberActions");
    let fromStatus = "00";
    let toStatus = "05";
    dispatch(prnumberActions.getPRNumbers(fromStatus, toStatus));
    dispatch(warehouseActions.getWarehouses());
    dispatch(buActions.getBUs());
    dispatch(approveActions.getApproves());
    dispatch(buyerActions.getBuyers());
    dispatch(supplierActions.getSuppliers());
    prheadReducer.result = null;
    prdetailReducer.result = null;
  }, []);

  useEffect(() => {
    const prheads = prheadReducer.result ? prheadReducer.result : [];
    // prheads.map((item) => {
    //   setPRNumber({ ...prnumber, vPRSelectNumber: item.HD_IBPLPN });
    // });
    prheads.map((item) => {
      setPRNumber({ ...prnumber, vPRSelectNumber: item.HD_IBPLPN });
      dispatch(itemActions.getItems(item.HD_IBWHLO));
      let phgroup = "PH";
      let bu = item.HD_BU;
      let department = item.HD_IBCOCE;
      dispatch(phgroupActions.getPHGroups(phgroup));
      dispatch(costcenterActions.getCostCenters(department));
      dispatch(departmentActions.getDepartments(bu));
      setPRHead({
        ...prhead,
        vPRNumber: item.HD_IBPLPN,
        vDate: moment(item.HD_PURCDT).format("YYYY-MM-DD"),
        vWarehouse: item.HD_IBWHLO,
        vDepartment: item.HD_IBCOCE,
        vMonth: item.HD_IBMTH,
        vPlanUnPlan: item.HD_IBPRIP,
        vBU: item.HD_BU,
        vBuyer: item.HD_IBBUYE,
        vGroup: item.HD_IBMODL,
        vCAPNo: item.HD_CAPNO,
        vRequestor: item.HD_IBPURC,
        vRemark: item.HD_REM1,
        vApprove1: item.HD_APP1,
        vApprove2: item.HD_APP2,
        vApprove3: item.HD_APP3,
        vApprove4: item.HD_APP4,
        vStatus: item.HD_STATUS,
      });

      if (item.HD_IBWHLO === "A99") {
        // console.log("Warehouse A99: true");
        // setEditNameDisable(false);
      } else {
        // console.log("Warehouse A99: false");
        // setEditNameDisable(true);
      }
    });
  }, [prheadReducer]);

  const prnumbers = useMemo(() =>
    prnumberReducer.result ? prnumberReducer.result : []
  );

  const warehouses = useMemo(() =>
    warehouseReducer.result ? warehouseReducer.result : []
  );

  const bus = useMemo(() => (buReducer.result ? buReducer.result : []));

  const departments = useMemo(() =>
    departmentReducer.result ? departmentReducer.result : []
  );

  const costcenters = useMemo(() =>
    costcenterReducer.result ? costcenterReducer.result : []
  );

  const approves = useMemo(() =>
    approveReducer.result ? approveReducer.result : []
  );

  const handleSearch = () => {
    if (prnumber.vPRSelectNumber === "") {
      setPRHead({
        ...initialStatePRHead,
      });
      dispatch(prdetailActions.getPRDetails("00"));
      setEditDisable(true);
      setCreateDisable(true);
      setCancelPRDisable(true);
    } else {
      let fromStatus = "00";
      let toStatus = "05";
      dispatch(
        prheadActions.getMPRHeads(
          prnumber.vPRSelectNumber,
          fromStatus,
          toStatus
        )
      );
      dispatch(prdetailActions.getPRDetails(prnumber.vPRSelectNumber));
      setNewDisable(true);
      setEditDisable(false);
      setCreateDisable(false);
      setCancelPRDisable(false);
    }
  };

  const handleNew = () => {
    var dateNow = new Date();
    var futureMonth = moment(dateNow)
      .add(1, "M")
      .format("YYYY-MM-DD");
    // console.log(moment(futureMonth).format("YYYY-MM-DD") + " " + futureMonth.toString().substr(2, 2) + futureMonth.toString().substr(5, 2));

    setPRHead({
      ...initialStatePRHead,
      vMonth:
        futureMonth.toString().substr(2, 2) +
        futureMonth.toString().substr(5, 2),
      vPlanUnPlan: "Plan",
    });
    setSearchDisable(true);
    setNewDisable(true);
    setEditDisable(false);
    setCreateDisable(true);
    setWhsDisable(false);
    setDeptDisable(false);
    setNewPR(true);
  };

  const handleCancel = () => {
    setPRNumber({ ...prnumber, vPRSelectNumber: "" });
    setPRHead({ ...initialStatePRHead });
    dispatch(prdetailActions.getPRDetails("00"));
    setSearchDisable(false);
    setNewDisable(false);
    setEditDisable(true);
    setCreateDisable(true);
    setCancelPRDisable(true);
    setWhsDisable(true);
    setDeptDisable(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setItemPRDetail(initialStateItemPRDetail);
    setSaveDisable(false);
    setConfirmDisable(false);
  };

  const handleCancelPR = () => {
    let status = "99";
    dispatch(prheadActions.updateStsPRHead(prhead.vPRNumber, status));
    setTimeout(() => {
      setCancelPRDisable(true);
      setPRNumber({ ...prnumber, vPRSelectNumber: "" });
      setPRHead({ ...initialStatePRHead });
      dispatch(prnumberActions.getPRNumbers("00", "00"));
      dispatch(prdetailActions.getPRDetails("00"));
      alert("Cancel Complete");
      setSearchDisable(false);
      setNewDisable(false);
      setEditDisable(true);
      setCreateDisable(true);
      setCancelPRDisable(true);
      setWhsDisable(true);
      setDeptDisable(true);
    }, 500);
  };

  const handleSubmitPH = () => {
    if (prdetailReducer.result.length > 0) {
      let status = "10";
      dispatch(prheadActions.updateStsPRHead(prhead.vPRNumber, status));
      setTimeout(() => {
        setCancelPRDisable(true);
        setPRNumber({ ...prnumber, vPRSelectNumber: "" });
        setPRHead({ ...initialStatePRHead });
        dispatch(prnumberActions.getPRNumbers("00", "00"));
        dispatch(prdetailActions.getPRDetails("00"));
        alert("Submit Complete");
        setSearchDisable(false);
        setNewDisable(false);
        setEditDisable(true);
        setCreateDisable(true);
        setCancelPRDisable(true);
        setWhsDisable(true);
        setDeptDisable(true);
      }, 500);
    } else {
      alert("Please create item detail before submit to PH");
    }
  };

  const NumberFormatCustom = (props) => {
    const { inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        prefix="฿"
      />
    );
  };

  const showForm = ({
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  }) => {
    return (
      <form onSubmit={handleSubmit}>
        <Grid container style={{ marginBottom: 2 }} spacing={5}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container item xs={12} className={classes.margin}>
                <Grid item xs={12} sm={2} className={classes.margin}>
                  <TextField
                    error={true}
                    fullWidth
                    select
                    size="small"
                    variant="outlined"
                    required
                    id="vSelectPRNumber"
                    label="MPR Number"
                    disabled={searchdisable}
                    value={prnumber.vPRSelectNumber}
                    onChange={(event) => {
                      // console.log(event.target.value);
                      setPRNumber({
                        ...prnumber,
                        vPRSelectNumber: event.target.value,
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option />
                    {prnumbers.map((option) => (
                      <option key={option.ID} value={option.HD_IBPLPN}>
                        {option.HD_IBPLPN}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={1} className={classes.margin}>
                  <Button
                    fullWidth
                    size="medium"
                    id="vSearch"
                    variant="contained"
                    color="primary"
                    disabled={searchdisable}
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Grid>
                <Grid item xs={12} sm={1} className={classes.margin}>
                  <Button
                    fullWidth
                    size="medium"
                    id="vNew"
                    variant="contained"
                    color="secondary"
                    disabled={newdisable}
                    startIcon={<AddCircleIcon />}
                    onClick={handleNew}
                  >
                    New
                  </Button>
                </Grid>
                <Grid item xs sm={1} className={classes.margin}>
                  <Button
                    fullWidth
                    size="medium"
                    id="vSave"
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<SaveIcon />}
                    disabled={editdisable}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item xs sm={1} className={classes.margin}>
                  <Button
                    fullWidth
                    size="medium"
                    id="vCancel"
                    variant="contained"
                    color="secondary"
                    startIcon={<CancelIcon />}
                    disabled={editdisable}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
              <Grid container item xs className={classes.margin}>
                <TextField
                  className={classes.margin}
                  style={{ maxWidth: 120 }}
                  required
                  disabled="true"
                  size="small"
                  id="vPRNumber"
                  label="MPR Number"
                  placeholder="MPR Number"
                  variant="outlined"
                  value={prhead.vPRNumber}
                  values={(values.vPRNumber = prhead.vPRNumber)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setPRHead({
                      ...prhead,
                      vPRNumber: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  className={classes.margin}
                  style={{ maxWidth: 180 }}
                  required
                  disabled="true"
                  type="date"
                  size="small"
                  id="vDate"
                  label="Date"
                  variant="outlined"
                  defaultValue={prhead.vDate}
                  value={prhead.vDate}
                  values={(values.vDate = prhead.vDate)}
                  onChange={(event) => {
                    // console.log("onChange: " + event.target.value.substr(2, 2) +
                    // event.target.value.substr(5, 2));
                    var dateNow = new Date();
                    if (
                      event.target.value < moment(dateNow).format("YYYY-MM-DD")
                    ) {
                      alert("Date not less than present day.");
                    } else {
                      setPRHead({
                        ...prhead,
                        vDate: event.target.value,
                        vMonth:
                          event.target.value.substr(2, 2) +
                          event.target.value.substr(5, 2),
                      });
                    }
                  }}
                  InputLabelProps={{ shrink: true, required: true }}
                />

                <TextField
                  className={classes.margin}
                  style={{ width: "150px" }}
                  error={true}
                  disabled={whsdisable}
                  select
                  size="small"
                  variant="outlined"
                  margin="normal"
                  required
                  id="vWarehouse"
                  label="Warehouse"
                  value={prhead.vWarehouse}
                  values={(values.vWarehouse = prhead.vWarehouse)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setPRHead({
                      ...prhead,
                      vWarehouse: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option />
                  {warehouses.map((option) => (
                    <option key={option.ID} value={option.MWWHLO}>
                      {option.WAREHOUSE}
                    </option>
                  ))}
                </TextField>

                <TextField
                  className={classes.margin}
                  style={{ maxWidth: 100 }}
                  error={true}
                  required
                  disabled={deptdisable}
                  select
                  size="small"
                  id="vBU"
                  label="BU"
                  placeholder="Placeholder"
                  variant="outlined"
                  value={prhead.vBU}
                  values={(values.vBU = prhead.vBU)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setPRHead({
                      ...prhead,
                      vBU: event.target.value,
                    });

                    dispatch(
                      departmentActions.getDepartments(event.target.value)
                    );
                  }}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option />
                  {bus.map((option) => (
                    <option key={option.ID} value={option.S1STID}>
                      {option.BU}
                    </option>
                  ))}
                </TextField>

                <TextField
                  className={classes.margin}
                  style={{ width: "150px" }}
                  error={true}
                  disabled={deptdisable}
                  select
                  size="small"
                  variant="outlined"
                  margin="normal"
                  required
                  id="vDepartment"
                  label="Department"
                  value={prhead.vDepartment}
                  values={(values.vDepartment = prhead.vDepartment)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setPRHead({
                      ...prhead,
                      vDepartment: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option />
                  {departments.map((option) => (
                    <option key={option.ID} value={option.S2AITM}>
                      {option.DEPARTMENT}
                    </option>
                  ))}
                </TextField>

                <TextField
                  className={classes.margin}
                  style={{ maxWidth: 100 }}
                  required
                  // disabled={editdisable}
                  disabled="true"
                  size="small"
                  id="vMonth"
                  label="Month"
                  placeholder="Month"
                  variant="outlined"
                  value={prhead.vMonth}
                  values={(values.vMonth = prhead.vMonth)}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  className={classes.margin}
                  style={{ maxWidth: 120 }}
                  required
                  // disabled={editdisable}
                  disabled="true"
                  size="small"
                  id="vPlanUnPlan"
                  label="Plan / UnPlan"
                  placeholder="Plan / UnPlan"
                  variant="outlined"
                  value={prhead.vPlanUnPlan}
                  values={(values.vPlanUnPlan = prhead.vPlanUnPlan)}
                  InputLabelProps={{ shrink: true }}
                />

                {/* <FormControl
                className={classes.margin}
                style={{ maxWidth: 170 }}
                required
                disabled={editdisable}
                variant="outlined"
                size="small"
              >
                <InputLabel>Buyer</InputLabel>
                <Select
                  id="vBuyer"
                  label="Buyer"
                  onChange={(event) => {
                    // console.log(event.target.value);
                    
                    setPRHead({
                      ...prhead,
                      vBuyer: event.target.value,
                    });
                  }}
                  value={prhead.vBuyer}
                >
                  <MenuItem value="0">
                    <em>Select Buyer</em>
                  </MenuItem>
                  {buyers.map((item) => (
                    <MenuItem key={item.ID} value={item.US_LOGIN}>
                      {item.US_LOGIN}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}

                {/* <TextField
                className={classes.margin}
                style={{ maxWidth: 100 }}
                required
                disabled={editdisable}
                size="small"
                id="vGroup"
                label="Group"
                placeholder="Placeholder"
                variant="outlined"
                onChange={(event) => {
                  // console.log(event.target.value);
                  
                  setPRHead({
                    ...prhead,
                    vGroup: event.target.value,
                  });
                }}
                value={prhead.vGroup}
              /> */}

                <TextField
                  className={classes.margin}
                  style={{ maxWidth: 100 }}
                  error={true}
                  disabled={editdisable}
                  size="small"
                  id="vCAPNo"
                  label="CAP No"
                  placeholder="CAP No"
                  variant="outlined"
                  value={prhead.vCAPNo}
                  values={(values.vCAPNo = prhead.vCAPNo)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setPRHead({
                      ...prhead,
                      vCAPNo: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  className={classes.margin}
                  style={{ maxWidth: 150 }}
                  required
                  // disabled={editdisable}
                  disabled="true"
                  size="small"
                  id="vRequestor"
                  label="Requestor"
                  placeholder="Requestor"
                  variant="outlined"
                  value={prhead.vRequestor}
                  values={(values.vRequestor = prhead.vRequestor)}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  className={classes.margin}
                  style={{ maxWidth: 200 }}
                  error={true}
                  disabled={editdisable}
                  size="small"
                  id="vRemark"
                  label="Remark"
                  placeholder="Remark"
                  variant="outlined"
                  value={prhead.vRemark}
                  values={(values.vRemark = prhead.vRemark)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setPRHead({
                      ...prhead,
                      vRemark: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid container item xs className={classes.margin}>
                <TextField
                  className={classes.margin}
                  style={{ width: "200px" }}
                  error={true}
                  disabled={editdisable}
                  select
                  size="small"
                  variant="outlined"
                  margin="normal"
                  required
                  id="vDeptHead"
                  label="Dept of Head"
                  value={prhead.vApprove1}
                  values={(values.vApprove1 = prhead.vApprove1)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setPRHead({
                      ...prhead,
                      vApprove1: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option />
                  {approves.map((option) => (
                    <option key={option.ID} value={option.US_LOGIN}>
                      {option.US_LOGIN}
                    </option>
                  ))}
                </TextField>

                <TextField
                  className={classes.margin}
                  style={{ width: "200px" }}
                  error={true}
                  disabled={editdisable}
                  select
                  size="small"
                  variant="outlined"
                  margin="normal"
                  required
                  id="vApprove1"
                  label="Approve1"
                  value={prhead.vApprove2}
                  values={(values.vApprove2 = prhead.vApprove2)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setPRHead({
                      ...prhead,
                      vApprove2: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option />
                  {approves.map((option) => (
                    <option key={option.ID} value={option.US_LOGIN}>
                      {option.US_LOGIN}
                    </option>
                  ))}
                </TextField>

                <TextField
                  className={classes.margin}
                  style={{ width: "200px" }}
                  error={true}
                  disabled={editdisable}
                  select
                  size="small"
                  variant="outlined"
                  margin="normal"
                  // required
                  id="vApprove2"
                  label="Approve2"
                  value={prhead.vApprove3}
                  values={(values.vApprove3 = prhead.vApprove3)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setPRHead({
                      ...prhead,
                      vApprove3: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option />
                  {approves.map((option) => (
                    <option key={option.ID} value={option.US_LOGIN}>
                      {option.US_LOGIN}
                    </option>
                  ))}
                </TextField>

                <TextField
                  className={classes.margin}
                  style={{ width: "200px" }}
                  error={true}
                  disabled={editdisable}
                  select
                  size="small"
                  variant="outlined"
                  margin="normal"
                  // required
                  id="vApprove3"
                  label="Approve3"
                  value={prhead.vApprove4}
                  values={(values.vApprove4 = prhead.vApprove4)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setPRHead({
                      ...prhead,
                      vApprove4: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option />
                  {approves.map((option) => (
                    <option key={option.ID} value={option.US_LOGIN}>
                      {option.US_LOGIN}
                    </option>
                  ))}
                </TextField>

                <Grid className={classes.margin}>
                  <Button
                    // fullWidth
                    size="medium"
                    id="vCancelPR"
                    variant="contained"
                    color="primary"
                    // style={{ backgroundColor: green[500] }}
                    startIcon={<DeleteIcon />}
                    disabled={cancelprdisable}
                    onClick={handleCancelPR}
                  >
                    Cancel PR
                  </Button>
                </Grid>
                <Grid className={classes.margin}>
                  <Button
                    // fullWidth
                    size="medium"
                    id="vCancelPR"
                    variant="contained"
                    color="secondary"
                    startIcon={<SendIcon />}
                    disabled={cancelprdisable}
                    onClick={handleSubmitPH}
                  >
                    Submit PH
                  </Button>

                  {/* <Button
                    // fullWidth
                    size="medium"
                    id="vCancelPR"
                    variant="contained"
                    color="primary"
                    // style={{ backgroundColor: green[500] }}
                    startIcon={<DeleteIcon />}
                    disabled={cancelprdisable}
                    onClick={handleCancelPR}
                  >
                    Reject PR
                  </Button>
                </Grid>
                <Grid className={classes.margin}>
                  <Button
                    // fullWidth
                    size="medium"
                    id="vCancelPR"
                    variant="contained"
                    color="secondary"
                    startIcon={<SendIcon />}
                    disabled={cancelprdisable}
                    onClick={handleSubmitPH}
                  >
                    Confirm All
                  </Button> */}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </form>
    );
  };

  const showDialog = ({
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  }) => {
    if (selectedProduct === null) {
      return "";
    }

    const items = itemReducer.result ? itemReducer.result : [];
    const itemunits = itemunitReducer.result ? itemunitReducer.result : [];
    const phgroups = phgroupReducer.result ? phgroupReducer.result : [];
    const phbuyers = phbuyerReducer.result ? phbuyerReducer.result : [];
    const suppliers = supplierReducer.result ? supplierReducer.result : [];

    return (
      <Dialog
        open={openDialog}
        keepMounted
        onClose={() => {}}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="alert-dialog-slide-title">
            PR Number : {prhead.vPRNumber}
            {itemprdetail.vItemLine
              ? ` - Line : ${itemprdetail.vItemLine}`
              : ""}
            {copy ? ` (Copy)` : ""}
          </DialogTitle>
          <DialogContent>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={5}>
                <Autocomplete
                  className={classes.margin}
                  autoFocus
                  required
                  fullWidth
                  size="small"
                  id="vItemNoAuto"
                  options={items}
                  getOptionLabel={(option) => option.ITEM}
                  value={itemprdetail.vItemDesc2}
                  values={(values.vItemNo = itemprdetail.vItemNo)}
                  onChange={(event, values) => {
                    // console.log(values);
                    // alert(values.MMITNO.substr(0, 2));

                    if (values) {
                      // console.log(
                      //   "Price: " +
                      //     values.MMPUPR +
                      //     " : Order Type: " +
                      //     values.MBORTY +
                      //     " Currency: " +
                      //     values.MMCUCD
                      // );

                      setItemPRDetail({
                        ...itemprdetail,
                        vQty: "",
                        vTotal: "",
                        // vItemNo: { MMITNO: values.MMITNO },
                        vItemNo: values.MMITNO,
                        vItemDesc1: values.MMITDS,
                        vItemDesc2: { ITEM: values.ITEM },
                        vUnit: values.MMUNMS,
                        vSupplierNo: values.MMSUNO,
                        vSupplierName: values.SASUNM,
                        vSupplierDesc: { SUPPLIER: values.SUPPLIER },
                        vPrice: values.MMPUPR,
                        vVat: values.MMVTCP,
                        vCurrency: values.MMCUCD,
                        vOrdertype: values.MBORTY,
                      });
                      dispatch(itemunitActions.getItemUnits(values.MMITNO));

                      if (
                        values.MMITNO.substr(0, 2) === "OH" ||
                        values.MMITNO.substr(0, 2) === "BU"
                      ) {
                        setEditNameDisable(false);
                      } else {
                        setEditNameDisable(true);
                      }

                      if (values.MMPUPR < 0) {
                        setSaveDisable(true);
                        setConfirmDisable(true);
                        alert("Price must be enter, Please contact ICT.");
                      }

                      if (values.MBORTY === "") {
                        setSaveDisable(true);
                        setConfirmDisable(true);
                        alert("Order Type must be enter, Please contact ICT.");
                      }

                      if (values.MMCUCD === "") {
                        setSaveDisable(true);
                        setConfirmDisable(true);
                        alert("Currency must be enter, Please contact ICT.");
                      }
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={true}
                      id="vItemNo"
                      label="Item No"
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  className={classes.margin}
                  error={true}
                  fullWidth
                  disabled={editnamedisable}
                  margin="dense"
                  id="vItemName"
                  label="Item Name"
                  type="text"
                  value={itemprdetail.vItemDesc1}
                  values={(values.vItemDesc1 = itemprdetail.vItemDesc1)}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setItemPRDetail({
                      ...itemprdetail,
                      vItemDesc1: event.target.value,
                    });
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={5}>
                <TextField
                  required
                  error={true}
                  fullWidth
                  // disabled="true"
                  margin="dense"
                  id="vQty"
                  label="Qty"
                  type="number"
                  value={itemprdetail.vQty}
                  values={(values.vQty = itemprdetail.vQty)}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    let qty = event.target.value;
                    let price = itemprdetail.vPrice;
                    setItemPRDetail({
                      ...itemprdetail,
                      vQty: event.target.value,
                      vTotal: (qty * price).toFixed(4),
                    });
                  }}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  className={classes.margin}
                  disabled={editnamedisable}
                  error={true}
                  fullWidth
                  required
                  select
                  margin="dense"
                  variant="standard"
                  size="small"
                  required
                  id="vUnit"
                  label="Unit"
                  value={itemprdetail.vUnit}
                  values={(values.vUnit = itemprdetail.vUnit)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setItemPRDetail({
                      ...itemprdetail,
                      vUnit: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option />
                  {itemunits.map((option) => (
                    <option key={option.ID} value={option.MMUNMS}>
                      {option.MMUNMS}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <TextField
              required
              error={true}
              fullWidth
              margin="dense"
              type="date"
              size="small"
              id="vDeliveryDate"
              label="Delivery Date"
              variant="standard"
              defaultValue={prhead.vDate}
              value={itemprdetail.vDateDetail}
              values={(values.vDateDetail = itemprdetail.vDateDetail)}
              onChange={(event) => {
                var dateNow = new Date();
                if (event.target.value < moment(dateNow).format("YYYY-MM-DD")) {
                  alert("Date not less than present day.");
                } else {
                  setItemPRDetail({
                    ...itemprdetail,
                    vDateDetail: event.target.value,
                  });
                }
              }}
              InputLabelProps={{ shrink: true, required: true }}
            />
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={5}>
                <Autocomplete
                  className={classes.margin}
                  autoFocus
                  required
                  disabled="true"
                  fullWidth
                  size="small"
                  id="vSupplierNoAuto"
                  options={suppliers}
                  // getOptionLabel={(option) => option.IDSUNO}
                  // value={itemprdetail.vSupplierNo}
                  // values={(values.vSupplierNo = itemprdetail.vSupplierNo)}
                  getOptionLabel={(option) => option.SUPPLIER}
                  value={itemprdetail.vSupplierDesc}
                  values={(values.vSupplierNo = itemprdetail.vSupplierNo)}
                  onChange={(event, values) => {
                    // console.log(values);
                    if (values) {
                      setItemPRDetail({
                        ...itemprdetail,
                        // vSupplierNo: { IDSUNO: values.IDSUNO },
                        vSupplierNo: values.IDSUNO,
                        vSupplierName: values.SASUNM,
                        vSupplierDesc: { SUPPLIER: values.SUPPLIER },
                      });
                      // dispatch(itemunitActions.getItemUnits(values.IDSUNO));
                      // dispatch(
                      //   itemprdetailActions.getItems(
                      //     prhead.vWarehouse,
                      //     values.MMITNO
                      //   )
                      // );
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="vSupplierNo"
                      label="Supplier No"
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  // required
                  fullWidth
                  disabled="true"
                  margin="dense"
                  id="vSupplierName"
                  label="Supplier Name"
                  type="text"
                  value={itemprdetail.vSupplierName}
                  values={(values.vSupplierName = itemprdetail.vSupplierName)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={4}>
                <TextField
                  required
                  fullWidth
                  disabled="true"
                  margin="dense"
                  id="vPrice"
                  label="Price"
                  type="number"
                  value={itemprdetail.vPrice}
                  values={(values.vPrice = itemprdetail.vPrice)}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    let price = event.target.value;
                    let qty = itemprdetail.vQty;
                    setItemPRDetail({
                      ...itemprdetail,
                      vPrice: event.target.value,
                      vTotal: (qty * price).toFixed(4),
                    });
                  }}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  required
                  fullWidth
                  disabled="true"
                  margin="dense"
                  id="vVat"
                  label="Vat"
                  type="text"
                  value={itemprdetail.vVat}
                  values={(values.vVat = itemprdetail.vVat)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  required
                  fullWidth
                  disabled="true"
                  margin="dense"
                  id="vCurrency"
                  label="Currency"
                  type="text"
                  value={itemprdetail.vCurrency}
                  values={(values.vCurrency = itemprdetail.vCurrency)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  required
                  fullWidth
                  disabled="true"
                  margin="dense"
                  id="vOrderType"
                  label="Order Type"
                  type="text"
                  value={itemprdetail.vOrdertype}
                  values={(values.vOrdertype = itemprdetail.vOrdertype)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            {/* <TextField
              required
              fullWidth
              disabled="true"
              margin="dense"
              id="vTotal"
              label="Total"
              type="number"
              value={itemprdetail.vTotal}
              values={(values.vTotal = itemprdetail.vTotal)}
            /> */}

            <TextField
              required
              fullWidth
              disabled="true"
              margin="dense"
              id="vTotal"
              label="Total"
              value={itemprdetail.vTotal}
              values={(values.vTotal = itemprdetail.vTotal)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />

            <Grid container item xs={12} spacing={2}>
              <Grid item xs={5}>
                <TextField
                  className={classes.margin}
                  disabled={editdisable}
                  error={true}
                  fullWidth
                  required
                  select
                  margin="dense"
                  variant="standard"
                  size="small"
                  required
                  id="vPHGroup"
                  label="PH Group"
                  value={itemprdetail.vPHGroupDetail}
                  values={(values.vPHGroupDetail = itemprdetail.vPHGroupDetail)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    let phgroup = "PH";
                    setItemPRDetail({
                      ...itemprdetail,
                      vPHGroupDetail: event.target.value,
                    });
                    dispatch(
                      phbuyerActions.getPHBuyers(phgroup, event.target.value)
                    );
                  }}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option />
                  {phgroups.map((option) => (
                    <option key={option.ID} value={option.US_GRP}>
                      {option.US_GRP}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs>
                <TextField
                  className={classes.margin}
                  disabled={editdisable}
                  error={true}
                  fullWidth
                  required
                  select
                  margin="dense"
                  variant="standard"
                  size="small"
                  required
                  id="vBuyer"
                  label="Buyer"
                  value={itemprdetail.vBuyerDetail}
                  values={(values.vBuyerDetail = itemprdetail.vBuyerDetail)}
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setItemPRDetail({
                      ...itemprdetail,
                      vBuyerDetail: event.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option />
                  {phbuyers.map((option) => (
                    <option key={option.ID} value={option.US_LOGIN}>
                      {option.US_LOGIN}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <TextField
              className={classes.margin}
              disabled={editdisable}
              error={true}
              fullWidth
              required
              select
              margin="dense"
              variant="standard"
              size="small"
              required
              id="vCostcenter"
              label="Cost center"
              value={itemprdetail.vCostcenterDetail}
              values={
                (values.vCostcenterDetail = itemprdetail.vCostcenterDetail)
              }
              onChange={(event) => {
                // console.log(event.target.value);
                setItemPRDetail({
                  ...itemprdetail,
                  vCostcenterDetail: event.target.value,
                });
              }}
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: true,
              }}
            >
              <option />
              {costcenters.map((option) => (
                <option key={option.ID} value={option.S2AITM}>
                  {option.COSTCENTER}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              margin="dense"
              id="vRemarkDetail"
              label="Remark"
              type="text"
              value={itemprdetail.vRemarkDetail}
              values={(values.vRemarkDetail = itemprdetail.vRemarkDetail)}
              onChange={(event) => {
                // console.log(event.target.value);
                setItemPRDetail({
                  ...itemprdetail,
                  vRemarkDetail: event.target.value,
                });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default">
              Close
            </Button>
            <Button
              disabled={savedisable}
              type="submit"
              color="primary"
              onClick={(event) => {
                if (itemprdetail.vItemLine === "") {
                  setCreate(true);
                } else {
                  setUpdate(true);
                }
              }}
            >
              Save
            </Button>
            <Button
              disabled={confirmdisable}
              type="submit"
              color="secondary"
              onClick={(event) => {
                setConfirm(true);
              }}
              style={{ display: "none" }}
            >
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

  const columns = [
    {
      title: "Line",
      field: "PR_IBPLPS",
      headerStyle: { maxWidth: 50, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "center",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBPLPS}
        </Typography>
      ),
    },
    // {
    //   title: "Confirm",
    //   field: "PR_CONFIRM",
    //   headerStyle: { maxWidth: 80, whiteSpace: "nowrap", textAlign: "center" },
    //   cellStyle: {
    //     textAlign: "center",
    //     borderLeft: 1,
    //     borderRight: 1,
    //     borderBottom: 1,
    //     borderTop: 1,
    //     borderColor: "#E0E0E0",
    //     borderStyle: "solid",
    //   },
    //   render: (item) => (
    //     <Typography variant="body1" noWrap>
    //       {item.PR_CONFIRM}
    //     </Typography>
    //   ),
    // },
    {
      title: "Item No",
      field: "PR_IBITNO",
      headerStyle: { maxWidth: 150, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "left",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      // editComponent: props => (
      //   <Autocomplete
      //     id="combo-box-demo"
      //     options={top100Films}
      //     getOptionLabel={option => option.title}
      //     style={{ width: 100 }}
      //     renderInput={params => <TextField {...params} />}
      //   />
      // ),
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBITNO}
        </Typography>
      ),
    },
    {
      title: "Item Name",
      field: "PR_IBPITT",
      headerStyle: { maxWidth: 150, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "left",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBPITT}
        </Typography>
      ),
    },
    {
      title: "Unit",
      field: "PR_IBPUUN",
      headerStyle: { maxWidth: 50, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "center",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBPUUN}
        </Typography>
      ),
    },
    {
      title: "Stock Rem.",
      field: "MBSTQT",
      // type: "numeric",
      headerStyle: { maxWidth: 100, whiteSpace: "nowrap", textAlign: "left" },
      cellStyle: {
        textAlign: "right",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          <NumberFormat
            value={item.MBSTQT}
            displayType={"text"}
            thousandSeparator={true}
            // prefix={"$"}
          />
        </Typography>
      ),
    },
    {
      title: "Qty",
      field: "PR_IBORQA",
      // type: "numeric",
      headerStyle: { maxWidth: 100, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "right",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          <NumberFormat
            value={item.PR_IBORQA}
            displayType={"text"}
            thousandSeparator={true}
            // prefix={"$"}
          />
        </Typography>
      ),
    },
    {
      title: "Deli. Date",
      field: "PR_IBDWDT",
      type: "date",
      headerStyle: { maxWidth: 150, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "center",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {moment(item.PR_IBDWDT).format("DD/MM/YYYY")}
        </Typography>
      ),
    },
    {
      title: "Order Typ.",
      field: "PR_IBORTY",
      headerStyle: { maxWidth: 100, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "center",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBORTY}
        </Typography>
      ),
    },
    {
      title: "Cost Cen.",
      field: "PR_IBCOCE",
      headerStyle: { maxWidth: 100, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "center",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBCOCE}
        </Typography>
      ),
    },
    {
      title: "Group",
      field: "PR_IBMODL",
      headerStyle: { maxWidth: 100, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "center",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBMODL}
        </Typography>
      ),
    },
    {
      title: "Buyer",
      field: "PR_IBBUYE",
      headerStyle: { maxWidth: 150, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "left",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBBUYE}
        </Typography>
      ),
    },

    {
      title: "U/P",
      field: "PR_IBPUPR",
      // type: "numeric",
      headerStyle: { maxWidth: 100, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "right",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          <NumberFormat
            value={item.PR_IBPUPR}
            displayType={"text"}
            thousandSeparator={true}
            // prefix={"$"}
          />
        </Typography>
      ),
    },
    {
      title: "Total",
      field: "PR_IBTOTA",
      headerStyle: { maxWidth: 100, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "right",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          <NumberFormat
            value={item.PR_IBTOTA}
            displayType={"text"}
            thousandSeparator={true}
            // prefix={"$"}
          />
        </Typography>
      ),
    },
    {
      title: "Vat.",
      field: "PR_IBVTCD",
      headerStyle: { maxWidth: 50, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "center",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          <NumberFormat
            value={item.PR_IBVTCD}
            displayType={"text"}
            thousandSeparator={true}
            // prefix={"$"}
          />
        </Typography>
      ),
    },
    {
      title: "Curr.",
      field: "PR_IBCUCD",
      headerStyle: { maxWidth: 50, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "center",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBCUCD}
        </Typography>
      ),
    },
    {
      title: "Supp. No",
      field: "PR_IBSUNO",
      headerStyle: { maxWidth: 150, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "left",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBSUNO}
        </Typography>
      ),
    },
    {
      title: "Supp. Name",
      field: "SASUNM",
      headerStyle: { maxWidth: 150, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "left",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "12px",
        paddingTop: "12px",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.SASUNM}
        </Typography>
      ),
    },
    // {
    //   title: "PR Rem3.",
    //   field: "PR_REM3",
    //   headerStyle: { maxWidth: 100, whiteSpace: "nowrap", textAlign: "center" },
    //   cellStyle: {
    //     textAlign: "left",
    //     borderLeft: 1,
    //     borderRight: 1,
    //     borderBottom: 1,
    //     borderTop: 1,
    //     borderColor: "#E0E0E0",
    //     borderStyle: "solid",
    //   },
    //   render: (item) => (
    //     <Typography variant="body1" noWrap>
    //       {item.PR_REM3}
    //     </Typography>
    //   ),
    // },
    // {
    //   title: "PR Rem5.",
    //   field: "PR_REM5",
    //   // type: "numeric",
    //   headerStyle: { maxWidth: 100, whiteSpace: "nowrap", textAlign: "center" },
    //   cellStyle: {
    //     textAlign: "right",
    //     borderLeft: 1,
    //     borderRight: 1,
    //     borderBottom: 1,
    //     borderTop: 1,
    //     borderColor: "#E0E0E0",
    //     borderStyle: "solid",
    //   },
    //   render: (item) => (
    //     <Typography variant="body1" noWrap>
    //       {item.PR_REM5}
    //     </Typography>
    //   ),
    // },
  ];

  return (
    <div className={classes.root}>
      {/* Grid */}
      {/* <p>#Debug prnumber {JSON.stringify(prnumber)}</p> */}
      {/* <p>#Debug prhead {JSON.stringify(prhead)}</p> */}
      {/* <p>#Debug itemprdetail {JSON.stringify(itemprdetail)}</p> */}
      {/* <p>#Debug editdisable {JSON.stringify(editdisable)}</p> */}
      {/* <p>#Debug warehouse {JSON.stringify(warehouse)}</p> */}
      {/* <p>#Debug approves {JSON.stringify(approve)}</p> */}
      <Formik
        initialValues={{
          vPRNumber: "",
          vDate: "",
          vWarehouse: "",
          vDepartment: "",
          vMonth: "",
          vPlanUnPlan: "",
          vBU: "",
          vCAPNo: "",
          vRequestor: "",
          vRemark: "",
          vApprove1: "",
          vApprove2: "",
          vApprove3: "",
          vApprove4: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          // alert(JSON.stringify(values));
          let formData = new FormData();
          formData.append("vPRNumber", values.vPRNumber);
          formData.append("vDate", values.vDate);
          formData.append("vWarehouse", values.vWarehouse);
          formData.append("vDepartment", values.vDepartment);
          formData.append("vMonth", values.vMonth);
          formData.append("vPlanUnPlan", "5");
          formData.append("vBU", values.vBU);
          formData.append("vCAPNo", values.vCAPNo);
          formData.append(
            "vRequestor",
            prhead.vRequestor
              ? prhead.vRequestor
              : loginActions.getTokenUsername()
          );
          formData.append("vRemark", values.vRemark);
          formData.append("vApprove1", values.vApprove1);
          formData.append("vApprove2", values.vApprove2);
          formData.append("vApprove3", values.vApprove3);
          formData.append("vApprove4", values.vApprove4);
          formData.append("vStatus", prhead.vStatus ? prhead.vStatus : "00");

          if (newpr) {
            dispatch(prheadActions.addPRHead(formData, props.history));
            setTimeout(() => {
              setSearchDisable(false);
              setNewDisable(false);
              setEditDisable(true);
              setCreateDisable(true);
              setWhsDisable(true);
              setDeptDisable(true);
              setPRNumber({ ...prnumber, vPRSelectNumber: "" });
              setPRHead({ ...initialStatePRHead });
              setNewPR(false);
              let fromStatus = "00";
              let toStatus = "05";
              dispatch(prnumberActions.getPRNumbers(fromStatus, toStatus));
            }, 500);
          } else {
            // Check approve duplicate
            let checkApprove = false;

            if (
              values.vApprove1 === values.vApprove2 ||
              values.vApprove1 === values.vApprove3 ||
              values.vApprove1 === values.vApprove4
            ) {
              alert("vApprove1 Duplicate");
            } else if (
              values.vApprove2 === values.vApprove1 ||
              values.vApprove2 === values.vApprove3 ||
              values.vApprove2 === values.vApprove4
            ) {
              alert("vApprove2 Duplicate");
            } else if (values.vApprove3) {
              if (
                values.vApprove3 === values.vApprove1 ||
                values.vApprove3 === values.vApprove2 ||
                values.vApprove3 === values.vApprove4
              ) {
                alert("vApprove3 Duplicate");
              } else {
                checkApprove = true;
              }
            } else if (values.vApprove4) {
              if (values.vApprove3 === "") {
                alert("vApprove3 should be enter");
                return;
              }

              if (
                values.vApprove4 === values.vApprove1 ||
                values.vApprove4 === values.vApprove2 ||
                values.vApprove4 === values.vApprove3
              ) {
                alert("vApprove4 Duplicate");
              } else {
                checkApprove = true;
              }
            } else {
              checkApprove = true;
            }

            if (checkApprove) {
              dispatch(prheadActions.updatePRHead(formData, props.history));
              checkApprove = false;
            }
          }
        }}
      >
        {(props) => showForm(props)}
      </Formik>

      {/* Plan PR Table */}
      <MaterialTable
        id="root_pr"
        title={`Plan MPR Stock & Non Stock : ${prhead.vStatus}`}
        columns={columns}
        data={prdetailReducer.result ? prdetailReducer.result : []}
        components={{
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px" }}>
                <Button
                  fullWidth
                  disabled={createdisable}
                  variant="contained"
                  color="primary"
                  // component={Link}
                  // to="/stock/create"
                  startIcon={<AddCircleIcon />}
                  onClick={(event, rowData) => {
                    // let phgroup = "PH";
                    setSelectedProduct("rowData");
                    setOpenDialog(true);
                    // dispatch(itemActions.getItems(prhead.vWarehouse));
                    // dispatch(phgroupActions.getPHGroups(phgroup));
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          ),
        }}
        options={{
          exportButton: true,
          // toolbar: false,
          paging: false,
          headerStyle: {
            textAlign: "center",
            borderLeft: 1,
            borderRight: 1,
            borderBottom: 1,
            borderTop: 1,
            borderColor: "#E0E0E0",
            borderStyle: "solid",
            paddingLeft: "6px",
            paddingRight: "6px",
            paddingBottom: "12px",
            paddingTop: "12px",
            // backgroundColor: "red",
            // padding: "5px",
            // whiteSpace: "normal",
            // wordWrap: "break-word",
            // wordBreak: "break-all"
          },
          cellStyle: {
            textAlign: "center",
            borderLeft: 1,
            borderRight: 1,
            borderBottom: 1,
            borderTop: 1,
            borderColor: "#E0E0E0",
            borderStyle: "solid",
          },
          // rowStyle: rowData => ({
          //   // backgroundColor:
          //   //   selectedRow && selectedRow.tableData.id === rowData.tableData.id
          //   //     ? "#EEE"
          //   //     : "#FFF"
          // }),
          fixedColumns: {
            // left: 2
          },
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow === rowData.tableData.id ? "#e0f5fd" : "#FFF",
          }),
        }}
        localization={
          {
            // body: {
            //   emptyDataSourceMessage: getMessage('label.no.records.to.display'),
            //   dateTimePickerLocalization: resolvedLocaleMap,
            //   muiDatePickerProps: {
            //     okLabel: getMessage('label.ok'),
            //     cancelLabel: getMessage('label.cancel'),
            //     clearLabel: getMessage('label.clear'),
            //   },
            // },
          }
        }
        // onRowClick={(evt, selectedRow) => {
        //   setSelectedRow(selectedRow.tableData.id);
        // }}
        onRowClick={{}}
        editable={{
          // onRowAdd: (newData) =>
          //   new Promise((resolve, reject) => {
          //     setTimeout(() => {
          //       setData([...data, newData]);

          //       resolve();
          //     }, 1000);
          //   }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              console.log("newData: " + JSON.stringify(newData));
              console.log("oldData: " + JSON.stringify(oldData));

              setTimeout(() => {
                // const dataUpdate = [...data];
                // const index = oldData.tableData.id;
                // dataUpdate[index] = newData;
                // setData([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          // onRowDelete: (oldData) =>
          //   new Promise((resolve, reject) => {
          //     setTimeout(() => {
          //       const dataDelete = [...data];
          //       const index = oldData.tableData.id;
          //       dataDelete.splice(index, 1);
          //       setData([...dataDelete]);

          //       resolve();
          //     }, 1000);
          //   }),

          // onRowDelete: (oldData) =>
          //   new Promise((resolve, reject) => {
          //     // console.log("onRowDelete: " + JSON.stringify(oldData));
          //     let data = [oldData];
          //     data.map((item) => {
          //       dispatch(
          //         prdetailActions.deletePRDetail(item.PR_IBPLPN, item.PR_IBPLPS)
          //       );
          //     });

          //     setTimeout(() => {
          //       {
          //         setItemPRDetail({ ...initialStateItemPRDetail });
          //         dispatch(prdetailActions.getPRDetails(prhead.vPRNumber));
          //       }
          //       resolve();
          //     }, 500);
          //   }),
        }}
        actions={
          [
            // (rowData) => ({
            //   icon: "edit",
            //   tooltip: "Edit row",
            //   iconProps: { color: "secondary" },
            //   onClick: (event, rowData) => {
            //     // console.log("rowData: " + JSON.stringify([rowData]));
            //     let data = [rowData];
            //     let phgroup = "PH";
            //     data.map((item) => {
            //       dispatch(itemunitActions.getItemUnits(item.PR_IBITNO));
            //       dispatch(phbuyerActions.getPHBuyers(phgroup, item.PR_IBMODL));
            //     });
            //     setTimeout(() => {
            //       data.map((item) => {
            //         if (item.PR_IBITNO.substr(0, 2) === "OH") {
            //           setEditNameDisable(false);
            //         } else {
            //           setEditNameDisable(true);
            //         }
            //         setItemPRDetail({
            //           ...itemprdetail,
            //           vItemLine: item.PR_IBPLPS,
            //           // vItemNo: { MMITNO: item.PR_IBITNO },
            //           vItemNo: item.PR_IBITNO,
            //           vItemDesc1: item.PR_IBPITT,
            //           vItemDesc2: { ITEM: item.ITEM },
            //           vQty: item.PR_IBORQA,
            //           vUnit: item.PR_IBPUUN,
            //           vDateDetail: item.PR_IBDWDT,
            //           // vSupplierNo: { IDSUNO: item.PR_IBSUNO },
            //           vSupplierNo: item.PR_IBSUNO,
            //           vSupplierName: item.SASUNM,
            //           vSupplierDesc: { SUPPLIER: item.SUPPLIER },
            //           vPrice: item.PR_IBPUPR,
            //           vVat: item.PR_IBVTCD,
            //           vCurrency: item.PR_IBCUCD,
            //           vOrdertype: item.PR_IBORTY,
            //           vTotal: (item.PR_IBORQA * item.PR_IBPUPR).toFixed(4),
            //           vCostcenterDetail: item.PR_IBCOCE,
            //           vPHGroupDetail: item.PR_IBMODL,
            //           vBuyerDetail: item.PR_IBBUYE,
            //           vRemarkDetail: item.PR_REM3,
            //         });
            //       });
            //     }, 500);
            //     setSelectedProduct("rowData");
            //     setOpenDialog(true);
            //   },
            // }),
            // (rowData) => ({
            //   icon: "library_add",
            //   tooltip: "Copy",
            //   iconProps: { color: "primary" },
            //   onClick: (event, rowData) => {
            //     console.log("rowData: " + JSON.stringify([rowData]));
            //     let data = [rowData];
            //     let phgroup = "PH";
            //     data.map((item) => {
            //       dispatch(itemunitActions.getItemUnits(item.PR_IBITNO));
            //       dispatch(phbuyerActions.getPHBuyers(phgroup, item.PR_IBMODL));
            //     });
            //     setTimeout(() => {
            //       data.map((item) => {
            //         setItemPRDetail({
            //           ...itemprdetail,
            //           vItemLine: item.PR_IBPLPS,
            //           // vItemNo: { MMITNO: item.PR_IBITNO },
            //           vItemNo: item.PR_IBITNO,
            //           vItemDesc1: item.PR_IBPITT,
            //           vItemDesc2: { ITEM: item.ITEM },
            //           vQty: item.PR_IBORQA,
            //           vUnit: item.PR_IBPUUN,
            //           vDateDetail: item.PR_IBDWDT,
            //           // vSupplierNo: { IDSUNO: item.PR_IBSUNO },
            //           vSupplierNo: item.PR_IBSUNO,
            //           vSupplierName: item.SASUNM,
            //           vSupplierDesc: { SUPPLIER: item.SUPPLIER },
            //           vPrice: item.PR_IBPUPR,
            //           vVat: item.PR_IBVTCD,
            //           vCurrency: item.PR_IBCUCD,
            //           vOrdertype: item.PR_IBORTY,
            //           vTotal: (item.PR_IBORQA * item.PR_IBPUPR).toFixed(4),
            //           vCostcenterDetail: item.PR_IBCOCE,
            //           vPHGroupDetail: item.PR_IBMODL,
            //           vBuyerDetail: item.PR_IBBUYE,
            //           vRemarkDetail: item.PR_REM3,
            //         });
            //       });
            //     }, 500);
            //     setSelectedProduct("rowData");
            //     setOpenDialog(true);
            //     setCopy(true);
            //   },
            // }),
          ]
        }
      />

      {/* Dialog */}
      <Formik
        initialValues={{
          vPRNumber: prhead.vPRNumber,
          vPlanUnPlan: prhead.vPlanUnPlan,
          vItemLine: "",
          vItemNo: "", //{ MMITNO: "" },
          vItemDesc1: "",
          vItemDesc2: "",
          vQty: "",
          vUnit: "",
          vDateDetail: moment(new Date()).format("YYYY-MM-DD"), //"2018-12-01"
          vSupplierNo: "",
          vSupplierName: "",
          vPrice: "",
          vVat: "",
          vCurrency: "",
          vOrdertype: "",
          vTotal: "",
          vCostcenterDetail: "",
          vPHGroupDetail: "",
          vBuyerDetail: "",
          vRemarkDetail: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          // alert(JSON.stringify(values));
          let formData = new FormData();
          formData.append("vPRNumber", prhead.vPRNumber);
          formData.append("vPlanUnPlan", "5");
          formData.append("vItemLine", itemprdetail.vItemLine);
          formData.append("vItemNo", values.vItemNo);
          formData.append("vItemDesc1", values.vItemDesc1);
          formData.append("vQty", values.vQty);
          formData.append("vUnit", values.vUnit);
          formData.append("vDateDetail", values.vDateDetail);
          formData.append("vSupplierNo", values.vSupplierNo);
          formData.append("vPrice", values.vPrice);
          formData.append("vVat", values.vVat);
          formData.append("vCurrency", values.vCurrency);
          formData.append("vOrdertype", values.vOrdertype);
          formData.append("vTotal", values.vTotal);
          formData.append("vCostcenterDetail", values.vCostcenterDetail);
          formData.append("vPHGroupDetail", values.vPHGroupDetail);
          formData.append("vBuyerDetail", values.vBuyerDetail);
          formData.append("vRemarkDetail", values.vRemarkDetail);
          formData.append("vAddFreeItem", "");
          formData.append("vConfirm", "0");
          formData.append("vStatus", "10");

          if (create || copy) {
            // console.log("create");
            dispatch(prdetailActions.addPRDetail(formData, props.history));
            setTimeout(() => {
              setItemPRDetail({ ...initialStateItemPRDetail });
              dispatch(prdetailActions.getPRDetails(prhead.vPRNumber));
              setOpenDialog(false);
              setCreate(false);
              setCopy(false);
            }, 1000);
          } else if (update) {
            // console.log("update");
            dispatch(prdetailActions.updatePRDetail(formData, props.history));
            setTimeout(() => {
              setItemPRDetail({ ...initialStateItemPRDetail });
              dispatch(prdetailActions.getPRDetails(prhead.vPRNumber));
              setOpenDialog(false);
              setUpdate(false);
            }, 1000);
          } else {
            // console.log("confirm");
            dispatch(prdetailActions.updatePRDetail(formData, props.history));
            setTimeout(() => {
              setItemPRDetail({ ...initialStateItemPRDetail });
              dispatch(prdetailActions.getPRDetails(prhead.vPRNumber));
              setOpenDialog(false);
              setConfirm(false);
            }, 1000);
          }
        }}
      >
        {(props) => showDialog(props)}
      </Formik>
    </div>
  );
};