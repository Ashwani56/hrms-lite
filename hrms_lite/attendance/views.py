from datetime import datetime
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import Attendance
from .serializers import AttendanceSerializer
from .filter import AttendanceFilter


class AttendanceListCreateView(generics.ListCreateAPIView):
    queryset = Attendance.objects.select_related("employee").all()
    serializer_class = AttendanceSerializer
    filterset_class = AttendanceFilter

    def list(self, request, *args, **kwargs):
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        if date_from and date_to:
            try:
                parsed_from = datetime.strptime(date_from, "%Y-%m-%d").date()
                parsed_to = datetime.strptime(date_to, "%Y-%m-%d").date()
                if parsed_from > parsed_to:
                    return Response(
                        {
                            "success": False,
                            "message": "Invalid date range.",
                            "errors": {
                                "date_range": ["date_from cannot be greater than date_to."]
                            },
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except ValueError:
                return Response(
                    {
                        "success": False,
                        "message": "Invalid date format.",
                        "errors": {
                            "date": ["Use YYYY-MM-DD format."]
                        },
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "success": True,
                "message": "Attendance records fetched successfully.",
                "count": queryset.count(),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Attendance marked successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        detail_error = serializer.errors.get("detail")
        if detail_error:
            return Response(
                {
                    "success": False,
                    "message": detail_error[0],
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": False,
                "message": "Validation failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

   

class AttendanceDeleteView(generics.DestroyAPIView):
    queryset = Attendance.objects.select_related("employee").all()
    serializer_class = AttendanceSerializer

    def get_object(self):
        try:
            return super().get_object()
        except Exception:
            raise NotFound("Attendance record not found.")

    def destroy(self, request, *args, **kwargs):
        attendance = self.get_object()
        attendance.delete()
        return Response(
            {
                "success": True,
                "message": "Attendance record deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )