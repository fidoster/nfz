import React from "react";
import { Routes,Route, Navigate} from "react-router-dom";
import Logic from "./Logic";

const App = () => {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/pilots/:serialNumber" />} />
        <Route path="/pilots/:serialNumber" element={<Logic />} />
    </Routes>
  );
};

export default App;

