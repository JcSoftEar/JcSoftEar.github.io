---
title: "使用C#实现蜘蛛程序"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 使用C#实现蜘蛛程序

> 原文链接: https://www.cnblogs.com/inday/articles/377544.html | 迁移自博客园

---

"蜘蛛"（Spider）是Internet上一种很有用的程序，搜索引擎利用蜘蛛程序将Web页面收集到数据库，企业利用蜘蛛程序监视竞争对手的网站并跟踪变动，个人用户用蜘蛛程序下载Web页面以便脱机使用，开发者利用蜘蛛程序扫描自己的Web检查无效的链接……对于不同的用户，蜘蛛程序有不同的用途。那么，蜘蛛程序到底是怎样工作的呢？ 

蜘蛛是一种半自动的程序，就象现实当中的蜘蛛在它的Web（蜘蛛网）上旅行一样，蜘蛛程序也按照类似的方式在Web链接织成的网上旅行。蜘蛛程序之所以是半自动的，是因为它总是需要一个初始链接（出发点），但此后的运行情况就要由它自己决定了，蜘蛛程序会扫描起始页面包含的链接，然后访问这些链接指向的页面，再分析和追踪那些页面包含的链接。从理论上看，最终蜘蛛程序会访问到Internet上的每一个页面，因为Internet上几乎每一个页面总是被其他或多或少的页面引用。 

本文介绍如何用C#语言构造一个蜘蛛程序，它能够把整个网站的内容下载到某个指定的目录，程序的运行界面如图一。你可以方便地利用本文提供的几个核心类构造出自己的蜘蛛程序。 

  


图1

  
C#特别适合于构造蜘蛛程序，这是因为它已经内置了HTTP访问和多线程的能力，而这两种能力对于蜘蛛程序来说都是非常关键的。下面是构造一个蜘蛛程序要解决的关键问题： 

⑴ HTML分析：需要某种HTML解析器来分析蜘蛛程序遇到的每一个页面。 

⑵ 页面处理：需要处理每一个下载得到的页面。下载得到的内容可能要保存到磁盘，或者进一步分析处理。 

⑶ 多线程：只有拥有多线程能力，蜘蛛程序才能真正做到高效。 

⑷ 确定何时完成：不要小看这个问题，确定任务是否已经完成并不简单，尤其是在多线程环境下。 

一、HTML解析 

C#语言本身不包含解析HTML的能力，但支持XML解析；不过，XML有着严格的语法，为XML设计的解析器对HTML来说根本没用，因为HTML的语法要宽松得多。为此，我们需要自己设计一个HTML解析器。本文提供的解析器是高度独立的，你可以方便地将它用于其它用C#处理HTML的场合。 

本文提供的HTML解析器由ParseHTML类实现，使用非常方便：首先创建该类的一个实例，然后将它的Source属性设置为要解析的HTML文档： 

ParseHTML parse = new ParseHTML();  
parse.Source = " 

Hello World

";  


  
接下来就可以利用循环来检查HTML文档包含的所有文本和标记。通常，检查过程可以从一个测试Eof方法的while循环开始： 

while(!parse.Eof())  
{  
char ch = parse.Parse();  


  
Parse方法将返回HTML文档包含的字符--它返回的内容只包含那些非HTML标记的字符，如果遇到了HTML标记，Parse方法将返回0值，表示现在遇到了一个HTML标记。遇到一个标记之后，我们可以用GetTag()方法来处理它。 

if(ch==0)  
{  
HTMLTag tag = parse.GetTag();  
}  


  
一般地，蜘蛛程序最重要的任务之一就是找出各个HREF属性，这可以借助C#的索引功能完成。例如，下面的代码将提取出HREF属性的值（如果存在的话）。 

Attribute href = tag["HREF"];  
string link = href.Value;  


  
获得Attribute对象之后，通过Attribute.Value可以得到该属性的值。 

二、处理HTML页面 

下面来看看如何处理HTML页面。首先要做的当然是下载HTML页面，这可以通过C#提供的HttpWebRequest类实现： 

HttpWebRequest request = (HttpWebRequest)WebRequest.Create(m_uri);  
response = request.GetResponse();  
stream = response.GetResponseStream();  


  
接下来我们就从request创建一个stream流。在执行其他处理之前，我们要先确定该文件是二进制文件还是文本文件，不同的文件类型处理方式也不同。下面的代码确定该文件是否为二进制文件。 

if( !response.ContentType.ToLower().StartsWith("text/") )  
{  
SaveBinaryFile(response);  
return null;  
}  
string buffer = "",line;  


  
如果该文件不是文本文件，我们将它作为二进制文件读入。如果是文本文件，首先从stream创建一个StreamReader，然后将文本文件的内容一行一行加入缓冲区。 

reader = new StreamReader(stream);  
while( (line = reader.ReadLine())!=null )  
{  
buffer+=line+"\r\n";  
}  


  
装入整个文件之后，接着就要把它保存为文本文件。 

SaveTextFile(buffer);  


  
下面来看看这两类不同文件的存储方式。 

二进制文件的内容类型声明不以"text/"开头，蜘蛛程序直接把二进制文件保存到磁盘，不必进行额外的处理，这是因为二进制文件不包含HTML，因此也不会再有需要蜘蛛程序处理的HTML链接。下面是写入二进制文件的步骤。 

首先准备一个缓冲区临时地保存二进制文件的内容。 byte []buffer = new byte[1024];  


  
接下来要确定文件保存到本地的路径和名称。如果要把一个myhost.com网站的内容下载到本地的c:\test文件夹，二进制文件的网上路径和名称是<http://myhost.com/images/logo.gif>，则本地路径和名称应当是c:\test\images\logo.gif。与此同时，我们还要确保c:\test目录下已经创建了images子目录。这部分任务由convertFilename方法完成。 

string filename = convertFilename( response.ResponseUri );  


  
convertFilename方法分离HTTP地址，创建相应的目录结构。确定了输出文件的名字和路径之后就可以打开读取Web页面的输入流、写入本地文件的输出流。 

Stream outStream = File.Create( filename );  
Stream inStream = response.GetResponseStream();  


  
接下来就可以读取Web文件的内容并写入到本地文件，这可以通过一个循环方便地完成。 

int l;  
do  
{  
l = inStream.Read(buffer,0,  
buffer.Length);  
if(l>0)  
outStream.Write(buffer,0,l);  
} while(l>0);  


  
写入整个文件之后，关闭输入流、输出流。 

outStream.Close();  
inStream.Close();  


  
比较而言，下载文本文件更容易一些。文本文件的内容类型总是以"text/"开头。假设文件已被下载并保存到了一个字符串，这个字符串可以用来分析网页包含的链接，当然也可以保存为磁盘上的文件。下面代码的任务就是保存文本文件。 

string filename = convertFilename( m_uri );  
StreamWriter outStream = new StreamWriter( filename );  
outStream.Write(buffer);  
outStream.Close();  


  
在这里，我们首先打开一个文件输出流，然后将缓冲区的内容写入流，最后关闭文件。 

三、多线程 

多线程使得计算机看起来就象能够同时执行一个以上的操作，不过，除非计算机包含多个处理器，否则，所谓的同时执行多个操作仅仅是一种模拟出来的效果--靠计算机在多个线程之间快速切换达到"同时"执行多个操作的效果。一般而言，只有在两种情况下多线程才能事实上提高程序运行的速度。第一种情况是计算机拥有多个处理器，第二种情况是程序经常要等待某个外部事件。 

对于蜘蛛程序来说，第二种情况正是它的典型特征之一，它每发出一个URL请求，总是要等待文件下载完毕，然后再请求下一个URL。如果蜘蛛程序能够同时请求多个URL，显然能够有效地减少总下载时间。 

为此，我们用DocumentWorker类封装所有下载一个URL的操作。每当一个DocumentWorker的实例被创建，它就进入循环，等待下一个要处理的URL。下面是DocumentWorker的主循环： 

while(!m_spider.Quit )  
{  
m_uri = m_spider.ObtainWork();

m_spider.SpiderDone.WorkerBegin();  
string page = GetPage();  
if(page!=null)  
ProcessPage(page);  
m_spider.SpiderDone.WorkerEnd();  
}  


  
这个循环将一直运行，直至Quit标记被设置成了true（当用户点击"Cancel"按钮时，Quit标记就被设置成true）。在循环之内，我们调用ObtainWork获取一个URL。ObtainWork将一直等待，直到有一个URL可用--这要由其他线程解析文档并寻找链接才能获得。Done类利用WorkerBegin和WorkerEnd方法来确定何时整个下载操作已经完成。 

从图一可以看出，蜘蛛程序允许用户自己确定要使用的线程数量。在实践中，线程的最佳数量受许多因素影响。如果你的机器性能较高，或者有两个处理器，可以设置较多的线程数量；反之，如果网络带宽、机器性能有限，设置太多的线程数量其实不一定能够提高性能。 

四、任务完成了吗？ 

利用多个线程同时下载文件有效地提高了性能，但也带来了线程管理方面的问题。其中最复杂的一个问题是：蜘蛛程序何时才算完成了工作？在这里我们要借助一个专用的类Done来判断。 

首先有必要说明一下"完成工作"的具体含义。只有当系统中不存在等待下载的URL，而且所有工作线程都已经结束其处理工作时，蜘蛛程序的工作才算完成。也就是说，完成工作意味着已经没有等待下载和正在下载的URL。 

Done类提供了一个WaitDone方法，它的功能是一直等待，直到Done对象检测到蜘蛛程序已完成工作。下面是WaitDone方法的代码。 

public void WaitDone()  
{  
Monitor.Enter(this);  
while ( m_activeThreads>0 )  
{  
Monitor.Wait(this);  
}  
Monitor.Exit(this);  
}  


  
WaitDone方法将一直等待，直到不再有活动的线程。但必须注意的是，下载开始的最初阶段也没有任何活动的线程，所以很容易造成蜘蛛程序一开始就立即停止的现象。为解决这个问题，我们还需要另一个方法WaitBegin来等待蜘蛛程序进入"正式的"工作阶段。一般的调用次序是：先调用WaitBegin，再接着调用WaitDone，WaitDone将等待蜘蛛程序完成工作。下面是WaitBegin的代码： 

public void WaitBegin()  
{  
Monitor.Enter(this);  
while ( !m_started )  
{  
Monitor.Wait(this);  
}  
Monitor.Exit(this);  
}  


  
WaitBegin方法将一直等待，直到m_started标记被设置。m_started标记是由WorkerBegin方法设置的。工作线程在开始处理各个URL之时，会调用WorkerBegin；处理结束时调用WorkerEnd。WorkerBegin和WorkerEnd这两个方法帮助Done对象确定当前的工作状态。下面是WorkerBegin方法的代码： 

public void WorkerBegin()  
{  
Monitor.Enter(this);  
m_activeThreads++;  
m_started = true;  
Monitor.Pulse(this);  
Monitor.Exit(this);  
}  


  
WorkerBegin方法首先增加当前活动线程的数量，接着设置m_started标记，最后调用Pulse方法以通知（可能存在的）等待工作线程启动的线程。如前所述，可能等待Done对象的方法是WaitBegin方法。每处理完一个URL，WorkerEnd方法会被调用： 

public void WorkerEnd()  
{  
Monitor.Enter(this);  
m_activeThreads--;  
Monitor.Pulse(this);  
Monitor.Exit(this);  
}  


  
WorkerEnd方法减小m_activeThreads活动线程计数器，调用Pulse释放可能在等待Done对象的线程--如前所述，可能在等待Done对象的方法是WaitDone方法。 

结束语：本文介绍了开发Internet蜘蛛程序的基础知识，下面提供的源代码将帮助你进一步深入理解本文的主题。这里提供的代码非常灵活，你可以方便地将它用于自己的程序。

