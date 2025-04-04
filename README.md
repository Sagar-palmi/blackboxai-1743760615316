
Built by https://www.blackbox.ai

---

```markdown
# University Mess Subscription Management System

## Project Overview

The **University Mess Subscription Management System** is a web application designed to facilitate the management and subscription of mess services for university students. This system allows students to sign up, manage their subscriptions, and offers administrators the ability to manage student information and subscription statuses effectively.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/university-mess-system.git
   cd university-mess-system
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and configure the required environment variables:
   ```plaintext
   ADMIN_ID=your_admin_id
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Initialize the database**:
   To create the required database tables and add the default admin user, run:
   ```bash
   node init-db.js
   ```

5. **Start the server**:
   You can start the server in development mode using:
   ```bash
   npm run dev
   ```
   Or in production mode with:
   ```bash
   npm start
   ```

## Usage

Once the server is running, you can access the application through your web browser at: `http://localhost:3000`. From there, you can sign up as a student or log in as an admin to manage subscriptions.

## Features

- **User Registration**: Students can register for the mess services.
- **Subscription Management**: Students can view and manage their subscriptions, including start and expiry dates.
- **Admin Access**: Administrators can view all students and their subscription statuses, manage users, and add new subscriptions.

## Dependencies

The project includes the following dependencies:

- **bcryptjs**: A library to help hash passwords.
- **cors**: Middleware to enable Cross-Origin Resource Sharing.
- **dotenv**: A module to load environment variables from a `.env` file.
- **express**: A fast, unopinionated, minimalist web framework for Node.js.
- **express-validator**: Middleware for validating and sanitizing user input.
- **jsonwebtoken**: A library to sign and verify JSON web tokens.
- **sqlite3**: A SQLite3 binding for Node.js, enabling the storage of data in a lightweight database.

## Project Structure

The project has the following structure:

```
university-mess-system/
├── backend/                  # Server-side code
│   ├── database.db          # SQLite database file
│   └── server.js            # Main server file
├── .env                      # Environment variables
├── init-db.js               # Script to initialize the database
├── package.json              # Project metadata and dependencies
├── package-lock.json         # Dependency locking
└── README.md                 # This README file
```

Feel free to explore and contribute to enhance the functionality of this application!
```