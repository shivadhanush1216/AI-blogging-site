// Simple test script to verify API endpoints
const http = require('http');

function testAPI() {
    console.log('Testing GET /api/blogs...');

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/blogs',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('✅ GET /api/blogs works! Response:', data);
            } else {
                console.log('❌ GET /api/blogs failed. Response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('❌ Error testing API:', e.message);
    });

    req.end();
}

testAPI();