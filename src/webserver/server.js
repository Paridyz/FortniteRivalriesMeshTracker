/* This will allow grabbing of our stored mesh networked event data over http in a prometheus format :3 */
let Fastify = require('fastify');
const fastify = Fastify({
  logger: true
})

fastify.get('/metrics',async function handler (request, reply) {
    return { 'paraidyz': 'hi hi hi hi :3' };
});

async function StartServer() {
    await fastify.listen({ port: process.env.SERVER_PORT || 3000 });
}

StartServer();