My Garage – Walkthrough

The My Garage application has been successfully converted into a full-stack Django web app with an integrated AI Cost Estimator.
The system manages vehicles, tracks maintenance, predicts service costs, and displays alerts for overdue tasks.
This README provides a clear overview of the functionality, how to run the project, and technical details for academic review.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Features Implemented
1. Dashboard
Status Overview: Shows “ATTENTION NEEDED” if any vehicle has overdue maintenance.
Vehicle Cards: Display vehicle name, year, type, odometer, and next due maintenance.
Alerts: A red warning banner appears when maintenance is required.

2. Vehicle Management
List View: See all vehicles in a responsive grid layout.
CRUD: Add / Edit / Delete vehicles.
Business Logic: Automatically calculates:
Due in X km
Overdue by X km
based on service intervals and current mileage.

3. Maintenance History & AI

Log Service: Record maintenance with date, mileage, and cost.
AI Cost Estimator:
When selecting a “Service Type” in the log form,
the AI model predicts the expected cost automatically.

Model: Random Forest Regressor trained on synthetic data
(because a real dataset was unavailable).

History Table: View all past services, including:
service type
mileage
cost
date

Delete Service: Ability to remove maintenance records.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

How to Run the Application
1. Start the Server
py manage.py runserver

2. Open Browser

Navigate to:

http://127.0.0.1:8000

Verification Steps

These steps help confirm the application functions correctly.

1. Check Dashboard

You should see 4 seeded vehicles.

Example expected behavior:

Weekend Warrior (Ducati) should show “ATTENTION NEEDED”
because Chain Lube is overdue.

2. Test AI Estimation

Open My Daily Driver (Toyota Corolla)

Go to Maintenance

Select “Brake Pad Replacement” from the dropdown

The AI estimator should predict a cost automatically
(e.g., €50–60 range)

3. Log a Service

Submit the service log

If the new mileage > previous mileage, the odometer updates

The new maintenance entry appears in the history table

Technical Details (For Thesis)
Backend

Django 5.x

Python 3.x

Database

SQLite (default)

Easily switchable to PostgreSQL

AI / Machine Learning

Scikit-learn

RandomForestRegressor

Pandas for data preprocessing

Uses synthetic training data
(due to lack of real maintenance dataset)

Frontend

Django Templates

CSS (responsive layout + glassmorphism theme)

Dark UI with high-contrast elements

Screenshots,
# 📸 **Screenshots**

### **Dashboard (Main Overview)**
![Dashboard](https://raw.githubusercontent.com/fnajdoski/mygarage/main/screenshots/dashboard.png)

### **Dashboard – Alternate View**
![Dashboard Alt](https://raw.githubusercontent.com/fnajdoski/mygarage/main/screenshots/dashboard%201.png)

### **My Vehicles Page**
![My Vehicles](https://raw.githubusercontent.com/fnajdoski/mygarage/main/screenshots/myvehicles.png)

### **Add Vehicle Form**
![Add Vehicle](https://raw.githubusercontent.com/fnajdoski/mygarage/main/screenshots/addvehicle.png)

### **Attention Banner (Overdue Maintenance)**
![Attention Banner](https://raw.githubusercontent.com/fnajdoski/mygarage/main/screenshots/attention.png)
