import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import React, { useState, Fragment } from 'react'

const transanctionInfo = {
  item_type: 'S',
  item_amount: 0,
  total_amount: 0,
  service_fees_payor: 'sender',
  package: {
    item_name: '',
    item_description: '',
    item_value: 0,
    payment_method: 'regular',
    package: {
      name: 'Small',
      item_type: 'S',
      item_code: 'S',
      rate: 60,
      weight: 'Max weight: 3 kg',
      size: '23.7cm x 39.8cm',
      description: ''
    }
  },
  sender: {
    full_name: '',
    province_name: '',
    province: {
      name: ''
    },
    city_name: '',
    city: {
      name: ''
    },
    district_name: '',
    district: {
      area: 'metro_manila',
      name: '',
      postal_code: ''
    },
    cellphone_no: '',
    street: '',
    landmarks: ''
  },
  recipient: {
    full_name: '',
    province_name: '',
    province: {
      area: 'metro_manila',
      name: ''
    },
    city_name: '',
    city: {
      name: ''
    },
    district_name: '',
    district: {
      name: '',
      postal_code: ''
    },
    cellphone_no: '',
    street: '',
    landmarks: ''
  }
}

const InfoDialog = (props) => {
  const { isOpen, transaction, handleClose } = props
  const [transactionInfo] = useState(transaction !== undefined ? transaction : transanctionInfo)
  const [isDialogOpen, setDialogOpen] = useState(isOpen !== undefined ? isOpen : false)

  const handleDialogState = (isOpen) => {
    setDialogOpen((isOpen === true) ? false : !isDialogOpen)
  }

  const handleDialogClose = () => {
    handleDialogState(true)
    handleClose('info')
  }

  const transformItemType = (itemType) => {
    const itemTypes = {
      'S': 'Small',
      'M': 'Medium',
      'L': 'Large',
      'B': 'Box'
    }

    return itemTypes[itemType]
  }

  return (
    <Fragment>
      <Dialog open={isDialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle>Transaction Details</DialogTitle>

        <DialogContent>
          <Typography variant="h6" gutterBottom>
            General Info
          </Typography>
            <p>
              Tracking No.: {transactionInfo.tracking_number} <br />
              Receipt ID: {transactionInfo.receipt_id === '' ? 'N/A' : transactionInfo.receipt_id} <br />
              Created: {transactionInfo.created_timestamp} <br />
            </p>
            <Typography variant="h6" gutterBottom>
              Package Info
            </Typography>
            <p>
              Name.: {transactionInfo.item_description} <br />
              Value: {transactionInfo.item_value}  <br />
              Type: {transformItemType(transactionInfo.item_type)}  <br />
            </p>
            <Typography variant="h6" gutterBottom>
              Sender Info
            </Typography>
            <p>
              Name: {transactionInfo.sender.full_name} <br />
              Address: {transactionInfo.sender.province}, {transactionInfo.sender.city} {transactionInfo.sender.district}, {transactionInfo.sender.street}, 
              {transactionInfo.sender.landmarks !==  '' ? transactionInfo.recipsenderient.landmarks + ',' : ''}{transactionInfo.sender.postal_code}<br />
              Contact No.: {transactionInfo.sender.cellphone_no}  <br />
            </p>
            <Typography variant="h6" gutterBottom>
              Recipient Info
            </Typography>
            <p>
              Name: {transactionInfo.recipient.full_name} <br />
              Address: {transactionInfo.recipient.province}, {transactionInfo.recipient.city} {transactionInfo.recipient.district}, {transactionInfo.recipient.street}, 
              {transactionInfo.recipient.landmarks !==  '' ? transactionInfo.recipient.landmarks + ',' : ''} {transactionInfo.recipient.postal_code}<br />
              Contact No.: {transactionInfo.recipient.cellphone_no}  <br />
            </p>
            <Typography variant="h6" gutterBottom>
              Fees
            </Typography>
            <p>
              Shipping Fee: {transactionInfo.shipping_fee} <br />
              Shouldered by: {transactionInfo.service_fees_payor} <br />
            </p>
            <Typography variant="h6" gutterBottom>
              Other Info
            </Typography>
            <p>
              Cancellation Reason: {transactionInfo.cancellation_reason === '' || transactionInfo.cancellation_reason === null  ?  'N/A' : transactionInfo.cancellation_reason } <br />
            </p>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDialogClose}
            color="primary">
            Close
          </Button>
        </DialogActions>
        </Dialog>     
    </Fragment>   
  );
}

InfoDialog.defaultProps = {
  btnText: 'Set Info'
}

InfoDialog.propTypes = {
  btnText: PropTypes.string,
  transaction: PropTypes.object,
  isOpen: PropTypes.bool,
}

export default InfoDialog;
