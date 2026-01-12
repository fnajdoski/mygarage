from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
import os

from garage.ml.train_model import train_model, DEFAULT_FEATURES, DEFAULT_TARGET


class Command(BaseCommand):
    help = "Train (or retrain) the maintenance cost estimation model and save it to garage/ml/models/."

    def add_arguments(self, parser):
        parser.add_argument("--dataset", required=True, help="Path to CSV dataset")
        parser.add_argument("--target", default=DEFAULT_TARGET, help="Target column name (default: Total Cost)")
        parser.add_argument(
            "--features",
            nargs="*",
            default=DEFAULT_FEATURES,
            help="Feature columns to use (space-separated)",
        )

    def handle(self, *args, **options):
        dataset = options["dataset"]
        target = options["target"]
        features = options["features"]

        if not os.path.exists(dataset):
            raise CommandError(f"Dataset file not found: {dataset}")

        out_dir = os.path.join(settings.BASE_DIR, "garage", "ml", "models")
        self.stdout.write(self.style.NOTICE("Training cost model..."))
        train_model(dataset, target, features, out_dir)
        self.stdout.write(self.style.SUCCESS("Done."))
