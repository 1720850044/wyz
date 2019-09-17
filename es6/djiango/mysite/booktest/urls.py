
from django.conf.urls import url
# from django.contrib import admin

# from  . import insert
from  booktest import views
urlpatterns = [
    url(r'^login$', views.login),
    url(r'^books$', views.show_books),
    url(r'^info$', views.books_info),
    url(r'^books/(\d+)$', views.detail),
]
