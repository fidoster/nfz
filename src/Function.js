import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";


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
      console.log("Data from Drone Endpoint:", xml.data); // added this

      // Parse the XML data
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml.data, "text/xml");

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

        // Calculate the distance from the nest
        const distance = Math.sqrt((x - 250000) ** 2 + (y - 250000) ** 2);
        console.log(distance);
        // If the drone is within the no-fly zone, fetch the pilot information
        if (distance <= 100000) {
          const pilot = await axios.get(pilotsEndpoint + serialNumber);
          pilot.data.distance = distance;
          setPilots((p) => [...p, pilot.data]);
        }
      }
    };
    let intervalId = setInterval(fetchPilots, 10000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="container">
      <table className="table table-striped table-dark table-responsive">
        <thead>
          <tr>
            <th className="text-center">First Name</th>
            <th className="text-center">Last Name</th>
            <th className="text-center">Email</th>
            <th className="text-center">Phone</th>
            <th className="text-center">Distance</th>
          </tr>
        </thead>
        <tbody>
          {pilots.map((pilot) => (
              <tr key={uuidv4()}>
                <td className="text-center">{pilot.firstName}</td>
                <td className="text-center">{pilot.lastName}</td>
                <td className="text-center">{pilot.email}</td>
                <td className="text-center">{pilot.phoneNumber}</td>
                <td className="text-center">{pilot.distance.toFixed(2)}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
export default Function;
