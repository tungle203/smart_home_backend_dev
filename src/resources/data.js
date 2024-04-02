const db = require('../models/index.model');
const User = db.user;
const Room = db.room;
const DeviceType = db.deviceType;
const Device = db.device;

const data = {
    users: [
        {
            userName: 'tungle',
            password: '123456',
        },
    ],
    rooms: [
        {
            name: 'Entire house',
            deviceCount: 5,
            UserId: 1,
        },
        {
            name: 'Living room',
            deviceCount: 2,
            UserId: 1,
        },
        {
            name: 'Kitchen',
            deviceCount: 2,
            UserId: 1,
        },
    ],
    deviceTypes: [
        {
            name: 'Light',
        },
        {
            name: 'Led',
        },
        {
            name: 'Fan',
        },
        {
            name: 'Humidity',
        },
        {
            name: 'Temperature',
        },
    ],
    devices: [
        {
            name: 'Light 1',
            feedName: 'light-1',
            UserId: 1,
            RoomId: 2,
            DeviceTypeId: 1,
            status: 0,
        },
        {
            name: 'Led 1',
            feedName: 'led-1',
            UserId: 1,
            RoomId: 2,
            DeviceTypeId: 2,
            status: 0,
        },
        {
            name: 'Fan 1',
            feedName: 'fan-1',
            UserId: 1,
            RoomId: 3,
            DeviceTypeId: 3,
            status: 0,
        },
        {
            name: 'Humidity 1',
            feedName: 'humidity-1',
            UserId: 1,
            RoomId: 1,
            DeviceTypeId: 4,
            status: 0,
        },
        {
            name: 'Temp 1',
            feedName: 'temp-1',
            UserId: 1,
            RoomId: 1,
            DeviceTypeId: 5,
            status: 0,
        },
    ],
};

try {
    User.bulkCreate(data.users);
    Room.bulkCreate(data.rooms);
    DeviceType.bulkCreate(data.deviceTypes);
    Device.bulkCreate(data.devices);
    console.log('Data inserted successfully');
} catch (error) {
    console.log(error);
}
