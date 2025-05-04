# Elearning_22

## Overview

Elearning_22 is a collaborative project — an online E-learning platform where students can buy and study courses. It also enables users to communicate and collaborate with others online.

Key Features:
- Browse and purchase a variety of courses

- Study course materials online

- Real-time communication and collaboration between users

 ## Test Results Comparison: Before vs After Caching

### Overview
This section compares the performance metrics before and after implementing caching. Caching has significantly improved response times and session lengths, but the issue with HTTP 404 errors persists.

### Metrics

| Metric                    | **Before Caching** | **After Caching** | **Change**       |
| ------------------------- | ------------------ | ----------------- | ---------------- |
| **Mean Response Time**    | 1.2 ms             | **0.9 ms**        | 🔽 25% faster    |
| **p99 Response Time**     | 8 ms               | **3 ms**          | 🔽 62.5% faster  |
| **Session Length (mean)** | 11.7 s             | **6.2 s**         | 🔽 47% faster    |
| **Requests Served**       | 600                | 600               | ➖ Same          |
| **HTTP 404s**             | 600                | 600               | ❌ No improvement |




## Features

- **Interactive Learning Modules**: Engage users with dynamic lessons and interactive quizzes.
- **Responsive Design**: Optimized for all devices using cutting-edge CSS techniques.
- **Dynamic Functionality**: JavaScript powers seamless interactions and intuitive navigation.
- **Collaborative Development**: Built by a team of contributors to ensure diverse perspectives and expertise.

## Technologies Used

- **JavaScript** (51.1%): For dynamic and interactive functionalities.
- **CSS** (30.8%): For styling and responsive design.
- **HTML** (18.1%): For structuring and presenting content.

## Getting Started

If your project has separate folders for the **frontend** and **backend**, here are the updated steps to run the project:

---

## Steps to Run the Project

### Prerequisites
Before running the project, ensure the following are installed on your system:
1. **Node.js**: Download and install it from [Node.js official website](https://nodejs.org).
2. **npm** (Node Package Manager): Comes bundled with Node.js.
3. **Code Editor** (Optional): A code editor like Visual Studio Code if you want to view or edit the code.

---

### Folder Structure
The project is organized into two main directories:
- **frontend/**: Contains the code for the client-side of the application.
- **backend/**: Contains the code for the server-side of the application.

---

### Steps to Run

#### 1. **Clone the Repository**
   - Open your terminal or command prompt.
   - Clone the GitHub repository to your local machine using the following command:
     ```bash
     git clone https://github.com/Tanesh-a4/Elearning_22.git
     ```

#### 2. **Navigate to the Project Directory**
   - Move into the project directory:
     ```bash
     cd Elearning_22
     ```

---

#### 3. **Set Up the Frontend**
   1. Navigate to the `frontend/` folder:
      ```bash
      cd frontend
      ```
   2. Install the required dependencies:
      ```bash
      npm install
      ```
   3. Start the frontend server:
      ```bash
      npm start
      ```
   - The frontend will typically run on `http://localhost:3000`.

---

#### 4. **Set Up the Backend**
   1. Open a new terminal window or tab.
   2. Navigate to the `backend/` folder:
      ```bash
      cd backend
      ```
   3. Install the required dependencies:
      ```bash
      npm install
      ```
   4. Start the backend server:
      ```bash
      npm run dev
      ```
   - The backend will typically run on `http://localhost:5000` or another specified port.

---

#### 5. **Access the Application**
   - Ensure both the frontend and backend servers are running.
   - Open your web browser and navigate to the frontend URL, typically:
     ```
     http://localhost:3000
     ```
   - The frontend will communicate with the backend server for all API requests.

---

### Additional Notes
- **Environment Variables**: If the project uses environment variables, ensure you set them up in `.env` files located in both the `frontend/` and `backend/` directories.
- **Dependency Issues**: If you encounter issues, try deleting the `node_modules` folder and `package-lock.json` file in the respective folder, then rerun `npm install`.

Let me know if you need any more assistance! You can create or update your README file directly [here](https://github.com/Tanesh-a4/Elearning_22/new/main?filename=README.md).
---


Let me know if you need additional help! You can edit your README file directly using this [link](https://github.com/Tanesh-a4/Elearning_22/new/main?filename=README.md).

This project is a team effort, and we welcome additional contributions! Here’s how you can contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Follow the coding standards agreed upon by the team.
4. Submit a pull request with a detailed explanation of your changes.

## Team

The success of this project is thanks to the efforts of the team members:
- **Tanesh-a4** 
- **[Akshaya](https://github.com/akshaya224)**
- **[Deraj](https://github.com/OneAutumnLeef)**


## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contact

For any questions or suggestions, feel free to reach out:
- **GitHub Repository**: [Elearning_22](https://github.com/Tanesh-a4/Elearning_22)

---

You can now create this README directly in your repository [here](https://github.com/Tanesh-a4/Elearning_22/new/main?filename=README.md). Let me know if you need help with anything else!
