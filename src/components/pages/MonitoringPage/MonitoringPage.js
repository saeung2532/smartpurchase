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
import * as prdetailbuyerActions from "./../../../actions/prdetailbuyer.action";
import * as monthActions from "./../../../actions/month.action";
import * as statusActions from "./../../../actions/status.action";
import * as warehouseActions from "./../../../actions/warehouse.action";
import * as departmentActions from "./../../../actions/department.action";
import * as costcenterActions from "./../../../actions/costcenter.action";
import * as approveActions from "./../../../actions/approve.action";
import * as buyerActions from "./../../../actions/buyer.action";
import * as itemActions from "./../../../actions/item.action";
import * as itemunitActions from "./../../../actions/itemunit.action";
import * as phgroupActions from "./../../../actions/phgroup.action";
import * as phbuyerActions from "./../../../actions/phbuyer.action";
import * as supplierActions from "./../../../actions/supplier.action";
import * as prconfirmbuyerActions from "./../../../actions/prconfirmbuyer.action";
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
  const warehouseReducer = useSelector(
    ({ warehouseReducer }) => warehouseReducer
  );
  const costcenterReducer = useSelector(
    ({ costcenterReducer }) => costcenterReducer
  );
  const phgroupReducer = useSelector(({ phgroupReducer }) => phgroupReducer);
  const monthReducer = useSelector(({ monthReducer }) => monthReducer);
  const statusReducer = useSelector(({ statusReducer }) => statusReducer);
  const prheadReducer = useSelector(({ prheadReducer }) => prheadReducer);
  const prdetailReducer = useSelector(({ prdetailReducer }) => prdetailReducer);

  const departmentReducer = useSelector(
    ({ departmentReducer }) => departmentReducer
  );
  const approveReducer = useSelector(({ approveReducer }) => approveReducer);
  const buyerReducer = useSelector(({ buyerReducer }) => buyerReducer);
  const itemReducer = useSelector(({ itemReducer }) => itemReducer);
  const itemunitReducer = useSelector(({ itemunitReducer }) => itemunitReducer);
  const phbuyerReducer = useSelector(({ phbuyerReducer }) => phbuyerReducer);
  const supplierReducer = useSelector(({ supplierReducer }) => supplierReducer);
  const prconfirmbuyerReducer = useSelector(
    ({ prconfirmbuyerReducer }) => prconfirmbuyerReducer
  );

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
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [whsdisable, setWhsDisable] = useState(true);
  const [deptdisable, setDeptDisable] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [prconfirmbuyer, setPRConfirmBuyer] = useState(null);

  useEffect(() => {
    dispatch(prnumberActions.getPRNumbersWithOutUser());
    dispatch(warehouseActions.getWarehouses());
    dispatch(costcenterActions.getCostCentersWithOutDepartment());
    let phgroup = "PH";
    dispatch(phgroupActions.getPHGroups(phgroup));
    dispatch(monthActions.getMonths());
    dispatch(statusActions.getStatuses());
    prheadReducer.result = null;
    prdetailReducer.result = null;
  }, []);

  useEffect(() => {
    const prheads = prheadReducer.result ? prheadReducer.result : [];
    prheads.map((item) => {
      dispatch(itemActions.getItems(item.HD_IBWHLO));
      let phgroup = "PH";
      let department = item.HD_IBCOCE;
      dispatch(phgroupActions.getPHGroups(phgroup));
      dispatch(costcenterActions.getCostCenters(department));
      setPRNumber({ ...prnumber, vPRSelectNumber: item.HD_IBPLPN });
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
    });
  }, [prheadReducer]);

  useEffect(() => {
    const prconfirmbuyers = prconfirmbuyerReducer.result
      ? prconfirmbuyerReducer.result
      : [];
    prconfirmbuyers.map((item) => {
      // console.log("PR_CONFIRM: " + item.PR_CONFIRM);
      setPRConfirmBuyer(item.PR_CONFIRM);
      if (item.PR_CONFIRM === 0) {
        // console.log("prconfirm: true");
        let statusprnumber = "10";
        dispatch(prnumberActions.getPRNumbers(statusprnumber));
        let statusprhead = "20";
        dispatch(prheadActions.updateStsPRHead(prhead.vPRNumber, statusprhead));
        prheadReducer.result = null;
        prdetailReducer.result = null;
        setPRHead({
          ...initialStatePRHead,
        });
      }
    });
  }, [prconfirmbuyerReducer]);

  const prnumberbuyers = useMemo(() =>
    prnumberReducer.result ? prnumberReducer.result : []
  );

  const warehouses = useMemo(() =>
    warehouseReducer.result ? warehouseReducer.result : []
  );

  const costcenters = useMemo(() =>
    costcenterReducer.result ? costcenterReducer.result : []
  );

  const phgroups = useMemo(() =>
    phgroupReducer.result ? phgroupReducer.result : []
  );

  const months = useMemo(() =>
    monthReducer.result ? monthReducer.result : []
  );

  const statuses = useMemo(() =>
  statusReducer.result ? statusReducer.result : []
  );

  const handleSearch = () => {
    if (prnumber.vPRSelectNumber === "") {
      setEditDisable(true);
      setCreateDisable(true);
      setPRHead({
        ...initialStatePRHead,
      });
      dispatch(prdetailbuyerActions.getPRDetails("0"));
    } else {
      setNewDisable(true);
      setEditDisable(false);
      setCreateDisable(false);
      setCancelPRDisable(false);
      let status = "10";
      dispatch(prheadActions.getPRHeads(prnumber.vPRSelectNumber, status));
      dispatch(prdetailbuyerActions.getPRDetails(prnumber.vPRSelectNumber));
    }
  };

  const handleNew = () => {
    setSearchDisable(true);
    setEditDisable(false);
    setCreateDisable(true);
    setWhsDisable(false);
    setDeptDisable(false);
    setPRHead({
      ...initialStatePRHead,
      vMonth: prhead.vDate.substr(2, 2) + prhead.vDate.substr(5, 2),
      vPlanUnPlan: "Plan",
    });
  };

  const handleCancel = () => {
    setSearchDisable(false);
    setNewDisable(false);
    setEditDisable(true);
    setCreateDisable(true);
    setCancelPRDisable(true);
    setWhsDisable(true);
    setDeptDisable(true);
    setPRNumber({ ...prnumber, vPRSelectNumber: "" });
    setPRHead({ ...initialStatePRHead });
    dispatch(prdetailbuyerActions.getPRDetails("00"));
  };

  const handleClose = () => {
    setItemPRDetail(initialStateItemPRDetail);
    setOpenDialog(false);
    setSaveDisable(false);
    setConfirmDisable(false);
  };

  const handleCancelPR = () => {
    setSearchDisable(false);
    setNewDisable(false);
    setEditDisable(true);
    setCreateDisable(true);
    setCancelPRDisable(true);
    setWhsDisable(true);
    setDeptDisable(true);
    let status = "00";
    dispatch(prheadActions.updateStsPRHead(prhead.vPRNumber, status));
    setTimeout(() => {
      setCancelPRDisable(true);
      setPRNumber({ ...prnumber, vPRSelectNumber: "" });
      setPRHead({ ...initialStatePRHead });
      dispatch(prnumberActions.getPRNumbers("00"));
      dispatch(prdetailbuyerActions.getPRDetails("00"));
      alert("Reject Complete");
    }, 500);
  };

  const handleSubmitPH = () => {
    if (prdetailReducer.result.length > 0) {
      setSearchDisable(false);
      setNewDisable(false);
      setEditDisable(true);
      setCreateDisable(true);
      setCancelPRDisable(true);
      setWhsDisable(true);
      setDeptDisable(true);
      let status = "10";
      dispatch(prheadActions.updateStsPRHead(prhead.vPRNumber, status));
      setTimeout(() => {
        setCancelPRDisable(true);
        setPRNumber({ ...prnumber, vPRSelectNumber: "" });
        setPRHead({ ...initialStatePRHead });
        dispatch(prnumberActions.getPRNumbers("00"));
        dispatch(prdetailbuyerActions.getPRDetails("00"));
        alert("Submit Complete");
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
                <Grid item xs={12} sm={1} className={classes.margin}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    variant="outlined"
                    // required
                    id="vSelectPRNumber"
                    label="PR Number"
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
                    {prnumberbuyers.map((option) => (
                      <option key={option.ID} value={option.HD_IBPLPN}>
                        {option.PRNUMBER}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={1} className={classes.margin}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    variant="outlined"
                    // required
                    id="vWarehouse"
                    label="Warehouse"
                    value={prnumber.vWarehouse}
                    onChange={(event) => {
                      // console.log(event.target.value);
                      setPRNumber({
                        ...prnumber,
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
                </Grid>
                <Grid item xs={12} sm={1} className={classes.margin}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    variant="outlined"
                    // required
                    id="vCostCenter"
                    label="Cost Center"
                    value={prnumber.vCostCenter}
                    onChange={(event) => {
                      // console.log(event.target.value);
                      setPRNumber({
                        ...prnumber,
                        vCostCenter: event.target.value,
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
                </Grid>
                <Grid item xs={12} sm={1} className={classes.margin}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    variant="outlined"
                    // required
                    id="vPHGroup"
                    label="PH Group"
                    value={prnumber.vPHGroup}
                    onChange={(event) => {
                      // console.log(event.target.value);
                      setPRNumber({
                        ...prnumber,
                        vPHGroup: event.target.value,
                      });
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
                <Grid item xs={12} sm={1} className={classes.margin}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    variant="outlined"
                    // required
                    id="vMonth"
                    label="vMonth"
                    value={prnumber.vMonth}
                    onChange={(event) => {
                      // console.log(event.target.value);
                      setPRNumber({
                        ...prnumber,
                        vMonth: event.target.value,
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option />
                    {months.map((option) => (
                      <option key={option.ID} value={option.HD_IBMTH}>
                        {option.HD_IBMTH}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={1} className={classes.margin}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    variant="outlined"
                    // required
                    id="vStatus"
                    label="Status"
                    value={prnumber.vStatus}
                    onChange={(event) => {
                      // console.log(event.target.value);
                      setPRNumber({
                        ...prnumber,
                        vStatus: event.target.value,
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option />
                    {statuses.map((option) => (
                      <option key={option.ID} value={option.HD_STATUS}>
                        {option.HD_STATUS}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs sm={1} className={classes.margin}>
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
                <Grid item xs sm={1} className={classes.margin}>
                  <Button
                    fullWidth
                    size="medium"
                    id="vCancel"
                    variant="contained"
                    color="secondary"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
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
                        vVat: values.MMVTCS,
                        vCurrency: values.MMCUCD,
                        vOrdertype: values.MBORTY,
                      });
                      dispatch(itemunitActions.getItemUnits(values.MMITNO));

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
                      id="vItemNo"
                      label="Item No"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  className={classes.margin}
                  // required
                  fullWidth
                  disabled="true"
                  margin="dense"
                  id="vItemName"
                  label="Item Name"
                  type="text"
                  value={itemprdetail.vItemDesc1}
                  values={(values.vItemDesc1 = itemprdetail.vItemDesc1)}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={5}>
                <TextField
                  required
                  fullWidth
                  // disabled="true"
                  margin="dense"
                  id="vQty"
                  label="Qty"
                  type="number"
                  value={itemprdetail.vQty}
                  values={(values.vQty = itemprdetail.vQty)}
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
                  disabled={editdisable}
                  fullWidth
                  disabled="true"
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
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={4}>
                <TextField
                  required
                  fullWidth
                  // disabled="true"
                  margin="dense"
                  id="vPrice"
                  label="Price"
                  type="number"
                  value={itemprdetail.vPrice}
                  values={(values.vPrice = itemprdetail.vPrice)}
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
              // required
              fullWidth
              // disabled="true"
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
              Cancel
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
                // dispatch(
                //   prconfirmbuyerActions.getPRConfirmBuyers(prhead.vPRNumber)
                // );
              }}
              style={{ display: "" }}
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
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBPLPS}
        </Typography>
      ),
    },
    {
      title: "Confirm",
      field: "PR_CONFIRM",
      headerStyle: { maxWidth: 80, whiteSpace: "nowrap", textAlign: "center" },
      cellStyle: {
        textAlign: "center",
        borderLeft: 1,
        borderRight: 1,
        borderBottom: 1,
        borderTop: 1,
        borderColor: "#E0E0E0",
        borderStyle: "solid",
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_CONFIRM}
        </Typography>
      ),
    },
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
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.MBSTQT}
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
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBORQA}
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
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBPUPR}
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
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBTOTA}
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
      },
      render: (item) => (
        <Typography variant="body1" noWrap>
          {item.PR_IBVTCD}
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
          formData.append("vStatus", prhead.vStatus ? prhead.vStatus : "00");

          if (newdisable === false && cancelprdisable === true) {
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
              let status = "00";
              dispatch(prnumberActions.getPRNumbers(status));
            }, 500);
          } else if (searchdisable === false) {
            dispatch(prheadActions.updatePRHead(formData, props.history));
          }
        }}
      >
        {(props) => showForm(props)}
      </Formik>

      {/* Plan PR Table */}
      {/* <p>#Debug {JSON.stringify(selectedProduct)}</p> */}
      <MaterialTable
        id="root_prstock"
        title={`Plan PR : ${prhead.vStatus}`}
        columns={columns}
        data={prdetailReducer.result ? prdetailReducer.result : []}
        options={{
          // exportButton: true,
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
        editable={{
          //Edit data in line
          // isEditable: rowData => rowData.name === "a", // only name(a) rows would be editable
          // isDeletable: rowData => rowData.name === "b", // only name(a) rows would be deletable
          // onRowAdd: newData =>
          //   new Promise((resolve, reject) => {
          //     console.log("onRowAdd");
          //     setTimeout(() => {
          //       {
          //         const data = this.state.data;
          //         data.push(newData);
          //         this.setState({ data }, () => resolve());
          //       }
          //       resolve();
          //     }, 500);
          //   }),
          // onRowUpdate: (newData, oldData) =>
          //   new Promise((resolve, reject) => {
          //     console.log("onRowUpdate: " + JSON.stringify(newData));
          //     props.history.push("/stock/edit/" + newData.product_id);
          //     setTimeout(() => {
          //       const data = [newData];
          //       data.map((item) => {
          //         // dispatch(prdetailActions.getPRDetails(item.PR_IBPLPN, "00"));
          //       });
          //       resolve();
          //     }, 500);
          //   }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              // console.log("onRowDelete: " + JSON.stringify(oldData));
              let data = [oldData];
              data.map((item) => {
                dispatch(
                  prdetailbuyerActions.deletePRDetail(
                    item.PR_IBPLPN,
                    item.PR_IBPLPS
                  )
                );
              });

              setTimeout(() => {
                {
                  setItemPRDetail({ ...initialStateItemPRDetail });
                  dispatch(prdetailbuyerActions.getPRDetails(prhead.vPRNumber));
                }
                resolve();
              }, 500);
            }),
        }}
        actions={[
          (rowData) => ({
            icon: "edit",
            tooltip: "Edit row",
            onClick: (event, rowData) => {
              // console.log("rowData: " + JSON.stringify([rowData]));

              let data = [rowData];
              let phgroup = "PH";
              data.map((item) => {
                // setItemDetail({ ...itemdetail, MMITNO: item.PR_IBITNO });
                // setItemPRDetail({
                //   ...itemprdetail,
                //   vItemNo: { MMITNO: item.PR_IBITNO },
                // });
                // dispatch(itemActions.getItems(prhead.vWarehouse));
                dispatch(itemunitActions.getItemUnits(item.PR_IBITNO));
                // dispatch(phgroupActions.getPHGroups(phgroup));
                dispatch(phbuyerActions.getPHBuyers(phgroup, item.PR_IBMODL));
              });

              setTimeout(() => {
                data.map((item) => {
                  setItemPRDetail({
                    ...itemprdetail,
                    vItemLine: item.PR_IBPLPS,
                    // vItemNo: { MMITNO: item.PR_IBITNO },
                    vItemNo: item.PR_IBITNO,
                    vItemDesc1: item.PR_IBPITT,
                    vItemDesc2: { ITEM: item.ITEM },
                    vQty: item.PR_IBORQA,
                    vUnit: item.PR_IBPUUN,
                    vDateDetail: item.PR_IBDWDT,
                    // vSupplierNo: { IDSUNO: item.PR_IBSUNO },
                    vSupplierNo: item.PR_IBSUNO,
                    vSupplierName: item.SASUNM,
                    vSupplierDesc: { SUPPLIER: item.SUPPLIER },
                    vPrice: item.PR_IBPUPR,
                    vVat: item.PR_IBVTCD,
                    vCurrency: item.PR_IBCUCD,
                    vOrdertype: item.PR_IBORTY,
                    vTotal: (item.PR_IBORQA * item.PR_IBPUPR).toFixed(4),
                    vCostcenterDetail: item.PR_IBCOCE,
                    vPHGroupDetail: item.PR_IBMODL,
                    vBuyerDetail: item.PR_IBBUYE,
                    vRemarkDetail: item.PR_REM3,
                  });
                });
              }, 500);

              setSelectedProduct("rowData");
              setOpenDialog(true);
            },
          }),
        ]}
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
          formData.append("vConfirm", confirm ? "1" : "");
          formData.append("vStatus", "10");

          if (create) {
            // console.log("create");
            dispatch(prdetailbuyerActions.addPRDetail(formData, props.history));
            setTimeout(() => {
              setItemPRDetail({ ...initialStateItemPRDetail });
              dispatch(prdetailbuyerActions.getPRDetails(prhead.vPRNumber));
              setOpenDialog(false);
            }, 500);
            setCreate(false);
          } else if (update) {
            // console.log("update");
            dispatch(
              prdetailbuyerActions.updatePRDetail(formData, props.history)
            );
            setTimeout(() => {
              setItemPRDetail({ ...initialStateItemPRDetail });
              dispatch(prdetailbuyerActions.getPRDetails(prhead.vPRNumber));
              setOpenDialog(false);
            }, 500);
            setUpdate(false);
          } else {
            // console.log("confirm");
            dispatch(
              prdetailbuyerActions.updatePRDetail(formData, props.history)
            );
            setTimeout(() => {
              setItemPRDetail({ ...initialStateItemPRDetail });
              // let status = "10";
              // dispatch(prnumberActions.getPRNumbers(status));
              dispatch(prdetailbuyerActions.getPRDetails(prhead.vPRNumber));
              dispatch(
                prconfirmbuyerActions.getPRConfirmBuyers(prhead.vPRNumber)
              );
              setOpenDialog(false);
            }, 500);
            setConfirm(false);
          }
        }}
      >
        {(props) => showDialog(props)}
      </Formik>
    </div>
  );
};
