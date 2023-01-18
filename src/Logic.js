import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";

const Logic = (props) => {
  const { serialNumber } = useParams();
  const [pilots, setPilots] = useState([]);

  useEffect(() => {
    const fetchPilots = async () => {
      // Fetch the pilots from the MongoDB
      const pilots = await axios.get(
        `http://localhost:5000/pilots/${serialNumber}`
      );
      setPilots(pilots.data);
      console.log(pilots.data)
    };
    let intervalId = setInterval(fetchPilots, 10000);
    return () => clearInterval(intervalId);
  }, [serialNumber]);
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
          {pilots.map((pilots) => (
            <tr key={uuidv4()}>
              <td className="text-center">{pilots.firstName}</td>
              <td className="text-center">{pilots.lastName}</td>
              <td className="text-center">{pilots.email}</td>
              <td className="text-center">{pilots.phoneNumber}</td>
              <td className="text-center">{pilots.distance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logic;
