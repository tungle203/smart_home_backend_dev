const db = require("../models/index.model");
const User = db.user;
const Room = db.room;
const DeviceType = db.deviceType;
const Device = db.device;

const data = {
  users: [
    {
      userName: "tungle",
      password: "123456",
    },
  ],
  rooms: [
    {
      name: "Living room",
      deviceCount: 2,
      UserId: 1,
    },
    {
      name: "Kitchen",
      deviceCount: 2,
      UserId: 1,
    },
  ],
  deviceTypes: [
    {
      name: "Light",
    },
    {
      name: "Fan",
    },
  ],
  devices: [
    {
      name: "Light 1",
      feedName: "light-1",
      UserId: 1,
      RoomId: 1,
      DeviceTypeId: 1,
      status: 0,
    },
    {
      name: "Light 2",
      feedName: "light-2",
      UserId: 1,
      RoomId: 2,
      DeviceTypeId: 1,
      status: 0,
    },
    {
      name: "Fan 1",
      feedName: "fan-1",
      UserId: 1,
      RoomId: 1,
      DeviceTypeId: 2,
      status: 0,
    },
    {
      name: "Fan 2",
      feedName: "fan-2",
      UserId: 1,
      RoomId: 2,
      DeviceTypeId: 2,
      status: 0,
    },
  ],
};


User.bulkCreate(data.users);
Room.bulkCreate(data.rooms);
DeviceType.bulkCreate(data.deviceTypes);
Device.bulkCreate(data.devices);

