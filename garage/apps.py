from django.apps import AppConfig


def _seed_default_service_types():
    """Create a minimal set of default ServiceType rows if none exist.

    This keeps the app usable immediately after `migrate` (no manual seed step).
    """
    from .models import ServiceType

    if ServiceType.objects.exists():
        return

    defaults = [
        # Common (ALL)
        {"name": "Oil Change", "vehicle_type": "ALL", "default_interval_km": 10000},
        {"name": "Brake Pad Replacement", "vehicle_type": "ALL", "default_interval_km": 30000},
        {"name": "Other", "vehicle_type": "ALL", "default_interval_km": None},
        # Bike-specific
        {"name": "Chain Lube", "vehicle_type": "BIKE", "default_interval_km": 800},
    ]

    ServiceType.objects.bulk_create([ServiceType(**d) for d in defaults])


class GarageConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'garage'

    def ready(self):
        # Auto-seed default service types after migrations.
        # This avoids an empty "Service Type" dropdown on a fresh install.
        from django.db.models.signals import post_migrate

        def _handler(**kwargs):
            try:
                _seed_default_service_types()
            except Exception:
                # Never fail app startup due to seeding.
                pass

        post_migrate.connect(_handler, sender=self)
