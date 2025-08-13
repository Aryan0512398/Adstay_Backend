# Adstay Backend

Adstay Backend is a comprehensive Node.js application designed to manage vendor profiles, bookings, payments, offers, and more. Built with modern technologies and best practices, it provides a robust foundation for backend services.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [License](#license)

## Features

- **User Authentication**: Secure login with JWT tokens.
- **Vendor Management**: Create and update vendor profiles.
- **Booking System**: Manage bookings and their statuses.
- **Payment Integration**: Handle payments and updates.
- **Offer Management**: Vendors can create and manage discount offers.
- **Complaint Handling**: Users can raise and track complaints.

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable applications.
- **Express.js**: Web framework for building RESTful APIs.
- **Drizzle ORM**: SQL ORM for database interactions.
- **JWT**: JSON Web Tokens for secure authentication.
- **PostgreSQL**: Relational database for storing data.
- **dotenv**: Module for loading environment variables.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Aryan0512398/Adstay_Backend.git
   cd Adstay_Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
2. Environment Variable:
   ```bash
   DATABASE_URL
   PORT
   JWT_SECRET
   ```
## API Documentation

### Users
- **POST /users/register**: New User Registeration.
- **POST /users/login**:  User Login.
- **GET /users/profile**:  Get All users.

---

## Vendors
- **POST /vendors**: Create a new vendor profile.
- **POST /vendor/login**: Vendor Login.
- **GET /vendors**: Retrieve all vendors.
- **GET /vendors/:id**: Retrieve a specific vendor by ID.
- **GET /vendors/user/:user_id**: Retrieve a specific vendor by userID.
- **PATCH /vendors/:id**: Update vendor profile (authenticated vendor only).

---

## Offers
- **POST /offers**: Create a new offer (authenticated vendor only).
- **GET /offers**: Retrieve all offers.
- **GET /offers/vendor/:vendor_id**: Retrieve offers by vendor ID.
- **PATCH /offers/:id**: Update an offer (authenticated vendor only).
- **DELETE /offers/:id**: Delete an offer (authenticated vendor only).

---

## Bookings
- **POST /bookings**: Create a new booking.
- **GET /bookings/my**: Retrieve bookings for logged-in user.
---


## Payments
- **POST /payments**: Create a new payment.
- **GET /payments/my**: Retrieve payments for logged-in user.
- **PATCH /payments/:id**: Update payment status.

---

## Complaints
- **POST /complaints**: Raise a new complaint.
- **GET /complaints**: Retrieve all complaints (optional filters: user_id, vendor_id).
- **PATCH /complaints/:id**: Update complaint status or escalate.

---

## Locations
- **GET /locations/countries**: List all countries.
- **GET /locations/states**: List all states.
- **GET /locations/cities**: List all cities.

---

## Branches
- **POST /branches**: Create a branch.
- **GET /branches**: List all branches.
- **GET /branches/:id**: Get branch by ID.
- **PATCH /branches/:id**: Update branch.

---

## Reviews
- **POST /reviews**: Create a review.
- **GET /reviews/**: Get all reviews.
- **PATCH /reviews/:id**: Update a review.
- **DELETE /reviews/:id**: Delete a review.

## Testing
 ```bash
    npm run dev
   ```
## License
This project is made by Aryan Gupta. 
