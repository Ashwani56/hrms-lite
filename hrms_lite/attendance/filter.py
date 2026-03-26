import django_filters
from .models import Attendance


class AttendanceFilter(django_filters.FilterSet):
    employee_id = django_filters.CharFilter(
        field_name="employee__employee_id",
        lookup_expr="icontains"
    )
    employee_name = django_filters.CharFilter(
        field_name="employee__full_name",
        lookup_expr="icontains"
    )
    status = django_filters.CharFilter(
        field_name="status",
        lookup_expr="iexact"
    )
    date = django_filters.DateFilter(field_name="date")
    date_from = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    date_to = django_filters.DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = Attendance
        fields = ["employee_id", "employee_name", "status", "date", "date_from", "date_to"]