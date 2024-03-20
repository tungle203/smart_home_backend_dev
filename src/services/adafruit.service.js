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
    async createFeed(name) {
        const data = {
            name
        }
        try {
            const response = await axios.post(`https://io.adafruit.com/api/v2/${userName}/feeds`, data, config);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
    async createData(feedKey, value) {
        const data = {
            value
        }
        try {
            const response = await axios.post(`https://io.adafruit.com/api/v2/${userName}/feeds/${feedKey}/data`, data, config);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
}

module.exports = new AdafruitService();