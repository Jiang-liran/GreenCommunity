from django.http import HttpResponse
from django.shortcuts import render
import datetime

def runoob(request):
    # 模板操作
    # context = {}
    # context['hello'] = 'Hello World'
    # return render(request, 'runoob.html', context)
    # 列表操作
    # views_list = ["name1", "name2", "name3"]
    # return render(request, "runoob.html", {"views_list": views_list})
    # 模板过滤器操作——{{ time|date:"Y-m-d H:i:s" }}
    # now = datetime.datetime.now()
    # return render(request, "runoob.html", {"time":now})
    # safe过滤器
    # views_str = "<a href='https://www.runoob.com/'>点击跳转</a>"
    # return render(request, "runoob.html", {"views_str": views_str})
    # 循环操作 for标签
    # views_list = ["菜鸟教程","菜鸟教程1","菜鸟教程2","菜鸟教程3",]
    # return render(request, "runoob.html", {"views_list": views_list})
    # 静态图片
    name = "菜鸟教程"
    return render(request, "runoob.html", {"name": name})

def hello(request):
    return HttpResponse("Hello world ! ")