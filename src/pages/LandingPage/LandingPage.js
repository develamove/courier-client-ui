import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from "@material-ui/icons/Search";
import Toolbar from '@material-ui/core/Toolbar';
import _ from 'lodash';
import axios from 'axios';
import { Helmet } from 'react-helmet'
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { ToastEmitter } from '../../components/Toast';


// import Box from '@material-ui/core/Box';
// import Stepper from '@material-ui/core/Stepper';
// import Step from '@material-ui/core/Step';
// import StepLabel from '@material-ui/core/StepLabel';
// import StepContent from '@material-ui/core/StepContent';
// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import LogoImg from '../../assets/img/track-delivery-graphic.svg';


// const events = [
//   {
//     label: 'label1',
//     description: 'description1'
//   },
//   {
//     label: 'label2',
//     description: 'description2'
//   },
//   {
//     label: 'label3',
//     description: 'description3'
//   }
// ]


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(3),
  },
  trackDeliveryImage: {
    backgroundImage: `url('../../assets/img/track-delivery-graphic.svg')`
  },
  inputSearchBarRoot: {
    
  },
  inputSearchBar: {
    height: '55px'
  },
  logoSearchBar: {
   
  },
  gridContainer: {
    // [theme.breakpoints.down('sm')]: {
    //   margin: 0,
    //   '& > .MuiGrid-item': {
    //     padding: 0,
    //   },
    // },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  searchBoxAdorment: {
    padding: '11px',
    // backgroundColor: 'blue',
    height: '100%',
  },
  searchMainRootAdorment: {
    margin: '0',
    padding: '0',
    height: '100%',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    '&&&:before': {
      borderBottom: 'none'
    },
    '&&:after': {
      borderBottom: 'none'
    }
  },
  searchRootAdorment: {
    background: '#3f51b5',
    margin: '0 0 0 8px',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    cursor: 'pointer'
    
  },
  checkBoxRoot: {
    color: '#e0c822',
    checked: {}
  },
  checkBox: {
    color: '#e0c822',
    checked: {}
  },
  gridContainerRight: {
    padding: '20px'
  },
  appBar: {
    backgroundColor: '#ffffff'
  },
  divHorizontal: {
    height: '5px',
    background: '#3f51b5'
  }
}));

const LandingPage = () => {
  const classes = useStyles();
  const [transaction, setTransaction] = useState({})
  const [trackingID, setTrackingID] = useState('')
  const [isChecked, setIsChecked] = useState('F')
  const [errors, setErrors] = useState({})
  const history = useHistory();
  
  const handleSearchTransaction = () => {
    if (_.isEmpty(trackingID) === true) {
      setErrors({tracking_id: ['The field is required.']})
      return
    }
    setErrors({})

    let requestParams = {
      'tracking_id': trackingID
    }

    if (isChecked === 'T') {
      requestParams = {
        'filter_key': 'receipt_id'
      }
    }
    axios.get(process.env.REACT_APP_WEB_API + '/deliveries/' + trackingID , {
      params: requestParams
    })
    .then(function (response) {
      if (_.isEmpty(response.data.data.delivery) === false) {
        setTransaction(response.data.data.delivery)
      } else {
        setTransaction({})
        ToastEmitter('error', 'Trasanction Not found')
      }
    })
    .catch(function (error) {
      ToastEmitter('error', 'Something went wrong')
    })
  }

  return (
    <div
      style={{
        backgroundColor: '#f2f3f8',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // flexDirection: 'column',
      }}
    >
      <Helmet>
        <title>{ 'E-lamove | Tracking Page' }</title>
      </Helmet>
      <AppBar 
        position="static"
        className={classes.appBar}
      >
        <div className={classes.divHorizontal}></div>
        <Toolbar>
          {/* <img 
            src={LogoImg}
            alt="Company logo"
						style="width: 100%; max-width: 200px" 
          /> */}

          <Button
            style={{
              color: '#000000'
            }}
            onClick={() => { history.push('/home'); }}
          >
            <HomeIcon />
            Create new Booking
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container 
        className={classes.root} 
        direction={'row'}
        justify="center" 
      >
      <Grid 
        item 
        classes={{
          root: classes.gridContainer,
        }}
      >
        {/* <h1>Test</h1> */}
      </Grid>
      <Grid  
        item
        classes={{
          root: classes.gridContainerRight,
        }}>
      <Typography
        component={'h2'}
        variant={'h6'}
      >
        WHERE'S MY DELIVERY?
      </Typography>  
        <TextField 
          classes={{
            root: classes.inputSearchBarRoot
          }}
          autoFocus
          label="Tracking Number"
          margin={'normal'}
          variant={'filled'}
          error={errors.hasOwnProperty('tracking_id') === true}
          helpertext={errors.hasOwnProperty('tracking_id') ? errors['tracking_id'][0] : '' }
          type={'text'}
          value={trackingID}
          onChange={(event) => {
            setTrackingID(event.currentTarget.value)
          }}
          className={classes.inputSearchBar}
          InputProps={{
            classes: {
              root: classes.searchMainRootAdorment
            },
            endAdornment: (
              <InputAdornment  
                position="end"
                classes={{
                  root: classes.searchRootAdorment
                }}
                className={classes.searchBoxAdorment}
              >
                <SearchIcon 
                  style={{
                    color: '#ffffff'
                  }}
                  aria-label="toggle password visibility"
                  onClick={handleSearchTransaction}
                  edge="end"
                />
              </InputAdornment>
            ),
          }}
        />
          <br />
           <FormControlLabel
            control={
              <Checkbox
                classes={{
                  root: classes.checkBoxRoot
                }}
                style={{
                  color: '#e0c822',
                }}
                className={classes.checkBox}
                checked={(isChecked === 'T')}
                name="isChecked"
                onClick={() => {
                  let newValues = isChecked === 'T' ? 'F' : 'T'
                  setIsChecked(newValues)
                }}
            />}
              label="Search by Receipt Number"
            />
      {_.isEmpty(transaction) === true ? 
        <Typography variant={'body1'}
        style={{
          textAlign: 'center'
        }}
        >
          No Transaction available
        </Typography> 
      :
        <div>
          <h3>Details</h3>
          <ul>
            <li>Tracking ID: {transaction.tracking_number}</li>
            <li>Receipt ID: {(transaction.receipt_id === '') ? 'N/A' : transaction.receipt_id}</li>
            <li>Total Amount: {transaction.total}</li>
            <li>Item Name: {transaction.item_description}</li>
            <li>Booked: {transaction.created_timestamp}</li>
          </ul>
          
          <h3>Events</h3>
          <ol>{
            transaction.events.map((event, index)=> {
              return (<li key={index}>Event: {event.name}, Date and Time: {event.created_timestamp}, Remarks: {event.remarks}</li>)
            })}
          </ol>
        </div>
        }
        {/* <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={0} orientation="vertical">
          {events.map((event, index) => (
            <Step key={event.label}>
              <StepLabel>
                {event.label}
              </StepLabel>
              <StepContent>
                <Typography>{event.description}</Typography>
                
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {0 === events.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All events completed - you&apos;re finished</Typography>
            <Button onClick={() => {}} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box> */}
      </Grid>
    </Grid>
    </div>
  )
}
export default LandingPage
