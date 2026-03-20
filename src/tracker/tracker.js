let DiscordWebhook = require('../discord/DiscordWebhookSender');
const { GetMeshNetworkMetadata, GetDataAsDict } = require('../utils/MeshUtils');

let BeforeData = {};

/* Report back to Discord (or whatever else we plug in) about the current mesh data! */
async function ReportMeshData() {
    let MeshData = await GetMeshNetworkMetadata();
    let MeshnetworkedEventsToTrack = process.env.MeshEventsToTrack.split(',');
    let MeshNetworkdEventsTrackedRealNames = GetDataAsDict(process.env.MeshEventTrackNameToRealName);
    let MeshNetworkedEventsTrackedColors = GetDataAsDict(process.env.MeshEventTrackNameToColor);

    let Report = {
        content: null,
        embeds: [],
        attachments: []
    };

    for(let TrackedMeshEventName of MeshnetworkedEventsToTrack) {
        let MeshEvent = MeshData[TrackedMeshEventName];

        if(MeshEvent) {
            Report.embeds.push({
                title: `${MeshNetworkdEventsTrackedRealNames[TrackedMeshEventName] ? MeshNetworkdEventsTrackedRealNames[TrackedMeshEventName] : TrackedMeshEventName}`,
                description: `**${MeshNetworkdEventsTrackedRealNames[TrackedMeshEventName] ? MeshNetworkdEventsTrackedRealNames[TrackedMeshEventName] : TrackedMeshEventName}**`,
                color: MeshNetworkedEventsTrackedColors[TrackedMeshEventName] ? MeshNetworkedEventsTrackedColors[TrackedMeshEventName] : 4522140,
                fields: [
                    {
                        name: "Current Value",
                        value: `${MeshEvent.metadataStructData.currentValue.toLocaleString()}`
                    },
                    {
                        name: "Required Value",
                        value: `${MeshEvent.metadataStructData.requiredValue.toLocaleString()}`
                    },
                    {
                        name: "bHasCompleted",
                        value: `${MeshEvent.metadataStructData.bHasCompleted}`
                    }
                ]
            });

            /* Check if we've newly completed this event */
            let PreviousMeshEvent = BeforeData[TrackedMeshEventName];
            if(PreviousMeshEvent) {
                if(PreviousMeshEvent.metadataStructData.bHasCompleted != MeshEvent.metadataStructData.bHasCompleted && MeshEvent.metadataStructData.bHasCompleted == true) {
                    Report.content = `<@&${process.env.PingRoleId}>`;
                }
            }
        }
    }

    BeforeData = MeshData;
    DiscordWebhook.SendDiscordWebhook(Report);
}

module.exports = {
    ReportMeshData 
}