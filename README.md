# Housekeeping Service System

## Project Overview
The Housekeeping Service System is a local web application that allows users to register, log in, book services, and manage their accounts securely. It incorporates multiple security measures such as SHA encryption for passwords, SQL injection prevention, and secure database operations using MySQL2.

## Features
- **User Registration and Login**
  - SHA-encrypted password storage.
  - Special character detection to prevent SQL injection.
- **Booking Services**
  - Users can book housekeeping services with secure data handling.
- **Account Management**
  - View registered email in the "My Info" section.
  - Delete accounts with complete data removal.
- **Database Security**
  - Special character detection for all inputs.
  - Parameterized queries with MySQL2 to protect against SQL injection.

## System Requirements
- **Operating System:** Windows, macOS, or Linux.
- **Software Requirements:**
  - Node.js (Latest LTS version recommended).
  - MySQL Server (Version 8.0 or higher).

## Setup Instructions
1. **Download and Extract Project Files**
   - Download the project file and extract it into a folder (e.g., `HouseKeeping`).

2. **Install Node.js and Dependencies**
   - Install Node.js from the official website.
   - Open a terminal, navigate to the project folder, and run:
     ```
     npm install
     ```

3. **Configure the MySQL Database**
   - Install MySQL Server and create a new database named `housekeeping`.
   - Import the schema using the `housekeeping.sql` file.

4. **Update Database Configuration**
   - Edit the `server.js` file and update the MySQL connection settings:
     ```javascript
     const db = mysql.createConnection({
         host: 'localhost',
         user: 'your_mysql_username',
         password: 'your_mysql_password',
         database: 'housekeeping'
     });
     ```

5. **Start the Server**
   - Run the following command:
     ```
     node server.js
     ```
   - The server will start on `http://localhost:3000`.

6. **Access the Application**
   - Open a web browser and navigate to `http://localhost:3000`.

## Security Features
- **SHA Encryption:** Secure password storage.
- **Special Character Detection:** Prevents SQL injection.
- **Parameterized Queries:** Protects against malicious SQL commands.

## Troubleshooting
- **Issue:** Cannot connect to the database.  
  **Solution:** Ensure MySQL is running and the connection settings in `server.js` are correct.  
- **Issue:** Server not starting.  
  **Solution:** Check if Node.js and dependencies are correctly installed.

## Future Improvements
- Implement more advanced authentication methods (e.g., Two-Factor Authentication).
- Add additional user roles (e.g., administrators) with specific privileges.
- Enhance the UI for a more user-friendly experience.

---

This system provides a secure and efficient platform for managing housekeeping services. Follow the steps above, and you should be able to successfully run the application locally.
