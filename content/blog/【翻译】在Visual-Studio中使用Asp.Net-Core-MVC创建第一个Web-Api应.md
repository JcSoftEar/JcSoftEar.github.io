---
title: "【翻译】在Visual Studio中使用Asp.Net Core MVC创建第一个Web Api应用（二）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 【翻译】在Visual Studio中使用Asp.Net Core MVC创建第一个Web Api应用（二）

> 原文链接: https://www.cnblogs.com/inday/p/6288714.html | 迁移自博客园

---

# 运行应用

In Visual Studio, press CTRL+F5 to launch the app. Visual Studio launches a browser and navigates to http://localhost:port/api/values, where _port_ is a randomly chosen port number. If you're using Chrome, Edge or Firefox, the data will be displayed. If you're using IE, IE will prompt to you open or save the _values.json_ file. Navigate to the `Todo`controller we just created `<http://localhost:port/api/todo>`.

在Visual Studio中，按CTRL+F5运行程序。Visual Studio将运行默认浏览器并导航至`<http://localhost:port/api/values>`, 这个port端口是自动生成。如果你使用的是Chrome，Edge或者Firefox，将直接显示数据。如果你使用IE，IE会提示你打开或保存valuse.json文件。我们输入[http://localhost:port/api/todo](http://localhost:port/api/todo) 将导航到TodoController。

# 执行其他的CRUD操作

We'll add `Create`, `Update`, and `Delete` methods to the controller. These are variations on a theme, so I'll just show the code and highlight the main differences. Build the project after adding or changing code.

我们将在Controller中添加Create、Update和Delete方法。模板中已经创建这些方法，我将会高亮我添加的代码。添加或者更改代码后生成项目。
    
    
    [HttpPost]
    public IActionResult Create([FromBody] TodoItem item)
    {
        if (item == null)
        {
            return BadRequest();
        }
        TodoItems.Add(item);
        return CreatedAtRoute("GetTodo", new { id = item.Key }, item);
    }

This is an HTTP POST method, indicated by the [`[HttpPost]`](https://docs.asp.net/projects/api/en/latest/autoapi/Microsoft/AspNetCore/Mvc/HttpPostAttribute/index.html) attribute. The [`[FromBody]`](https://docs.asp.net/projects/api/en/latest/autoapi/Microsoft/AspNetCore/Mvc/FromBodyAttribute/index.html) attribute tells MVC to get the value of the to-do item from the body of the HTTP request. 

这使一个HTTP POST方法，使用了HTTPPost特性。FromBody特性告诉了MVC我们从HTTP request中获取to-do项所需要的值。

The `CreatedAtRoute` method returns a 201 response, which is the standard response for an HTTP POST method that creates a new resource on the server. `CreateAtRoute` also adds a Location header to the response. The Location header specifies the URI of the newly created to-do item. See [10.2.2 201 Created](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).

这个CreatedAtRoute方法返回一个201响应，它是当HTTP POST在服务器上创建新资源后的标准响应。CreateAtRoute方法在响应中添加了定位头信息，这个定位头信息提供了这个新对象的URI。详见：[10.2.2 201 Created](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)。

# 使用Postman发送一个创建的请求

![](https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/first-web-api/_static/pmc.png)

  * Set the HTTP method to `POST`

  * `设置HTTP方法为POST`

  * Tap the **Body** radio button

  * 点击Body按钮

  * Tap the **raw** radio button

  * 选中raw选项

  * Set the type to JSON

  * 设置类型为JSON

  * In the key-value editor, enter a Todo item such as `{"Name":"<your to-do item>"}`

  * `在key-value编辑器中，输入一个Todo项，比如`{"Name":"<your to-do item>"}``

  * Tap **Send**

  * **点击Send**




Tap the Headers tab and copy the **Location** header: 

点击Headers选项卡，复制Location信息： 

![](https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/first-web-api/_static/pmget.png)

You can use the Location header URI to access the resource you just created. Recall the `GetById` method created the `"GetTodo"` named route: 

你可以使用这个定位头信息中的URI访问你刚创建的资源。还记得我们在GetById中创建的"GetTodo"路由：
    
    
    [HttpGet("{id}", Name = "GetTodo")]
    public IActionResult GetById(string id)

# 更新
    
    
    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] TodoItem item)
    {
        if (item == null || item.Key != id)
        {
            return BadRequest();
        }
    
        var todo = TodoItems.Find(id);
        if (todo == null)
        {
            return NotFound();
        }
    
        TodoItems.Update(item);
        return new NoContentResult();
    }

`Update` is similar to `Create`, but uses HTTP PUT. The response is [204 (No Content)](http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html). According to the HTTP spec, a PUT request requires the client to send the entire updated entity, not just the deltas. To support partial updates, use HTTP PATCH.

Update类似于Create，但使用的HTTP Put，响应代码204（无内容）。根据HTTP规范，PUT请求需要客户端发送整个更新实体，而不是部分。如果需要支持部分更新，需要使用HTTP PATCH。

![](https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/first-web-api/_static/pmcput.png)

# 删除
    
    
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var todo = TodoItems.Find(id);
        if (todo == null)
        {
            return NotFound();
        }
    
        TodoItems.Remove(id);
        return new NoContentResult();
    }

The response is [204 (No Content)](http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html). 

相应代码为：204. 

![](https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/first-web-api/_static/pmd.png)

# 原文链接

<https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/first-web-api>

