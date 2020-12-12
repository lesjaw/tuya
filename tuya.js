const TuyAPI = require('tuyapi');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://cloud.olmatix.com', {
  // var client = mqtt.connect('mqtt://broker.emqx.io', {
  will: {
    topic: '/tuyaRaspi/online',
    payload: 'false',
    qos: 1,
    retain: true
  }
})

var options = {
  qos: 1,
  retain: true
}

let stateHasChanged = false;
let waktu = 5 * 60 * 1000;
var initialMandi, initialTangga, initialDapur;


client.on('connect', function () {
  console.log('MQTT connected');
  client.subscribe('/tuyaRaspi/set', options, function (err) {
    if (!err) {
      client.publish('/tuyaRaspi/online', 'true', options);
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());

  const data = message.toString().split(';');
  console.log(data);

  if (data[0] != undefined && data[1] != undefined) {
    if (data[0] == "dapur" && data[1] == "on") {
      dapur.set({ dps: 20, set: true }).then(() => console.log('Dapur was turned on'));
    }
    if (data[0] == "dapur" && data[1] == "off") {
      dapur.set({ dps: 20, set: false }).then(() => console.log('Dapur was turned off'));
    }
    if (data[0] == "mandiatas" && data[1] == "on") {
      mandi_atas.set({ dps: 20, set: true }).then(() => console.log('Kamar Mandi atas was turned on'));
    }
    if (data[0] == "mandiatas" && data[1] == "off") {
      mandi_atas.set({ dps: 20, set: false }).then(() => console.log('Kamar Mandi atas was turned off'));
    }
    if (data[0] == "tangga" && data[1] == "on") {
      tangga.set({ dps: 20, set: true }).then(() => console.log('Tangga was turned on'));
    }
    if (data[0] == "tangga" && data[1] == "off") {
      tangga.set({ dps: 20, set: false }).then(() => console.log('Tangga was turned off'));
    }
    if (data[0] == "kamaratas" && data[1] == "on") {
      kamarAtas.set({ dps: 20, set: true }).then(() => console.log('Kamar atas was turned on'));
    }
    if (data[0] == "kamaratas" && data[1] == "off") {
      kamarAtas.set({ dps: 20, set: false }).then(() => console.log('Kamar atas was turned off'));
    }
  }
})

const siren = new TuyAPI({
  id: '64808574e09806850b29',
  key: '0012cc809947164f'
});

const tangga = new TuyAPI({
  id: '30100634500291074d76',
  key: '25cbb33513d94732'
});

const dapur = new TuyAPI({
  id: '3010063410521cfea0fd',
  key: '1c39aa150eb869d3'
});

const mandi_atas = new TuyAPI({
  id: '3010063410521cfec6b3',
  key: '694362cf0b87b4cd'
});

const socketDapur = new TuyAPI({
  id: '60470408f4cfa227e381',
  key: 'c1e6c1edc9ff4b6a'
});

const kamarAtas = new TuyAPI({
  id: '3010063410521cfeaccd',
  key: '3176f2e5acad8bb3'
});

// Find device on network
siren.find().then(() => {
  // Connect to device
  siren.connect();
});

// Find device on network
kamarAtas.find().then(() => {
  // Connect to device
  kamarAtas.connect();
});

// Find device on network
mandi_atas.find().then(() => {
  // Connect to device
  mandi_atas.connect();
});

// Find device on network
socketDapur.find().then(() => {
  // Connect to device
  socketDapur.connect();
});

// Find device on network
tangga.find().then(() => {
  // Connect to device
  tangga.connect();
});

// Find device on network
dapur.find().then(() => {
  // Connect to device
  dapur.connect();
});

// Add event listeners
siren.on('connected', () => {
  console.log('Connected to Smart Siren!');
});

// Add event listeners
kamarAtas.on('connected', () => {
  console.log('Connected to Kamar Atas!');
});

// Add event listeners
socketDapur.on('connected', () => {
  console.log('Connected to Smart Socket Dapur!');
});


// Add event listeners
mandi_atas.on('connected', () => {
  console.log('Connected to Mandi Atas!');
});

// Add event listeners
dapur.on('connected', () => {
  console.log('Connected to Dapur!');
});

// Add event listeners
tangga.on('connected', () => {
  console.log('Connected to Tangga');
});

siren.on('disconnected', () => {
  console.log('Disconnected from device.');
});

siren.on('error', error => {
  console.log('Error!', error);
});

siren.on('data', data => {
  // console.log('Data from device:', data);
  //sensor tangga = AFQAYQBuAGcAZwBh
  //sensor living = AEwAaQB2AGkAbgBnACAAUgBvAG8AbQ==
  //sendor mandiatas = AE0AYQBuAGQAaQAgAEEAdABhAHM=
  //sensor pintu = AEQAbwBvAHI=
  let sensor;
  if (data.dps['122'] != undefined) {
    sensor = data.dps['122'];
    console.log('trigger 122 ', sensor);
  }

  //sensor tangga
  if (sensor == 'AFQAYQBuAGcAZwBh') {
    tangga.set({ dps: 20, set: true }).then(() => console.log('Tangga was turned on'));
    clearTimeout(initialTangga)
    waktu = 1000 * 60 * 1;
    initialTangga = setTimeout(
      function () {
        tangga.set({ dps: 20, set: false }).then(() => console.log('Tangga was turned off'));
      }, waktu);
  }

  //sensor dapur
  if (sensor == 'AEwAaQB2AGkAbgBnACAAUgBvAG8AbQ==') {
    dapur.set({ dps: 20, set: true }).then(() => console.log('Dapur was turned on'));
    clearTimeout(initialDapur)
    waktu = 1000 * 60 * 1;
    initialDapur = setTimeout(
      function () {
        dapur.set({ dps: 20, set: false }).then(() => console.log('Dapur was turned off'));
      }, waktu);
  }

  //sensor mandi atas
  if (sensor == 'AE0AYQBuAGQAaQAgAEEAdABhAHM=') {
    mandi_atas.set({ dps: 20, set: true }).then(() => console.log('Mandi was turned on'));
    clearTimeout(initialMandi)
    waktu = 1000 * 60 * 1;
    initialMandi = setTimeout(
      function () {
        mandi_atas.set({ dps: 20, set: false }).then(() => console.log('Mandi was turned off'));
      }, waktu);
  }

  // Set default property to opposite
  if (!stateHasChanged) {
    console.log('state berubaaaahhh!')

    // Otherwise we'll be stuck in an endless
    // loop of toggling the state.
    stateHasChanged = true;
  }
});

socketDapur.on('data', data => {
    console.log('Data from device:', data);

});


