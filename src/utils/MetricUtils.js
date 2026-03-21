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
    let response = await axios.get(`${process.env.PrometheusAPIURL}/api/v1/query?query=avg(rate(${prometheusVariableName}[1h]))&stats=true`).catch((ex) => {
        console.log(`Prometheus API error: ${ex}`);
    });

    // Its a string, why tf?
    return parseInt(response.data.data.result[0].value[1]);
}

module.exports = {
    GetValuesFromObject,
    GetPerHourAverage
}