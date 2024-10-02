from django.urls import path

from . import views, testdb

urlpatterns = [
    path("runoob/", views.runoob, name="runoob"),
    path("testdb/", testdb.testdb, name="testdb"),
]
