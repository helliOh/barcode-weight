const SerialPort = require("serialport");
const robot = require('robotjs');

const port = new SerialPort("COM14", {
    baudRate: 9600
});

var prev, curr;

var zero = 0;
var stable = 0;
var isStable = false, isSent = false;

const THRESHOLD = 0.20;
const STABLE_THRESHOLD = 4;

const signalDebug = false;
const timeDebug = true;

/*
    Avg. KB I/O time : 1000ms
*/

async function eventSerializer(){
    return new Promise(async (resolve, reject) =>{
        port
        .on('open', async () =>{
            process.stdout.write('\x07\x07\x07\x07\x07');

            port.on('data', async (data) =>{
                data = data.toString('utf8').replace(/[wkg]/gi, '');
                if(isNaN(data)) return resolve();
                
                data = Number(data);
                if(signalDebug) console.log(`${prev}   ${curr}   Rate : ${stable}   Stable : ${isStable}   Sent : ${isSent}`);
            
                curr = data;

                if(data == 0){
                    zero++

                    if(STABLE_THRESHOLD < zero) isSent = false, zero = 0;
                }
                else zero = 0;

                if(data == 0 || Math.abs(data) <= THRESHOLD){
                    return resolve();
                }

                if(stable < STABLE_THRESHOLD) isStable = false;
                else isStable = true;

                if(curr == prev){
                    stable++;
                    
                    if(isStable && !isSent){
                        prev = curr, stable = 0, isStable = false, isSent = true;
                        let buf = `${String(curr)}`;
                        
                        process.stdout.write('\x07');//Start I/O
                        if(timeDebug) console.time('I/O');
                        await robot.typeString(buf);
                        if(timeDebug) console.timeLog('I/O');
                        await robot.keyTap('tab')
                        process.stdout.write('\x07');//Ready to load another product
                        if(timeDebug) console.timeLog('I/O');
                        if(timeDebug) console.timeEnd('I/O');
                    }
                }
                else prev = curr, curr = 0, stable = 0, isStable = false, isSent = false;
                
                resolve();
            });
        })
        .on('error', async (error) =>{
            console.log(error);
        })
    })
}

async function mainThread(){
    return new Promise(async (resolve, reject) =>{
        try{
            await eventSerializer();
            resolve();
        }
        catch(e){
            reject();
        }
    })
}

mainThread();