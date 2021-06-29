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
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Toolbar from '@material-ui/core/Toolbar';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { Helmet } from 'react-helmet'
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { ToastEmitter } from '../../components/Toast';


import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
    backgroundColor: '#ffffff',
    margin: '0',
    padding: '0',
    height: '100%',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    '.Mui-focused': {
    backgroundColor: '#ffffff',
    },
    '&&&:before': {
      borderBottom: 'none',
    },
    '&&:after': {
      borderBottom: 'none',
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
  },
  currentEvent: {
    padding: '15px',
    textAlign: 'center',
    borderTopRightRadius: '10px',
    borderTopLeftRadius: '10px',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  eventsContainer: {
    backgroundColor: '#e1e3ef',
    borderRadius: 0,
    padding: '0 10px',
    minHeight: '500px'
  },
  cartLogo: {
    background: '#ebcf19',
    width: '45px',
    height: '40px',
    padding: '10px',
    borderRadius: '50%',
    textAlign: 'center'
  },
  currentStatus: {
    color: '#c4c4c4'
  },
  eventDate: {
    color: '#c4c4c4',
    fontWeight: '300'
  },
  eventInfoContainer: {
    padding: '0 10px'
  },
  elementsContainer: {
    width: '50px'
  },
  verticalLine: {
    position: 'relative',
    width: '2px',
    height: '60px',
    background: '#c0c4df',
    margin: '0 auto'
  },
  circle: {
    width: '30px',
    height: '30px',
    background: '#c0c4df',
    borderRadius: '100px',
    position: 'relative',
    margin: '0 auto'
  }
}));

const LandingPage = () => {
  const classes = useStyles();
  const [transaction, setTransaction] = useState({})
  const [events, setEvents] = useState([])
  const [currentEvent, setCurrentEvent] = useState([])
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
        let transEvents = _.reverse(response.data.data.delivery.events)
        if (transEvents.length=== 1) {
          setCurrentEvent(transEvents[0])
          setEvents([])
        } else if (transEvents.length > 1) {
          let transEventsCopy = [...transEvents]
          setCurrentEvent(transEvents[0])
          transEventsCopy.shift()
          setEvents(transEventsCopy)
        }
      } else {
        setTransaction({})
        setCurrentEvent({})
        setEvents([])
        ToastEmitter('error', 'Trasanction Not found')
      }
    })
    .catch(function (error) {
      setTransaction({})
      setCurrentEvent({})
      setEvents([])
      ToastEmitter('error', 'Something went wrong')
    })
  }

  const formatDate = (datetime) => {
    return moment(datetime).format('D MMM, YYYY, h:mm:ss A');
  }

  const formatEventName = (name) => {
    let newName = name
    if (name !== undefined) {
      newName = newName.replace('_', ' ')
    }

    return _.capitalize(newName)
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
            NEW BOOKING
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
        style={{
          fontWeight: 'bold',
          color: '#505caf'
        }}
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
      <Box sx={{ maxWidth: 400 }}>
      <Paper className={classes.currentEvent}>
        <div style={{
          display: 'flex',
          textAlign: 'left'
        }}>
          <div className={classes.cartLogo}>
            <ShoppingCartIcon fontSize={'large'}/>
          </div>
          <div style={{
            padding: '5px'
          }}>
          <Typography variant="caption" className={classes.currentStatus}>
              CURRENT STATUS
            </Typography>
            <Typography variant="body1" style={{
              fontWeight: 'bold'
            }}> 
              {formatEventName(currentEvent.name)}
            </Typography>
            <Typography variant="body2" className={classes.eventDate}>
              {formatDate(currentEvent.created_timestamp)}
            </Typography>
          </div>
        </div>
      </Paper>
      <Paper className={classes.eventsContainer}>
      <div style={{
        display: 'flex'
      }}>
          <div className={classes.elementsContainer}>
            <div className={classes.verticalLine}></div>
          </div>

          <div style={{
             padding: '10px'
          }}>
            <Typography variant="h5" style={{
              color: '#505caf'
            }}>
              Timeline
            </Typography>
          </div>
      </div>
      {events.map((transEvent, index) => {
         return (
          <div 
            key={index}
            style={{
              display: 'flex'
            }}
          >
              <div className={classes.elementsContainer}>
                <div className={classes.circle}></div>
                <div className={classes.verticalLine}></div>
              </div>

              <div className={classes.eventInfoContainer}>
                <Typography variant="body1" style={{
                  fontWeight: 'bold'
                }}>
                  {formatEventName(transEvent.name)}
                </Typography>
                <Typography variant="body2" className={classes.eventDate}>
                  {formatDate(transEvent.created_timestamp)}
                </Typography>
                <Typography variant="caption" className={classes.currentStatus}>
                  {transEvent.remarks}
                </Typography>
              </div>
          </div>
         )
      })}
      <div style={{
        display: 'flex'
      }}>
          <div className={classes.elementsContainer}>
            <div className={classes.circle}></div>
          </div>
          <div className={classes.eventInfoContainer}>
            <Typography variant="body1" style={{
              fontWeight: 'bold'
            }}> 
              Order Created
            </Typography>
            <Typography variant="body2" className={classes.eventDate}>
              {formatDate(transaction.created_timestamp)}
            </Typography>
          </div>
      </div>
      </Paper>
    </Box>
        }
        
      </Grid>
    </Grid>
    </div>
  )
}
export default LandingPage
