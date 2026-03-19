const dotenv = require('dotenv')
dotenv.config();

const { ReportMeshData } = require('./src/tracker/tracker');

ReportMeshData();
setInterval(ReportMeshData, 5000);