---
title: "Enumerable#Zip 实现一下"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Enumerable#Zip 实现一下

> 原文链接: https://www.cnblogs.com/inday/archive/2010/06/21/1761811.html | 迁移自博客园

---

早上看到“[geff Zhang](http://www.cnblogs.com/shanyou/)”介绍了[Enumerable#Zip](http://www.cnblogs.com/shanyou/archive/2010/06/20/1761607.html)，闲来没事弄一个实现。

也谈不上思路，看了张兄的测试代码，先写了个简单的结构：
    
    
    public static IEnumerable<TResult> Zip<TFirst, TSencond, TResult>(
                this IEnumerable<TFirst> first, 
                IEnumerable<TSencond> sencond, 
                Func<TFirst, TSencond, TResult> func)
            {
                
            }

有了结构，实现就简单多了。张兄在文中介绍到“方法将第一个序列中的每个元素与第二个序列中有相同索引的元素合并。如果该序列不具有相同数目的元素，则直到它到达其中一个的末尾，该方法才合并序列。例如，如果一个序列有三个元素，另一个序列具有四个元素，那么结果序列将只有三个元素。”

要读到两个序列的各个元素，按照相同索引的元素，执行func，原先想想用foreach，for之类的，好像有点麻烦，为了简单，就直接转换成IEnumerator。

上代码，大家看了就明白了：
    
    
    public static IEnumerable<TResult> Zip<TFirst, TSencond, TResult>(
                this IEnumerable<TFirst> first, 
                IEnumerable<TSencond> sencond, 
                Func<TFirst, TSencond, TResult> func)
            {
                var firsttor = first.GetEnumerator();
                var sencondtor = sencond.GetEnumerator();
    
                while (firsttor.MoveNext())
                {
                    if (sencondtor.MoveNext())
                    {
                        yield return func(firsttor.Current, sencondtor.Current);
                    }
                }
            }

随便写的，也没在意性能方面，等大家一起讨论下好了。

附上测试代码：
    
    
    int[] numberic = new int[] { 1, 2, 3, 4 };
                string[] words = new string[] { "a", "b", "c", "d" };
                int[] numbericDiff = new int[] { 1, 2, 3 };
    
                var result = numberic.Zip(words, (a, b) => a + " " + b);
    
                foreach (var r in result)
                {
                    Console.WriteLine(r);
                }
    
                result = numbericDiff.Zip(words, (a, b) => a + " " + b);
    
                foreach (var r in result)
                {
                    Console.WriteLine(r);
                }

结果：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/EnumerableZip_96D1/image_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/EnumerableZip_96D1/image_2.png)

PS：推一个旅游网站，大家工作之余也要放松自己嘛。

<http://www.sh-bus.com>

