import React from "react";
import axios from "axios";

const Function = () => {
  const [pilots, setPilots] = useState([]);

  useEffect(() => {
    const fetchPilots = async () => {
      setPilots([]);
      // Set up variables for the endpoints
      const dronesEndpoint = "http://assignments.reaktor.com/birdnest/drones";
      const pilotsEndpoint = "https://assignments.reaktor.com/birdnest/pilots/";

      // Fetch the latest snapshot of drone positions
      const xml = await axios.get(dronesEndpoint);
          console.log("Data from Drone Endpoint:", xml.data); // added this for testing
        
        // Iterate over the drones in the snapshot
      const drones = xmlDoc.getElementsByTagName("drone");
      for (const drone of drones) {
        // Get the serial number and position of the drone
        const serialNumber =
          drone.getElementsByTagName("serialNumber")[0].textContent;
        const x = parseFloat(
          drone.getElementsByTagName("positionX")[0].textContent
        );
        const y = parseFloat(
          drone.getElementsByTagName("positionY")[0].textContent
        );