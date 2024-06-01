const LogService = require('../services/log.service');
const db = require('../models/index.model');
const Log = db.log;
class LogController {
    constructor() {
        this.intervalCreateLog = setInterval(async () => {
            try {
                LogController.logs = await LogService.createLogs();
            } catch (error) {
                console.log(error);
            }
        }, 30000);
    }

    static logs = [];

    getLogsStream(req, res) {
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
        }, 20000);

        res.on('close', () => {
            clearInterval(interval);
            res.end();
        });
    }

    async getLogs(req, res) {
        try {
            const logs = await Log.findAll(
                {
                    attributes: ['id', 'message', 'value', 'date'],
                    where: {
                        UserId: req.userId,
                    },
                },
            );
            logs.sort((a, b) => b.date - a.date);
            return res.status(200).json(logs);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }

    }
    destroy() {
        clearInterval(this.intervalCreateLog);
    }
}

module.exports = new LogController();
