# Generated by Django 5.2.3 on 2025-07-05 12:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="InventoryItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True)),
                ("quantity", models.PositiveIntegerField(default=0)),
                ("location", models.CharField(max_length=255)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
