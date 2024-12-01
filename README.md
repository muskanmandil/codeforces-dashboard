# **Codeforces Dashboard**

## **Project Overview**

The **Codeforces Dashboard** is a web application that displays programming contests fetched from the **Codeforces API**. It allows users to browse contests, filter them based on specific criteria, and manage their favorite contests seamlessly. The dashboard is designed with a clean user interface and intuitive features, making it an essential tool for competitive programmers to stay updated on upcoming and past contests.

The project is built with **React** for the frontend and utilizes **Polaris by Shopify** for a professional and modern design. **Context API** is used for efficient state management across the application.

### **Deployed Project**

You can view the deployed project at:  
[Codeforces Dashboard (Deployed)](https://codeforces-dashboard-chi.vercel.app)

---

## **Project Setup**

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/muskanmandil/codeforces-dashboard.git
   cd codeforces-dashboard
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

   The application will run on `http://localhost:3000` by default.

---

## **Project Features**

### 1. **Contest Table**

- **Browse Contests:** Displays a list of programming contests fetched from the **Codeforces API**.
- **Contest Details:** Includes contest name, duration, start time, type, and phase (e.g., "Upcoming," "Ongoing," or "Finished").
- **Sortable Columns:** Users can sort the contests table by different attributes like duration.

### 2. **Contest Search and Filters**

- **Search Functionality:** Users can search contests by name using a **real-time, debounced search bar**. The search is optimized using a debounce technique to prevent unnecessary API calls while typing, improving the app's performance and user experience.
- **Filter Contests:** Filter contests based on their type (e.g., Div 1, Div 2) or phase (e.g., "Ongoing," "Finished").

### 3. **Favorites Management**

- **Add/Remove Favorites:** Users can mark contests as favorites and view them in a separate "Favorites" section.
- **Persistent Favorites:** Favorites are saved in **session storage**, ensuring that marked contests remain accessible even after refreshing the page.

### 4. **Graphical Representation**

- **Contest Duration Visualization:** A graph using the **Recharts** library visually compares contests by their duration (in hours).

### 5. **Search Debouncing**

- **Efficient Search Function:** The search bar is debounced to ensure that UI is not rendered too frequently while the user is typing. This minimizes unnecessary load on the server and enhances the performance of the app.
- **Debouncing Logic:** A delay is implemented to wait until the user finishes typing before rendering data. This approach ensures that the search experience remains fast and responsive.

### 6. **Caching**

- **API Data Caching:** The application uses a **localStorage cache** to store the list of contests fetched from the Codeforces API. This helps in reducing the number of API requests made and ensures faster load times for subsequent visits.
- **Cache Expiry:** Cached data is stored for up to **one hour**. If the cache has expired, the application fetches fresh data from the API and updates the cache accordingly.
- **Graceful Fallback:** If there is an issue fetching fresh data from the API, the app gracefully uses the cached data if available, providing a seamless experience even during network issues.

---

## **Technology Stack**

- **Frontend:** React, Polaris by Shopify, Recharts
- **State Management:** Context API
- **Data Storage:** Session storage, Local storage
- **API Integration:** Codeforces API
