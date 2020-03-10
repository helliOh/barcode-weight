const SerialPort = require("serialport");
const ks = require('node-key-sender');
const fs = require('fs');

const port = new SerialPort("COM14", {
    baudRate: 9600
});

var init = false;
var prev, curr;

var barcode, weight;

var file = [];

const THRESHOLD = 0.45;

port
.on('open', ()=>{
    process.stdout.write('\x07\x07\x07');
    port.on('data', (data) =>{
        data = data.toString('utf8').replace(/[wkg]/gi, '');
        if(isNaN(data)) return;
        curr = data = Number(data);

        if(data <= 0 || Math.abs(data) <= THRESHOLD) return;

        if(!init) curr = data, init = true;

        if(curr == prev) return;
        else prev = curr;

        let buf = String(curr);
        
        
        process.stdout.write('\x07');

        weight = buf;
        console.log(`barcode : ${barcode}\tweight : ${weight}`);
    });
})
.on('error', (error) =>{
    console.log(error);
})

process.stdin.on('data', (chunk) =>{
    let data = chunk.toString('utf8').replace(/[\r\n]/g, '');
    
    if(data == 'quit'){
        try{
            let dataAsFile = file.reduce((acc, cur) => `${acc},${cur}`);
            fs.writeFileSync('./data.csv', dataAsFile);
        }
        catch(e){
            console.log('No data to save');
        }
        
     
        process.exit();
    }
    else if(data == 'commit') commit();
    else if(data == 'save'){
        console.log(file);
        //save logic should be improved
        let dataAsFile = file.reduce((acc, cur) => `${acc}\r\n,${cur.barcode},${cur.weight}\r\n`);
        fs.writeFileSync('./data.csv', dataAsFile);
        console.log('saved');
    }
    else{
        barcode = data;
        console.log(`barcode : ${barcode}\tweight : ${weight}`);
    }
});

function commit(){
    let data = {barcode : barcode, weight : weight};
    file.push(data);

    console.log(data);
    weight = barcode = null;
}