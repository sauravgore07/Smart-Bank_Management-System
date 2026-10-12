# Smart Bank Management System

A full-stack Bank Management System developed using **Java 21, Spring Boot, React.js, and MySQL**. The application is designed to manage banking operations through a web-based interface with separate user and admin functionality.

## Technologies Used

- **Frontend:** React.js, JavaScript, CSS, HTML
- **Backend:** Java 21, Spring Boot
- **Database:** MySQL
- **ORM:** Spring Data JPA, Hibernate
- **Security:** Spring Security, JWT Authentication
- **API:** REST APIs
- **Build Tool:** Maven
- **PDF Generation:** Apache PDFBox

## Features

- User registration and login
- JWT-based authentication
- Bank account management
- Banking transactions
- User dashboard
- Admin dashboard and statistics
- KYC verification
- Card management
- Loan management
- User profile management
- Notifications
- PDF bank statement generation

## Project Structure

```text
Smart-Bank_Management-System/
├── src/
│   └── main/
│       ├── java/
│       └── resources/
├── frontend/
├── pom.xml
└── README.md
```

*Note: Update the project structure if your actual folders differ.*

## Prerequisites

- Java JDK 21
- Node.js and npm
- MySQL Server
- Maven

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/sauravgore07/Smart-Bank_Management-System.git
cd Smart-Bank_Management-System
```

### 2. Configure the Database

Create a MySQL database and configure the database URL, username, and password in your Spring Boot configuration.

Do not upload real passwords or secret keys to GitHub.

### 3. Run the Backend

From the folder containing `pom.xml`, run:

```bash
mvn spring-boot:run
```

### 4. Run the Frontend

Open a terminal in the frontend folder:

```bash
npm install
npm run dev
```

## Future Enhancements

- Online deployment
- Automated testing
- Improved transaction reports
- Additional security enhancements

## Author

**Saurav Gore**

GitHub: [@sauravgore07](https://github.com/sauravgore07)
