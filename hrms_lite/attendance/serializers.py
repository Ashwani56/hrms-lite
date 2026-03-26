from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.full_name", read_only=True)
    employee_code = serializers.CharField(source="employee.employee_id", read_only=True)

    class Meta:
        model = Attendance
        fields = [
            "id",
            "employee",
            "employee_code",
            "employee_name",
            "date",
            "status",
            "created_at",
            "updated_at",
        ]
        validators = []  # IMPORTANT: default unique_together validator hata do

    def validate_status(self, value):
        allowed = ["Present", "Absent"]
        if value not in allowed:
            raise serializers.ValidationError("Status must be either Present or Absent.")
        return value

    def validate(self, attrs):
        employee = attrs.get("employee")
        date = attrs.get("date")

        if not employee:
            raise serializers.ValidationError({"employee": "Employee is required."})

        if not date:
            raise serializers.ValidationError({"date": "Date is required."})

        qs = Attendance.objects.filter(employee=employee, date=date)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError({
                "detail": "Attendance already exists for this employee on this date."
            })

        return attrs