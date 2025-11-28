from django.urls import path
from . import views

urlpatterns = [
    path('', views.DashboardView.as_view(), name='dashboard'),
    path('garage/', views.VehicleListView.as_view(), name='vehicle_list'),
    path('garage/add/', views.VehicleCreateView.as_view(), name='vehicle_add'),
    path('garage/<int:pk>/', views.VehicleDetailView.as_view(), name='vehicle_detail'),
    path('garage/<int:pk>/edit/', views.VehicleUpdateView.as_view(), name='vehicle_edit'),
    path('garage/<int:pk>/delete/', views.VehicleDeleteView.as_view(), name='vehicle_delete'),
    path('garage/<int:vehicle_id>/log/', views.MaintenanceRecordCreateView.as_view(), name='log_service'),
    path('maintenance/<int:pk>/delete/', views.MaintenanceRecordDeleteView.as_view(), name='delete_service'),
    path('api/predict-cost/', views.predict_cost_view, name='predict_cost'),
]
