# FIDO2 Web Authentication

## Overview

This web application demonstrates passwordless authentication using FIDO2 (Fast Identity Online) with Node.js and Express.js. FIDO2 provides a secure and convenient way for users to authenticate without relying on traditional passwords.

## Features

- FIDO2 passwordless authentication
- Node.js and Express.js server implementation
- Demonstrates the use of WebAuthn and CTAP protocols
- Simple client-server communication for registration and authentication

## Prerequisites

- Node.js installed on your machine
- Web browser with FIDO2 and WebAuthn support

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/Subu19/FIDO2-PasswordLess-Auth.git
   ```
2. Install dependencies:

   ```
   npm install
   ```
3. Start the server(PORT 3000):

   ```
   npm start
   ```
4. Open your web browser and visit http://localhost:8080 (Or PORT in .env) to access the application.
   
## .env requirement
   ```env
   URI= "mongodb uri"
   ORIGIN = "http://localhost:3000"
   SECRET= "your secret key"
   ```
## Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## Acknowledgments
>FIDO Alliance for providing the FIDO2 standards

>Node.js and Express.js communities for powerful and flexible server-side development
