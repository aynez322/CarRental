# 🚗 CarRental - Full Stack Car Rental Application

A modern, full-stack car rental management system built with **Spring Boot** and **React**. This application allows users to browse available cars, make reservations, and manage their bookings, while administrators can manage the car fleet and handle customer bookings.

<img width="1919" height="1029" alt="Screenshot 2026-01-13 012954" src="https://github.com/user-attachments/assets/1300b875-5da4-4b99-a211-cf848d38ed8c" />


## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)

---

## ✨ Features

### Customer Features
- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 🚙 **Browse Cars** - View available cars with detailed specifications
- 📅 **Book Vehicles** - Select pickup/return dates and locations
- 📋 **My Bookings** - View and manage personal reservations
- 👤 **Profile Management** - Update personal information
- 📄 **Driver License Upload** - Upload license documents for verification

### Admin Features
- 🚗 **Car Management** - Add, edit, and remove vehicles from the fleet
- 📊 **Booking Management** - View and manage all customer bookings
- 👥 **User Management** - Manage customer accounts
- 📸 **Image Management** - Upload and manage car images

### General Features
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔍 **Search & Filter** - Find cars by location, date, and specifications
- 💰 **Dynamic Pricing** - Automatic price calculation based on rental duration
- 📧 **Contact Form** - Customer support and inquiries

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Description |
|------------|---------|-------------|
| Java | 21 | Programming Language |
| Spring Boot | 3.5.7 | Backend Framework |
| Spring Security | - | Authentication & Authorization |
| Spring Data JPA | - | Database ORM |
| PostgreSQL | - | Relational Database |
| JWT (jjwt) | 0.12.3 | Token-based Authentication |
| Lombok | - | Boilerplate Code Reduction |
| ModelMapper | 3.2.0 | Object Mapping |
| Maven | - | Build Tool |

### Frontend
| Technology | Version | Description |
|------------|---------|-------------|
| React | 19.1.1 | Frontend Library |
| Vite | 7.1.7 | Build Tool & Dev Server |
| React Router | 7.9.4 | Client-side Routing |
| React Icons | 5.5.0 | Icon Library |
| ESLint | 9.36.0 | Code Linting |

---

## 🏗 Architecture

The application follows a **3-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│                    Port: 5173 (Vite Dev)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Spring Boot)                      │
│                       Port: 8080                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Controllers │  │  Services   │  │    Repositories     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                      │
│                       Port: 5432                            │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

<img width="763" height="659" alt="Screenshot 2026-01-11 031605" src="https://github.com/user-attachments/assets/bd61d6c9-f8ac-421f-bc65-ffa0825bbf9c" />


**Main Entities:**
- **Users** - Customer and admin accounts
- **Cars** - Vehicle fleet information
- **CarImages** - Multiple images per car
- **Bookings** - Rental reservations

---

## 📦 Prerequisites

Before running this application, ensure you have the following installed:

- **Java 21** or higher
- **Node.js 18** or higher
- **PostgreSQL 14** or higher
- **Maven 3.8** or higher (or use the included Maven wrapper)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/aynez322/CarRental
cd CarRental
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE CarRental;
```

Import the initial data (optional):

```bash
psql -U postgres -d CarRental -f CarRental-backend/db_data.sql
```

### 3. Backend Setup

```bash
cd CarRental-backend

# Using Maven wrapper (recommended)
./mvnw clean install

# Or using system Maven
mvn clean install
```

### 4. Frontend Setup

```bash
cd CarRental-frontend

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

Edit `CarRental-backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/CarRental
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration (Change the secret in production!)
jwt.secret=yourSecretKeyThatShouldBeAtLeast256BitsLong
jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
```

### Frontend Configuration

The frontend API base URL is configured in `CarRental-frontend/src/utils/api.js`. Update if your backend runs on a different port.

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd CarRental-backend

# Using Maven wrapper
./mvnw spring-boot:run

# Or using system Maven
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### Start Frontend Development Server

```bash
cd CarRental-frontend

npm run dev
```

The frontend will start on **http://localhost:5173**

### Production Build (Frontend)

```bash
npm run build
npm run preview
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Cars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cars` | Get all cars |
| GET | `/api/cars/{id}` | Get car by ID |
| GET | `/api/cars/available` | Get available cars |
| POST | `/api/cars` | Add new car (Admin) |
| PUT | `/api/cars/{id}` | Update car (Admin) |
| DELETE | `/api/cars/{id}` | Delete car (Admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get all bookings (Admin) |
| GET | `/api/bookings/my` | Get current user's bookings |
| GET | `/api/bookings/{id}` | Get booking by ID |
| POST | `/api/bookings` | Create new booking |
| PUT | `/api/bookings/{id}` | Update booking |
| DELETE | `/api/bookings/{id}` | Cancel booking |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get current user profile |
| PUT | `/api/users/profile` | Update user profile |

---

## 📸 Screenshots

### Home Page
<img width="1919" height="1029" alt="Screenshot 2026-01-13 012954" src="https://github.com/user-attachments/assets/2b0dcd72-2af0-4188-ab19-ba4fec9e9c6a" />


### Available Cars
<img width="1919" height="1028" alt="Screenshot 2026-01-13 114502" src="https://github.com/user-attachments/assets/b80c02c2-e9bc-4a81-ba54-c4df81b5d9b0" />


### Booking Process
<img width="1919" height="1026" alt="Screenshot 2026-01-13 120014" src="https://github.com/user-attachments/assets/0138d46e-a5ed-41c7-a258-4512738720d9" />


### Admin Dashboard
<img width="1919" height="1025" alt="Screenshot 2026-01-13 114524" src="https://github.com/user-attachments/assets/e7677af5-f826-44cd-bde9-3f129923b0d6" />


### User Profile
<img width="1919" height="1025" alt="Screenshot 2026-01-13 114600" src="https://github.com/user-attachments/assets/97cfc428-147e-468b-9fba-a561a8cd496e" />


### My Bookings
<img width="1919" height="1023" alt="Screenshot 2026-01-13 114548" src="https://github.com/user-attachments/assets/5559e20c-9f1f-4d0f-90f9-e36a1b93d2de" />


---

## 📁 Project Structure

```
CarRental/
├── CarRental-backend/          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/carrental/
│   │   │   │   ├── config/         # Security & App Configuration
│   │   │   │   ├── controller/     # REST Controllers
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── model/          # Entity Classes
│   │   │   │   ├── repository/     # JPA Repositories
│   │   │   │   ├── service/        # Business Logic
│   │   │   │   └── util/           # Utility Classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                   # Unit Tests
│   ├── uploads/                    # Uploaded Files
│   └── pom.xml                     # Maven Dependencies
│
├── CarRental-frontend/         # React Frontend
│   ├── src/
│   │   ├── api/                # API Service Functions
│   │   ├── components/         # Reusable Components
│   │   │   ├── booking/        # Booking Components
│   │   │   ├── car/            # Car Display Components
│   │   │   ├── common/         # Shared Components
│   │   │   └── contact/        # Contact Components
│   │   ├── context/            # React Context (Auth)
│   │   ├── pages/              # Page Components
│   │   └── utils/              # Utility Functions
│   ├── public/                 # Static Assets
│   └── package.json            # NPM Dependencies
│
└── README.md                   # This file
```

---

## 👥 Authors

- **Jalba Simion** - *Full Stack Development*
- **Ilco Doina-Cezara** - *Full Stack Development*

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- PostgreSQL Community
- All open-source contributors

---

<p align="center">
  Made with ❤️ for car rental enthusiasts
</p>
