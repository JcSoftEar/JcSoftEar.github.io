---
title: "View-ForumsGroupView.ascx 读解"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# View-ForumsGroupView.ascx 读解

> 原文链接: https://www.cnblogs.com/inday/archive/2004/12/31/84634.html | 迁移自博客园

---

为了修改首页的框架，一路跟踪到了View-ForumsGroupView.ascx这个文件，其实他就是一个页面的模版，微软在这里并没有弄了太多花絮，所以阅读起来很方便。   


![](/Images/OutliningIndicators/None.gif)<%@ Control Language="C#" %>   
![](/Images/OutliningIndicators/None.gif)<%@ Register TagPrefix="Forums" Namespace="AspNetForums.Controls" Assembly="AspNetForums.Controls" %>   
![](/Images/OutliningIndicators/None.gif)<%@ Import Namespace="AspNetForums" %>   
![](/Images/OutliningIndicators/None.gif)<%@ Import Namespace="AspNetForums.Controls" %>   
![](/Images/OutliningIndicators/None.gif)<%@ Import Namespace="AspNetForums.Components" %>

导入了一些名称空间，并且声明了一个控件。   


![](/Images/OutliningIndicators/None.gif)<Forums:Ads Zone="Inline" runat="server" />

注释上显示是广告，我个人理解为登入框上面的banner。![](/Emoticons/QQ/13.gif)   
  


![](/Images/OutliningIndicators/ExpandedBlockStart.gif)![](/Images/OutliningIndicators/ContractedBlock.gif)<% if ( Users.GetUser().IsAnonymous ) ![](/Images/dot.gif){ %>   
![](/Images/OutliningIndicators/InBlock.gif)<table width="100%" cellspacing="0" cellpadding="5" border="0">   
![](/Images/OutliningIndicators/InBlock.gif) <tr>   
![](/Images/OutliningIndicators/InBlock.gif) <td>   
![](/Images/OutliningIndicators/InBlock.gif) <!-- ForumGroupView.Header.End \-->   
![](/Images/OutliningIndicators/InBlock.gif) <Forums:Login SkinFilename="Skin-LoginSmall.ascx" runat="server" ID="Login1" />   
![](/Images/OutliningIndicators/InBlock.gif) <!-- ForumGroupView.MainCentent.Start \-->   
![](/Images/OutliningIndicators/InBlock.gif) </td>   
![](/Images/OutliningIndicators/InBlock.gif) </tr>   
![](/Images/OutliningIndicators/InBlock.gif)</table>   
![](/Images/OutliningIndicators/ExpandedBlockEnd.gif)<% } %>

匿名用户显示的表格，感觉和动网的有些类似。   


![](/Images/OutliningIndicators/None.gif)<table width="100%" cellpadding="5" cellspacing="0">   
![](/Images/OutliningIndicators/None.gif) <tr>   
![](/Images/OutliningIndicators/None.gif) <td valign="bottom" colspan="2">   
![](/Images/OutliningIndicators/None.gif) <table width="100%" cellpadding="0" cellspacing="0">   
![](/Images/OutliningIndicators/None.gif) <tr>   
![](/Images/OutliningIndicators/None.gif) <td class="txt4" align="left" nowrap>   
![](/Images/OutliningIndicators/None.gif) <Forums:DisplayUserWelcome runat="server" />   
![](/Images/OutliningIndicators/None.gif) </td>   
![](/Images/OutliningIndicators/None.gif) <td class="txt4" align="right" valign="bottom" nowrap>   
![](/Images/OutliningIndicators/ExpandedBlockStart.gif)![](/Images/OutliningIndicators/ContractedBlock.gif) <% if ( !Users.GetUser().IsAnonymous ) ![](/Images/dot.gif){ %>   
![](/Images/OutliningIndicators/InBlock.gif) <a class="lnk3" href="<%=Globals.GetSiteUrls().MyFavorites%>">   
![](/Images/OutliningIndicators/InBlock.gif) <%=ResourceManager.GetString("MyFavorites_Description")%>   
![](/Images/OutliningIndicators/InBlock.gif) </a>   
![](/Images/OutliningIndicators/InBlock.gif) <br />   
![](/Images/OutliningIndicators/InBlock.gif) <!--<Forums:MarkAllRead runat="server" ID="Markallread1"/>\-->   
![](/Images/OutliningIndicators/ExpandedBlockEnd.gif) <% } %>   
![](/Images/OutliningIndicators/None.gif) <Forums:ForumAnchor class="lnk3" AnchorType="PostsActive" runat="server" /><br />   
![](/Images/OutliningIndicators/None.gif) <Forums:ForumAnchor class="lnk3" AnchorType="PostsUnanswered" runat="server" /><br />   
![](/Images/OutliningIndicators/None.gif) </td>   
![](/Images/OutliningIndicators/None.gif) </tr>   
![](/Images/OutliningIndicators/None.gif) <tr>   
![](/Images/OutliningIndicators/None.gif) <td align="left">   
![](/Images/OutliningIndicators/None.gif) <Forums:BreadCrumb ShowHome="true" runat="server" ID="Breadcrumb1" />   
![](/Images/OutliningIndicators/None.gif) </td>   
![](/Images/OutliningIndicators/None.gif) <td align="right" class="txt4">   
![](/Images/OutliningIndicators/None.gif) <Forums:SearchRedirect ID="SearchRedirect" runat="server" />   
![](/Images/OutliningIndicators/None.gif) </td>   
![](/Images/OutliningIndicators/None.gif) </tr>   
![](/Images/OutliningIndicators/None.gif) </table>   
![](/Images/OutliningIndicators/None.gif) </td>   
![](/Images/OutliningIndicators/None.gif) </tr>   
![](/Images/OutliningIndicators/None.gif)</table>

  
这个就是登入以后所显示的表格。   
下面就是论坛组的显示了，我们公司就是要我修改这里，所以准备一点一点分析。   


![](/Images/OutliningIndicators/None.gif)<asp:Repeater EnableViewState="false" runat="server" id="forumGroupRepeater">

定义了一个Repeater控件，用来显示整个论坛组框架。   


![](/Images/OutliningIndicators/None.gif)<HeaderTemplate>   
![](/Images/OutliningIndicators/None.gif) <!-- ********* Repeater.Header.Start ************* //\-->   
![](/Images/OutliningIndicators/None.gif) <table width="100%" class="tableBorder" cellpadding="4" cellspacing="1">   
![](/Images/OutliningIndicators/None.gif) <tr>   
![](/Images/OutliningIndicators/None.gif) <td colspan="2" class="column" align="center" width="*"><% = ResourceManager.GetString("ForumGroupView_Inline1") %></td>   
![](/Images/OutliningIndicators/None.gif) <td class="column" align="center" width="177" nowrap><%= ResourceManager.GetString("ForumGroupView_Inline4") %></td>   
![](/Images/OutliningIndicators/None.gif) <td class="column" align="center" width="65" nowrap><%= ResourceManager.GetString("ForumGroupView_Inline2") %></td>   
![](/Images/OutliningIndicators/None.gif) <td class="column" align="center" width="65" nowrap><%= ResourceManager.GetString("ForumGroupView_Inline3") %></td>   
![](/Images/OutliningIndicators/None.gif) </tr>   
![](/Images/OutliningIndicators/None.gif) </table>   
![](/Images/OutliningIndicators/None.gif) <!-- ********* Repeater.HeaderTemplate.End ************* //\-->   
![](/Images/OutliningIndicators/None.gif) </HeaderTemplate>

定义了头模板，ResourceManager.GetString()，让我看了很长时间，个人以为是整理了一下字符串，然后又从配置里面把数据读出，从Language目录里的Resources.xml读出数据。   


<td class="fh1" colspan="5" valign="bottom">   
![](/Images/OutliningIndicators/None.gif) <asp:ImageButton ID="ExpandCollapse" CommandArgument='<%# DataBinder.Eval(Container.DataItem, "ForumGroupID") %>' ImageUrl='<%# Formatter.ExplandCollapseIcon( (ForumGroup) Container.DataItem ) %>' ToolTip='<%# ResourceManager.GetString("ForumGroupView_ExpandCollapse")%>' Runat="server"/> &nbsp;<a href="<%# Globals.GetSiteUrls().ForumGroup ( (int) DataBinder.Eval(Container.DataItem, "ForumGroupID")) %>"><%# DataBinder.Eval(Container.DataItem, "Name") %></a>   
</td>

这个表格显示了一个图片和论坛组的名字。   


![](/Images/OutliningIndicators/None.gif)<Forums:ForumRepeater ForumGroupID='<%# DataBinder.Eval(Container.DataItem, "ForumGroupID") %>' HideForums='<%# DataBinder.Eval(Container.DataItem, "HideForums") %>' runat="server">

这是一个自定义的Repeater控件，具体代码还没研究过。 

![](/Images/OutliningIndicators/None.gif)<td class="f1" width="20">   
![](/Images/OutliningIndicators/ExpandedBlockStart.gif)![](/Images/OutliningIndicators/ContractedBlock.gif)<%![](/Images/dot.gif)# Formatter.StatusIcon( (Forum)Container.DataItem ) %>   
![](/Images/OutliningIndicators/None.gif)</td>

这个是显示版面是否有信息的那个图片。 

![](/Images/OutliningIndicators/None.gif)<Forums:ForumLogo runat="server" Forum='<%# (Forum) Container.DataItem %>' />

这个是版面的logo，如果有就显示，没有就不显示，都在ForumsRepeater控件里都有了。   


![](/Images/OutliningIndicators/None.gif)<b><a href="<%# Globals.GetSiteUrls().Forum( ((Forum) Container.DataItem).ForumID ) %>">   
![](/Images/OutliningIndicators/ExpandedBlockStart.gif)![](/Images/OutliningIndicators/ContractedBlock.gif) <%![](/Images/dot.gif)# DataBinder.Eval(Container.DataItem, "Name") %>   
![](/Images/OutliningIndicators/None.gif) </a></b>   
![](/Images/OutliningIndicators/ExpandedBlockStart.gif)![](/Images/OutliningIndicators/ContractedBlock.gif) <%![](/Images/dot.gif)# Formatter.FormatUsersViewingForum( (Forum) Container.DataItem ) %>   
![](/Images/OutliningIndicators/None.gif) <br />

  
这个很容易理解，就是版面名字的显示，<%# Formatter.FormatUsersViewingForum( (Forum) Container.DataItem ) %>   
是显示版面现在的在线人数，很多余的东西，缓存太久了，根本不能及时显示。

![](/Images/OutliningIndicators/ExpandedBlockStart.gif)![](/Images/OutliningIndicators/ContractedBlock.gif)<span class="txt5"></span><%# DataBinder.Eval(Container.DataItem, "Description") %><%# Formatter.FormatSubForum( (Forum) Container.DataItem ) %></span>   
![](/Images/OutliningIndicators/None.gif)<br />   
![](/Images/OutliningIndicators/None.gif)<forums:ForumModerators runat="server" ForumID='<%# ((Forum)Container.DataItem).ForumID %>'/>

  
版面的简介和版主显示   


![](/Images/OutliningIndicators/None.gif)<td class="fh3" align="center" width="175">   
![](/Images/OutliningIndicators/ExpandedBlockStart.gif)![](/Images/OutliningIndicators/ContractedBlock.gif) <%# Formatter.FormatLastPost( (Forum) Container.DataItem, (bool) true ) %>   
![](/Images/OutliningIndicators/None.gif)</td>   
![](/Images/OutliningIndicators/None.gif)<td class="fh3" align="center" width="64">   
![](/Images/OutliningIndicators/ExpandedBlockStart.gif)![](/Images/OutliningIndicators/ContractedBlock.gif) <%# Formatter.FormatNumber( ((Forum) Container.DataItem).TotalThreads ) %>   
![](/Images/OutliningIndicators/None.gif)</td>   
![](/Images/OutliningIndicators/None.gif)<td class="fh3" align="center" width="65">   
![](/Images/OutliningIndicators/ExpandedBlockStart.gif)![](/Images/OutliningIndicators/ContractedBlock.gif) <%# Formatter.FormatNumber( ((Forum) Container.DataItem).TotalPosts ) %>   
![](/Images/OutliningIndicators/None.gif)</td>

这三个分别显示：最后帖子，主题数，帖子数的。   
好了，后面都是一些闭合语句了。   
  
分析完毕，现在修改起来也简单了，以后研究的时候会继续贴上来的，嘿嘿 

版面的简介和版主显示 这三个分别显示：最后帖子，主题数，帖子数的。好了，后面都是一些闭合语句了。分析完毕，现在修改起来也简单了，以后研究的时候会继续贴上来的，嘿嘿 

