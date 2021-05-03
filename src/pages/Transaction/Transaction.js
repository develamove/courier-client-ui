import React, { forwardRef, useState } from 'react'
import Container from '@material-ui/core/Container';
import Page from 'material-ui-shell/lib/containers/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import { useIntl } from 'react-intl'
import MaterialTable from 'material-table'
import { Helmet } from 'react-helmet'
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import GetAppIcon from '@material-ui/icons/GetApp';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import { ToastEmitter } from '../../components/Toast';
import TransactionDialog from './TransactionDialog';
import { useConfirm } from 'material-ui-confirm';
import 'react-toastify/dist/ReactToastify.css';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} color='action' />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    GetAppIcon: forwardRef((props, ref) => <GetAppIcon {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

const Transaction = () => {
  const intl = useIntl()
  const confirm = useConfirm();
  // const [trasanctions, setTrasanctions] = useState([])
  const [isTransDialogOpen, setTransDialogOpen] = useState(false)

  const [selectedTransaction, setSelectedTransaction] = useState()


  const displayTransactionDialog = () => {
    if (isTransDialogOpen === true) {
      return <TransactionDialog isOpen={isTransDialogOpen} transaction={selectedTransaction}/>
    }

    return null
  }

  const requestCancelTransaction = (trasanction) => {
    axios.put(process.env.REACT_APP_WEB_API + '/deliveries/' + trasanction['id'].toString(), {
      is_cancelled: 'T'
    })
    .then(function (response) {
      console.log(response)
      ToastEmitter('success', 'Transaction are now cancelled')
    })
    .catch(function (error) {
      ToastEmitter('error', 'Something went wrong')
    })
  }

  const deleteTransaction = (trasanction) => {
    confirm({ description: 'Cancel Transaction?, this action is permanent' })
      .then(() => {
        requestCancelTransaction({id: trasanction['id']})
      })
      .catch(() => { /* ... */ });
  }

  const downloadReceipt = (transaction) => {
    ToastEmitter('info', 'Downloading the transaction receipt!')
    window.open(process.env.REACT_APP_WEB_API + '/deliveries/' + transaction['id'].toString() + '/receipts')
  }

  const renderStatus = (transaction) => {    
    let status = transaction.status.replace('_', ' ')

    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <Page pageTitle={intl.formatMessage({ id: 'transaction' })}>
       <Helmet>
        <title>{ 'E-lamove | Trasanction' }</title>
      </Helmet>
      <Scrollbar>
        {displayTransactionDialog()}
        <Container>
        <h1>{''}</h1>
        <MaterialTable
          icons={tableIcons}
          title={'List of Transactions'}
          options={{
            search: false,
            sorting: false
          }}
          columns={[
            { title: 'Tracking ID', field: 'tracking_number'},
            { title: 'Receipt ID', field: 'receipt_id'},
            { title: 'Sender', field: 'sender.full_name' },
            { title: 'Item Description', field: 'item_description' },
            { title: 'Item Value', field: 'item_value' },
            { title: 'Total', field: 'total' },
            { title: 'Status', field: 'status', render: renderStatus},
          ]}
          data={query =>
            new Promise((resolve, reject) => {
              let url = process.env.REACT_APP_WEB_API + '/deliveries?'
              url += 'limit=' + query.pageSize
              url += '&page=' + (query.page + 1)
              fetch(url)
                .then(response => response.json())
                .then(result => {
                  resolve({
                    data: result.data.deliveries,
                    page: result.data.page - 1,
                    totalCount: result.data.total,
                  })
                })
            })
          }
          actions={[
            {
              icon: tableIcons.Edit,
              tooltip: 'Modify Trasaction',
              onClick: (event, rowData) => {
                setSelectedTransaction(rowData)
                setTransDialogOpen(!isTransDialogOpen)
              }
            },
            {
              icon: tableIcons.Delete,
              tooltip: 'Cancel Trasaction',
              onClick: (event, rowData) => {
                deleteTransaction(rowData)
              }
            },
            {
              icon: tableIcons.GetAppIcon,
              tooltip: 'Download Receipt',
              onClick: (event, rowData) => {
                downloadReceipt(rowData)
              }
            }
          ]}
          // detailPanel={[
          //   {
          //     tooltip: 'Show Name',
          //     render: rowData => {
          //       return (
          //         <div
          //           style={{
          //             fontSize: 100,
          //             textAlign: 'center',
          //             color: 'white',
          //             backgroundColor: '#43A047',
          //           }}
          //         >
          //           {rowData.sender.full_name}
          //           {rowData.sender.province}
          //         </div>
          //       )
          //     },
          //   },
          // ]}
        />
        </Container>
        
      </Scrollbar>
        
    </Page>
  )
}

export default Transaction;