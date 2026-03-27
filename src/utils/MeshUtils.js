const axios = require('axios');
const { GetValuesFromObject } = require('./MetricUtils');

let CurrentMeshData = {};

function GetMeshNetworkMetadataUrl() {
    return(FormatUrl(process.env.MeshNetworkMetadataURL, [process.env.MeshNetworkIdentifier]))
}

function GetMeshNetworkedEventMilestones() {
    return GetDataArray(process.env.MeshEventMilestones);
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

/* This will parse the data (value array split by ',') */
function GetDataArray(Data) {
    return Data.split(',');
}

/* This will parse the data (string of [Key][Splitter (typically ':')][Array split by '-']) */
function GetDataDictArray(Data) {
    let Dict = {};

    if(!Data || Data == '') {
        return Dict;
    }

    let DataArray = Data.split(',');
    for(let Key of DataArray) {
        let RealKey = Key.split(":")[0];
        let Value = Key.split(":")[1].split('-');
        Dict[RealKey] = Value;
    }

    return Dict;
}

function GetCurrentMeshData() {
    return CurrentMeshData;
}

function SetCurrentMeshData(NewMeshData) {
    CurrentMeshData = NewMeshData;
    return CurrentMeshData;
}

function GetMeshMetadataForPrometheus() {
    return GetValuesFromObject(CurrentMeshData, '');
}

module.exports = {
    GetMeshNetworkMetadataUrl,
    GetMeshNetworkedEventMilestones,
    FormatUrl,
    GetMeshNetworkMetadata,
    GetDataAsDict,
    GetDataDictArray,
    GetDataArray,
    GetMeshMetadataForPrometheus,
    GetCurrentMeshData,
    SetCurrentMeshData
};