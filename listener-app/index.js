/**
 * Primary file for the API
 * 
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {
    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the http Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', data => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // Choose handler this user should go to, If one is not found go to not found handler
        const chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : router.notFound;

        // Construct the data object to send to the handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof statusCode === 'number' ? statusCode : 200;
            
            // Use the payload called bak tby the handler, or default to empty object
            payload = typeof payload === 'object' ? payload : {};
            
        });
        // Send the response
        res.end('Hello World\n');
    
        // Log the request path
        // console.log(`Request is received on path: ${trimmedPath} with this method: ${method} and with these query string params: `, queryStringObject)
        console.log(`Request received with this payload: `, buffer);
    });
});

// Start the server and have it listen on port 3000
server.listen(3000, () => {
    console.log('The server is listening on port 3000 now');
});

// Define the handlers
const handlers = {};

handlers.sample = (data, callback) => {
    callback(406, { name: 'sample handler' });
};
handlers.notFound = (data, callback) => {
    callback(404);
};

// Define a request router
const router = {
    sample: handlers.sample
}
