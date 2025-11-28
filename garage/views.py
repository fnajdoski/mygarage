from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
from django.urls import reverse_lazy
from django.db.models import Max, F
from .models import Vehicle, MaintenanceRecord, ServiceType
from django import forms

class DashboardView(TemplateView):
    template_name = 'garage/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        vehicles = Vehicle.objects.all()
        
        # Logic for overdue tasks
        global_attention_needed = any(v.is_overdue for v in vehicles)
        context['vehicles'] = vehicles
        context['global_attention_needed'] = global_attention_needed
        return context

class VehicleListView(ListView):
    model = Vehicle
    template_name = 'garage/vehicle_list.html'
    context_object_name = 'vehicles'

class VehicleDetailView(DetailView):
    model = Vehicle
    template_name = 'garage/vehicle_detail.html'
    context_object_name = 'vehicle'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['history'] = self.object.maintenance_records.order_by('-date', '-mileage_km')
        context['service_types'] = ServiceType.objects.all()
        return context

class VehicleCreateView(CreateView):
    model = Vehicle
    fields = ['name', 'make', 'model', 'year', 'type', 'image_url', 'current_odometer_km']
    template_name = 'garage/vehicle_form.html'
    success_url = reverse_lazy('vehicle_list')

class VehicleUpdateView(UpdateView):
    model = Vehicle
    fields = ['name', 'make', 'model', 'year', 'type', 'image_url', 'current_odometer_km']
    template_name = 'garage/vehicle_form.html'
    success_url = reverse_lazy('vehicle_list')

class VehicleDeleteView(DeleteView):
    model = Vehicle
    template_name = 'garage/vehicle_confirm_delete.html'
    success_url = reverse_lazy('vehicle_list')

class MaintenanceRecordCreateView(CreateView):
    model = MaintenanceRecord
    fields = ['service_type', 'date', 'mileage_km', 'cost', 'notes']
    template_name = 'garage/maintenance_form.html'

    def form_valid(self, form):
        form.instance.vehicle_id = self.kwargs['vehicle_id']
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('vehicle_detail', kwargs={'pk': self.kwargs['vehicle_id']})

class MaintenanceRecordDeleteView(DeleteView):
    model = MaintenanceRecord
    template_name = 'garage/maintenance_confirm_delete.html'
    
    def get_success_url(self):
        return reverse_lazy('vehicle_detail', kwargs={'pk': self.object.vehicle.pk})

from django.http import JsonResponse
from .ml.cost_estimator import predict_cost

def predict_cost_view(request):
    vehicle_type = request.GET.get('vehicle_type')
    service_type = request.GET.get('service_type')
    
    if not vehicle_type or not service_type:
        return JsonResponse({'error': 'Missing parameters'}, status=400)
    
    cost = predict_cost(vehicle_type, service_type)
    if cost is None:
        return JsonResponse({'error': 'Prediction failed'}, status=500)
    
    return JsonResponse({'estimated_cost': cost})
