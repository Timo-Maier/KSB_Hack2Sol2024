var xsenv = require('@sap/xsenv')
const request = require('request');
const cds = require('@sap/cds');
const LOG = cds.log("RequestService");

const dest_service = xsenv.getServices({
    destination: {
        tag: "destination",
    }
}).destination

function createToken(destAuthUrl, clientId, clientSecret) {
    return new Promise(function(resolve, reject) {
        request({
                url: `${destAuthUrl}/oauth/token`,
                method: 'POST',
                json: true,
                form: {
                    grant_type: 'client_credentials',
                    client_id: clientId
                },
                auth: {
                    user: clientId,
                    pass: clientSecret
                }
            },
            function(error, response, body) {
                if (error) {
                    LOG.error(error)
                    reject(error);
                } else {
                    resolve(body.access_token);
                }
            });
    });
}

async function getDestination(destinationName) {
    const access_token = await createToken(dest_service.url, dest_service.clientid, dest_service.clientsecret)
    return new Promise(function(resolve, reject) {

        request({
                url: `${dest_service.uri}/destination-configuration/v1/destinations/${destinationName}`,
                method: 'GET',
                auth: {
                    bearer: access_token,
                },
                json: true,
            },
            function(error, response, body) {
                if (error) {
                    LOG.error(`Error retrieving destination ${error.toString()}`);
                    reject(error);
                } else {
                    resolve(body.destinationConfiguration);
                }
            });
    });
}

module.exports = {
    getDestination
}