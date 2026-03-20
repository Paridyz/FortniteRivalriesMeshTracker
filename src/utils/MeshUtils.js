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

/* Get the current mesh networked event metadata from the public Fortnite mesh service */
async function GetMeshNetworkMetadata() {
    let MeshNetworkMetadataUrl = GetMeshNetworkMetadataUrl();
    console.log(MeshNetworkMetadataUrl);
    let response = await axios.get(MeshNetworkMetadataUrl);
    return response.data;
}

/* This will parse the data (string of [Key][Splitter (typically ':')][Value]) */
function GetDataAsDict(Data) {
    let Dict = {};

    if(!Data || Data == '') {
        return Dict;
    }

    let DataArray = Data.split(',');
    for(let Key of DataArray) {
        let RealKey = Key.split(":")[0];
        let Value = Key.split(":")[1];
        Dict[RealKey] = Value;
    }

    return Dict;
}

module.exports = {
    GetMeshNetworkMetadataUrl,
    FormatUrl,
    GetMeshNetworkMetadata,
    GetDataAsDict
};