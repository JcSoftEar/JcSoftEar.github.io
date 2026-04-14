---
title: "打造属于自己的支持版本迭代的Asp.Net Web Api Route"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 打造属于自己的支持版本迭代的Asp.Net Web Api Route

> 原文链接: https://www.cnblogs.com/inday/p/custom-version-webapi-route.html | 迁移自博客园

---

在目前的主流架构中，我们越来越多的看到web Api的存在，小巧，灵活，基于Http协议，使它在越来越多的微服务项目或者移动项目充当很好的service endpoint。

# 问题

以Asp.Net Web Api 为例，随着业务的扩展，产品的迭代，我们的web api也在随之变化，很多时候会出现多个版本共存的现象，这个时候我们就需要设计一个支持版本号的web api link，比如：

原先：http://www.test.com/api/{controller}/{id} 

如今：http://www.test.com/api/{version}/{controller}/{id}

在我们刚设计的时候，有可能没有考虑版本的问题，我看到很多的项目都会在link后加入一个“?version=”的方式，这种方式确实能够解决问题，但对Asp.Net Web Api来说，进入的还是同一个Controller，我们需要在同一个Action中进行判断版本号，例如：

http://www.test.com/api/bolgs?version=v2[HttpGet]
    
    
    public class BlogsController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get([FromUri]string version = "")
        {
            if (!String.IsNullOrEmpty(version))
            {
                return new string[] { $"{version} blog1", $"{version} blog2" };
            }
            return new string[] { "blog1", "blog2" };
        }
    }

我们看到我们通过判断url中的version参数进行对应的返回，为了确保原先接口的可用，我们需要对参数赋上默认值，虽然能够解决我们的版本迭代问题，但随着版本的不断更新，你会发现这个Controller会越来越臃肿，维护越来越困难，因为这种修改已经严重违反了OCP（Open-Closed Principle），最好的方式是不修改原先的Controller，而是新建新的Controller，放在对应的目录中（或者项目中），比如：

[![image](https://images2015.cnblogs.com/blog/4871/201707/4871-20170713135820400-96981671.png)](http://images2015.cnblogs.com/blog/4871/201707/4871-20170713135815806-665429116.png)

> 为了不影响原先的项目，我们尽量不要改动原Controller的Namespace，除非你有十足的把握没有影响，不然请尽量只是移动到目录。

ok，为了保持原接口的映射，我们需要在WebApiConfig.Register中注册支持版本号的Route映射：
    
    
    config.Routes.MapHttpRoute(
        name: "DefaultVersionApi",
        routeTemplate: "api/{version}/{controller}/{id}",
        defaults: new { id = RouteParameter.Optional }
    );

打开浏览器或者postman，输入原先的api url，你会发现这样的错误：

[![image](https://images2015.cnblogs.com/blog/4871/201707/4871-20170713135822415-352763344.png)](http://images2015.cnblogs.com/blog/4871/201707/4871-20170713135821165-743047654.png)

那是因为web api 查找Controller的时候，只会根据ClassName进行查找的，当出现相同ClassName的时候，就会报这个错误，这时候我们就需要打造自己的Controller Selector，好在微软留了一个接口给到我们：IHttpControllerSelector。不过为了兼容原先的api（有些不在我们权限范围内的api，不加版本号的那种），我们还是直接集成DefaultHttpControllerSelector比较好，我们给定一个规则，不负责我们版本迭代的api，就让它走原先的映射。

# 思路

1、项目启动的时候，先把符合条件的Controller加入到一个字典中

2、判断request，符合规则的，我们返回我们制定的controller。

[![image](https://images2015.cnblogs.com/blog/4871/201707/4871-20170713135823665-403586513.png)](http://images2015.cnblogs.com/blog/4871/201707/4871-20170713135822993-1469909787.png)

[![image](https://images2015.cnblogs.com/blog/4871/201707/4871-20170713135828337-1091774483.png)](http://images2015.cnblogs.com/blog/4871/201707/4871-20170713135824681-1193013098.png)

# 打造属于自己的Selector

思路有了，那改造起来也非常简单，今天我们先做一个简单的，等有时间改成可配置的。

第一步，我们先创建一个Selector类，继承自DefaultHttpControllerSelector，然后初始化的时候创建一个属于我们自己的字典：
    
    
    public class VersionHttpControllerSelector : DefaultHttpControllerSelector
    {
        private readonly HttpConfiguration _configuration;
        private readonly Lazy<Dictionary<string, HttpControllerDescriptor>> _lazyMappingDictionary;
        private const string DefaultVersion = "v1"; //默认版本号，因为之前的api我们没有版本号的概念
        private const string DefaultNamespaces = "WebApiVersions.Controllers"; //为了演示方便，这里就用到一个命名空间
        private const string RouteVersionKey = "version"; //路由规则中Version的字符串
        private const string DictKeyFormat = "{0}.{1}";
        public VersionHttpControllerSelector(HttpConfiguration configuration):base(configuration)
        {
            _configuration = configuration;
            _lazyMappingDictionary = new Lazy<Dictionary<string, HttpControllerDescriptor>>(InitializeControllerDict);
        }
    
        private Dictionary<string, HttpControllerDescriptor> InitializeControllerDict()
        {
            var result = new Dictionary<string, HttpControllerDescriptor>(StringComparer.OrdinalIgnoreCase);
            var assemblies = _configuration.Services.GetAssembliesResolver();
            var controllerResolver = _configuration.Services.GetHttpControllerTypeResolver();
            var controllerTypes = controllerResolver.GetControllerTypes(assemblies);
    
            foreach(var t in controllerTypes)
            {
                if (t.Namespace.Contains(DefaultNamespaces)) //符合NameSpace规则
                {
                    var segments = t.Namespace.Split(Type.Delimiter);
                    var version = t.Namespace.Equals(DefaultNamespaces, StringComparison.OrdinalIgnoreCase) ?
                        DefaultVersion : segments[segments.Length - 1];
                    var controllerName = t.Name.Remove(t.Name.Length - DefaultHttpControllerSelector.ControllerSuffix.Length);
                    var key = string.Format(DictKeyFormat, version, controllerName);
                    if (!result.ContainsKey(key))
                    {
                        result.Add(key, new HttpControllerDescriptor(_configuration, t.Name, t));
                    }
                }
            }
    
            return result;
        }
    }

  


有了字典接下来就好办了，只需要分析request就好了，符合我们版本要求的，就从我们的字典中查找对应的Descriptor，如果找不到，就走默认的，这里我们需要重写SelectController方法：
    
    
    public override HttpControllerDescriptor SelectController(HttpRequestMessage request)
    {
        IHttpRouteData routeData = request.GetRouteData();
        if (routeData == null)
            throw new HttpResponseException(HttpStatusCode.NotFound);
    
        var controllerName = GetControllerName(request);
        if (String.IsNullOrEmpty(controllerName))
            throw new HttpResponseException(HttpStatusCode.NotFound);
    
        var version = DefaultVersion;
        if (IsVersionRoute(routeData, out version))
        {
            var key = String.Format(DictKeyFormat, version, controllerName);
            if (_lazyMappingDictionary.Value.ContainsKey(key))
            {
                return _lazyMappingDictionary.Value[key];
            }
    
            throw new HttpResponseException(HttpStatusCode.NotFound);
        }
    
        return base.SelectController(request);
    }
    
    private bool IsVersionRoute(IHttpRouteData routeData, out string version)
    {
        version = String.Empty;
        var prevRouteTemplate = "api/{controller}/{id}";
        object outVersion;
        if(routeData.Values.TryGetValue(RouteVersionKey, out outVersion))   //先找符合新规则的路由版本
        {
            version = outVersion.ToString();
            return true;
        }
    
        if (routeData.Route.RouteTemplate.Contains(prevRouteTemplate))  //不符合再比对是否符合原先的api路由
        {
            version = DefaultVersion;
            return true;
        }
    
        return false;
    }

完成这个类后，我们去WebApiConfig.Register中进行替换操作：
    
    
    config.Services.Replace(typeof(IHttpControllerSelector), new VersionHttpControllerSelector(config));

ok，再次打开浏览器，输入http://www.xxx.com/api/blogs 和 http://www.xxx.com/api/v2/blogs ,这时应该能看到正确的执行：

[![image](https://images2015.cnblogs.com/blog/4871/201707/4871-20170713135829712-1113377347.png)](http://images2015.cnblogs.com/blog/4871/201707/4871-20170713135829197-1967755969.png)

[![image](https://images2015.cnblogs.com/blog/4871/201707/4871-20170713135835368-448410168.png)](http://images2015.cnblogs.com/blog/4871/201707/4871-20170713135833353-1397777858.png)

# 写在最后

今天我们打造了一个简单符合webapi版本号更新迭代的ControllerSelector，不过还不是很完善，因为很多都是hard code，后面我会做一个支持配置的ControllerSelector放到github上。

之前一直在研究eShopOnContrainers，最近也在研究，不过工作确实有点忙，见谅见谅，如果大家.Net有什么问题或者喜欢技术交友的，都可以加QQ群：376248054

