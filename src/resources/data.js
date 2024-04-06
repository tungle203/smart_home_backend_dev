const db = require('../models/index.model');
const User = db.user;
const Room = db.room;
const DeviceType = db.deviceType;
const Device = db.device;
const SensorType = db.sensorType;
const Sensor = db.sensor;

const data = {
    users: [
        {
            userName: 'tungle',
            password: '123456',
        },
    ],
    rooms: [
        {
            name: 'Living room',
            deviceCount: 1,
            UserId: 1,
        },
        {
            name: 'Kitchen',
            deviceCount: 1,
            UserId: 1,
        },
    ],
    sensorTypes: [
        {
            name: 'Temperature',
            upperThreshold: 40,
            lowerThreshold: 10,
            UserId: 1,
        },
        {
            name: 'Humidity',
            upperThreshold: 90,
            lowerThreshold: 30,
            UserId: 1,
        },
        {
            name: 'Light',
            upperThreshold: 100,
            lowerThreshold: 0,
            UserId: 1,
        },
    ],
    sensor: [
        {
            name: 'Temperature 1',
            feedName: 'temp-1',
            UserId: 1,
            SensorTypeId: 1,
            value: 0,
        },
        {
            name: 'Humidity 1',
            feedName: 'humidity-1',
            UserId: 1,
            SensorTypeId: 2,
            value: 0,
        },
        {
            name: 'Light 1',
            feedName: 'light-1',
            UserId: 1,
            SensorTypeId: 3,
            value: 0,
        },
    ],
    deviceTypes: [
        {
            name: 'Led',
            UserId: 1,
        },
        {
            name: 'Fan',
            UserId: 1,
        },
    ],
    devices: [
        {
            name: 'Led 1',
            feedName: 'led-1',
            UserId: 1,
            RoomId: 2,
            DeviceTypeId: 1,
            status: 0,
            value: 0,
        },
        {
            name: 'Fan 1',
            feedName: 'fan-1',
            UserId: 1,
            RoomId: 1,
            DeviceTypeId: 2,
            status: 0,
            value: 0,
        },
    ],
};

try {
    User.bulkCreate(data.users);
    Room.bulkCreate(data.rooms);
    DeviceType.bulkCreate(data.deviceTypes);
    Device.bulkCreate(data.devices);
    SensorType.bulkCreate(data.sensorTypes);
    Sensor.bulkCreate(data.sensor);
    console.log('Data inserted successfully');
} catch (error) {
    console.log(error);
}
