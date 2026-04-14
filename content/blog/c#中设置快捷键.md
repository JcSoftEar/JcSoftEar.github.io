---
title: "c#中设置快捷键"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# c#中设置快捷键

> 原文链接: https://www.cnblogs.com/inday/archive/2006/02/22/335408.html | 迁移自博客园

---

最近找了一些资料，是讲在C＃中设置快捷键运行方法或程序的  
  
要设置快捷键必须使用user32.dll下面的两个方法。  
  
BOOL RegisterHotKey(  
HWND hWnd,  
int id,  
UINT fsModifiers,  
UINT vk  
);   
  
和  
  
BOOL UnregisterHotKey(  
HWND hWnd,  
int id  
);   
转换成C#代码，那么首先就要引用命名空间System.Runtime.InteropServices;来加载非托管类user32.dll。于是有了：  
  
[DllImport("user32.dll", SetLastError=true)]   
public static extern bool RegisterHotKey(  
IntPtr hWnd, // handle to window   
int id, // hot key identifier   
KeyModifiers fsModifiers, // key-modifier options   
Keys vk // virtual-key code   
);   
  
[DllImport("user32.dll", SetLastError=true)]   
public static extern bool UnregisterHotKey(  
IntPtr hWnd, // handle to window   
int id // hot key identifier   
);  
  
  
[Flags()]   
public enum KeyModifiers   
{   
None = 0,   
Alt = 1,   
Control = 2,   
Shift = 4,   
Windows = 8   
}   
  
这是注册和卸载全局快捷键的方法，那么我们只需要在Form_Load的时候加上注册快捷键的语句，在FormClosing的时候卸载全局快捷键。同时，为了保证剪贴板的内容不受到其他程序调用剪贴板的干扰，在Form_Load的时候，我先将剪贴板里面的内容清空。  
  
于是有了：  
  
private void Form1_Load(object sender, System.EventArgs e)  
{  
label2.AutoSize = true;  
  
Clipboard.Clear();//先清空剪贴板防止剪贴板里面先复制了其他内容  
RegisterHotKey(Handle, 100, 0, Keys.F10);  
}  
  
private void Form1_FormClosing(object sender, FormClosingEventArgs e)  
{  
UnregisterHotKey(Handle, 100);//卸载快捷键  
}   
  
那么我们在别的窗口，怎么让按了快捷键以后调用我的主过程ProcessHotkey()呢？  
  
那么我们就必须重写WndProc()方法，通过监视系统消息，来调用过程：  
  
protected override void WndProc(ref Message m)//监视Windows消息  
{  
const int WM_HOTKEY = 0x0312;//按快捷键  
switch (m.Msg)  
{  
case WM_HOTKEY:  
ProcessHotkey();//调用主处理程序  
break;  
}  
base.WndProc(ref m);  
}   
  
这样我的程序就完成了。   


