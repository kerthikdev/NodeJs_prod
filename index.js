const axios = require('axios');

// Define the URL of your Node.js application
const url = 'http://13.201.22.121/';  // Replace with the correct URL

// Function to send a single request
async function sendRequest() {
    try {
        const response = await axios.get(url);
        console.log(`Response Code: ${response.status} | URL: ${url}`);
    } catch (error) {
        console.log(`Error while sending request: ${error.message}`);
    }
}

// Number of requests to send concurrently
const numRequests = 20; // Adjust this to the number of requests you want to send

// Function to send multiple requests concurrently
async function sendMultipleRequests() {
    const requests = [];
    
    // Create an array of promises for the requests
    for (let i = 0; i < numRequests; i++) {
        requests.push(sendRequest());
    }

    // Wait for all requests to complete
    await Promise.all(requests);
    console.log("All requests completed.");
}

// Call the function to send requests
sendMultipleRequests();
