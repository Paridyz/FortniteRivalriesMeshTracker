function createWebhookBody(eventName, eventDescription, eventColor, event) {
    let embed = {
        title: eventName,
        description: `**${eventDescription}**`,
        color: eventColor,
        fields: []
    };

    // Epic stores the health of each dig site stone in an array so we'll populate description from that.
    for(let i = 0; i < event.metadataStructData.currentHealth.length; i++) {
        // sometimes they go negative instead of just clamping to 0 so we'll manually do that and cover for Epics oopsies.
        let healthValue = event.metadataStructData.currentHealth[i] < 0 ? 0 : event.metadataStructData.currentHealth[i];

        // was gonna use fields but too many = no send.
        embed.description += `\nStone **${i + 1}**: ${healthValue.toLocaleString()} HP (${Math.floor(healthValue / 100000000 * 100)}% HP Remaining)`
    }

    return embed;
}

function isEventComplete(event) {
    for(let i = 0; i < event.metadataStructData.currentHealth.length; i++) {
        if(event.metadataStructData.currentHealth[i] > 0) {
            return false;
        }
    }

    return true;
}

module.exports = { createWebhookBody, isEventComplete }