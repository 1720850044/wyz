# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from  django.http import  HttpResponse
from  django.template import  loader,RequestContext
from django.shortcuts import render,redirect
from booktest.models import BookInfo,HeroInfo

def my_render(request,template_path,context_dict={}):
    temp = loader.get_template(template_path)
    context = RequestContext(request,context_dict)
    res_html = temp.render(context)
    return  HttpResponse(res_html)


def index(request):
    return render(request,'index.html',{'content':'jiantianzhenghao'})
def login(request):
    return render(request,'login.html')

def show_books(request):
    books = BookInfo.objects.all()
    return render(request, 'show_books.html', {'books': books})

def books_info(request):
    books = BookInfo.objects.all()
    booksList = []
    for item in books:
        booksList += [{
            'btitle': item.btitle
        }]
    return JsonResponse(booksList, safe=False)

def detail(request,bid):
    book = BookInfo.objects.get(id=bid)
    heros = book.heroinfo_set.all()
    return render(request, 'detail.html', {'books': book,'heros':heros})
