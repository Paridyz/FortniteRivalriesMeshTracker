let DiscordWebhook = require('../discord/DiscordWebhookSender');
const { GetMeshNetworkMetadata, GetDataAsDict, SetCurrentMeshData, GetCurrentMeshData } = require('../utils/MeshUtils');

/* Report back to Discord (or whatever else we plug in) about the current mesh data! */
async function ReportMeshData() {
    let MeshData = await GetMeshNetworkMetadata();
    let BeforeData = GetCurrentMeshData();

    /* Skip reporting if the data is exactly the same */
    if(JSON.stringify(MeshData) == JSON.stringify(BeforeData)) {
        console.log("data is exact");
        return;
    }

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
                title: TrackedMeshEventName,
                description: `**${MeshNetworkdEventsTrackedRealNames[TrackedMeshEventName] ? MeshNetworkdEventsTrackedRealNames[TrackedMeshEventName] : TrackedMeshEventName}**`,
                color: MeshNetworkedEventsTrackedColors[TrackedMeshEventName] ? MeshNetworkedEventsTrackedColors[TrackedMeshEventName] : 4522140,
                fields: [
                    {
                        name: "Current Value",
                        value: `${MeshEvent.metadataStructData.currentValue.toLocaleString()} (${MeshEvent.metadataStructData.currentValue / MeshEvent.metadataStructData.requiredValue * 100}%)`
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

    SetCurrentMeshData(MeshData);
    DiscordWebhook.SendDiscordWebhook(Report);
}

module.exports = {
    ReportMeshData 
}
