import React, { useState, Fragment } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
// import _ from 'lodash';
// import axios from 'axios'
// import { Validator } from '../../utils/customValidator';
// import { makeStyles } from '@material-ui/core/styles';
// import FormLabel from '@material-ui/core/FormLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import { useConfirm } from 'material-ui-confirm';
// import { ToastEmitter } from '../../components/Toast';
// import { useAuth } from 'base-shell/lib/providers/Auth'

/**
 * For the following object keys (province, city, district) 
 * suffix _name is use for validation while the keys without suffix is the variable key for its real value
 */
const defaultInfo = {
  comments: '',
  created_timestamp: '',
  is_already_pick_up: 'F',
  is_cancelled: 'F',
  is_cod: '',
  is_delivered: 'F',
  is_for_pick_up: 'F',
  is_in_transit: 'F',
  is_provincial: 'F',
  is_remitted: 'F',
  is_successful: 'F',
  item_amount: 0,
  item_name: '',
  item_type: '',
  item_weight: 1,
  receipt_id: '',
  set_timestamp: null,
  set_user: null,
  total_amount: 0,
  tracking_id: '',

}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//   },
//   formControl: {
//     margin: theme.spacing(3),
//   },
// }));

const CancellationDialog = (props) => {
  // const auth = useAuth()
  const [cancellationComments, setCancellationComments] = useState('')

  // const classes = useStyles();
  const { isOpen, getInfo, transaction } = props
  const [isDialogOpen, setDialogOpen] = useState(isOpen !== undefined ? isOpen : false)
  const [info, setInfo] = useState(transaction || defaultInfo)
  // const [cachedInfo,] = useState(transaction || defaultInfo)
  
  // const [, setErrors] = useState({})
  // const confirm = useConfirm();

  // const handleInfoChange = (event) => {
  //   let value = event.target.value

  //   // All keys with prefix is_ are filtered here, values are 
  //   if (event.target.name.startsWith('is_') === true) {
  //     value = (info[event.target.name] === 'T') ? 'F' : 'T'
  //   }

  //   setInfo({ 
  //     ...info, 
  //     [event.target.name]: value
  //   })
  // }

  // const handleCellPhoneChange = (value) => {
  //   const cpRegex = /^[0-9\b]+$/;

  //   if (value === '' || cpRegex.test(value)) {
  //     return value.slice(0, 10)
  //   }

  //   return info.cellphone_no
  // }

  const handleDialogState = (isOpen) => {
    setDialogOpen((isOpen === true) ? false : !isDialogOpen)
  }

  const handleDialogClose = () => {
    handleDialogState(true)
  }

  const manageInfo = (isClearInfo) => {
    handleDialogClose()
    if (isClearInfo === true) {
      setInfo(defaultInfo)
    } else {
      getInfo(info)
    }
  }

  const cancelTransaction = () => {
    console.log('cancel')
    // axios.post(process.env.REACT_APP_WEB_API + '/deliveries', deliveryInfo, {
    //   headers: headers
    // })
    // .then(function (response) {
    //   if (_.isEmpty(response.data.errors) === false) {
    //     ToastEmitter('error', 'Failed to create transaction!')
    //     setErrors(response.data.errors)
    //   } else {
    //     setErrors({})
    //     setDelivery(defaultDelivery)
    //     ToastEmitter('success', 'Succesfully created!')
    //   }
      
    // })
    // .catch(function (error) {
    //   if (error.response.status === 401) {
    //     ToastEmitter('error', 'Session expired, please re-login!')
    //     setTimeout(function(){
    //       auth.setAuth({ isAuthenticated: false })
    //     }, 1500);
    //   } else {
    //     ToastEmitter('error', 'Something wrong, please refresh the page!')
    //   }
    // })
  }


  return (
    <Fragment>
      <Dialog open={isDialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle>Transactions Details</DialogTitle>

        <DialogContent>

          <TextField
            margin="dense"
            label={'Comment'}
            type="text"
            name={"cancellation_comments"}
            value={cancellationComments}
            onChange={(event) => {
              setCancellationComments(event.target.value)
            }}
            rows={5}
            fullWidth
            multiline
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { manageInfo(true) }} color="primary">
            Exit
          </Button>
          <Button 
            onClick={cancelTransaction}
            color="primary">
            Cancel Transaction
          </Button>
        </DialogActions>
        </Dialog>     
    </Fragment>   
  );
}

CancellationDialog.defaultProps = {
  btnText: 'Set Info'
}

CancellationDialog.propTypes = {
  btnText: PropTypes.string,
  transaction: PropTypes.object,
  isOpen: PropTypes.bool,
}

export default CancellationDialog;
