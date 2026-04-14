---
title: "Visual C#.Net网络程序开发-Tcp篇（3） 祥细内容："
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Visual C#.Net网络程序开发-Tcp篇（3） 祥细内容：

> 原文链接: https://www.cnblogs.com/inday/articles/217480.html | 迁移自博客园

---

综合运用上面的知识，下面的实例实现了简单的网络通讯-双机互连，针对客户端和服务端分别编制了应用程序。客户端创建到服务端的连接，向远程主机发送连接请求连接信号，并发送交谈内容；远程主机端接收来自客户的连接，向客户端发回确认连接的信号，同时接收并显示客户端的交谈内容。在这个基础上，发挥你的创造力，你完全可以开发出一个基于程序语言(C#)级的聊天室！   
  
客户端主要源代码：   
  
public void SendMeg()//发送信息  
{   
try  
{   
  
  
int port=Int32.Parse(textBox3.Text.ToString());//远程主机端口  
try  
{  
tcpClient=new TcpClient(textBox1.Text,port);//创建TcpClient对象实例 }  
catch(Exception le)  
{  
MessageBox.Show("TcpClient Error:"+le.Message);  
}   
string strDateLine=DateTime.Now.ToShortDateString()+" "+DateTime.Now.ToLongTimeString();//得到发送时客户端时间  
netStream=tcpClient.GetStream();//得到网络流  
sw=new StreamWriter(netStream);//创建TextWriter,向流中写字符  
string words=textBox4.Text;//待发送的话  
string content=strDateLine+words;//待发送内容  
sw.Write(content);//写入流  
sw.Close();//关闭流写入器  
netStream.Close();//关闭网络流  
tcpClient.Close();//关闭客户端连接   
}  
catch(Exception ex)  
{  
MessageBox.Show("Sending Message Failed!"+ex.Message);  
}  
textBox4.Text="";//清空  
}   
  
  
服务器端主要源代码：   
  
public void StartListen()//侦听特定端口的用户请求  
{   
//ReceiveMeg();   
isLinked=false; //连接标志  
try  
{  
int port=Int32.Parse(textBox1.Text.ToString());//本地待侦听端口  
serverListener=new TcpListener(port);//创建TcpListener对象实例  
serverListener.Start(); //启动侦听  
}  
catch(Exception ex)  
{  
MessageBox.Show("Can‘t Start Server"+ex.Message);  
return;  
}  
isLinked=true;  
while(true)//进入无限循环等待用户端连接  
{  
try  
{  
tcpClient=serverListener.AcceptTcpClient();//创建客户端连接对象  
netStream=tcpClient.GetStream();//得到网络流  
sr=new StreamReader(netStream);//流读写器  
}  
catch(Exception re)  
{  
MessageBox.Show(re.Message);  
}  
string buffer="";   
string received="";  
received+=sr.ReadLine();//读流中一行  
while(received.Length!=0)  
{  
buffer+=received;  
buffer+="\r\n";  
//received="";  
received=sr.ReadLine();  
}   
listBox1.Items.Add(buffer);//显示  
//关闭  
sr.Close();  
netStream.Close();  
tcpClient.Close();  
}  
}   


