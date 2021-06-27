import _ from 'lodash';
import { ToastEmitter } from '../../components/Toast';

export class DeliveryValidator {
    
    static validateAddress(type, address) {

        let requiredFields = [
            {
                key: 'full_name',
                value: 'name'
            },
            {
                key: 'province_name',
                value: 'province'
            },
            {
                key: 'city_name',
                value: 'city'
            },
            {
                key: 'district_name',
                value: 'district'
            },
            {
                key: 'street',
                value: 'street'
            },
            {
                key: 'cellphone_no',
                value: 'contact number'
            },
        ]

        for (const index in requiredFields) {
            if (_.isEmpty(address[requiredFields[index]['key']]) === true) {
                ToastEmitter('error', _.capitalize(type) + `'s ${requiredFields[index]['value']} is required.`)
                return false;
            }
        }
        
        return true
    }

    static validatePackage(packageInfo) {
        let requiredFields = [
            {
                key: 'item_description',
                value: 'description'
            },
        ]

        for (const index in requiredFields) {
            if (_.isEmpty(packageInfo[requiredFields[index]['key']]) === true) {
                ToastEmitter('error', _.capitalize('package') + `'s ${requiredFields[index]['value']} is required.`)
                return false;
            }
        }
    }
}
