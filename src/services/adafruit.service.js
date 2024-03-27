const axios = require('axios');
require('dotenv').config();

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-AIO-Key': process.env.AIO_KEY
    }
}


class AdafruitService {
    async createFeed(userName, deviceName) {
        const feedKey = deviceName.toLowerCase().replace(/ /g, '-');
        await axios.post(`https://io.adafruit.com/api/v2/${userName}/feeds`, {
            feed: {
                name: feedKey
            }
        }, config);
    }
    async createData(userName, deviceName, value) {
        const feedKey = deviceName.toLowerCase().replace(/ /g, '-');
        await axios.post(`https://io.adafruit.com/api/v2/${userName}/feeds/${feedKey}/data`, {
            datum: {
                value
            }
        }, config);
    }
    async getLastData(userName, deviceName) {
        const feedKey = deviceName.toLowerCase().replace(/ /g, '-');
        const response = await axios.get(`https://io.adafruit.com/api/v2/${userName}/feeds/${feedKey}/data/last`, config);
        return response.data;
    }
}

module.exports = new AdafruitService();