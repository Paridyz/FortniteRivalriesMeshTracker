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

module.exports = {
    GetValuesFromObject
}