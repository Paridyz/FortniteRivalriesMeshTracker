let DiscordWebhook = require('../discord/DiscordWebhookSender');
const fs = require('fs');
let path = require('path');
const { GetMeshNetworkMetadata, GetDataAsDict, SetCurrentMeshData, GetCurrentMeshData } = require('../utils/MeshUtils');

/* Report back to Discord (or whatever else we plug in) about the current mesh data! */
async function ReportMeshData() {
    let MeshData = await GetMeshNetworkMetadata();
    let BeforeData = GetCurrentMeshData();

    let MeshnetworkedEventsToTrack = process.env.MeshEventsToTrack.split(',');

    /* Skip reporting if the data is exactly the same */
    if(JSON.stringify(MeshData) == JSON.stringify(BeforeData)) {
        console.log("data is exact");
        return;
    }

    let MeshNetworkdEventsTrackedRealNames = GetDataAsDict(process.env.MeshEventTrackNameToRealName);
    let MeshNetworkedEventsTrackedColors = GetDataAsDict(process.env.MeshEventTrackNameToColor);

    let Report = {
        content: '',
        embeds: []
    };

    for(let TrackedMeshEventName of MeshnetworkedEventsToTrack) {

        let MeshEvent = MeshData[TrackedMeshEventName];

        if(MeshEvent) {
            let EventStructHandlerPath = path.join(__dirname, '..', 'events', 'structhandlers', `${MeshEvent.metadataStructName}.js`);
            if(!fs.existsSync(EventStructHandlerPath)) {
                console.log(`Event struct ${MeshEvent.metadataStructName} is not currently supported.`);
                continue;
            }

            let EventStructHandler = require(EventStructHandlerPath);

            let PreviousMeshEvent = BeforeData[TrackedMeshEventName];
            if(PreviousMeshEvent && EventStructHandler.isEventComplete(PreviousMeshEvent)) {
                continue;
            }

            Report.embeds.push(EventStructHandler.createWebhookBody(TrackedMeshEventName, 
                MeshNetworkdEventsTrackedRealNames[TrackedMeshEventName] ? MeshNetworkdEventsTrackedRealNames[TrackedMeshEventName] : TrackedMeshEventName, 
                    MeshNetworkedEventsTrackedColors[TrackedMeshEventName] ? parseInt(MeshNetworkedEventsTrackedColors[TrackedMeshEventName]) : 4522140, MeshEvent));

            /* Check if we've newly completed this event */
            if(PreviousMeshEvent) {
                if(EventStructHandler.isEventComplete(PreviousMeshEvent) != EventStructHandler.isEventComplete(MeshEvent) && EventStructHandler.isEventComplete(MeshEvent) == true) {
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