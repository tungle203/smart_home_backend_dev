const axios = require('axios');
require('dotenv').config();

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-AIO-Key': process.env.AIO_KEY
    }
}


class AdafruitService {
    constructor() {
        this.userName = process.env.AIO_USERNAME;
    }

    async createGroup(groupKey) {
        await axios.post(`https://io.adafruit.com/api/v2/${this.userName}/groups`, {
            group: {
                name: groupKey
            }
        }, config);
    }

    async createFeedInGroup(feedName, groupKey) {
        await axios.post(`https://io.adafruit.com/api/v2/${this.userName}/groups/${groupKey}/feeds`, {
            feed: {
                name: feedName
            }
        }, config);
    }

    async createFeed(deviceName) {
        const feedKey = deviceName.toLowerCase().replace(/ /g, '-');
        await axios.post(`https://io.adafruit.com/api/v2/${this.userName}/feeds`, {
            feed: {
                name: feedKey
            }
        }, config);
    }
    async createData(groupKey, feedKey, value) {
        await axios.post(`https://io.adafruit.com/api/v2/${this.userName}/groups/${groupKey}/feeds/${feedKey}/data`, {
            datum: {
                value
            }
        }, config);
    }
    async getLastDataGroup(groupKey) {
        const response = await axios.get(`https://io.adafruit.com/api/v2/${this.userName}/groups/${groupKey}`, config);
        return response.data.feeds;
    }
}

module.exports = new AdafruitService();