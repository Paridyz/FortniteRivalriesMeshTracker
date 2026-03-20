/* In other projects I would've just used express.js for this but after watching a 2 hour video on someone making-
   -a server handle 1,000,000r/s (iykyk) i saw fastify and was like oki might use that its allot faster than express-
   why am i yapping in this code - Paridyz */
/* This will allow grabbing of our stored mesh networked event data over http in a prometheus format :3 */
let Fastify = require('fastify');
const { GetMeshMetadataForPrometheus } = require('../utils/MeshUtils');
const fastify = Fastify({
  logger: true
})

fastify.get('/metrics',async function handler (request, reply) {
    return GetMeshMetadataForPrometheus();
});

async function StartServer() {
    await fastify.listen({ port: process.env.SERVER_PORT || 3000, host: '0.0.0.0' });
}

StartServer();