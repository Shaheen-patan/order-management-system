# Generated by Django 5.2.3 on 2025-07-05 13:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("inventory", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="inventoryitem",
            name="low_stock_threshold",
            field=models.PositiveIntegerField(default=5),
        ),
    ]
