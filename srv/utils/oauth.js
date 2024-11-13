const axios = require("axios").default;

async function getToken(destination) {
    const response = await axios({
        method: "POST",
        url: destination.tokenServiceURL,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            grant_type: "password",
            username: destination.User,
            password: destination.Password,
            client_id: destination.clientId,
            client_secret: destination.clientSecret,
            login_hint: '{"origin":"sap.custom"}'
        }
        })
    return response.data.access_token
}

module.exports = {
    getToken
}