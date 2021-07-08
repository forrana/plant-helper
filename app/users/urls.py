from django.urls import path

from . import views

urlpatterns = [
    path('activate/<token>/', views.activate, name='activate'),
]
