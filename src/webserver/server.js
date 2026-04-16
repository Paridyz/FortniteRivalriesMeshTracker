/* In other projects I would've just used express.js for this but after watching a 2 hour video on someone making-
   -a server handle 1,000,000r/s (iykyk) i saw fastify and was like oki might use that its allot faster than express-
   why am i yapping in this code - Paridyz */
/* This will allow grabbing of our stored mesh networked event data over http in a prometheus format :3 */
let Fastify = require('fastify');
const { GetMeshMetadataForPrometheus, GetMeshNetworkMetadata, GetMeshNetworkedEventMilestones } = require('../utils/MeshUtils');
const { GetPerHourAverage } = require('../utils/MetricUtils');
const fastify = Fastify({
  logger: true
})

fastify.get('/metrics',async function handler (request, reply) {
    return GetMeshMetadataForPrometheus();
});

/* Get an estimated date of completion for the event */
fastify.get('/eta/:meshNetworkedEventId/:prometheusVariableName',async function handler (request, reply) {
    let { meshNetworkedEventId, prometheusVariableName } = request.params;
    let perHourAverage = await GetPerHourAverage(prometheusVariableName);
    let meshNetworkData = await GetMeshNetworkMetadata();
    let milestones = GetMeshNetworkedEventMilestones();
    let meshNetworkedMetadata = meshNetworkData[meshNetworkedEventId];
    if(!meshNetworkedMetadata) {
        reply.status(404);
        return { 'message': 'Mesh networked event not found.' };
    }

    let currentDate = new Date();
    let remainingAmount = meshNetworkedMetadata.metadataStructData.requiredValue - meshNetworkedMetadata.metadataStructData.currentValue;
    let daysLeft = (remainingAmount / perHourAverage) / 24;
    currentDate.setDate(currentDate.getDate() + daysLeft);

    let milestoneCompletionETAs = {};
    for(let milestone of milestones) {
        let etaDate = new Date();
        let milestoneDaysLeft = ((parseInt(milestone) - meshNetworkedMetadata.metadataStructData.currentValue) / perHourAverage) / 24;
        etaDate.setDate(etaDate.getDate() + milestoneDaysLeft);
        milestoneCompletionETAs[milestone] = {
            DaysLeft: milestoneDaysLeft,
            Eta: etaDate.toISOString(),
            Display: milestoneDaysLeft <= 0 ? "Completed" : etaDate.toDateString(),
        };
    }

    return { 
        Avg: perHourAverage,
        DaysLeft: daysLeft,
        Eta: currentDate.toISOString(),
        Display: currentDate.toDateString(),
        Milestones: milestoneCompletionETAs
    };
});

/* Get an estimated date of completion for all milestones */
fastify.get('/milestones/eta/:meshNetworkedEventId/:prometheusVariableName',async function handler (request, reply) {
    let { meshNetworkedEventId, prometheusVariableName } = request.params;
    let perHourAverage = await GetPerHourAverage(prometheusVariableName);
    let meshNetworkData = await GetMeshNetworkMetadata();
    let milestones = GetMeshNetworkedEventMilestones();
    let meshNetworkedMetadata = meshNetworkData[meshNetworkedEventId];
    if(!meshNetworkedMetadata) {
        reply.status(404);
        return { 'message': 'Mesh networked event not found.' };
    }

    let milestoneCompletionETAs = {};
    for(let milestone of milestones) {
        let etaDate = new Date();
        let milestoneDaysLeft = ((parseInt(milestone) - meshNetworkedMetadata.metadataStructData.currentValue) / perHourAverage) / 24;
        etaDate.setDate(etaDate.getDate() + milestoneDaysLeft);
        milestoneCompletionETAs[milestone] = {
            DaysLeft: milestoneDaysLeft,
            Eta: etaDate.toISOString(),
            Display: milestoneDaysLeft <= 0 ? "Completed" : etaDate.toDateString(),
        };
    }

    return milestoneCompletionETAs;
});

/* Get an estimated date of completion for all milestones */
fastify.get('/grafana/milestones/eta/:meshNetworkedEventId/:prometheusVariableName',async function handler (request, reply) {
    let { meshNetworkedEventId, prometheusVariableName } = request.params;
    let perHourAverage = await GetPerHourAverage(prometheusVariableName);
    let meshNetworkData = await GetMeshNetworkMetadata();
    let milestones = GetMeshNetworkedEventMilestones();
    let meshNetworkedMetadata = meshNetworkData[meshNetworkedEventId];
    if(!meshNetworkedMetadata) {
        reply.status(404);
        return { 'message': 'Mesh networked event not found.' };
    }

    let milestoneCompletionETAs = {};
    for(let milestone of milestones) {
        let etaDate = new Date();
        let milestoneDaysLeft = ((parseInt(milestone) - meshNetworkedMetadata.metadataStructData.currentValue) / perHourAverage) / 24;
        etaDate.setDate(etaDate.getDate() + milestoneDaysLeft);
        milestoneCompletionETAs[milestone] = milestoneDaysLeft <= 0 ? "Completed" : etaDate.toDateString();
    }

    return milestoneCompletionETAs;
});

async function StartServer() {
    await fastify.listen({ port: process.env.SERVER_PORT || 3000, host: '0.0.0.0' });
}

StartServer();