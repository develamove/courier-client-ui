import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import Alert from '@material-ui/lab/Alert';
import AddressDialog from './AddressDialog';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import PackageDialog from './PackageDialog';
import Page from 'material-ui-shell/lib/containers/Page'
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { DeliveryValidator } from './validator.js';
import { Helmet } from 'react-helmet'
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from 'base-shell/lib/providers/Auth'
import { useConfirm } from 'material-ui-confirm';
import { ToastEmitter } from '../../components/Toast';
import { SHIPPING_FEES } from '../../utils/data';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return ['Set Sender Info', 'Set Recipient Info', 'Set Package Details', 'Review Details'];
}

const defaultDelivery = {
  item_type: 'S',
  item_amount: 0,
  total_amount: 0,
  service_fees_payor: '',
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

const HomePage = () => {
  const confirm = useConfirm();
  const auth = useAuth()
  const [errors, setErrors] = useState({})
  const [delivery, setDelivery] = useState(defaultDelivery)
  const [cachedSenderLocations, setCachedSenderLocations] = useState({
    cities: {
      cached: {},
      selected: [],
    },
    districts: {
      cached: {},
      selected: [],
    }
  })
  const [cachedRecipientLocations, setCachedRecipientLocations] = useState({
    cities: {
      cached: {},
      selected: [],
    },
    districts: {
      cached: {},
      selected: [],
    }
  })
  const classes = useStyles();
  const [activeStep, setActiveStep] =useState(0);
  const steps = getSteps();

  const handleNext = (data) => {
    
    if (activeStep === 0) {
      let isValid = DeliveryValidator.validateAddress('sender', delivery.sender)
      if (isValid === false) {
        return
      }
    } else if (activeStep === 1) {
      let isValid = DeliveryValidator.validateAddress('recipient', delivery.recipient)
      if (isValid === false) {
        return
      }
    } else if (activeStep === 2) {
      let isValid = DeliveryValidator.validatePackage(delivery.package)
      if (isValid === false) {
        return
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fragment>
            <AddressDialog
              defaults={delivery.sender}
              cachedLocations={cachedSenderLocations}
              btnText={'Set Sender'}
              type={'sender'}
              getInfo={(data) => {
                handleDeliveryState('sender', data.info)
                setCachedSenderLocations(data.cachedLocations)
              }}
            />
             <ul>
              <li>Sender Name: {delivery.sender.full_name}</li>
              <li>Mobile No: {delivery.sender.cellphone_no !== '' ? '+63' + delivery.sender.cellphone_no : ''}</li>
              <li>Address: {delivery.sender.street}, {delivery.sender.district_name}, {delivery.sender.city_name}, {delivery.sender.province_name}, {delivery.sender.district.postal_code}</li>
            </ul>
          </Fragment>
        );
      case 1:
        return (
          <Fragment>
            <AddressDialog
              defaults={delivery.recipient}
              btnText={'Set Recipient'}
              cachedLocations={cachedRecipientLocations}
              type={'recipient'}
              getInfo={(data) => {
                handleDeliveryState('recipient', data.info)
                setCachedRecipientLocations(data.cachedLocations)
              }}
            />
            <ul>
              <li>Recipient Name: {delivery.recipient.full_name}</li>
              <li>Mobile No: {delivery.recipient.cellphone_no !== '' ? '+63' + delivery.recipient.cellphone_no : ''}</li>
              <li>Address: {delivery.recipient.street}, {delivery.recipient.district_name}, {delivery.recipient.city_name}, {delivery.recipient.province_name}, {delivery.recipient.district.postal_code}</li>
            </ul>
          </Fragment>
        );
      case 2:
        return (
          <Fragment>
            <PackageDialog
              defaults={delivery.package}
              recipient={delivery.recipient}
              getPackageInfo={handlePackageInfo}
            />
          </Fragment>
        );
      case 3:
        return (
          <Fragment>
            <h1>Summary</h1>
            
            <ul>
              <li>
                Sender Details
                <ul>
                  <li>Name: {delivery.sender.full_name}</li>
                  <li>Mobile No: {delivery.sender.cellphone_no !== '' ? '+63' + delivery.sender.cellphone_no : ''}</li>
                  <li>Address: {delivery.sender.street}, {delivery.sender.district_name}, {delivery.sender.city_name}, {delivery.sender.province_name}, {delivery.sender.district.postal_code}</li>
                </ul>

              </li>
              <li>
                Recipient Details
                <ul>
                  <li>Name: {delivery.recipient.full_name}</li>
                  <li>Mobile No: {delivery.recipient.cellphone_no !== '' ? '+63' + delivery.recipient.cellphone_no : ''}</li>
                  <li>Address: {delivery.recipient.street}, {delivery.recipient.district_name}, {delivery.recipient.city_name}, {delivery.recipient.province_name}, {delivery.recipient.district.postal_code}</li>
                </ul>
              </li>
              <li>
                Package Details
                <ul>
                  <li>Description: {delivery.package.item_name}</li>
                  <li>Amount: &#8369; {delivery.package.item_value}</li>
                  <li>Shipping Fee: {computeShippingRate()}</li>
                  {/* <li>Insurance Fee: &#8369; 0</li> */}
                  <li>Payment Method: {delivery.package.payment_method === 'regular' ? 'Regular Transaction' : 'Cash on Delivery' }</li>
                  <li>Shipping Fee payor: {_.capitalize(delivery.service_fees_payor)}</li>
                </ul>
              </li>
              </ul>
            <FormControl component="fieldset">
              <FormLabel component="legend">Shipping Fee will be charge by:</FormLabel>
              <RadioGroup aria-label="service_fees_payor" name="service_fees_payor" value={delivery.service_fees_payor} onChange={(event) => {
                handleDeliveryState('service_fees_payor', event.target.value)
              }}>
                <FormControlLabel value="sender" control={<Radio />} label="Sender" />
                <FormControlLabel value="recipient" control={<Radio />} label="Recipient" />
              </RadioGroup>
            </FormControl>
          </Fragment>
        );
      default:
        return 'Unknown step';
    }
  }

  const requestDelivery = async () => {
    let deliveryInfo = {
       item_type: delivery.package.package.item_type,
       item_description: delivery.package.item_name,
       item_value: (_.isEmpty(delivery.package.item_value) === true ? 0 : parseInt(delivery.package.item_value, 10)),
       payment_method: delivery.package.payment_method,
       service_fees_payor: delivery.service_fees_payor,
       sender: {
          full_name: delivery.sender.full_name,
          cellphone_no: '0' + delivery.sender.cellphone_no,
          email: '',
          province: delivery.sender.province_name,
          city: delivery.sender.city_name,
          district: delivery.sender.district_name,
          street: delivery.sender.street,
          postal_code: delivery.sender.district.postal_code,
          landmarks: delivery.sender.landmarks,
          province_id: delivery.sender.province.id,
          city_id: delivery.sender.city.id,
          district_id: delivery.sender.district.id
        },
        recipient: {
          full_name: delivery.recipient.full_name,
          cellphone_no: '0' + delivery.recipient.cellphone_no,
          email: '',
          province: delivery.recipient.province_name,
          city: delivery.recipient.city_name,
          district: delivery.recipient.district_name,
          street: delivery.recipient.street,
          postal_code: delivery.recipient.district.postal_code,
          landmarks: delivery.recipient.landmarks,
          province_id: delivery.recipient.province.id,
          city_id: delivery.recipient.city.id,
          district_id: delivery.recipient.district.id
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth.auth.token}`,
    }

    axios.post(process.env.REACT_APP_WEB_API + '/deliveries', deliveryInfo, {
      headers: headers
    })
    .then(function (response) {
      if (_.isEmpty(response.data.errors) === false) {
        ToastEmitter('error', 'Failed to create transaction!')
        setErrors(response.data.errors)
      } else {
        setErrors({})
        setDelivery(defaultDelivery)
        ToastEmitter('success', 'Succesfully created!')
      }
    })
    .catch(function (error) {
      if (error.response.status === 401) {
        ToastEmitter('error', 'Session expired, please re-login!')
        setTimeout(function(){
          auth.setAuth({ isAuthenticated: false })
        }, 1500);
      } else {
        ToastEmitter('error', 'Please refresh the page!')
      }
    })
  }

  const computeShippingRate = () => {
    let provinceArea = delivery.recipient.province.area
    let item_type = delivery.package.package.item_type
    let shippingFee = 0

    if (SHIPPING_FEES[item_type][provinceArea]['fee'] !== undefined) {
      shippingFee = SHIPPING_FEES[item_type][provinceArea]['fee']
    }
   
    return shippingFee
  }

  const handleDeliveryState = (key, value) => {
    setDelivery({
      ...delivery,
      [key]: value
    })
  }

  const handlePackageInfo = (packageInfo) => {
    setDelivery({
      ...delivery,
      package: packageInfo
    })
  }

  const handleFinish = () => {
    if (_.isEmpty(delivery.service_fees_payor) === true) {
      ToastEmitter('error', 'Please select shipping Fee payor!')
      return
    }

    confirm({ 
      title: 'Booking confirmation',
      description: 'Make sure the details you entered are correct. Do you want to proceed?', 
      confirmationText: 'Proceed'
    })
      .then(() => { 
        requestDelivery()
      })
      .catch(() => { /* ... */ });
  }

  return (
    <Page pageTitle={'New Booking'}>
      <Helmet>
        <title>{ 'E-Lamove | New Booking' }</title>
      </Helmet>
      <Scrollbar
        style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}
      >
        <h1>{''}</h1>

        { _.isEmpty(errors) === false &&
          Object.keys(errors).map((error, index) => {
              if (typeof errors[error][0] === 'string') {
                return (
                  <Alert key={index} severity="error">{error}: {errors[error][0]}</Alert>
                )
              }
              return (
                <Alert key={index} severity="error">{error}
                <ul>
                { Object.keys(errors[error][0]).map((error1, index) => {
                    return (
                      <li key={index}>{error1}:  {errors[error][0][error1][0]}</li>
                    )
                   })
                }
                </ul>
                </Alert>
              )
            })
        }
    
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Fragment>{getStepContent(index)}</Fragment>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    // disabled
                    variant="contained"
                    color="primary"
                    onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
      </Scrollbar>
    </Page>
  )
}

export default HomePage
