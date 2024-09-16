## uPlay (Server)

## Overview

uPlay Server is the backend component of the uPlay web application. It serves as the backend API, managing user data, authentication, and communication with external services like Cloudinary and the Spotify Web API. This server is built to support the uPlay frontend and facilitate the core features of the application.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#apiendpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

Node.js installed on your server.
npm (Node Package Manager) installed.

### Installation

To set up and run uPlay Server locally, follow these steps:

1. Clone the repository to your local machine or server:

    git clone https://github.com/Eme19/server

2. Change your working directory to the server project folder:

    cd uplay-server-server

3. Install the project dependencies:

    npm install

4. Start the server:

    npm start

This will run the server in production mode. You can configure different environments for development and production.

## Usage

uPlay Server provides the backend functionality for the uPlay web application. It handles user authentication, music data storage, and communication with external services. To use uPlay Server effectively, follow these guidelines:

1. User Authentication: The server manages user accounts and authentication. Users can sign up, log in, and access their profiles securely.

2. Music Data: uPlay Server interacts with the Spotify Web API to retrieve music data. Users can search for songs, artists, and albums through the frontend, and the server handles these requests.

3. Playlist Management: Users can create, modify, and delete playlists. The server stores playlist data and ensures the correct association with user accounts.

4. User Profiles: Customize your profile by updating personal information and profile pictures. The server securely stores and retrieves this data.

5. Settings: Configure the server's behavior and settings to suit your application's needs. Adjust environment variables in the .env file.

## Features

- User Authentication: Create, log in, and secure user accounts.

- Music Data Retrieval: Access music data from the Spotify Web API.

- Playlist Management: Create, update, and delete playlists.

- User Profiles: Customize user profiles with personal information.

- Settings: Configure server settings using environment variables.

- API Endpoints: The server exposes API endpoints to interact with the frontend.

## API Endpoints


User Routes

1. User Registration

- Route: POST /auth/signup
- Description: Allows users to create an account.
- Request Body: JSON object containing user details (username, email, password).
- Response: Returns the newly created user's data with a token for authentication.

2. User Login

- Route: POST /auth/login
- Description: Allows registered users to log in.
- Request Body: JSON object containing user credentials (email or username and password).
- Response: Returns user data with an authentication token.

3. User Profile

- Route: GET /api/users
- Description: Retrieves the user's profile information.
- Authentication: Requires a valid JWT token.
- Response: Returns user data (username, email, state, country, image).

4. Update User Profile Image

- Route: PUT /api/users
- Description: Updates the user's profile image.
- Authentication: Requires a valid JWT token.
- Request Body: JSON object containing the user's ID and the new image URL.
- Response: Returns the updated user's data.

5. Delete User Profile Image

- Route: DELETE /api/users/:username/image
- Description: Deletes the user's profile image.
- Authentication: Requires a valid JWT token.
- Response: Returns a success message upon successful deletion.


Music Routes

6. Search for Songs

- Route: GET /api/tracks/search
- Description: Searches for songs by name or artist.
- Request Query Parameters: q (query string for search).
- Authentication: Requires a valid JWT token.
- Response: Returns a list of matching songs.

7. Create Playlist

- Route: POST /api/playlists
- Description: Creates a new playlist.
- Request Body: JSON object containing playlist details (name, description).
- Authentication: Requires a valid JWT token.
- Response: Returns the newly created playlist.

8. Update Playlist

- Route: PUT /api/playlists/:id
- Description: Updates an existing playlist.
- Request Parameters: id (playlist ID).
- Request Body: JSON object containing updated playlist details.
- Authentication: Requires a valid JWT token and ownership of the playlist.
- Response: Returns the updated playlist.

9. Delete Playlist

- Route: DELETE /api/playlists/:id
- Description: Deletes an existing playlist.
- Request Parameters: id (playlist ID).
- Authentication: Requires a valid JWT token and ownership of the playlist.
- Response: Returns a success message upon successful deletion.


Other Routes

10. Spotify Authorization

- Route: GET /auth/spotify
- Description: Initiates the Spotify OAuth2 authorization process.
- Response: Redirects the user to the Spotify login page.

11. Spotify Callback

- Route: GET /auth/spotify/callback
- Description: Handles the callback from Spotify after user authorization.
- Response: Redirects the user to the frontend with the Spotify access token.

## Technologies Used

This project was built using the following technologies and libraries:

- Node.js
- Express.js
- MongoDB
- Mongoose
- Cloudinary
- JWT (JSON Web Tokens)
- Axios
- Spotify Web API Node

## Contributing

We welcome contributions from the community. If you'd like to contribute to uPlay Server, please follow these steps:

1. Fork the repository and create your branch:

    git checkout -b feature/your-feature-name

2. Commit your changes:

    git commit -m 'Add some feature'

3. Push to the branch:

    git push origin feature/your-feature-name

4. Open a pull request. Explain your changes and why they are necessary.

## License

This project is licensed under the MIT License.
