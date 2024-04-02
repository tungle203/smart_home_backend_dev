const AdafruitService = require('../services/adafruit.service');
const { createLogs } = require('../services/log.service');
const db = require('../models/index.model');
const Log = db.log;
const Device = db.device;
const DeviceType = db.deviceType;
const User = db.user;
const Room = db.room;

class LogController {
    constructor() {
        this.intervalCreateLog = setInterval(async () => {
            try {
                LogController.logs = await createLogs();
            } catch (error) {
                console.log(error);
            }
        }, 30000);
    }
    // create a static attribute to store the logs
    static logs = [];

    getLogs(req, res) {
        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
        });
        res.flushHeaders();

        const interval = setInterval(() => {
            if (LogController.logs.length > 0) {
                LogController.logs.forEach((log) => {
                    if (log.UserId === req.userId) {
                        res.write(`data: ${JSON.stringify(log)}\n\n`);
                    }
                });
            }
        }, 30000);

        res.on('close', () => {
            clearInterval(interval);
            res.end();
        });
    }

    destroy() {
        clearInterval(this.intervalCreateLog);
    }
}

module.exports = new LogController();
