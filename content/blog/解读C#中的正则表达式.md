---
title: "解读C#中的正则表达式"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 解读C#中的正则表达式

> 原文链接: https://www.cnblogs.com/inday/articles/364187.html | 迁移自博客园

---

多少年来，许多的编程语言和工具都包含对正则表达式的支持，.NET基础类库中包含有一个名字空间和一系列可以充分发挥规则表达式威力的类，而且它们也都与未来的Perl 5中的规则表达式兼容。   
  
此外，regexp类还能够完成一些其他的功能，例如从右至左的结合模式和表达式的编辑等。   
  
在这篇文章中，我将简要地介绍System.Text.RegularExpression中的类和方法、一些字符串匹配和替换的例子以及组结构的详细情况，最后，还会介绍一些你可能会用到的常见的表达式。   
  
应该掌握的基础知识 

规则表达式的知识可能是不少编程人员“常学常忘”的知识之一。在这篇文章中，我们将假定你已经掌握了规则表达式的用法，尤其是Perl 5中表达式的用法。.NET的regexp类是Perl 5中表达式的一个超集，因此，从理论上说它将作为一个很好的起点。我们还假设你具有了C#的语法和.NET架构的基本知识。   
  
如果你没有规则表达式方面的知识，我建议你从Perl 5的语法着手开始学习。在规则表达式方面的权威书籍是由杰弗里·弗雷德尔编写的《掌握表达式》一书，对于希望深刻理解表达式的读者，我们强烈建议阅读这本书。   
  
RegularExpression组合体

regexp规则类包含在System.Text.RegularExpressions.dll文件中，在对应用软件进行编译时你必须引用这个文件，例如：

csc r:System.Text.RegularExpressions.dll foo.cs

命令将创建foo.exe文件，它就引用了System.Text.RegularExpressions文件。   
  
名字空间简介

在名字空间中仅仅包含着6个类和一个定义，它们是：   
  
Capture: 包含一次匹配的结果；   
CaptureCollection: Capture的序列；   
Group: 一次组记录的结果，由Capture继承而来；   
Match: 一次表达式的匹配结果，由Group继承而来；   
MatchCollection: Match的一个序列；   
MatchEvaluator: 执行替换操作时使用的代理；   
Regex: 编译后的表达式的实例。

Regex类中还包含一些静态的方法：

Escape: 对字符串中的regex中的转义符进行转义；   
IsMatch: 如果表达式在字符串中匹配，该方法返回一个布尔值；   
Match: 返回Match的实例；   
Matches: 返回一系列的Match的方法；   
Replace: 用替换字符串替换匹配的表达式；   
Split: 返回一系列由表达式决定的字符串；   
Unescape:不对字符串中的转义字符转义。   
  
简单匹配

我们首先从使用Regex、Match类的简单表达式开始学习。   
  
Match m = Regex.Match("abracadabra", "(a|b|r)+");   
  
我们现在有了一个可以用于测试的Match类的实例，例如：if (m.Success)...   
如果想使用匹配的字符串，可以把它转换成一个字符串：   
  
Console.WriteLine("Match="+m.ToString());   
  
这个例子可以得到如下的输出: Match=abra。这就是匹配的字符串了。   
  
字符串的替换

简单字符串的替换非常直观。例如下面的语句：   
  
string s = Regex.Replace("abracadabra", "abra", "zzzz");   
  
它返回字符串zzzzcadzzzz，所有匹配的字符串都被替换成了zzzzz。 

现在我们来看一个比较复杂的字符串替换的例子：   
  
string s = Regex.Replace(" abra ", @"^\s*(.*?)\s*$", "$1");   
  
这个语句返回字符串abra，其前导和后缀的空格都去掉了。   
  
上面的模式对于删除任意字符串中的前导和后续空格都非常有用。在C#中，我们还经常使用字母字符串，在一个字母字符串中，编译程序不把字符“ \” 作为转义字符处理。在使用字符“\”指定转义字符时，@"..."是非常有用的。另外值得一提的是$1在字符串替换方面的使用，它表明替换字符串只能包含被替换的字符串。   
  
匹配引擎的细节

现在，我们通过一个组结构来理解一个稍微复杂的例子。看下面的例子：   
  
string text = "abracadabra1abracadabra2abracadabra3";   
  
string pat = @"   
  
( # 第一个组的开始   
  
abra # 匹配字符串abra   
  
( # 第二个组的开始   
  
cad # 匹配字符串cad   
  
)? # 第二个组结束（可选）   
  
) # 第一个组结束   
  
\+ # 匹配一次或多次   
  
";   
  
//利用x修饰符忽略注释   
  
Regex r = new Regex(pat, "x");   
  
//获得组号码的清单   
  
int[] gnums = r.GetGroupNumbers();   
  
//首次匹配   
  
Match m = r.Match(text);   
  
while (m.Success)   
  
{   
  
//从组1开始   
  
for (int i = 1; i < gnums.Length; i++)   
  
{   
  
Group g = m.Group(gnums[i]);   
  
//获得这次匹配的组   
  
Console.WriteLine("Group"+gnums[i]+"=["+g.ToString()+"]");   
  
//计算这个组的起始位置和长度   
  
CaptureCollection cc = g.Captures;   
  
for (int j = 0; j < cc.Count; j++)   
  
{   
  
Capture c = cc[j];   
  
Console.WriteLine(" Capture" + j + "=["+c.ToString()   
  
\+ "] Index=" + c.Index + " Length=" + c.Length);   
  
}   
  
}   
  
//下一个匹配   
  
m = m.NextMatch();   
  
}   
  
这个例子的输出如下所示：   
  
Group1=[abra]   
  
Capture0=[abracad] Index=0 Length=7   
  
Capture1=[abra] Index=7 Length=4   
  
Group2=[cad]   
  
Capture0=[cad] Index=4 Length=3   
  
Group1=[abra]   
  
Capture0=[abracad] Index=12 Length=7   
  
Capture1=[abra] Index=19 Length=4   
  
Group2=[cad]   
  
Capture0=[cad] Index=16 Length=3   
  
Group1=[abra]   
  
Capture0=[abracad] Index=24 Length=7   
  
Capture1=[abra] Index=31 Length=4   
  
Group2=[cad]   
  
Capture0=[cad] Index=28 Length=3

我们首先从考查字符串pat开始，pat中包含有表达式。第一个capture是从第一个圆括号开始的，然后表达式将匹配到一个abra。第二个capture组从第二个圆括号开始，但第一个capture组还没有结束，这意味着第一个组匹配的结果是abracad ，而第二个组的匹配结果仅仅是cad。因此如果通过使用？符号而使cad成为一项可选的匹配，匹配的结果就可能是abra或abracad。然后，第一个组就会结束，通过指定+符号要求表达式进行多次匹配。   
  
现在我们来看看匹配过程中发生的情况。首先，通过调用Regex的constructor方法建立表达式的一个实例，并在其中指定各种选项。在这个例子中，由于在表达式中有注释，因此选用了x选项，另外还使用了一些空格。打开x选项，表达式将会忽略注释和其中没有转义的空格。   
  
然后，取得表达式中定义的组的编号的清单。你当然可以显性地使用这些编号，在这里使用的是编程的方法。如果使用了命名的组，作为一种建立快速索引的途径这种方法也十分有效。   
  
接下来是完成第一次匹配。通过一个循环测试当前的匹配是否成功，接下来是从group 1开始重复对组清单执行这一操作。在这个例子中没有使用group 0的原因是group 0是一个完全匹配的字符串，如果要通过收集全部匹配的字符串作为一个单一的字符串，就会用到group 0了。   
  
我们跟踪每个group中的CaptureCollection。通常情况下每次匹配、每个group中只能有一个capture，但本例中的Group1则有两个capture：Capture0和Capture1。如果你仅需要Group1的ToString，就会只得到abra，当然它也会与abracad匹配。组中ToString的值就是其CaptureCollection中最后一个Capture的值，这正是我们所需要的。如果你希望整个过程在匹配abra后结束，就应该从表达式中删除+符号，让regex引擎知道我们只需要对表达式进行匹配。   
  
基于过程和基于表达式方法的比较

一般情况下，使用规则表达式的用户可以分为以下二大类：第一类用户尽量不使用规则表达式，而是使用过程来执行一些需要重复的操作；第二类用户则充分利用规则表达式处理引擎的功能和威力，而尽可能少地使用过程。   
  
对于我们大多数用户而言，最好的方案莫过于二者兼而用之了。我希望这篇文章能够说明.NET语言中regexp类的作用以及它在性能和复杂性之间的优、劣点。   
  
基于过程的模式

我们在编程中经常需要用到的一个功能是对字符串中的一部分进行匹配或其他一些对字符串处理，下面是一个对字符串中的单词进行匹配的例子：

string text = "the quick red fox jumped over the lazy brown dog.";   
  
System.Console.WriteLine("text=[" + text + "]");   
  
string result = "";   
  
string pattern = @"\w+|\W+";   
  
foreach (Match m in Regex.Matches(text, pattern))   
  
{   
  
// 取得匹配的字符串   
  
string x = m.ToString();   
  
// 如果第一个字符是小写   
  
if (char.IsLower(x[0]))   
  
// 变成大写   
  
x = char.ToUpper(x[0]) + x.Substring(1, x.Length-1);   
  
// 收集所有的字符   
  
result += x;   
  
}   
  
System.Console.WriteLine("result=[" + result + "]");  
  
正象上面的例子所示，我们使用了C#语言中的foreach语句处理每个匹配的字符，并完成相应的处理，在这个例子中，新创建了一个result字符串。这个例子的输出所下所示：   
  
text=[the quick red fox jumped over the lazy brown dog.]   
  
result=[The Quick Red Fox Jumped Over The Lazy Brown Dog.]   
  
基于表达式的模式

完成上例中的功能的另一条途径是通过一个MatchEvaluator，新的代码如下所示：   
  
static string CapText(Match m)   
  
{   
  
//取得匹配的字符串   
  
string x = m.ToString();   
  
// 如果第一个字符是小写   
  
if (char.IsLower(x[0]))   
  
// 转换为大写   
  
return char.ToUpper(x[0]) + x.Substring(1, x.Length-1);   
  
return x;   
  
}   
  
  
  
static void Main()   
  
{   
  
string text = "the quick red fox jumped over the   
  
lazy brown dog.";   
  
System.Console.WriteLine("text=[" + text + "]");   
  
string pattern = @"\w+";   
  
string result = Regex.Replace(text, pattern,   
  
new MatchEvaluator(Test.CapText));   
  
System.Console.WriteLine("result=[" + result + "]");   
  
}   
  
同时需要注意的是，由于仅仅需要对单词进行修改而无需对非单词进行修改，这个模式显得非常简单。

常用表达式 

为了能够更好地理解如何在C#环境中使用规则表达式，我写出一些对你来说可能有用的规则表达式，这些表达式在其他的环境中都被使用过，希望能够对你有所帮助。   
  
罗马数字

string p1 = "^m*(d?c{0,3}|c[dm])" + "(l?x{0,3}|x[lc])(v?i{0,3}|i[vx])$";   
  
string t1 = "vii";   
  
Match m1 = Regex.Match(t1, p1);   
  
交换前二个单词 

string t2 = "the quick brown fox";   
  
string p2 = @"(\S+)(\s+)(\S+)";   
  
Regex x2 = new Regex(p2);   
  
string r2 = x2.Replace(t2, "$3$2$1", 1);   
  
关健字=值

string t3 = "myval = 3";   
  
string p3 = @"(\w+)\s*=\s*(.*)\s*$";   
  
Match m3 = Regex.Match(t3, p3);   
  
实现每行80个字符

string t4 = "********************"   
  
\+ "******************************"   
  
\+ "******************************";   
  
string p4 = ".{80,}";   
  
Match m4 = Regex.Match(t4, p4);   
  
月/日/年 小时:分:秒的时间格式

string t5 = "01/01/01 16:10:01";   
  
string p5 = @"(\d+)/(\d+)/(\d+) (\d+):(\d+):(\d+)";   
  
Match m5 = Regex.Match(t5, p5);   
  
改变目录（仅适用于Windows平台）

string t6 = @"C:\Documents and Settings\user1\Desktop\";   
  
string r6 = Regex.Replace(t6,@"\\\user1\\\", @"\\\user2\\\");   
  
扩展16位转义符

string t7 = "%41"; // capital A   
  
string p7 = "%([0-9A-Fa-f][0-9A-Fa-f])";   
  
string r7 = Regex.Replace(t7, p7, HexConvert);   
  
删除C语言中的注释（有待完善）

string t8 = @"   
  
/*   
  
* 传统风格的注释   
  
*/   
  
";   
  
string p8 = @"   
  
/\\* # 匹配注释开始的定界符   
  
.*? # 匹配注释   
  
\\*/ # 匹配注释结束定界符   
  
";   
  
string r8 = Regex.Replace(t8, p8, "", "xs");   
  
删除字符串中开始和结束处的空格

string t9a = " leading";   
  
string p9a = @"^\s+";   
  
string r9a = Regex.Replace(t9a, p9a, "");   
  
string t9b = "trailing ";   
  
string p9b = @"\s+$";   
  
string r9b = Regex.Replace(t9b, p9b, "");   
  
在字符\后添加字符n，使之成为真正的新行

string t10 = @"\ntest\n";   
  
string r10 = Regex.Replace(t10, @"\\\n", "\n");   
  
转换IP地址

string t11 = "55.54.53.52";   
  
string p11 = "^" +   
  
@"([01]?\d\d|2[0-4]\d|25[0-5])\\." +   
  
@"([01]?\d\d|2[0-4]\d|25[0-5])\\." +   
  
@"([01]?\d\d|2[0-4]\d|25[0-5])\\." +   
  
@"([01]?\d\d|2[0-4]\d|25[0-5])" +   
  
"$";   
  
Match m11 = Regex.Match(t11, p11);   
  
删除文件名包含的路径

string t12 = @"c:\file.txt";   
  
string p12 = @"^.*\\\";   
  
string r12 = Regex.Replace(t12, p12, "");   
  
联接多行字符串中的行

string t13 = @"this is   
  
a split line";   
  
string p13 = @"\s*\r?\n\s*";   
  
string r13 = Regex.Replace(t13, p13, " ");   
  
提取字符串中的所有数字 

string t14 = @"   
  
test 1   
  
test 2.3   
  
test 47   
  
";   
  
string p14 = @"(\d+\\.?\d*|\\.\d+)";   
  
MatchCollection mc14 = Regex.Matches(t14, p14);   
  
找出所有的大写字母

string t15 = "This IS a Test OF ALL Caps";   
  
string p15 = @"(\b[^\Wa-z0-9_]+\b)";   
  
MatchCollection mc15 = Regex.Matches(t15, p15);   
  
找出小写的单词

string t16 = "This is A Test of lowercase";   
  
string p16 = @"(\b[^\WA-Z0-9_]+\b)";   
  
MatchCollection mc16 = Regex.Matches(t16, p16);   
  
找出第一个字母为大写的单词

string t17 = "This is A Test of Initial Caps";   
  
string p17 = @"(\b[^\Wa-z0-9_][^\WA-Z0-9_]*\b)";   
  
MatchCollection mc17 = Regex.Matches(t17, p17);   
  
找出简单的HTML语言中的链接

  
string t18 = @"   
  
<html>   
  
<a href=""first.htm"">first tag text</a>   
  
<a href=""next.htm"">next tag text</a>   
  
</html>   
  
";   
  
string p18 = @"<A[^>]*?HREF\s*=\s*[""']?" + @"([^'"" >]+?)[ '""]?>";   
  
MatchCollection mc18 = Regex.Matches(t18, p18, "si");  


