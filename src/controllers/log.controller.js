const LogService = require('../services/log.service');

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
