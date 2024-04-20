// Import Express
const express = require('express');
const path = require('path');

// Create an Express application
const app = express();

// Set the port (you can use any port, 3000 is common for development)
const PORT = process.env.PORT || 8100;

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set the directory where the view templates will be stored
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));




// Define routes
// Home route using an EJS template
app.get('/', async (req, res) => {
    // Render 'index' template from the 'views' directory

    // Fetch the latest SpaceX launches
    const launches = await fetchSpaceXLaunches();

    res.render('index', { title: 'Welcome to the SpaceX Launches Information Portal', message: 'This is a simple web application that uses the SpaceX API to display information about the latest launches.',
    launches: launches,
    launchDetails: null,
    crewDetails: [],
    showBackButton: false });
});

// Route to fetch and display details of a specific launch
app.get('/launch/:id', async (req, res) => {
    const launchId = req.params.id;

    try {
        const launches = await fetchSpaceXLaunches();

        console.log(`Fetching details for launch ${launchId}`);
        const response = await fetch(`https://api.spacexdata.com/v5/launches/${launchId}`);
        const launchDetails = await response.json();

        // Check if there are crew members for this launch
        const crewIds = launchDetails.crew.map(crewMember => crewMember.crew);

        const crewDetailsPromises = crewIds.map(id => 
            fetch(`https://api.spacexdata.com/v4/crew/${id}`).then(response => response.json())
        );

        // Wait for all the crew details to be fetched
        const crewDetails = await Promise.all(crewDetailsPromises);

        res.render('index', {
            title: `Launch Details: ${launchDetails.name}`,
            message: '',
            launches: launches,
            launchDetails: launchDetails, // Pass the launch details to the template
            crewDetails: crewDetails,
            showBackButton: true
        });
        return;
    } catch (error) {
        console.error('Error fetching launch details:', error);

        res.render('index', {
                title: `Launch Details: ${launchDetails.name}`,
                message: '',
                launches: launches,
                launchDetails: launchDetails, // Pass the launch details to the template
                crewDetails: [],
                showBackButton: true
        });
    }
});


async function fetchSpaceXLaunches() {
    const response = await fetch('https://api.spacexdata.com/v5/launches');
    const data = await response.json();
    return data;
}

// Function to fetch crew member details by their ID
async function fetchCrewDetails(crewIds) {
    const crewDetails = [];

    console.log(`Finding CrewID: ${crewIds}`);

    // Wait for all fetch requests to complete
    await Promise.all(crewIds.map(async (id) => {
        const response = await fetch(`https://api.spacexdata.com/v4/crew/${id}`);
        const crewMember = await response.json();
        crewDetails.push(crewMember);
    }));

    return crewDetails;
}


// Start the Express server only if we are not testing
if (process.env.NODE_ENV !== 'test') {
    /* istanbul ignore next */
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// At the end of your server.js
module.exports = { app, fetchSpaceXLaunches}; // Export the app for testing

