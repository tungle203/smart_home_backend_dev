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
            password:
                '$2b$10$qkD9xP8zU9e1CwZWej9xpetOnKw2hjCjMxr16Nul1SEfO9H0dW4uS',
            email: 'thanhtunga52021@gmail.com',
            phoneNumber: '0966288048',
            fullName: 'Le Thanh Tung',
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
            feedName: 'temperature1-1-sensor',
            UserId: 1,
            SensorTypeId: 1,
            value: 0,
        },
        {
            name: 'Humidity 1',
            feedName: 'humidity1-2-sensor',
            UserId: 1,
            SensorTypeId: 2,
            value: 0,
        },
        {
            name: 'Light 1',
            feedName: 'light1-3-sensor',
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
            feedName: 'led1-1-device',
            UserId: 1,
            RoomId: 2,
            DeviceTypeId: 1,
            status: 0,
            value: 0,
        },
        {
            name: 'Fan 1',
            feedName: 'fan1-2-device',
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
