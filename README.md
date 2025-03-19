Subscription Tracker API 📆💳

Overview

The Subscription Tracker API is a backend service built with Node.js, Express, and MongoDB. It allows users to manage their subscriptions, automate renewal tracking, and ensure security against bot attacks.

This API includes JWT authentication, security enhancements, automated workflows, email notifications, and business logic implementation.


#Automated Workflow🤖

The automation workflow begins when a user creates a new subscription. The system automatically schedules background tasks, such as sending email reminders before subscription deadlines. This ensures users stay informed and never miss a renewal.

Advanced Security

Using Arcjet for bot protection helps detect and prevent malicious or excessive requests, keeping the platform secure and functional against automated threats.

Features 🚀

🔐 User Authentication – Secure login and signup with JWT.

🔄 Automated Workflows – Uses Upstash for scheduling background tasks and email reminders.

🔒 Security Against Bot Attacks – Arcjet is used to block multiple bot requests.

📧 Email Notifications – NodeMailer sends alerts before subscription deadlines, renewals, and cancellations.

🛠 Built with:

Express.js
MongoDB 
Mongoose 
JWT (JSON Web Tokens) 
Arcjet 
Upstash 
NodeMailer
