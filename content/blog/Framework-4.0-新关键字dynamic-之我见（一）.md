---
title: "Framework 4.0 新关键字dynamic 之我见（一）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Framework 4.0 新关键字dynamic 之我见（一）

> 原文链接: https://www.cnblogs.com/inday/archive/2009/05/23/1487415.html | 迁移自博客园

---

大家好，好久没有写博客了，最近一段时间工作也比较忙，不过我还是会在空余时间去学习一些东西。 

微软在这个星期一，开放了VS2010和Framework4.0的Beta1版本的下载，所以我也花了1天的时间进行了下载和安装，因为系统现在是windows7，而且这次版本也是beta版本，所以把它安装在了虚拟机上，虽然只设置了1G的内存，不过跑起来还非常让人满意，没有像其他兄弟说的，很吃内存，很废cpu。 

其实先前已经使用过CTP版本了，也一直对新特性在做研究，在第一时间下载了beta版本后，发现其实和CTP版本区别不是很大。好了，废话不说了，说说今天的主题吧。 

在Framework 4.0 中，微软加入了新的关键字：dynamic 根据字的中文含义，我们就知道了，动态，一切都为动态。有了这个关键字，我们在写代码时就可以不用确定某个变量、属性、方法（不包含void方法，文中所说的方法都是不包含void的）的类型了，一切都交给Framework吧。或许有人会说更var好像一样，其实两者一点都不一样，这会在后面跟大家说说。先来看一段简单的代码： 

static void Main(string[] args) 

{ 

dynamic dynamicValue; 

dynamicValue = DateTime.Now; 

Console.WriteLine(dynamicValue.ToString("yyyy-MM-dd")); 

Console.WriteLine(dynamicValue.GetType()); 

Console.Read(); 

} 

非常简单的一段代码，我们用dynamic定义了一个变量，然后给它赋了一个时间类型的值，随后打印DateTime.ToString()方法，再打印这个动态变量的类型出来。这里要说一点，也是非常重要的一点： 

Dynamic 在没有运行的时候，是一个Object类型，其实也可以说没有Type的，它是在Runtime时才被确定是那种类型，所以这里的.ToString()方法，在IDE中是没有任何智能感知的，有点回到记事本的时代了，呵呵。 

其实在CTP版本中，已经是这样了，不过我觉得，虽然他在编译时不能确定他的类型，但所有的类型都是继承于Object类型的，为什么智能感知没有把Object的几个共有方法给感知出来呢？？？（我等了一个版本还是这样，真有点失望）。 

那我们来看看，到底程序为什么那么慢吧。用IL DASM看看。 

.method private hidebysig static void Main(string[] args) cil managed {  .entrypoint  // Code size 396 (0x18c)  .maxstack 12  .locals init ([0] object dynamicValue,  [1] class [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo[] CS$0$0000)  IL_0000: nop  IL_0001: call valuetype [mscorlib]System.DateTime [mscorlib]System.DateTime::get_Now()  IL_0006: box [mscorlib]System.DateTime  IL_000b: stloc.0  IL_000c: ldsfld class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Action`3<class [System.Core]System.Runtime.CompilerServices.CallSite,class [mscorlib]System.Type,object>> ConsoleApplication1.Program/'<Main>o__SiteContainer0'::'<>p__Site1'  IL_0011: brtrue.s IL_0052  IL_0013: ldc.i4.0  IL_0014: ldstr "WriteLine"  IL_0019: ldtoken ConsoleApplication1.Program  IL_001e: call class [mscorlib]System.Type [mscorlib]System.Type::GetTypeFromHandle(valuetype [mscorlib]System.RuntimeTypeHandle)  IL_0023: ldnull  IL_0024: ldc.i4.2  IL_0025: newarr [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo  IL_002a: stloc.1  IL_002b: ldloc.1  IL_002c: ldc.i4.0  IL_002d: ldc.i4.s 33  IL_002f: ldnull  IL_0030: newobj instance void [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo::.ctor(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfoFlags,  string)  IL_0035: stelem.ref  IL_0036: ldloc.1  IL_0037: ldc.i4.1  IL_0038: ldc.i4.0  IL_0039: ldnull  IL_003a: newobj instance void [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo::.ctor(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfoFlags,  string)  IL_003f: stelem.ref  IL_0040: ldloc.1  IL_0041: newobj instance void [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpInvokeMemberBinder::.ctor(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpCallFlags,  string,  class [mscorlib]System.Type,  class [mscorlib]System.Collections.Generic.IEnumerable`1<class [mscorlib]System.Type>,  class //省略N行  IL_0093: stelem.ref  IL_0094: ldloc.1  IL_0095: ldc.i4.1  IL_0096: ldc.i4.3  IL_0097: ldnull  IL_0098: newobj instance void [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo::.ctor(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfoFlags,  string)  IL_009d: stelem.ref  IL_009e: ldloc.1  IL_009f: newobj instance void [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpInvokeMemberBinder::.ctor(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpCallFlags,  string,  class [mscorlib]System.Type,  class [mscorlib]System.Collections.Generic.IEnumerable`1<class [mscorlib]System.Type>,  class [mscorlib]System.Collections.Generic.IEnumerable`1<class [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo>)  IL_00a4: call class [System.Core]System.Runtime.CompilerServices.CallSite`1<!0> class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Func`4<class [System.Core]System.Runtime.CompilerServices.CallSite,object,string,object>>::Create(class [System.Core]System.Runtime.CompilerServices.CallSiteBinder)  IL_00a9: stsfld class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Func`4<class [System.Core]System.Runtime.CompilerServices.CallSite,object,string,object>> ConsoleApplication1.Program/'<Main>o__SiteContainer0'::'<>p__Site2'  IL_00ae: br.s IL_00b0  IL_00b0: ldsfld class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Func`4<class [System.Core]System.Runtime.CompilerServices.CallSite,object,string,object>> ConsoleApplication1.Program/'<Main>o__SiteContainer0'::'<>p__Site2'  IL_00b5: ldfld !0 class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Func`4<class [System.Core]System.Runtime.CompilerServices.CallSite,object,string,object>>::Target  IL_00ba: ldsfld class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Func`4<class [System.Core]System.Runtime.CompilerServices.CallSite,object,string,object>> ConsoleApplication1.Program/'<Main>o__SiteContainer0'::'<>p__Site2'  IL_00bf: ldloc.0  IL_00c0: ldstr "yyyy-MM-dd"  IL_00c5: callvirt instance !3 class [mscorlib]System.Func`4<class [System.Core]System.Runtime.CompilerServices.CallSite,object,string,object>::Invoke(!0,  !1,  !2)  IL_00ca: callvirt instance void class [mscorlib]System.Action`3<class [System.Core]System.Runtime.CompilerServices.CallSite,class [mscorlib]System.Type,object>::Invoke(!0,  !1,  !2)  //再次省略N行  IL_0184: nop  IL_0185: call int32 [mscorlib]System.Console::Read()  IL_018a: pop  IL_018b: ret } // end of method Program::Main   
---  
  
晕死了，那么一大推东西，我们先看看初始化吧，原来编译器在这里把dynamic的变量类型定义成了object，因为是不确定的类型，所以。。。。它把System.Type进行迭代了（大概是这么个意思吧）。我的理解是，它先定义成object类型，然后在Runtime时，在用Invoke去调用ToString方法，省略的部分还有很多，其实都是因为它的不确定性，动态特性，所以把所有可能的类型都列举了出来，然后通过在runtime 的时候再判断和中类型，Invoke相应的方法。 

现在知道了吧，为什么会这么慢，初始是object Type 免不了要装箱、拆箱，还要Invoke等，能不慢吗？不过测试下来，如果你用了一个Int类型的话，程序会明显的快很多，其中的原因，大家也可以研究一下。 

Dynamic虽然是个好东西，不过因为很多时候的不确定因素，让程序在第一次运行的时候会造成很大程度的性能损耗，所以我建议大家一定要慎用，而且在你使用了dynamic类型后，因为它的动态特性，你将失去智能提示这个优越的功能。当然， 

Dynamic也有它的好处，因为只需要在运行时第一次确定好类型后，它会变成强类型，这样在后面的运行中，会大大提高效率，而且使用起来也比较方便，免去了烦人的拆箱、装箱工作。 

今天最后说说和var跟dynamic的区别，我们都知道var能在编译时确定类型，而且也有智能感知，但是var只能在局部使用（方法体），而且必须初始时赋予它值，它才能在编译时去确定是何种类型，不过他们都有一个特点，就是为了程序在后面的运行时，所有的类型都是强类型，至于强类型的好处，大家可以找找博客园中其他大大的一些好文章。 

很晚了，今天就到这里了，后面的文章会谈谈dynamic在其他方面的性能比较，不过总体下来不是很理想，有点鸡肋的感觉了，感觉微软在这块做的真的不是很好，呵呵。

