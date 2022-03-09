const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// Initialize server configuration and function
const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
            security: false,
        },
    });
    server.route(routes);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
};

// Start the server
init();
