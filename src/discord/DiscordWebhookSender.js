let axios = require('axios');

async function SendDiscordWebhook(Data) {
    await axios.post(process.env.DiscordWebhook,Data).catch((ex) => console.log(`ERROR!!: ${JSON.stringify(ex.response.data)}`));
}

module.exports = {
    SendDiscordWebhook
}