import django_filters
from .models import Employee


class EmployeeFilter(django_filters.FilterSet):
    employee_id = django_filters.CharFilter(field_name="employee_id", lookup_expr="icontains")
    full_name = django_filters.CharFilter(field_name="full_name", lookup_expr="icontains")
    email = django_filters.CharFilter(field_name="email", lookup_expr="icontains")
    department = django_filters.CharFilter(field_name="department", lookup_expr="icontains")

    class Meta:
        model = Employee
        fields = ["employee_id", "full_name", "email", "department"]