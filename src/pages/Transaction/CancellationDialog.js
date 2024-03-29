import React, { useState, Fragment } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios'
import { useAuth } from 'base-shell/lib/providers/Auth'
import { ToastEmitter } from '../../components/Toast';
import Autocomplete from '@material-ui/lab/Autocomplete';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//   },
//   formControl: {
//     margin: theme.spacing(3),
//   },
// }));

const REASONS = [
  {
    name: '',
    value: ''
  },
  {
    name: 'Item/s not ready.',
    value: 'Item/s not ready.',
  },
  {
    name: 'Item/s out of stock.',
    value: 'Item/s out of stock.',
  },
  {
    name: 'Out of town or not around.',
    value: 'Out of town or not around.',
  },
  {
    name: 'Entered wrong pick-up address.',
    value: 'Entered wrong pick-up address.',
  },
  {
    name: 'Buyer requested to cancel transaction.',
    value: 'Buyer requested to cancel transaction.',
  },
  {
    name: 'Buyer provided incorrect details.',
    value: 'Buyer provided incorrect details.',
  },
  {
    name: 'Incorrect Cash-on-Delivery (COD) amount.',
    value: 'Incorrect Cash-on-Delivery (COD) amount.',
  }
]

const CancellationDialog = (props) => {
  const auth = useAuth()
  const [reason, setReason] = useState({
    name: 'Item/s not ready.',
    value: 'Item/s not ready.'
  })

  // const classes = useStyles();
  const { isOpen, transaction, handleClose } = props
  const [isDialogOpen, setDialogOpen] = useState(isOpen !== undefined ? isOpen : false)

  const handleDialogState = (isOpen) => {
    setDialogOpen((isOpen === true) ? false : !isDialogOpen)
  }

  const handleDialogClose = () => {
    handleDialogState(true)
    handleClose('cancellation')
  }

  const cancelTransaction = () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth.auth.token}`,
    }
    
    axios.put(process.env.REACT_APP_WEB_API + '/deliveries/' + transaction['id'].toString(), {
      cancellation_reason: reason.value,
      for_cancellation: 'T'
    }, {
      headers: headers
    })
    .then(function (response) {
      if (_.isEmpty(response.data.errors) === false) {
        ToastEmitter('error', 'Failed to cancel the transaction!')
      } else {
        ToastEmitter('success', 'Transaction cancelled!')
      }
      handleDialogClose()
    })
    .catch(function (error) {
      if (error.response.status === 401) {
        ToastEmitter('error', 'Session expired, please re-login!')
        setTimeout(function(){
          auth.setAuth({ isAuthenticated: false })
        }, 1500);
      } else {
        ToastEmitter('error', 'Something wrong, please refresh the page!')
      }
    })
  }

  return (
    <Fragment>
      <Dialog open={isDialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle>Transaction</DialogTitle>

        <DialogContent>
        <Autocomplete
             options={REASONS}
             getOptionLabel={(option) => option.name}
             getOptionSelected={(option, value) => option.name === value.name}
             clearOnEscape
             name={'reasons'}
             value={reason}
             onChange={(event, newValue) => {
              setReason(newValue)
             }}
            renderInput={(params) => <TextField 
                  {...params} 
                  label="Canncellation Reason"
                  margin="normal"
                />}
           />    
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
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
  handleClose: PropTypes.func
}

export default CancellationDialog;
