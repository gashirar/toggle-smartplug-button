require('date-utils')
const DashButton = require('dash-button');
const { Client } = require('tplink-smarthome-api')
const {exec} = require('child_process');

if (!process.argv[1] || !process.argv[2]) {
  console.log("nodejs index.js [DasuButton MAC] [TP Link SmartPlug IP]");
}

let DASHBUTTON_MAC = process.argv[1];
let SMARTPLUG_IP = process.argv[2];


const button = new DashButton(DASHBUTTON_MAC);
const client = new Client();
let device;
let prev_reboot = jstDate();

function jstDate() {
  let dt = new Date();
  dt.setTime(dt.getTime() + 1000*60*60*9);
  return dt;
}

function toFormat(dt) {
  return dt.toFormat("YYYY/MM/DD HH24:MI:SS");
}

const plug = client.getDevice({host: SMARTPLUG_IP}).then((dev)=>{
  device = dev;
  dev.getSysInfo().then(console.log);
  dev.setPowerState(true);
});

button.addListener(() => {
  let now = jstDate();
  let diff_seconds = (now.getTime() - prev_reboot.getTime()) / 1000;
  if (diff_seconds > 10) {
    device.togglePowerState();
    console.log(toFormat(now), " : Toggle Plug...");
    prev_reboot = now;
  } else {
    console.log(toFormat(now), " : Previous Toggled Time (", toFormat(prev_reboot), ")");
  }
});

console.log("Start...");
