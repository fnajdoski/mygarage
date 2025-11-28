from django.db import models
from django.utils import timezone
from django.db.models import Q

class Vehicle(models.Model):
    VEHICLE_TYPES = [
        ('CAR', 'Car'),
        ('BIKE', 'Bike'),
        ('TRUCK', 'Truck'),
    ]

    name = models.CharField(max_length=100)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    type = models.CharField(max_length=10, choices=VEHICLE_TYPES)
    image_url = models.URLField(blank=True, null=True)
    current_odometer_km = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model} ({self.name})"

    def get_maintenance_status(self):
        """
        Returns a list of dictionaries representing the status of each service type.
        """
        status_list = []
        # Get all service types for this vehicle type or ALL
        service_types = ServiceType.objects.filter(models.Q(vehicle_type=self.type) | models.Q(vehicle_type='ALL'))

        for service in service_types:
            last_record = self.maintenance_records.filter(service_type=service).order_by('-date', '-mileage_km').first()
            
            status = {
                'service_name': service.name,
                'default_interval_km': service.default_interval_km,
                'last_performed_km': last_record.mileage_km if last_record else None,
                'last_performed_date': last_record.date if last_record else None,
                'is_overdue': False,
                'due_in_km': None,
                'overdue_by_km': None,
                'message': ''
            }

            if service.default_interval_km:
                if last_record:
                    km_since = self.current_odometer_km - last_record.mileage_km
                    if km_since >= service.default_interval_km:
                        status['is_overdue'] = True
                        status['overdue_by_km'] = km_since - service.default_interval_km
                        status['message'] = f"Overdue by {status['overdue_by_km']} km"
                    else:
                        status['due_in_km'] = service.default_interval_km - km_since
                        status['message'] = f"Due in {status['due_in_km']} km"
                else:
                    # Never performed
                    status['message'] = "Never performed"
                    # If never performed, is it overdue? 
                    # Assuming if odometer > interval, it's overdue (simplified logic)
                    if self.current_odometer_km > service.default_interval_km:
                         status['is_overdue'] = True
                         status['overdue_by_km'] = self.current_odometer_km - service.default_interval_km
                         status['message'] = f"Never performed (Overdue by {status['overdue_by_km']} km)"
            
            status_list.append(status)
        
        return status_list

    @property
    def is_overdue(self):
        """Returns True if any service is overdue."""
        statuses = self.get_maintenance_status()
        return any(s['is_overdue'] for s in statuses)

class ServiceType(models.Model):
    VEHICLE_TYPES = [
        ('CAR', 'Car'),
        ('BIKE', 'Bike'),
        ('TRUCK', 'Truck'),
        ('ALL', 'All'),
    ]

    name = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=10, choices=VEHICLE_TYPES, default='ALL')
    default_interval_km = models.PositiveIntegerField(null=True, blank=True)
    default_interval_months = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.vehicle_type})"

class MaintenanceRecord(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='maintenance_records')
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    mileage_km = models.PositiveIntegerField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        # Update vehicle odometer if this record is newer/higher
        if self.mileage_km > self.vehicle.current_odometer_km:
            self.vehicle.current_odometer_km = self.mileage_km
            self.vehicle.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.service_type.name} on {self.vehicle.name} ({self.date})"
