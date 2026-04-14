---
title: "Asp.NetCore利用缓存使用AOP方式防止重复提交"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Asp.NetCore利用缓存使用AOP方式防止重复提交

> 原文链接: https://www.cnblogs.com/inday/p/asp-net-core-aop-cache-lock-resubmit.html | 迁移自博客园

---

### 为什么要用？

有些时候经常会遇到重复提交的问题，为了避免这个问题，可以使用缓存锁的方式，主要是利用存取缓存比较快的原理。

当提交某个操作的时候，第一次提交会创建一个缓存，当有相同提交的时候，就可以判定为重复提交。当第一次提交完成或者抛错的时候，清除缓存。

### 使用什么方式？

使用AOP，也可以使用Filter，这里使用AOP：
    
    
    public class CacheLockAttribute : BaseAOPAttribute
    {
        readonly string _cacheKeyFormat;
        readonly string[] _keyDataFieldNames;
        readonly string _errorMessage;
        readonly int _objectIndex;
        readonly int _expiredMinutes;
    
        public CacheLockAttribute(string cacheKeyFormat, string[] keyDataFieldNames, string errorMessage,
            int objectIndex=0, int expiredMinutes=15)
        {
            _cacheKeyFormat = cacheKeyFormat;
            _keyDataFieldNames = keyDataFieldNames;
            _errorMessage = errorMessage;
            _objectIndex = objectIndex;
            _expiredMinutes = expiredMinutes;
        }
    
        string cacheKey = string.Empty;
    
        public override async Task Befor(IAOPContext context)
        {
            cacheKey = await CreateCacheKey(context);
            var cacheService = GetCacheService(context);
            if (await cacheService.HasCache(cacheKey))
            {
                throw new BusException(_errorMessage);
            }
    
            await cacheService.SetData(cacheKey, cacheKey, _expiredMinutes);
        }
    
        public override Task After(IAOPContext context) => ClearLockCache(context);
    
        public override Task HandlerException(IAOPContext context) => ClearLockCache(context);
    
        private async Task ClearLockCache(IAOPContext context)
        {
            if (cacheKey.IsNotNullOrEmpty())
            {
                var cacheService = GetCacheService(context);
                await cacheService.Remove(cacheKey);
            }
        }
    
        async Task<string> CreateCacheKey(IAOPContext context)
        {
            var obj = context.Arguments[_objectIndex];
            var cacheKeyDatas = _keyDataFieldNames.Select(s => obj.GetPropertyValue(s)).ToArray();
            return string.Format(_cacheKeyFormat, cacheKeyDatas);
        }
    
        ICacheService GetCacheService(IAOPContext context) => 
            context.ServiceProvider.GetService<ICacheService>();
    }
    

### 单元测试：
    
    
    public class CacheLockAopTests : BaseTests
    {
        [Fact(DisplayName = "cache lock tests")]
        public async Task CacheLockTests()
        {
            var mockAop = new Mock<IAOPContext>();
            var mockCacheService = new Mock<ICacheService>();
            var cacheDict = new Dictionary<string, string>();
            var obj = new { Id = "123", Name = "james" };
    
            mockCacheService.Setup(m => m.HasCache(It.IsAny<string>()))
                .Returns((string s) => Task.FromResult(cacheDict.ContainsKey(s)));
            mockCacheService.Setup(m => m.SetData(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns((string key, string value, int m) =>
                {
                    cacheDict.Add(key, value);
                    return Task.CompletedTask;
                });
            mockCacheService.Setup(m => m.Remove(It.IsAny<string>())).Returns((string key) =>
            {
                cacheDict.Remove(key);
                return Task.CompletedTask;
            });
    
            mockAop.Setup(a => a.ServiceProvider.GetService(typeof(ICacheService)))
                .Returns(() => mockCacheService.Object);
    
            mockAop.Setup(a => a.Arguments).Returns(() => new []{obj});
            CacheLockAttribute cacheLockAttribute_1 =
                new CacheLockAttribute("test_key_{0}_{1}", new[] { "Id", "Name" }, "test error");
            CacheLockAttribute cacheLockAttribute_2 =
                new CacheLockAttribute("test_key_{0}_{1}", new[] { "Id", "Name" }, "test error");
            await cacheLockAttribute_1.Befor(mockAop.Object);
            Assert.Single(cacheDict);
            await Assert.ThrowsAsync<BusException>(async () =>
            {
                await cacheLockAttribute_2.Befor(mockAop.Object);
            });
            Assert.Single(cacheDict);
            await cacheLockAttribute_1.After(mockAop.Object);
            Assert.Empty(cacheDict);
        }
        
    }
    

### 如何使用？

在某个提交的方法上，加上`[CacheLock(keyFormat, datafileds, errormessage, index, expiredMinutes]`

  * keyFormat：缓存键的Format
  * datafileds：对象数据的字段名数组
  * errormessage：抛错的错误信息
  * index：参数中的第几个参数
  * expiredMinutes：过期时间（分钟）默认15分钟



举例：
    
    
    [CacheLock("payment_record_{0}", new []{"Id"}, "请不要重复提交")]
    public async Task AddDataAsync(PaymentRecord data)
    {
        await Task.Delay(5000);
    }
    

