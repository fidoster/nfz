const Pilot = require("./src/models/Pilot");
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const moment = require('moment');

const app = express();

// Connect to the MongoDB Atlas database
mongoose.connect(
  "mongodb+srv://fidoster:uRLxmomS3mZRtZPx@cluster0.amwn9l8.mongodb.net/nodrone?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const connection = mongoose.connection;
connection.once("open", () => {
console.log("MongoDB connected successfully");
});

// Enable CORS on the routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Parse request bodies with body-parser middleware
app.use(express.json());

// Set up the routes
app.get("/drones", async (req, res) => {
  try {
    // Define variables for the endpoints
    const dronesEndpoint = "https://assignments.reaktor.com/birdnest/drones";
    const pilotsEndpoint = "https://assignments.reaktor.com/birdnest/pilots/";

    // Retrieve the latest position of the drone
    const xml = await axios.get(dronesEndpoint);
    console.log(xml.data)

    // process XML data
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml.data, "text/xml");
    console.log(xmlDoc)

    // Loop through the drones in the snapshot
    const drones = xmlDoc.getElementsByTagName("drone");
    for (const drone of drones) {
      // Retrieve serial number and position of drones
      const serialNumber =
        drone.getElementsByTagName("serialNumber")[0].textContent;
      const x = parseFloat(
        drone.getElementsByTagName("positionX")[0].textContent
      );
      const y = parseFloat(
        drone.getElementsByTagName("positionY")[0].textContent
      );

      // Determine the distance from the nest
      const distance = Math.sqrt((x - 250000) ** 2 + (y - 250000) ** 2);
      console.log(distance)

      // Retreive the pilot information if the drone is in no fly zone
      if (distance <= 100000) {
        const pilot = await axios.get(pilotsEndpoint + serialNumber);
        //store data to the MongoDB
        const newPilot = new Pilot({
          firstName: pilot.data.firstName,
          lastName: pilot.data.lastName,
          email: pilot.data.email,
          phoneNumber: pilot.data.phoneNumber,
          serialNumber: serialNumber,
          lastSeen: moment().format(),
          distance: distance,
        });
        await newPilot.save();
      }
    }
    res.send("Data saved successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.get("/pilots", async (req, res) => {
  try {
    const serialNumber = req.query.serialNumber;
    // Identify pilot using the serial number
    const pilot = await Pilot.findOne({
      serialNumber: serialNumber,
      lastSeen: { $gte: moment().subtract(10, "minutes") },
    });
    if (!pilot) {
      return res.status(404).send("Pilot not found");
    }
    return res.json(pilot);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
