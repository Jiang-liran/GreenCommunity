- # Django 学习笔记

  ## 项目简介

  本文件夹用于记录本人（江离然，Wjh）在学习 **Django** 过程中所做的笔记、练习项目以及相关资源。通过系统化的学习和实践，逐步掌握 Django 框架的核心概念和开发技能，为后续在 **绿色社区：环保行动与低碳出行综合平台** 项目中应用 Django 做好准备。

  ## 学习目标

  - 理解 Django 的基本概念和架构
  - 掌握 Django 的模型（Models）、视图（Views）和模板（Templates）
  - 学习 Django 的表单处理和用户认证
  - 掌握 Django 的管理后台定制
  - 学习 Django 的中间件和信号
  - 掌握 Django REST Framework 的基本使用
  - 完成至少一个完整的 Django 项目

  ## 学习进展

  ### 2024-10-01 学习内容

  今天的学习主要集中在 Django 的基础安装、创建第一个入门项目以及理解和使用 Django 的模板系统。具体内容包括：

  1. **Django 的安装**
     
     - 通过 `pip` 安装 Django：
       ```bash
       pip install django
       ```
     - 验证安装是否成功：
       ```bash
       django-admin --version
       ```
     - 了解 Django 的版本和安装路径。
     
  2. **创建第一个入门项目（Hello World）**
     - 使用 `django-admin` 创建一个新的 Django 项目：
       ```bash
       django-admin startproject hello_world
       ```
     - 进入项目目录并运行开发服务器：
       ```bash
       cd hello_world
       python manage.py runserver
       ```
     - 在浏览器中访问 [http://127.0.0.1:8000/](http://127.0.0.1:8000/) ，看到 Django 的欢迎页面，确认项目成功运行。

  3. **Django 的模板系统**
     - 理解模板（Templates）的作用：用于定义应用的前端界面，与视图（Views）分离。
     - 创建一个简单的模板文件 `runoob.html`：
     - 配置视图（View）以渲染模板：
     - 设置 URL 路由：
     - 在浏览器中访问 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)，看到自定义的页面，验证模板系统的基本使用。
     - 以及各种标签模板的使用，巨多，详见模板文件或者[菜鸟教程]([Django 模板 | 菜鸟教程 (runoob.com)](https://www.runoob.com/django/django-template.html))

  ## 文件夹结构

  后续补充

  ## 学习资源

  ### 书籍

  - [《Django for Beginners》](https://djangoforbeginners.com/)
  - [《Two Scoops of Django》](https://www.twoscoopspress.com/products/two-scoops-of-django-3-x)

  ### 在线课程

  - [Django官方教程](https://docs.djangoproject.com/en/4.0/intro/tutorial01/)
  - [Udemy上的Django课程](https://www.udemy.com/topic/django/)

  ### 文章与文档

  - [Django官方文档](https://docs.djangoproject.com/en/4.0/)
  - [Real Python的Django教程](https://realpython.com/tutorials/django/)

  ## 贡献

  目前本项目由本人独立开发完成，主要用于记录学习过程和练习。未来可能会开放更多功能或接受外部贡献。

  ## 许可协议

  本项目采用 [MIT 许可协议](LICENSE) 进行许可。详情请参阅 `LICENSE` 文件。

  ## 联系方式

  如有任何问题或建议，欢迎通过以下方式联系我：

  - **邮箱**：747329069@qq.com
  - **GitHub**：[Jiang-liran](https://github.com/Jiang-liran)

  ## 致谢

  - 感谢所有提供优质Django学习资源的作者和社区成员。
  - 感谢家人和朋友的支持与鼓励。