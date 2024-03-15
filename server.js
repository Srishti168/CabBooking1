const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/cab_system", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const cabSchema = new mongoose.Schema({
  name: String,
  pricePerMinute: Number,
  timeToDestination: { type: Map, of: Number },
});

const Cab = mongoose.model("Cab", cabSchema);

const bookingSchema = new mongoose.Schema({
  userEmail: String,
  source: String,
  destination: String,
  cabName: String,
  startTime: String,
  bookingTime: { type: Date, default: Date.now },
  estimatedArrivalTime: String, // Add estimated arrival time field
  estimatedCost: Number, // Add estimated cost field
  totalTime: Number, // Add total time field
});

const Booking = mongoose.model("Booking", bookingSchema);

// Seed cabs data
Cab.countDocuments().then((count) => {
  if (count === 0) {
    const cabsData = [
      {
        name: "Cab 1",
        pricePerMinute: 1.5,
        timeToDestination: { B: 5, C: 7, D: 15, E: 20, F: 25 },
      },
      {
        name: "Cab 2",
        pricePerMinute: 2.0,
        timeToDestination: { B: 6, C: 8, D: 16, E: 21, F: 26 },
      },
      {
        name: "Cab 3",
        pricePerMinute: 2.5,
        timeToDestination: { B: 7, C: 9, D: 17, E: 22, F: 27 },
      },
      {
        name: "Cab 4",
        pricePerMinute: 3.0,
        timeToDestination: { B: 8, C: 10, D: 18, E: 23, F: 28 },
      },
      {
        name: "Cab 5",
        pricePerMinute: 3.5,
        timeToDestination: { B: 9, C: 11, D: 19, E: 24, F: 29 },
      },
    ];
    Cab.insertMany(cabsData)
      .then(() => {
        console.log("Cabs seeded successfully");
      })
      .catch((err) => {
        console.error("Error seeding cabs:", err);
      });
  }
});

app.get("/cabs", async (req, res) => {
  try {
    const cabs = await Cab.find();
    res.json(cabs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/book", async (req, res) => {
  console.log("hello");
  const { userEmail, source, destination, cabId, startTime } = req.body;
 
  try {
    // Check if the cab is already booked at the specified start time
    const existingBooking = await Booking.findOne({
      cabName: cabId,
      startTime,
    });
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Cab is already booked at the specified time" });
    }

    const cab = await Cab.findById(cabId);

    if (!cab) {
      return res.status(404).json({ message: "Cab not found" });
    }

    // Find the maximum value (assuming timeToDestinationValues are time durations)

    const timeToDestination = cab.timeToDestination.get(destination);
    console.log(timeToDestination);
    
    // Calculate estimated arrival time
    const startTimeInMinutes = convertTimeToMinutes(startTime);
    const estimatedArrivalTimeInMinutes =
      startTimeInMinutes + timeToDestination;
    const estimatedArrivalTime = convertMinutesToTime(
      estimatedArrivalTimeInMinutes
    );

    // Calculate estimated cost
    const pricePerMinute = cab.pricePerMinute;
    const estimatedCost = pricePerMinute * timeToDestination;

    // Create booking object
    const booking = new Booking({
      userEmail,
      source,
      destination,
      cabName: cab.name,
      startTime,
      bookingTime: new Date(),
      estimatedArrivalTime,
      estimatedCost,
      totalTime: timeToDestination,
    });

    // Save booking to database
    await booking.save();

    // Send booking confirmation with estimated arrival time and estimated cost
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Utility functions to convert time to minutes and vice versa
function convertTimeToMinutes(time) {
  const [hours, minutes] = time.split(":");
  return parseInt(hours) * 60 + parseInt(minutes);
}

function convertMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins < 10 ? "0" + mins : mins}`;
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
