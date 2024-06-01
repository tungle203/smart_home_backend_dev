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
            deviceCount: 6,
            UserId: 1,
        },
        {
            name: 'Kitchen',
            deviceCount: 3,
            UserId: 1,
        },
        {
            name: 'Bedroom',
            deviceCount: 3,
            UserId: 1,
        },
        {
            name: 'Bathroom',
            deviceCount: 4,
            UserId: 1,
        },
        {
            name: 'Balcony',
            deviceCount: 2,
            UserId: 1,
        }
    ],
    sensorTypes: [
        {
            name: 'Temperature',
        },
        {
            name: 'Humidity',
        },
    ],
    sensor: [
        {
            name: 'Temperature',
            feedName: 'tungle-temperature-sensor',
            upperThreshold: 40,
            lowerThreshold: 10,
            UserId: 1,
            SensorTypeId: 1,
            value: 0,
        },
        {
            name: 'Humidity',
            feedName: 'tungle-humidity-sensor',
            UserId: 1,
            SensorTypeId: 2,
            upperThreshold: 90,
            lowerThreshold: 30,
            value: 0,
        },
    ],
    deviceTypes: [
        {
            name: 'Led',
            defaultValue: 1,
        },
        {
            name: 'Fan',
            defaultValue: 100,
        },
    ],
    devices: [
        {
            name: 'Led 1',
            feedName: 'led1-1-device',
            UserId: 1,
            RoomId: 1,
            DeviceTypeId: 1,
            status: false,
        },
        {
            name: 'Led 2',
            feedName: 'led2-2-device',
            UserId: 1,
            RoomId: 1,
            DeviceTypeId: 1,
            status: false,
        },
        {
            name: 'Led 3',
            feedName: 'led3-3-device',
            UserId: 1,
            RoomId: 1,
            DeviceTypeId: 1,
            status: false,
        },
        {
            name: 'Led 4',
            feedName: 'led4-4-device',
            UserId: 1,
            RoomId: 1,
            DeviceTypeId: 1,
            status: false,
        },
        {
            name: 'Fan 1',
            feedName: 'fan1-5-device',
            UserId: 1,
            RoomId: 1,
            DeviceTypeId: 2,
            status: false,
        },
        {
            name: 'Fan 2',
            feedName: 'fan2-6-device',
            UserId: 1,
            RoomId: 1,
            DeviceTypeId: 2,
            status: false,
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
