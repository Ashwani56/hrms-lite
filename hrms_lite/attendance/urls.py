from django.urls import path
from .views import AttendanceListCreateView, AttendanceDeleteView

urlpatterns = [
    path("attendance/", AttendanceListCreateView.as_view(), name="attendance-list-create"),
    path("attendance/<int:pk>/", AttendanceDeleteView.as_view(), name="attendance-delete"),
]