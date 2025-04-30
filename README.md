# 🎓 Course Selling App (Backend)

A backend RESTful API built with **Node.js**, **Express.js**, and **MongoDB** to support a course-selling platform. This backend manages users, admins, courses, and purchase flows with secure authentication using JWT and password hashing via Bcrypt.

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT (jsonwebtoken)** – for authentication
- **Bcrypt** – for password hashing
- **dotenv** – for environment variable management
- **Zod** – for input validation
- **Postman** – for API testing





## 🧠 Features


✅ Admin Functionalities:

* Signup/Signin (JWT protected)
* Create a course
* Delete a course
* Update course content

### 🙋 User Functionalities

* Signup/signin (JWT protected)
* Purchase a course
* View all purchased courses

### 📮 API Endpoints (Tested via Postman)
**Admin Routes (/admin)**
* POST /signup
* POST /signin
* POST /newCourse – (Requires Token in headers)
* DELETE /deleteCourse
* PUT /updateCourse

**User Routes (/user)**
* POST /signup
* POST /signin
* POST /purchasing – purchase the course
* GET /allpurchased – (Requires Token in headers) see all purchased courses.

**Course Routes (/course)**
* GET /preview  - sell all the available courses
* GET /getdetails/:courseID - view course by id



---
---
---
## 🧪 Improvements To Work On
*  Better status code usage (e.g. use 401 Unauthorized, 403 Forbidden, 409 Conflict, etc.)

*  Regex validation for user passwords (strong password enforcement)

*  Use mongoose.populate() to show course details inside purchases