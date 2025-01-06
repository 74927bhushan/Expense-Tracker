# Expense Tracker Application

This is a web-based expense tracker application designed to help users manage their income and expenses effectively. The application allows users to upload data from Excel files, visualize the data through pie charts, and view detailed records in table format.

## Key Features

*   **Excel File Upload:**
    *   Users can upload `.xlsx` or `.xls` files containing their income and expense data.
    *   The application supports multiple tables within a single Excel file.
    *   Users can specify the starting cell location of each table.

*   **Income and Expense Management:**
    *   The application processes income data from tables with columns for `Date`, `Total`, and `Remark` (and optional `Type`).
    *  It can processes expenses data from tables with columns for `Type`, `Date` and `Amount`.

*   **Data Visualization:**
    *   Pie charts are generated for both income and expenses.
    *   Income chart segments are based on the `remark` column and expenses chart segment is based on the `type` column.
    *   Charts are interactive and responsive.
    *   Chart data is dynamically updated after each successful upload.
    *   Charts are displayed only when data is present.

*   **Data Tables:**
    *   Detailed records of income and expenses are presented in sortable, paginated tables.

*   **Error Handling:**
    *   The application provides descriptive error messages for common issues, including:
        *   Invalid or missing Excel files.
        *   Incorrectly formatted tables or data.
        *   No tables found at specified locations.

*   **User-Friendly Interface:**
    *   Clear and intuitive design.
    *   Provides a sample structure of a valid Excel file to help users understand data input requirements.
    *   Responsive layout that adapts to different screen sizes.

## Technologies Used

*   **Frontend:**
    *   Angular (version 18)
    *   `@swimlane/ngx-charts` for data visualization
    *   HTML, CSS, TypeScript
    *   Standalone Components
*   **Backend:**
    *   Spring Boot (version 3.4.1)
    *   Java 21
    *   MySQL for data storage
    *   Apache POI for Excel processing
*   **Dependencies:**
    * `ng2-charts`: It is replaced by `@swimlane/ngx-charts`
    *   `chart.js`: It is replaced by `@swimlane/ngx-charts`
    *   `rxjs`, `@angular/router`, `@angular/forms`, `@angular/common`, `@angular/http`, `@angular/material`, and other core Angular dependencies.

## Setup Instructions

### Backend
1.  Make sure you have Java 21 and Maven installed
2. Create a mysql database `ExpenseTracker`
3. Make sure you have a database with user `root` and password `bala1889`. Change as per your requirements in `application.properties`.
4. Clone the backend repository.
5. Navigate to the project directory.
6.  Run `mvn spring-boot:run` to start the backend server.

### Frontend

1.  Make sure you have Node.js (v20.11.1 or higher) and npm installed.
2. Clone the fronted repository.
3.  Navigate to the project directory.
4.  Run `npm install` to install all dependencies.
5.  Run `npm start` to start the frontend server.

## Usage

1.  Start the backend and the frontend application.
2.  Navigate to `http://localhost:4200/upload` (or the port where your Angular app is running).
3.  Upload your excel file by selecting it.
4.  Enter the number of tables in excel for income and expense table.
5. Enter the starting cell locations of the tables.
6.  Once the file is uploaded and processed, data will be shown in tables and a pie charts below them.

## Contribution
Feel free to create a pull request to make changes in the repository.

## License
Bhushan Choudahry
