const HID = require('node-hid');

const devices = HID.devices();

const BARCODE_MANUFACTURER = 'BARCODE SCANNER';
const BARCODE_PRODUCT = 'USB Keyboard';

let deviceInfo = {
    'barcode' : null,
    'weight' : null
};

let barcodeDevice, weightIndicator;

console.log(devices);

try{//Barcode Device Loading
    deviceInfo.barcode = devices.filter(device => device.manufacturer == BARCODE_MANUFACTURER && device.product == BARCODE_PRODUCT)[0];

    barcodeDevice = new HID.HID(deviceInfo.barcode.path);
    console.log(barcodeDevice)
    console.log('barcode device found');
}
catch(e){
    console.log(e);
    return console.log('Cannot find barcode device');
}

try{//Weigth Indicator Loading

}
catch(e){

}

// barcodeDevice.on('data', (data) =>{
//     process.stdout.write(data);
// });

// barcodeDevice.on('error', (e) =>{
//     console.log(e);
// })

