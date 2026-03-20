const axios = require('axios');

function GetMeshNetworkMetadataUrl() {
    return(FormatUrl(process.env.MeshNetworkMetadataURL, [process.env.MeshNetworkIdentifier]))
}

function FormatUrl(Url, Args) {
    return Url.replace(/{(\d+)}/g, (match, number) => {
        return typeof Args[number] !== 'undefined' 
            ? Args[number] 
            : match;
    });
}

async function GetMeshNetworkMetadata() {
    let MeshNetworkMetadataUrl = GetMeshNetworkMetadataUrl();
    console.log(MeshNetworkMetadataUrl);
    let response = await axios.get(MeshNetworkMetadataUrl);
    return response.data;
}

async function ParseRealNamesDict() {
    let Dict = {};

    if(!process.env.MeshEventTrackNameToRealName || process.env.MeshEventTrackNameToRealName == '') {
        return Dict;
    }

    let MeshNetworkdEventsTrackedRealNames = process.env.MeshEventTrackNameToRealName.split(',');
    for(let TrackedRealName of MeshNetworkdEventsTrackedRealNames) {
        let MeshEventId = TrackedRealName.split(":")[0];
        let RealName = TrackedRealName.split(":")[1];
        Dict[MeshEventId] = RealName;
    }

    return Dict;
}

async function ParseColorsDict() {
    let Dict = {};

    if(!process.env.MeshEventTrackNameToColor || process.env.MeshEventTrackNameToColor == '') {
        return Dict;
    }

    let MeshEventTrackNameToColor = process.env.MeshEventTrackNameToColor.split(',');
    for(let TrackedRealName of MeshEventTrackNameToColor) {
        let MeshEventId = TrackedRealName.split(":")[0];
        let Color = TrackedRealName.split(":")[1];
        Dict[MeshEventId] = parseInt(Color);
    }

    return Dict;
}

module.exports = {
    GetMeshNetworkMetadataUrl,
    FormatUrl,
    GetMeshNetworkMetadata,
    ParseRealNamesDict,
    ParseColorsDict
};