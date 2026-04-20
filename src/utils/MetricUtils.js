/* Format all values into a prometheus metrics value, Lowkey kinda hate this code. */
function GetValuesFromObject(object, startingName) {
    let output = "";

    for(let key of Object.keys(object)) {
        if(Number.isInteger(object[key])) {
            output += `${startingName.replace('.', ':')}_${key.replace('.', '-')} ${object[key.replace('.', ':')]}\n`
        }
        else if (typeof object[key] == 'object') {
            output += GetValuesFromObject(object[key],startingName != '' ? `${startingName}_${key.replace('.', ':')}` : key.replace('.', ':'));
        }
    }
    
    return output;
}

let axios = require('axios');

/* Get the current per-hour average of a prometheus variable */
async function GetPerHourAverage(prometheusVariableName) {
    let timeRange = 24; // Number in hours. - Paridyz

    let response = await axios.get(`${process.env.PrometheusAPIURL}/api/v1/query?query=${prometheusVariableName}[${timeRange}h]&stats=true`).catch((ex) => {
        console.log(`Prometheus API error: ${ex}`);
    });
    
    let result = response.data.data.result[0];

    return Math.floor((parseInt(result.values[result.values.length - 1][1]) - parseInt(result.values[0][1])) / timeRange);
}

module.exports = {
    GetValuesFromObject,
    GetPerHourAverage
}