// Load required modules
const express = require('express');
const path = require('path');

// Initialize the Express app
const app = express();

// Configure server port (default to 8100 if PORT isn't set)
const PORT = process.env.PORT || 8100;

// Configure EJS as the templating engine
app.set('view engine', 'ejs');

// Specify the folder for EJS templates
app.set('views', path.join(__dirname, 'views'));

// Serve static assets from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes Definition
// Root route to display the home page with SpaceX launches
app.get('/', async (req, res) => {
    // Retrieve latest SpaceX launches
    const launches = await fetchSpaceXLaunches();

    res.render('index', {
        title: 'Welcome to the SpaceX Launches Information Portal',
        message: 'This is a simple web application that uses the SpaceX API to display information about the latest launches.',
        launches: launches,
        launchDetails: null,
        crewDetails: [],
        showBackButton: false
    });
});

// Route to display detailed information about a specific launch
app.get('/launch/:id', async (req, res) => {
    const launchId = req.params.id;

    try {
        const launches = await fetchSpaceXLaunches();
        console.log(`Fetching details for launch ${launchId}`);
        const response = await fetch(`https://api.spacexdata.com/v5/launches/${launchId}`);
        const launchDetails = await response.json();

        // Fetch details for crew members if available
        const crewIds = launchDetails.crew.map(crewMember => crewMember.crew);
        const crewDetailsPromises = crewIds.map(id => fetch(`https://api.spacexdata.com/v4/crew/${id}`).then(res => res.json()));
        const crewDetails = await Promise.all(crewDetailsPromises);

        res.render('index', {
            title: `Launch Details: ${launchDetails.name}`,
            message: '',
            launches: launches,
            launchDetails: launchDetails,
            crewDetails: crewDetails,
            showBackButton: true
        });
    } catch (error) {
        console.error('Error fetching launch details:', error);
        res.render('index', {
            title: `Launch Details: ${launchDetails.name}`,
            message: 'Failed to retrieve details for this launch.',
            launches: launches,
            launchDetails: null,
            crewDetails: [],
            showBackButton: true
        });
    }
});

// Function to retrieve all SpaceX launches
async function fetchSpaceXLaunches() {
    const response = await fetch('https://api.spacexdata.com/v5/launches');
    return await response.json();
}

// Fetch individual crew member details
async function fetchCrewDetails(crewIds) {
    const crewDetails = [];

    console.log(`Finding CrewID: ${crewIds}`);
    await Promise.all(crewIds.map(async (id) => {
        const response = await fetch(`https://api.spacexdata.com/v4/crew/${id}`);
        const crewMember = await response.json();
        crewDetails.push(crewMember);
    }));

    return crewDetails;
}

// Start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server operational on port ${PORT}`);
    });
}

// Export the application for testing purposes
module.exports = { app, fetchSpaceXLaunches };
