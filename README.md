**Cab Booking App README**

---

### Overview

This is a basic web application for booking cabs. It allows users to select a source and destination, along with the desired time for travel, and then books a cab if it's available during that time. The application calculates the minimum distance between the source and destination, estimates the time and cost of the journey based on a fixed price per minute for the cab, and provides necessary booking details. Users also have the option to cancel their bookings.

### Features

- User-friendly interface for booking cabs.
- Selection of source and destination from options A, B, C, D, E, F.
- Booking a cab based on availability during the specified time.
- Calculation of minimum distance between source and destination.
- Estimation of travel time and cost based on fixed price per minute.
- Display of booking confirmation with relevant details.
- Option to cancel bookings.

### User Roles

#### Admin
- Admin will use the application to manage cab bookings.
- Admin will have access to the booking system and all its functionalities.

#### User
- Users will use the application to book cabs for their travel needs.
- Users will select the source, destination, and time for their journey.
- Users will receive confirmation of their bookings and can cancel them if needed.

### Cab and Route Information

- **Sources:** A, B, C, D, E, F
- **Destinations:** A, B, C, D, E, F
- **Cabs Available:** 1, 2, 3, 4, 5

### How to Use

1. **Login:**
   - Admin will log in using their credentials to access the admin dashboard.

2. **Booking a Cab:**
   - Users will navigate to the booking page.
   - Select a source and destination from the dropdown menus.
   - Choose the desired start time for the journey.
   - Click on the "Book Cab" button.
   - If the cab is available during the specified time, the booking will be confirmed, and details will be displayed.
   - If the cab is not available, the booking will not be confirmed.

3. **Viewing Booking Confirmation:**
   - After successful booking, users will see a confirmation message with details such as source, destination, cab details, start time, estimated arrival time, total time, and estimated cost.

4. **Cancelling a Booking:**
   - Users will have the option to cancel their booking.
   - The cancellation will be processed, and the cab will be made available for other bookings.

### Technologies Used

- React.js for frontend development.
- Axios for handling HTTP requests.
- Node.js and Express.js for backend (not implemented in this README but required for the application to function).
- MongoDB for storing cab and booking data (not implemented in this README but required for the application to function).

### Example Image

<img width="354" alt="distanceBtwPath" src="https://github.com/Srishti168/CabBooking/assets/101701334/719e1474-a991-422d-be9e-fae69fde76c1">

### Setting Up the Application

1. Clone the repository to your local machine.
2. Install dependencies using npm or yarn.
3. Set up the backend server with Node.js and Express.js.
4. Connect the backend to MongoDB for storing cab and booking data.
5. Run the application.



