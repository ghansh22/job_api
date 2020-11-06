const nodeGeocoder = require('node-geocoder');

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_APIKEY,
    formatter: null
}

const geoCoder = nodeGeocoder(options)
module.exports = geoCoder;