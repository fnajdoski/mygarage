from django.core.management.base import BaseCommand
from garage.models import Vehicle, ServiceType, MaintenanceRecord
from django.utils import timezone
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Clear existing data
        MaintenanceRecord.objects.all().delete()
        Vehicle.objects.all().delete()
        ServiceType.objects.all().delete()

        # Create Service Types
        services = [
            ServiceType(name='Oil Change', vehicle_type='ALL', default_interval_km=10000),
            ServiceType(name='Tire Rotation', vehicle_type='CAR', default_interval_km=15000),
            ServiceType(name='Chain Lube', vehicle_type='BIKE', default_interval_km=1000),
            ServiceType(name='Air Filter', vehicle_type='ALL', default_interval_km=20000),
            ServiceType(name='Brake Inspection', vehicle_type='TRUCK', default_interval_km=30000),
        ]
        ServiceType.objects.bulk_create(services)

        # Create Vehicles
        vehicles = [
            Vehicle(name='My Daily Driver', make='Toyota', model='Corolla', year=2018, type='CAR', current_odometer_km=55000),
            Vehicle(name='Weekend Warrior', make='Ducati', model='Panigale V2', year=2021, type='BIKE', current_odometer_km=4500),
            Vehicle(name='Work Truck', make='Volvo', model='FH16', year=2019, type='TRUCK', current_odometer_km=120000),
            Vehicle(name='Family SUV', make='Honda', model='CR-V', year=2022, type='CAR', current_odometer_km=15000),
        ]
        
        created_vehicles = []
        for v in vehicles:
            v.save()
            created_vehicles.append(v)

        # Create some maintenance records
        oil_change = ServiceType.objects.get(name='Oil Change')
        
        # Corolla - Oil change done recently
        MaintenanceRecord.objects.create(
            vehicle=created_vehicles[0],
            service_type=oil_change,
            date=timezone.now().date() - timedelta(days=30),
            mileage_km=54000,
            cost=85.00,
            notes='Regular maintenance'
        )

        # Ducati - Chain lube overdue (last done at 3000, now 4500, interval 1000)
        chain_lube = ServiceType.objects.get(name='Chain Lube')
        MaintenanceRecord.objects.create(
            vehicle=created_vehicles[1],
            service_type=chain_lube,
            date=timezone.now().date() - timedelta(days=60),
            mileage_km=3000,
            cost=25.00,
            notes='Cleaned and lubed'
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
