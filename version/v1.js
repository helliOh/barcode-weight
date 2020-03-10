const SerialPort = require("serialport");
const ks = require('node-key-sender');
const fs = require('fs');

const port = new SerialPort("COM14", {
    baudRate: 9600
});

var init = false;
var prev, curr;

const THRESHOLD = 0.45;
const WAIT = 300;

var endurance = 0;
var file = [];

port
.on('open', ()=>{
    port.on('data', (data) =>{
        data = data.toString('utf8').replace(/[wkg]/gi, '');
        if(isNaN(data)) return;
        curr = data = Number(data);

        if(endurance++ >= WAIT) process.exit();
        if(data <= 0 || Math.abs(data) <= THRESHOLD) return;

        if(!init) curr = data, init = true;

        if(curr == prev) return;
        else prev = curr;

        endurance = 0;

        let buf = String(curr);
        console.log(`Weight : ${buf}`);
        file.push(buf);
    });
})
.on('error', (error) =>{
    console.log(error);
})

process.on('exit', ()=>{
    let dataAsFile = file.reduce((acc, cur) => `${acc},${cur}`);
    return fs.writeFileSync('./data.csv', dataAsFile);
})