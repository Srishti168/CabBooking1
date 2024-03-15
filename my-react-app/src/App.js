import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [cabs, setCabs] = useState([]);
  const [selectedCab, setSelectedCab] = useState("");
  const [startTime, setStartTime] = useState("");
  const [selectedCabPrice, setSelectedCabPrice] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [bookedCabs, setBookedCabs] = useState([]);
  const [error,seterror]=useState("");
  const [EstimatedArrivalTime,setEstimatedArrivalTime]=useState(""); 

  useEffect(() => {
    axios
      .get("http://localhost:5000/cabs")
      .then((response) => {
        setCabs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cabs:", error);
      });
  }, []);

  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins < 10 ? "0" + mins : mins}`;
  };

  const handleBooking = () => {
    if (source === destination) {
      alert("Source and destination cannot be the same");
      return;
    }

    if (!selectedCab) {
      alert("Please select a cab");
      return;
    }

    if (!startTime) {
      alert("Please select a start time");
      return;
    }

    const isCabBooked = bookedCabs.some(
      (cab) => cab.cabId === selectedCab && cab.startTime === startTime
    );
    if (isCabBooked) {
      alert("This cab is already booked at the specified start time");
      return;
    }

    const selectedCabInfo = cabs.find((cab) => cab._id === selectedCab);
    const estimatedArrivalTimeInMinutes =
      convertTimeToMinutes(startTime) + selectedCabInfo.timeToDestination.get(destination);
    const estimatedArrivalTime = convertMinutesToTime(estimatedArrivalTimeInMinutes);

    const isCabAvailable = bookedCabs.every(
      (cab) =>
        cab.cabId !== selectedCab || convertTimeToMinutes(cab.startTime) > estimatedArrivalTimeInMinutes
    );

    if (!isCabAvailable) {
      alert("This cab is not available at the specified start time");
      return;
    }

    axios
      .post("http://localhost:5000/book", {
        userEmail: "user@example.com",
        source,
        destination,
        cabId: selectedCab,
        startTime,
      })
      .then((response) => {
        setBookingConfirmation(response.data);
        setBookedCabs([...bookedCabs, { cabId: selectedCab, startTime }]);
      })
      .catch((error) => {
        alert("Error booking cab:", error.message);
      });
  };

  const handleCabSelection = (cabId) => {
    const selectedCabInfo = cabs.find((cab) => cab._id === cabId);
    setSelectedCab(selectedCabInfo);
    setSelectedCabPrice(selectedCabInfo.pricePerMinute);
    setEstimatedArrivalTime(""); // Clear estimated arrival time when cab changes
};
  return (
    <div >
      <h1>Cab Booking System</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form>
        <label htmlFor="source">Source:</label>
        <select
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        >
          <option value="">Select</option>
          {["A", "B", "C", "D", "E", "F"].map((letter) => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="destination">Destination:</label>
        <select
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        >
          <option value="">Select</option>
          {["A", "B", "C", "D", "E", "F"].map((letter) => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="cab">Select a Cab:</label>
        <select
          id="cab"
          onChange={(e) => handleCabSelection(e.target.value)}
          required
        >
          <option value="">Select</option>
          {cabs.map((cab) => (
            <option key={cab._id} value={cab._id}>
              {cab.name} - Price Per Minute: ${cab.pricePerMinute}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="startTime">Start Time:</label>
        <input
          type="time"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <br />

        <button type="button" onClick={handleBooking}>
          Book Cab
        </button>
      </form>

      {bookingConfirmation && (
        <div>
          <h2>Booking Confirmation</h2>
          <p>Source: {bookingConfirmation.source}</p>
          <p>Destination: {bookingConfirmation.destination}</p>
          <p>
            Cab:{" "}
            {cabs.find((cab) => cab._id === selectedCab).name} - Price Per
            Minute: ${selectedCabPrice}
          </p>
          <p>Start Time: {bookingConfirmation.startTime}</p>
          <p>Estimated Arrival Time: {bookingConfirmation.estimatedArrivalTime}</p>
          <p>Total Time: {bookingConfirmation.totalTime} minutes</p>
          <p>Estimated Cost: {bookingConfirmation.estimatedCost ? `$${bookingConfirmation.estimatedCost.toFixed(2)}` : 'N/A'}</p>
        </div>
      )}
    </div>
  );
}

export default App;