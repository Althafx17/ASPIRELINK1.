# ASPIRE LINK

A professional networking and collaborative platform designed to unite ambitions by connecting students, mentors, and professionals. **Aspire Link** leverages real-time communication and database management to foster a community where like-minded individuals can share knowledge, collaborate on projects, and achieve their collective dreams.

📌 **Project Overview**
**Aspire Link** is a real-world academic project developed to address the lack of specialized platforms for ambition-based networking. Unlike general social media, this platform focuses on "Interconnected Ambitions," allowing users to find partners with complementary skills to embark on collective professional journeys.

The project is fully functional, featuring a robust backend and real-time interaction capabilities.

🎯 **Objectives**

* **Bridge the Gap:** Connect students directly with experienced mentors.
* **Enable Collaboration:** Provide a space for users with similar goals to find each other.
* **Real-Time Interaction:** Facilitate instant knowledge sharing through chat rooms.
* **Secure Environment:** Ensure a moderated community through admin oversight and reporting systems.
* **Role-Based Networking:** Clearly define user roles (Student/Mentor) to streamline the search for expertise.

🚀 **Key Features**

* **Real-Time Chat Rooms:** Dynamic messaging powered by Socket.io for instant collaboration.
* **Role-Based Access Control:** Separate interfaces and permissions for Students, Mentors, and Admins.
* **Mentor Verification:** A dedicated system for mentors to provide qualifications before guiding others.
* **User Reporting & Moderation:** Features to report inappropriate behavior and an Admin panel to remove violators.
* **Dynamic Search:** Payload-based room and user searching using Regex for high accuracy.
* **Persistent Profiles:** Detailed user profiles stored securely in a NoSQL database.

🧱 **System Architecture**

* **Frontend:** EJS (Embedded JavaScript templates) with Bootstrap for responsive UI.
* **Backend:** Node.js with Express framework.
* **Real-time Engine:** Socket.io for bidirectional communication.
* **Database:** MongoDB Atlas (Cloud NoSQL).
* **Authentication:** Cookie-based session management with custom Middleware.

🛠️ **Technology Stack**

* **Frontend**
* HTML5 / CSS3
* Bootstrap 5
* EJS View Engine


* **Backend**
* Node.js
* Express.js
* Socket.io


* **Database**
* MongoDB (Mongoose ODM)


* **Development Tools**
* Visual Studio Code
* Postman (API Testing)


* **Cloud Services**
* MongoDB Atlas


* **Version Control**
* GitHub



🖥️ **Supported Platforms**

* Web Browsers (Chrome, Firefox, Safari, Edge)
* Responsive design supports Mobile and Desktop views.

⚙️ **How to Run the Project (Development Setup)**

### Prerequisites

* Node.js installed (v14 or higher)
* MongoDB Atlas account or local MongoDB instance
* Git installed

### Step-by-Step Setup

1. **Clone the Repository**
```bash
git clone <repository-url>
cd aspire-link-main

```


2. **Install Dependencies**
```bash
npm install

```


3. **Environment Configuration**
* Update the `uri` variable in `index.js` with your MongoDB connection string.
* Set your preferred `PORT` (default is 3500).


4. **Run the Application**
```bash
# Using normal node
node index.js

# Or using nodemon (if installed)
npm start

```



📂 **Project Structure (Overview)**

```text
aspire-link-main/
├── schema/             # Mongoose Models (User, Room, Reports, etc.)
├── public/             # Static files (CSS, Images, Client-side JS)
├── views/              # EJS Templates (Login, Signup, Index, Admin)
├── node_modules/       # Dependencies
├── index.js            # Main server entry point
├── package.json        # Project metadata and scripts
└── README.md           # Documentation

```

🔐 **Security Considerations**

* **Authentication Middleware:** `isAuthenticated` and `adminAuthenticated` functions protect private routes.
* **Cookie Security:** Automated cookie clearing for unauthorized or failed login attempts.
* **Input Sanitization:** Body-parser and JSON parsing for secure data handling.
* **Database Isolation:** Using environment-specific connection strings.

📚 **Learning Outcomes**

* Implementation of real-time communication using WebSockets.
* Deep understanding of MVC (Model-View-Controller) architecture.
* Hands-on experience with NoSQL database design and Mongoose schemas.
* Practical knowledge of Middleware and Role-Based Access Control (RBAC).

🏫 **Academic Context**

* **Project Type:** Mini Project
* **Institution:** AWH Engineering College
* **University:** APJ Abdul Kalam Technological University (KTU)
* **Course:** Bachelor of Technology in Computer Science and Engineering
* **Date:** June 2024

👤 **Authors**

* **Saifulla** 
* **Muhammad Abdul Razak A M** 
* **Muhammed Nihad T** 
* **Althaf K** 

📄 **License**
This project is developed for academic purposes as part of the KTU B.Tech curriculum.

**Aspire Link** – *Uniting ambitions through technology.*
