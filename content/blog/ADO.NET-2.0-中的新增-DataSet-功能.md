---
title: "ADO.NET 2.0 中的新增 DataSet 功能"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# ADO.NET 2.0 中的新增 DataSet 功能

> 原文链接: https://www.cnblogs.com/inday/articles/95200.html | 迁移自博客园

---

# ADO.NET 2.0 中的新增 DataSet 功能

发布日期： 1/13/2005 | 更新日期： 1/13/2005 

Jackie Goldstein   
Renaissance Computer Systems 

适用于：   
Microsoft ADO.NET 2.0   
Visual Basic 编程语言 

**摘要：** 了解有关 .NET Framework DataSet 类以及与它密切相关的类中的新增 ADO.NET 2.0 功能的知识。这些更改包括对 DataSet、DataTable 和 DataView 类的功能和性能增强。 

下载与本文相关的 [DataSetSamples.exe 示例代码](http://download.microsoft.com/download/a/1/4/a1412c5e-5977-4a95-a177-b9abb39330cd/DataSetSamples.EXE)。 

![*](/library/gallery/templates/MNP2.Common/images/3squares.gif)

##### 本页内容

![简介](/library/gallery/templates/MNP2.Common/images/arrow_px_down.gif) | 简介  
---|---  
![原始性能](/library/gallery/templates/MNP2.Common/images/arrow_px_down.gif) | 原始性能  
![DataTable — 比以前更独立](/library/gallery/templates/MNP2.Common/images/arrow_px_down.gif) | DataTable — 比以前更独立  
![流到缓存，缓存到流](/library/gallery/templates/MNP2.Common/images/arrow_px_down.gif) | 流到缓存，缓存到流  
![小结](/library/gallery/templates/MNP2.Common/images/arrow_px_down.gif) | 小结  
  
## 简介

在即将问世的 ADO.NET 版本（ADO.NET 2.0）中，有很多新增的和改进的功能，它们影响了很多不同的 .NET Framework 类和应用程序开发方案。本文讨论对核心断开模式 ADO.NET Framework 类 — **DataSet** 和关联的类（例如，**DataSet** 、**DataTable** 和**DataView** ）的更改和增强。 

本文实际上是有关 ADO.NET 2.0 中的 **DataSet** 和关联类的两篇文章中的第一篇。这里，我们将重点讨论 .NET Framework 中的类。在随后的文章中，我们将重点讨论在 Visual Studio 2005 开发环境中通过上述类和相关的类进行开发。Visual Studio 2005 提供了多个设计器和工具，它们为开发应用程序中以数据为中心的方面提供了极大的灵活性和生产率。因此，每篇文章都将给予您不同的“感受”。本文主要概述新功能，并伴以解释和代码示例。在下一篇文章中，随着我们了解如何开发有效的应用程序，将重点讨论开发过程。 

正如我在前面提到的那样，本文只讨论 ADO.NET 2.0 的一小部分新功能。您可以在 [ADO.NET 2.0 Feature Matrix](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dnvs05/html/ado2featurematrix.asp) 中找到其他一些功能的概述。下列文章中包含有关这里提到的一些主题的详细信息： 

• |  [Asynchronous Command Execution in ADO.NET 2.0](http://msdn.microsoft.com/data/default.aspx?pull=/library/en-us/dnvs05/html/async2.asp)  
---|---  
• |  [Generic Coding with the ADO.NET 2.0 Base Classes and Factories](http://msdn.microsoft.com/data/default.aspx?pull=/library/en-us/dnvs05/html/vsgenerics.asp)  
• |  [Schemas in ADO.NET 2.0](http://msdn.microsoft.com/data/default.aspx?pull=/library/en-us/dnvs05/html/adonet2schemas.asp)  
  
除非另行说明，否则本文的内容都是基于 Visual Studio 2005 的 Beta 1 版。代码示例使用 SQL Server 2000 随附的示例数据库 — Northwind 数据库。

![返回页首](/library/gallery/templates/MNP2.Common/images/arrow_px_up.gif)返回页首

## 原始性能

软件开发人员总是很关心性能。有时他们会过分关心性能，并使他们的代码尽量简洁以减少一点儿执行时间，而实际上这样做根本没有什么意义 — 不过这是另一篇文章所要讨论的主题了。在涉及 ADO.NET 1.x **DataSet** （特别是那些包含大量数据的数据集）时，开发人员所表达的性能方面的担忧是非常正当的。大型 **DataSet** 的处理速度很慢 — 这体现在两个不同的上下文中。第一次感受到缓慢的速度是在加载带有大量行的 **DataSet** （实际上是 **DataTable** ）时。随着 **DataTable** 中行数的增加，加载一个新行的时间几乎按照与 **DataTable** 中的行数成正比的速度增加。另一个能够感受到性能影响的时候是在序列化和远程处理大型 **DataSet** 时。**DataSet** 的一项关键功能是它能够自动了解如何序列化自身，尤其是当我们希望在应用程序层之间传递它的时候。但是，通过仔细观察可以发现，这一序列化过程很罗嗦，它需要消耗大量内存和网络带宽。上述两个性能瓶颈都在 ADO.NET 2.0 中得到了解决。 

新的索引引擎

在 ADO.NET 2.0 中已经彻底重新编写了用于 **DataTable** 的索引引擎，并且使其能够更好地针对大型数据集进行伸缩。这会使基本的插入、更新和删除操作变得更加快速，从而使 **Fill** 和 **Merge** 操作变得更快。尽管基准和性能收益量化总是特定于应用程序，并且通常是一件有风险的事情，但上述改进无疑在加载带有一百万行的 DataTable 时提供了高于数量级的改进。但不要轻易相信我的话，请通过下面的简单示例亲自对此进行检验。请添加以下代码作为 Windows 窗体中按钮的单击事件处理程序： 
    
    
    Private Sub LoadButton_Click(ByVal sender As System.Object, 
    ByVal e As System.EventArgs) Handles LoadButton.Click
            Dim ds As New DataSet
            Dim time1 As New Date
    
            Dim i As Integer
            Dim dr As DataRow
            ds.Tables.Add("BigTable")
            ds.Tables(0).Columns.Add("ID", Type.GetType("System.Int32"))
            ds.Tables(0).Columns("ID").Unique = True
            ds.Tables(0).Columns.Add("Value", Type.GetType("System.Int32"))
    
            ' Show status label
            WaitLabel.Visible = True
            Me.Cursor = Cursors.WaitCursor
            Me.Refresh()
    
            ' catch start time
            time1 = DateTime.Now()
    
            ' Yes, we are loading a million rows to a DataTable!
            '
            ' If you compile/run this with ADO.NET 1.1, you have time 
            ' to make and enjoy a fresh pot of coffee...
            Dim rand As New Random
            Dim value As Integer
    
            For i = 1 To 1000000
                Try
                    value = rand.Next
    
                    dr = ds.Tables(0).NewRow()
    
                    dr("ID") = value
                    dr("Value") = value
    
                    ds.Tables(0).Rows.Add(dr)
    
                Catch ex As Exception
                    ' if there are any duplicate values, an exception
                    ' will be thrown since the ID column was specified
                    ' to be unique
                End Try
            Next
    
            ' reset cursor and label
            WaitLabel.Visible = False
            Me.Cursor = Me.DefaultCursor
    
            ' Show elapsed time, in seconds
            MessageBox.Show("Elapsed Time: " & _
    DateDiff(DateInterval.Second, time1, DateTime.Now))
    
            ' verify number of rows in the table
            ' This number will probably be less that the number
            ' of loop iterations, since if the same random number
            ' comes up, it will/can not be added to the table
            MessageBox.Show("count = " & ds.Tables(0).Rows.Count)
    
    End Sub
    

当我通过 ADO.NET 1.1 和 Visual Studio 2003 在我的环境中运行上述代码时，执行时间大约为 30 分钟。使用 ADO.NET 2.0 和 Visual Studio 2005 时，执行时间大约为 40 到 50 _秒_ ！当我将行数减少到只有五十万时，1.1 版大约花费了 45 秒，而 2.0 版大约花费了 20 秒。您的数字可能有所不同，但我认为其含义是很清楚的。 

实际上，该示例非常简单，因为它只包含一个针对唯一列的索引。但是，随着指定 **DataTable** 上的索引数的增加（例如，通过添加额外的 **DataView** 、**UniqueKey** 和 **ForeignKey** ），性能差异将变得如此巨大。 

**注** 示例代码中的 ID 值是通过随机数字生成器生成的，而不是仅仅使用循环计数器作为 ID，其原因是为了更好地表示现实世界中的方案。在实际的应用程序中，访问 DataTable 的元素以便插入、更新和删除的操作很少顺序完成。对于每个操作，必须首先找到由唯一键指定的行。在插入和删除行时，必须更新表的索引。如果我们只是将带有顺序键值的一百万行加载到一个空表中，那么结果会非常快，但是却会令人误解。 

二进制序列化选择

在加载带有大量数据的 **DataTable** 方面的重大性能改进不要求我们对现有的 ADO.NET 1.x 代码进行任何更改。为了在序列化 **DataSet** 时从改进的性能中受益，我们的工作需要更加辛苦一些 — 需要添加一行代码以设置新的 **RemotingFormat** 属性。 

在 ADO.NET 1.x 中，DataSet 序列化为 XML（甚至在使用二进制格式化程序时也是如此）。在 ADO.NET 2.0 中，除了该行为以外，我们还可以通过将 **RemotingFormat** 属性设置为 **SerializationFormat.Binary** 而不是（默认的）**SerializationFormat.XML** ，来指定真正的二进制序列化。让我们观察一下这两个不同选择所产生的不同输出。 

为了保持向后兼容性（ADO.NET 团队总是关注这一点），XML 序列化的默认值将为我们提供与 ADO.NET 1.x 中相同的行为。通过运行下面的代码，可以看到该序列化的结果：
    
    
    Private Sub XMLButton_Click(ByVal sender As System.Object, 
    ByVal e As System.EventArgs) Handles XMLButton.Click
            Dim ds As New DataSet
            Dim da As New SqlDataAdapter("select * from [order details]", _
     GetConnectionString())
            da.Fill(ds)
    
            Dim bf As New BinaryFormatter
            Dim fs As New FileStream("..\xml.txt", FileMode.CreateNew)
            
            bf.Serialize(fs, ds)
    End Sub
    
    
    
    Private Function GetConnectionString() As String
            ' To avoid hard-coding the connection string in your code, 
            ' use the application settings
    
            Return MySettings.Value.NorthwindConnection
    
    End Function
    

请注意，上述代码显式使用了 **BinaryFormatter** 类，而文件 xml.txt 中的输出（如**图 1** 所示）显然是 XML。而且，在这种情况下，该文件的大小为 388 KB。 

![datasetenhance_01](art/datasetenhance_01.gif)   


现在，让我们通过添加行 
    
    
    ds.RemotingFormat = SerializationFormat.Binary
    

将序列化格式更改为二进制，并且通过在 **FileStream** 构造函数中修改文件名将数据保存到另一个文件中，现在代码将如下所示： 
    
    
    Private Sub BinaryButton_Click(ByVal sender As System.Object, 
    ByVal e As System.EventArgs) Handles BinaryButton.Click
            Dim ds As New DataSet
            Dim da As New SqlDataAdapter("select * from [order details]", _
    GetConnectionString())
            da.Fill(ds)
    
            Dim bf As New BinaryFormatter
            Dim fs As New FileStream("..\binary.txt", FileMode.CreateNew)
    
            ds.RemotingFormat = SerializationFormat.Binary
    
            bf.Serialize(fs, ds)
    End Sub
    

文件 binary.txt 中的输出显示在图 2 中。在这里，我们看到它现在实际上是二进制数据，人们很难理解这些数据。此外，该文件的大小只有 59 KB — 同样，在需要传输的数据量以及处理该数据所需的 CPU、内存和带宽资源方面降低了一个数量级。应当指出的是，这一改进在使用远程处理时有重大意义，但在使用 Web 服务时没有意义，这是因为 Web 服务按照定义必须传递 XML。这意味着，只能在通信两端都基于 .NET 并且不是与非 .NET 平台进行通信时，才能利用该增强功能。

![datasetenhance_02](art/datasetenhance_02.gif)   


有关 **DataSet** 序列化过程的详细信息，请参阅 [Binary Serialization of DataSets](http://msdn.microsoft.com/msdnmag/issues/04/10/CuttingEdge/)。 

![返回页首](/library/gallery/templates/MNP2.Common/images/arrow_px_up.gif)返回页首

## DataTable — 比以前更独立

在讨论 ADO.NET 1.x 和它的断开数据访问对象模型时，主要的对象是 **DataSet** 。当然，它还包含其他对象，如 **DataTable** 、**DataRelation** 、**DataRow** 等，但是人们所关心的对象通常从 **DataSet** 开始并以它为中心。的确，大多数 .NET 开发人员都知道 **DataTable** 本身（没有封装在 **DataSet** 内部）极为有用，并会利用这一事实。但是，在某些情况下，我们无法通过 **DataTable** 完成我们希望完成的工作，除非我们首先获得它并将其强行转换为 **DataSet** 。这方面的最突出并且通常令人痛苦的示例是在 **DataTable** 中读取和写入（加载和保存）XML 数据。在 ADO.NET 1.x 中，我们必须首先将 **DataTable** 添加到 **DataSet** 中，只有这样我们才能读取或写入 XML，这是因为完成该工作的方法只能在 **DataSet** 上使用！ 

ADO.NET 2.0 的目标之一是使独立的 **DataTable** 类比在 ADO.NET 1.x 中更为实用和有用。**DataTable** 现在支持用于 XML 的基本方法，就像 **DataSet** 一样。这包括下列方法： 

• |  **ReadXML**  
---|---  
• |  **ReadXMLSchema**  
• |  **WriteXML**  
• |  **WriteXMLSchema**  
  
**DataTable** 可单独序列化，并且可以在 Web 服务和远程处理方案中使用。现在，除了支持 **Merge** 方法以外，独立的 **DataTable** 还支持添加到 **DataSet** 中的新增 ADO.NET 2.0 功能： 

• |  **RemotingFormat** 属性（先前讨论过）   
---|---  
• |  **Load** 方法（本文随后将讨论）   
• |  **GetDataReader** 方法（本文随后将讨论）   
  
**注** 对于 XML 的主题，值得说明的是，在 ADO.NET 2.0 中，有大量增强的 XML 支持 — Microsoft 喜欢称之为更好的“XML 保真度”(XML Filelity)。它采取的形式是对 SQL Server 2005 XML 数据类型的支持、扩展 XSD 架构支持、改进的 XSD 架构推理引擎，以及两个通常很讨厌的限制的消除：(i) DataSet 和 DataTable 类现在可以处理多个嵌入式架构，并且 (ii) DataSet 现在完全支持命名空间，以便 DataSet 可以包含多个具有相同名称、但来自不同命名空间的 DataTable，也就是说，表具有相同的非限定名称，但具有不同的限定名称。而且，多个关系中包含的具有相同名称和命名空间的子表可以嵌套在多个父表中。 

![返回页首](/library/gallery/templates/MNP2.Common/images/arrow_px_up.gif)返回页首

## 流到缓存，缓存到流

对于 ADO.NET 2.0 中的 **DataSet** 和 **DataTable** 类的另一个主要增强是，提供了用来消耗 **DataReader** （将数据加载到 **DataTable** 中）以及在 **DataTable** 的内容之上公开 **DataReader** 的机制。 

有时，我们具有（或收到）**DataReader** 形式的数据，但实际上是希望具有缓存 **DataTable** 形式的数据。通过新增的 **Load** 方法，我们可以获得现有的 **DataReader** ，并使用它的内容来填充 **DataTable** 。 

有时，我们具有（或收到）缓存形式的数据 (**DataTable**)，并且需要通过 **DataReader** 类型接口来访问它。通过新增的 **GetTableReader** 方法，我们可以获得现有的 **DataTable** ，并通过 **DataReader** 接口和语义来访问它。 

在下面的部分中，我们将考察一下这些新方法。

Load 方法 — 基本用法

**Load** 方法是已经添加到 ADO.NET 2.0 的 **DataSet** 和 **DataTable** 中的一个新方法。它用 **DataReader** 对象的内容加载 **DataTable** 。如果 **DataReader** 包含多个结果集，则它实际上可以一次加载多个表。 

Load 方法的基本用法非常简单：
    
    
    MyDataTable.Load (MyDataReader)
    

下面的示例代码较为完整地说明了它的用法：
    
    
    Private Sub LoadButton_Click(ByVal sender As System.Object, 
    ByVal e As System.EventArgs) Handles LoadButton.Click
            Try
                Using connection As New SqlConnection(GetConnectionString())
                    Using command As New SqlCommand("SELECT * from customers", connection)
                        connection.Open()
                        Using dr As SqlDataReader = command.ExecuteReader()
                            'Fill table with data from DataReader
                            Dim dt As New DataTable
                            dt.Load(dr, LoadOption.OverwriteRow)
    
                            ' Display the data
                            DataGridView1.DataSource = dt
                        End Using
                    End Using
                End Using
    
            Catch ex As SqlException
                MessageBox.Show(ex.Message)
            Catch ex As InvalidOperationException
                MessageBox.Show(ex.Message)
            Catch ex As Exception
                ' You might want to pass these errors
                ' back out to the caller.
                MessageBox.Show(ex.Message)
            End Try
        End Sub
    

上述代码初始化连接和命令对象，然后执行 **ExecuteReader** 方法以便从数据库中获取数据。查询的结果作为 **DataReader** 提供，它随后被传递给 **DataTable** 的 **Load** 方法，以便用返回的数据填充它。用数据填充 **DataTable** 之后，就可以在 **DataGridView** 中绑定和显示它了。下一部分将解释（可选的）**LoadOption** 参数的 **OverwriteRow** 加载选项的重要性。 

Load 方法 — 为什么要加载该数据？

如果您通过 **DataSet** /**DataTable** 和 **DataAdapter** 所做的所有工作就是用数据源中的数据填充 **DataSet** ，修改该数据，然后在随后的某个时刻将该数据推送到数据源中，则这些工作会非常平稳地进行。如果您要利用开放式并发并且检测到并发冲突（其他某个人已经更改了您要尝试更改的某一行），则会发生第一个问题。在这种情况下，为了解决冲突而通常需要完成的工作是将 **DataSet** 与数据源重新进行同步，以便这些行的原始值与当前数据库值相匹配。这可以通过将 DataTable 与新值合并到原始表中来完成（在 ADO.NET 1.x 中，合并方法仅在 **DataSet** 上可用）： 
    
    
    OriginalTable.Merge(NewTable, True)
    

通过匹配带有相同主键的行，可以将新表中的记录与原始表中的记录合并。这里，具有关键意义的是第二个参数 — **PreserveChanges** 。该参数指定合并操作只应当更新每个行的原始值，而不应当影响这些行的当前值。这使开发人员随后可以执行 **DataAdapter.Update** ，它现在将成功地用更改（当前值）更新数据源，这是因为原始值现在与当前数据源值相匹配。如果 **PreserveChanges** 保留它的默认值 false，则合并操作会重写原始 **DataTable** 中的行的原始值和当前值，并且所作的所有更改都将丢失。 

但是，有时我们希望更新数据源中的数据，在数据源中，新值不是通过以编程方式修改值而得到的。或者我们从其他数据库或 XML 源获得更新的值。在这种情况下，我们希望更新 **DataTable** 中的行的当前值，但是不希望影响这些行的原始值。在 ADO.NET 1.x 中没有提供实现这一点的简单方式。正是因为这个原因，ADO.NET 2.0 **Load** 方法接受参数 **LoadOption** ，该参数指示如何将传入的新行与 **DataTable** 中已经存在的相同（主键）行组合在一起。 

**LoadOption** 使我们可以显式指定我们在加载数据时的意图（同步或聚合），以及我们因此希望如何合并新行和现有行。图 3****概括了各种方案：

![datasetenhance_03](art/datasetenhance_03.gif)   


其中： 

• |  **主数据源** — **DataTable/DataSet** 只通过一个主数据源进行同步/更新。它将跟踪更改以便可以与主数据源同步。   
---|---  
• |  **辅助数据源** — **DataTable/DataSet** 从一个或多个辅助数据源接受增量数据馈送。它不负责跟踪更改以便与辅助数据源同步。   
  
图 3 中显示的三种情况可以总结如下： 

• |  **情况 1** — **根据主数据源初始化 DataTable。** 用户希望用来自主数据源的值初始化空的 DataTable（原始值和当前值），然后，在对该数据进行更改之后，将更改传回主数据源。   
---|---  
• |  **情况 2** — **保留更改并且根据主数据源重新同步。** 用户希望获得修改后的 DataTable，并且在保持所作更改（当前值）的同时，将它的内容（仅限于原始值）与主数据源重新同步。   
• |  **情况 3** — **聚合来自一个或多个辅助数据源的增量数据馈送。** 用户希望接受来自一个或多个辅助数据源的更改（当前值），然后将这些更改传回到主数据源。   
  
**LoadOption** 枚举具有三个值，分别代表以下三种情况： 

• |  **OverwriteRow** — 用传入的行的值更新该行的当前版本和原始版本。   
---|---  
• |  **PreserveCurrentValues** （**默认** ）— 用传入的行的值更新该行的原始版本。   
• |  **UpdateCurrentValues** — 用传入的行的值更新该行的当前版本。   
  
**注** 这些名称可能会在 Beta 1 之后更改。 

下面的表 1 总结了加载语义。如果传入的行和现有行就主键值达成协议，则使用该行的现有 **DataRowState** 来处理它，否则使用“Not Present”部分（该表的最后一行）中的内容来处理。 

表 1. 加载语义摘要  
---  
现有的 DataRow 状态 | UpdateCurrentValues | OverwriteRow | PreserveCurrentValues（默认）  
**Added** |  Current = <Incoming> Original = - -- State = <Added> |  Current = <Incoming> Original = <Incoming> State = <Unchanged> |  Current = <Existing> Original = <Incoming> State = <Modified>  
**Modified** |  Current = <Incoming> Original = <Existing> State = <Modified> |  Current = <Incoming> Original = <Incoming> State = <Unchanged> |  Current = <Existing> Original = <Incoming> State = <Modified>  
**Deleted** |  (_Undo Delete) 和_ _Current = <Incoming>_ _Original = <Existing>_ _State = < Modified >_ |  _(Undo Delete) 和_ _Current = <Incoming>_ _Original = <Incoming>_ _State = <Unchanged>_ |  Current = <Existing> Original = <Incoming> State = <Deleted>  
**Unchanged** |  Current = <Incoming> Original = <Existing> 如果新值与现有值相同，则 State = <Unchanged> Else State = <Modified> |  Current = <Incoming> Original = <Incoming> State = <Unchanged> |  Current = <Incoming> Original = <Incoming> State = <Unchanged>  
**Not Present** |  Current = <Incoming> Original = --- State = < Added > |  Current = <Incoming> Original = <Incoming> State = <Unchanged> |  Current = <Incoming> Original = <Incoming> State = <Unchanged>  
  
示例

为了说明表 1 中指定的行为，我提供了一个简单示例。 

假设现有的 DataRow 和传入的行都具有 2 个带有匹配名称的列。第一列是主键，第二列包含一个数值。下面的表显示了数据行中第二列的内容。 

表 2 表示行在调用 Load 之前处于所有 4 种状态时的内容。传入的行的第二列值为 3。表 3 显示了它在加载后的内容。 

表 2. 加载之前的行状态  
---  
现有的行状态 | 版本 | 已添加 | 已修改 | 已删除 | 未更改  
|  **当前** |  2 |  2 |  - |  4  
|  **原始** |  - |  4 |  4 |  4  
  
传入的行  
---  
传入的行  
**3**  
  
表 3. 加载之后的行状态  
---  
| UpdateCurrentValues | OverwriteRow | PreserveCurrentValues  
**Added** |  **Current = <3>** **Original = ---** **State = <Added>** |  **Current = <3>** **Original = <3>** **State = <Unchanged>** |  **Current = <2>** **Original = <3>** **State = <Changed>**  
**Modified** |  **Current = <3>** **Original = <4>** **State = <Modified>** |  **Current = <3>** **Original = <3>** **State = <Unchanged>** |  **Current = <2>** **Original = <3>** **State = <Changed>**  
**Deleted** |  **Current = <3>** **Original = <4>** **State = <Modified>** |  **Current = <3>** **Original = <3>** **State = <Unchanged>** |  **Current = <2>** **Original = <3>** **State = <Changed>**  
**Unchanged** |  **Current = <3>** **Original = <4>** **State = <Modified>** |  **Current = <3>** **Original = <3>** **State = <Unchanged>** |  **Current = <3>** **Original = <3>** **State = <Unchanged>**  
**Not Present** |  **Current = <3>** **Original = ---** **State = <Added>** |  **Current = <3>** **Original = <3>** **State = <Unchanged>** |  **Current = <3>** **Original = <3>** **State = <Unchanged>**  
  
**注** 您可以看到此概念的萌芽已经存在于 ADO.NET 1.x 之中了。在将数据加载到 DataTable 中时，DataAdapter 的 **Fill** 方法的默认行为是将所有行标记为“未更改”（这可以通过将 **AcceptChangesOnFill** 属性设置为 False 来重写）。但是，在使用 ReadXML 将数据加载到 DataSet 中时，行被标记为“已添加”。这一机制（它是基于客户反馈实现的）的基本原理是：这将允许将新数据从 XML 源加载到 DataSet 中，然后使用关联的 DataAdapter 来更新主数据源。如果行在从 ReadXML 加载时被标记为“未更改”，则 **DataAdapter.Update** 不会检测到任何更改，并且不会针对数据源执行任何命令。 

为了提供类似的功能，已经将 **FillLoadOptions** 属性添加到 **DataAdapter** 中，以便提供与这里描述的 **Load** 方法相同的语义和行为，同时仍然保留 **Fill** 方法的相同（默认情况下）现有行为。 

开发人员总是针对 ADO.NET 1.x 询问的另一个功能（它并不存在）是手动修改 **DataRow** 状态的能力。尽管 **Load** 方法提供的选项可以满足大多数情况的需要，但您仍然可能希望对行状态进行较细粒度的控制 — 您可能需要修改单个行的状态。有鉴于此，ADO.NET 2.0 在 **DataRow** 类中引入了两个新方法：**SetAdded** 和 **SetModified** 。在您询问有关将状态设置为 **Deleted** 或 **Unchanged** 的问题之前，让我提醒您一下，在版本 1.x 中，我们已经具有了能够完成该工作的 **Delete** 和 **AcceptChanges** /**RejectChanges** 方法。 

GetTableReader 方法

**GetTableReader** 方法是已经添加到 ADO.NET 2.0 的 **DataSet** 和 **DataTable** 中的一个新方法。它将 **DataTable** 的内容作为 **DataTableReader** （派生自 DBDataReader）对象返回。如果在包含多个表的 DataSet 上调用该方法，则 **DataReader** 将包含多个结果集。 
    
    
    The use of the GetTableReader method is quite straight-forward:
    
    Dim dtr As DataTableReader = ds.Tables(0).GetDataReader
    

**DataTableReader** 的工作方式非常类似于您使用过的其他数据读取器，例如，**SqlDataReader** 或**OleDbDataReader** 。但是，区别在于 **DataTableReader** 提供了对断开连接的 **DataTable** 的行的迭代，而不是从活动数据库连接流式传输数据。 

**DataTableReader** 提供了智能且稳定的迭代器。缓存的数据可以在 **DataTableReader** 处于活动状态时进行修改，而读取器可以自动适当地维护它的位置 — 即使在迭代时有一个或多个行被删除或插入。 

通过对 **DataTable** 调用 **GetDataReader** 而创建的 **DataTableReader** 所包含的结果集具有与创建它时所依据的 **DataTable** 相同的数据。该结果集只包含每个 **DataRow** 的当前列值，而被标记为删除的行将被跳过。通过对包含多个表的 **DataSet** 调用 **GetDataReader** 而创建的 **DataTableReader** 将包含多个结果集。该结果集将具有与 **DataSet** 对象的 **DataTableCollection** 中的 **DataTable** 对象相同的顺序。 

除了上面概述的功能以外，**GetDataReader** 方法的另一个美妙用途是将数据从一个 **DataTable** 快速复制到另一个 **DataTable** 中： 
    
    
    Dim dt2 as new DataTable
    dt2.Load(ds.Tables(0).GetDataReader) 
    

DataView.ToTable 方法

与上述方法有点关系（因为它为现有数据提供了新的 **DataTable** 缓存）并且值得一提的另一个新方法是 **DataView** 类的 **ToTable** 方法。作为提示，DataView 类提供了 **DataTable** 中的行的逻辑视图。该视图可以按行、行状态进行筛选，并且可以排序。但是，在 ADO.NET 1.1 中，不存在保存或传递该视图的行的简单方式，这是因为 **DataView** 没有它自己的行副本 — 它只是按照筛选器和排序参数的指示来访问基础 **DataTable** 的行。**DataView** 的 **ToTable** 方法可以返回实际的 **DataTable** 对象（该对象是用当前视图所公开的行填充的）。 

**ToTable** 方法的重载版本提供了用于指定要在所创建的表中包含的列的列表的选项。生成的表将按照指定的顺序（可能不同于原始的表/视图）包含列出的列。ADO.NET 1.x 中缺少这种限制视图中的列数量的功能，这一点已经使很多 .NET 程序员感到失望。您还可以指定所创建的表的名称，并指定它是应当包含所有行还是只包含独特的行。 

下面是一些示例代码，它说明了如何使用 **ToTable** 方法： 
    
    
       Private Sub ToTableButton_Click(ByVal sender As System.Object, 
    ByVal e As System.EventArgs) Handles ToTableButton.Click
            ' Show only 2 columns in second grid
            Dim columns As String() = {"CustomerID", "ContactName"}
    
            Dim dt As DataTable = _
    ds.Tables("customers").DefaultView.ToTable( _
    "SmallCustomers", False, columns)
    
            DataGridView2.DataSource = dt
    End Sub
    

假定 **DataSet** 中的“customers”表的内容显示在第一个网格中，则该例程会显示刚刚创建的、只包含那些由 **DefaultView** （由它的筛选器参数所指定）公开的行的 **DataTable** 。新表中的行只包含原始 **DataTable** 和 **DataView** 的两个列。图 4 显示了这方面的一个示例。 

![datasetenhance_04](art/datasetenhance_04.gif)   


![返回页首](/library/gallery/templates/MNP2.Common/images/arrow_px_up.gif)返回页首

## 小结

**DataSet** （和 **DataTable** ）的 ADO.Net 2.0 版本引入了大量新增功能以及对现有功能的增强。本文所讨论的主要功能包括：由于新的索引引擎和二进制序列化格式选项而显著改进的性能、可用于独立 **DataTable** 的大量功能，以及用于将缓存数据公开为流 (**DataReader**) 和将流数据加载到 **DataTable** 缓存的机制。ADO.NET 2.0 还提供了对 **DataTable** 中行状态的更强控制，以便更好地满足更多实际情况的需要。 

**感谢** Microsoft 的 Kawarjit S. Bedi、Pablo Castro、Alan Griver、Steve Lasker 和 Paul Yuknewicz 帮助我准备本文。 

_Jackie Goldstein 是_[ Renaissance Computer Systems](http://www.renaissance.co.il/) _的负责人，该公司专门从事咨询、培训以及使用 Microsoft 工具和技术进行开发。Jackie 是 Microsoft 地区主管、Israel VB User Group 的创始人以及国际开发人员活动（包括 TechEd、VSLive!、Developer Days 和 Microsoft PDC）的主要演讲人。它还是_ Database Access with Visual Basic .NET _(Addison-Wesley, ISBN 0-67232-3435) 一书的作者以及 INETA Speakers Bureau 的成员。在 2003 年 12 月，Microsoft 将 Jackie 指定为 .NET 软件传奇人物！_

