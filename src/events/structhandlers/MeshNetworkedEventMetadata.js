function createWebhookBody(eventName, eventDescription, eventColor, event) {
    return {
        title: eventName,
        description: `**${eventDescription}**`,
        color: eventColor,
        fields: [
            {
                name: "Current Value",
                value: `${event.metadataStructData.currentValue.toLocaleString()} (${Math.floor(event.metadataStructData.currentValue / event.metadataStructData.requiredValue * 100)}%)`
            },
            {
                name: "Required Value",
                value: `${event.metadataStructData.requiredValue.toLocaleString()}`
            },
            {
                name: "bHasCompleted",
                value: `${event.metadataStructData.bHasCompleted}`
            }
        ]
    }
}

function isEventComplete(event) {
    return event.metadataStructData.bHasCompleted;
}

module.exports = { createWebhookBody, isEventComplete }