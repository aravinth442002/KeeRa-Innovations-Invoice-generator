# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Running the Project Locally

This project consists of two separate parts: a Next.js frontend and a Node.js (Express) backend. You need to run them in two separate terminal windows.

### Running the Backend Server

The backend server is an Express.js application located in the `/backend` folder.

1.  **Open a new terminal window.**
2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
3.  **Install the necessary packages:**
    ```bash
    npm install
    ```
4.  **Start the backend server:**
    ```bash
    npm start
    ```
    This will start the backend server, typically on `http://localhost:8080`. You should see a message in the terminal confirming that the server is running.

### Running the Frontend Application

The frontend is a Next.js application located in the root folder.

1.  **Open a second terminal window.**
2.  **Make sure you are in the project's root directory.**
3.  **Install the necessary packages:**
    ```bash
    npm install
    ```
4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    This will start the frontend application, typically on `http://localhost:9002`. You can now open this URL in your web browser to see the app.

With both servers running, the frontend application will be able to make API calls to your backend server.