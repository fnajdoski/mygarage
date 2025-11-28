import pandas as pd
import numpy as np
import random

def generate_synthetic_data(num_samples=1000):
    vehicle_types = ['CAR', 'BIKE', 'TRUCK']
    makes = {
        'CAR': ['Toyota', 'Honda', 'Ford', 'BMW'],
        'BIKE': ['Ducati', 'Yamaha', 'Kawasaki', 'Harley'],
        'TRUCK': ['Volvo', 'Scania', 'MAN', 'Mercedes']
    }
    service_types = ['Oil Change', 'Tire Rotation', 'Brake Pad Replacement', 'Battery Replacement', 'Chain Lube', 'Air Filter']
    
    data = []

    for _ in range(num_samples):
        v_type = random.choice(vehicle_types)
        make = random.choice(makes[v_type])
        model = f"{make} Model {random.randint(1, 5)}"
        service = random.choice(service_types)
        
        # Logic for realistic costs
        base_cost = 50
        if service == 'Oil Change':
            base_cost = 80
        elif service == 'Tire Rotation':
            base_cost = 40
        elif service == 'Brake Pad Replacement':
            base_cost = 200
        elif service == 'Battery Replacement':
            base_cost = 150
        elif service == 'Chain Lube':
            base_cost = 20
        elif service == 'Air Filter':
            base_cost = 30
            
        if v_type == 'TRUCK':
            base_cost *= 3
        elif v_type == 'BIKE':
            base_cost *= 0.8
            
        cost = base_cost * random.uniform(0.9, 1.2)
        mileage = random.randint(1000, 200000)
        duration = base_cost / 50 * random.uniform(0.8, 1.2) # Rough estimate
        urgency = random.choice(['Low', 'Medium', 'High'])

        data.append({
            'Vehicle Type': v_type,
            'Make': make,
            'Model': model,
            'Service Type': service,
            'Total Cost': round(cost, 2),
            'Mileage at Service': mileage,
            'Service Duration Hours': round(duration, 1),
            'Urgency Level': urgency
        })

    df = pd.DataFrame(data)
    df.to_csv('maintenance_dataset.csv', index=False)
    print("Synthetic dataset generated: maintenance_dataset.csv")

if __name__ == "__main__":
    generate_synthetic_data()
