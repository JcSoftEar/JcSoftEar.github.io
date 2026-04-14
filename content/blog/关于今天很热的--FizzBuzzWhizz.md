---
title: "关于今天很热的--FizzBuzzWhizz"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 关于今天很热的--FizzBuzzWhizz

> 原文链接: https://www.cnblogs.com/inday/p/my-object-C-sharp-fizzbuzzwhizz.html | 迁移自博客园

---

今天早上到现在看到了3篇关于FizzBuzzWhizz的问题，第一篇是@程序媛想事儿（Alexia）【[最难面试的IT公司之ThoughtWorks代码挑战——FizzBuzzWhizz游戏](http://www.cnblogs.com/lanxuezaipiao/p/3705313.html)】其实题目不难，大家解法也都能实现，可大家比拼的都是算法问题，但如此简单的题目真的只是简单的算法吗？我不这么认为，我们先来看看题目吧：

你是一名体育老师，在某次课距离下课还有五分钟时，你决定搞一个游戏。此时有100名学生在上课。游戏的规则是： 

1\. 你首先说出三个不同的特殊数，要求必须是个位数，比如3、5、7。   
2\. 让所有学生拍成一队，然后按顺序报数。 

3\. 学生报数时，如果所报数字是第一个特殊数（3）的倍数，那么不能说该数字，而要说Fizz；如果所报数字是第二个特殊数（5）的倍数，那么要说Buzz；如果所报数字是第三个特殊数（7）的倍数，那么要说Whizz。 

4\. 学生报数时，如果所报数字同时是两个特殊数的倍数情况下，也要特殊处理，比如第一个特殊数和第二个特殊数的倍数，那么不能说该数字，而是要说FizzBuzz, 以此类推。如果同时是三个特殊数的倍数，那么要说FizzBuzzWhizz。   
5\. 学生报数时，如果所报数字包含了第一个特殊数，那么也不能说该数字，而是要说相应的单词，比如本例中第一个特殊数是3，那么要报13的同学应该说Fizz。如果数字中包含了第一个特殊数，那么忽略规则3和规则4，比如要报35的同学只报Fizz，不报BuzzWhizz。

初看题目，很多人会以为就是求个算法，其实不然，说白了算法很简单，先判断第5规则，再判断第3，第4，其实3和4可以利用字符串拼接，无需重复来进行判断。我们逐一来看题目吧。

### 1、你首先说出三个不同的特殊数，要求必须是个位数，比如3、5、7

这是我们的输入，3个特殊数，必须为个位数。因为是根据报数，肯定n > 0，我们的特殊数m 也肯定必须>0，根据题目3,4，我觉得可以把1排除在外，当然也可以包含在其中，每个人理解不一样吧。因为是个位数，所以1<m<10。因为对m有要求，所以必须对我们3个特殊数进行一个验证。

### 2、让所有学生拍成一队，然后按顺序报数 

这个简单，循环到100，我看到有朋友用了for(int i = 1;i<101;i++) ，不是不可以，但题目写了100个学生，为何你要去<101呢？<=100就可以了，尽量符合题目。

### 3、学生报数时，如果所报数字是第一个特殊数（3）的倍数，那么不能说该数字，而要说Fizz；如果所报数字是第二个特殊数（5）的倍数，那么要说Buzz；如果所报数字是第三个特殊数（7）的倍数，那么要说Whizz。 

### 4\. 学生报数时，如果所报数字同时是两个特殊数的倍数情况下，也要特殊处理，比如第一个特殊数和第二个特殊数的倍数，那么不能说该数字，而是要说FizzBuzz, 以此类推。如果同时是三个特殊数的倍数，那么要说FizzBuzzWhizz。

3和4的规则可以通过字符串拼接，合并在一起

if (m % num1 == 0) str += “Fizz”;

if (m % num2 == 0) str += “Buzz”;

if (m % num3 == 0) str += “Whizz”;

这些都是个人喜爱问题，你要一条条去验证判断，也没什么问题。

### 5、学生报数时，如果所报数字包含了第一个特殊数，那么也不能说该数字，而是要说相应的单词，比如本例中第一个特殊数是3，那么要报13的同学应该说Fizz。如果数字中包含了第一个特殊数，那么忽略规则3和规则4，比如要报35的同学只报Fizz，不报BuzzWhizz。

这条规则很特殊，所以我们的计算必须以if（5）else（3,4）进行，5的权重最高。

说完了规则，来看下其他的要求：

代码要求：

1，语言不限，Java, C#, Ruby, C++, Js, Python, Scala, objective-C统统可以，小语种也没问题，只要你擅长；

2，强烈建议写单元测试；

3，请展示出你超赞的面向对象/函数式编程功底；

4，建议尽量减少圈复杂度；

5，请提交可运行的代码，及相关构建脚本/说明文档（代码运行平台和环境）；

2-4的要求非常重要，因为这是区别程序员级别的一个标准。测试代码尽量全面。

# 我对题目的做法

看到题目的时候，活动结束了，也没想细作，只能说个大概。我使用的是C#，使用的是面向对象的方法。我设计了一个Student类
    
    
    public class Student
        {
            private int Id { get; set; }
    
            private IRule Rule { get; set; }
    
            public Student(int id, IRule rule)
            {
                Id = id;
                Rule = rule;
            }
    
            public void Say()
            {
                Console.WriteLine(Rule.RuleResult(Id));
            }
        }

100个学生，说明有100个对象，id为其所需要报的数，IRule则是其核心算法，解耦其算法，以免项目中会有算法变动。
    
    
    public interface IRule
        {
            string RuleResult(int number);
        }

如何实现IRule，则很简单了，这里说下第5个规则，如果含有第一个特殊数，比如第一个特殊数是3，则13,31,35都只报“Fizz”，第一篇的楼主用了indexof，把所需报的数变成了字符串，然后查找，不是不可，但你懂得，装箱拆箱不说，把数字变成了字符串就有点不符合题意了。我们可以使用加减的方法来进行判断。

13,23,33,43：n % 10 – m = 0 

31,32,33,34: n - (m * 10) >= 0 && n –(m*10) < 10

规则3,4，利用字符串的拼接就可实现，大致的实现为：
    
    
                if (number % Number_1 == 0)
                    {
                        result += Num_Result_1;
                    }
    
                    if (number % Number_2 == 0)
                    {
                        result += Num_Result_2;
                    }
    
                    if (number % Number_3 == 0)
                    {
                        result += Num_Result_3;
                    }

[](http://11011.net/software/vspaste)

我的实现如下：
    
    
            public string RuleResult(int number)
            {
                var result = String.Empty;
                var isRuled = false;
                if ((number % 10 - Number_1) == 0 ||
                    (number - (Number_1 * 10) >= 0 && number - (Number_1 * 10) < 10))
                {
                    isRuled = true;
                    result = Num_Result_1;
                }
                else
                {
                    if (number % Number_1 == 0)
                    {
                        result += Num_Result_1;
                        isRuled = true;
                    }
    
                    if (number % Number_2 == 0)
                    {
                        result += Num_Result_2;
                        isRuled = true;
                    }
    
                    if (number % Number_3 == 0)
                    {
                        result += Num_Result_3;
                        isRuled = true;
                    }
                }
    
                if (!isRuled)
                {
                    result = number.ToString();
                }
    
                return result;
            }

[](http://11011.net/software/vspaste)在不符合规则的情况下，返回number.ToString();

开始报数：
    
    
            IRule role = new FBWRule(numbers);
                for (var i = 1; i <= 100; i++)
                {
                    var student = new Student(i, role);
                    student.Say();
                }

[](http://11011.net/software/vspaste)

基本就完成了，运行如下：[![image](https://images0.cnblogs.com/blog/4871/201405/041652256733338.png)](https://images0.cnblogs.com/blog/4871/201405/041652254238794.png)

接下来就是写单元测试，我们只要针对IRule进行测试即可
    
    
        [Fact]
            public void RuleTest()
            {
                IRule rule = new FBWRule(3, 5, 7);
                Assert.Equal("Fizz", rule.RuleResult(30));
                Assert.Equal("Fizz", rule.RuleResult(35));
                Assert.Equal("FizzBuzz", rule.RuleResult(15));
                Assert.Equal("FizzBuzz", rule.RuleResult(45));
                Assert.Equal("BuzzWhizz", rule.RuleResult(70));
            }

# 写在最后

今天看到“ThoughtWorks”最难面试题，看了以后才发觉，很简单，但就是这么简单的题目，回答的答案都各有千秋，我相信考的不仅仅是算法，在代码中，思路中都能体现一个人的思想、行为，相信这是面试的关键吧。

刚试了下还能提交代码，写出来的目的也想看看的想法，接受任何批评和指点，谢谢。

