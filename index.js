const dotenv = require('dotenv')
dotenv.config();

const { ReportMeshData } = require('./src/tracker/tracker');

ReportMeshData();
setInterval(ReportMeshData,parseInt(process.env.QueryTime));

require('./src/webserver/server');