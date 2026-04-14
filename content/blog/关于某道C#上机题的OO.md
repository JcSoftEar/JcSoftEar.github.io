---
title: "关于某道C#上机题的OO"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 关于某道C#上机题的OO

> 原文链接: https://www.cnblogs.com/inday/archive/2009/08/30/About-Game-OO-Develop.html | 迁移自博客园

---

前两天在园子里，有人出了一道[《关于一道C#上机题的一点想法》](http://www.cnblogs.com/joyaspx/archive/2009/08/27/1554753.html)，大概的意思呢是利用OO的思想来进行编程，接着又有一位朋友，也写了自己的[答案](http://www.cnblogs.com/hongyin163/archive/2009/08/27/1555012.html)，此朋友非常厉害，从类图，接口，封装，多态，都一一实现，实在让我佩服，不过真有点过度设计的味道，接着又有一大虾，完成了自己的[OO答案](http://www.cnblogs.com/roovent/archive/2009/08/27/1555182.html)，把泛型，可变，不可变都一一列举，实在令人佩服啊，可我觉得，或许是我理解错了，但我觉得三位，你们都偏离了题目，偏离了OO，你们只是利用了OO的特性。

# 题目

> 17个人围成一圈，从第一个人开始报数，报到3的退出，一直到剩下最后一个人，用面向对象的思想去做这道题。

# 点评

我不是高手，没什么资格点评大家，只是提出自己的看法。

[Joyaspx](http://www.cnblogs.com/joyaspx/) 只实现了一个对象，那就是人，但是却把“到3退出”给放在执行方法中，而人这个对象，还要知道他的哥哥弟弟，或许是Joyaspx上机时间不够，感觉这个方式不是面向对象的进行开发，还是用了面向问题来解决了。

[OOLi](http://www.cnblogs.com/hongyin163/) 不得不佩服，OO的一切，从设计到接口到实现都一一实现，实在是过度设计了，但其中的OO实在不敢恭维，比如初始数据时，使用了硬编码，第一个人还需要给他一个编号，还给Person这个对象配备了一个State，根据State来判断是否该移除，他的退出也很有趣，把自己割掉。。。。告诉哥哥，你没有我这个弟弟，你的弟弟是我的小弟弟，那我想问下，我去哪里了？

[YangQ](http://www.cnblogs.com/roovent/) 这位仁兄，我不得不说下，你的程序真的不是面向对象，是完全的面向过程来开发，虽然你用到了泛型，但不是说用了泛型就是面向对象开发了，希望兄台能继续努力，掌握和了解一下什么是面向对象开发。

# 我的理解

题目很短，我们也应该很好理解他，一共只有一个对象，那就是人Person，这是没有错误的，大家都想到的。但在这到题目中，并没有说我需要知道下一个人是谁，上一个人是谁，因为他们都是在玩游戏，一个报数的游戏，“到3退出”只是游戏的一个规则，不是每一个人都需要玩这个游戏，我们只需要17个人而已，所以对Person对象而言，并不需要那么复杂的Perv，Next，包括退出的动作，也不属于“人”的范畴，只是“人”在“报数游戏”的场景中，对于OO编程来说，一切皆对象，也就是说，游戏也是对象，呵呵。

> 此题是非常微妙的，如果没有要求OO的话，它应该是一个数据结构的算法问题，也就是前几位大哥说的那种，是什么结构我叫不出来，我自己认为是一个环状的，大家手拉手拉成圈的。

# 开始

理解了题目，我们知道需要2个对象，Person，Game，游戏必须依赖于人，因为没有人，游戏也不会开始，人不需要知道游戏，只要参加的人了解游戏就可以。我们看下Person对象的定义：
    
    
    public class Person
    {
          public Person(int personID)
    {
          this.PersonID = personID;
    }
          public int PersonID { get; set; }
          public void Say()
          {
                if (this.Said != null) this.Said(this, new PersonEventArgs(this));
          }
          public event EventHandler<PersonEventArgs> Said;
    }

每一个人都有自己的ID，因为是演示，姓名之类的，我就不加入了。有一个Say的方法，因为我们报数需要嘴巴来说，其中呢也不执行什么内容，如果需要内容，我们可以自己添加。对于人来说，我们每次说话不一定需要每次自己或者别人来做出响应，但我需要通知某一个对象，我说话了，就算你是对墙说话，你还是通知了墙，“Hi，墙，我说话了”，所以我加入了Said一个委托事件，目的是把我说话了通知给某个对象，在这个题目中，我通知给“游戏”这个对象，这应该属于通知模式了吧，呵呵。

PersonEventArgs：
    
    
    public class PersonEventArgs : EventArgs
    {
          public PersonEventArgs(Person person)
          {
                this.Person = person;
          }
          public Person Person { get; set; }
    }

接下来重点说说游戏，对于我们其他人来说（除了游戏中人），我是裁判，我只需要说游戏开始，就可以了，达到某个条件的时候，Game Over。所以我们只需要发命令，让游戏开始就好了。
    
    
    Game game = new Game(17);       //17 代表参加的人数
    game.Start();

这是程序测试的接口了，那我们构造这个Game对象就相对简单了，因为只要告诉它，多少人参加，然后游戏开始就OK了，我们只需要公开一个构造函数，一个开始方法就好了。
    
    
    public class Game
    {
          public Game(int personNumber)
          {
          }
          public void Start()
          {
          }
    }

这样我们完成了封装，呵呵，对于外部，我们只需要知道这些已经足够了，那接下来，我们看看Game中，我们还需要些什么。

既然我们需要人，而且是很多人玩游戏，那一定有一个Players的属性，游戏开始呢，需要开始报数，这时候我们需要一个一个人去进行报数，报数的结果呢，是游戏的一个状态（注意，是对象的状态，不是类型的），我们看下我写的Game类：
    
    
    public class Game
    {
          private int CurrentNumber = 0;
          private List<Person> CurrentQuitPersons = new List<Person>();
          private List<Person> Players { get; set; }
          private event EventHandler<PersonEventArgs> GameOver;
          public Game(int personNumber)
          {
                Ready(personNumber);
          }
          public void Start()
          {
                ++CurrentNumber;
                this.GameOver += new EventHandler<PersonEventArgs>(Game_GameOver);
                Go();
          }
          private void Ready(int personNumber)
          {
                this.Players = new List<Person>(personNumber);
                for (int i = 0; i < personNumber; i++)
                {
                      Person person = new Person(i);
                      person.Said += new EventHandler<PersonEventArgs>(Person_Said);
                      this.Players.Add(person);
                }
          }
          private void Go()
          {
                var persons = this.Players;
                persons.ForEach(p =>
                {
                      p.Say();
                      CurrentNumber++;
                });
                if (this.Players.Count > 1)
                {
                      if (CurrentQuitPersons.Any())
                      {
                            this.Players.RemoveAll(p => CurrentQuitPersons.Contains(p));
                            CurrentQuitPersons.Clear();
                      }
                      Go();
                }
                else
                {
                      this.GameOver(this, new PersonEventArgs(this.Players.First()));
                }
          }
          private void Person_Said(object sender, PersonEventArgs e)
          {
                if (CurrentNumber % 3 == 0)
                {
                      CurrentQuitPersons.Add(e.Person);
                      Console.WriteLine("The player quit, ID : {0}, CurrentNumber:{1}", e.Person.PersonID, CurrentNumber);
                }
          }
          private void Game_GameOver(object sender, PersonEventArgs e)
          {
                Console.WriteLine("Last Person's Person ID is {0}", e.Person.PersonID);
                Console.WriteLine("Game Over.");
          }
    }

呵呵，不好意思，比较长，请大家耐心看完。

其中呢有一个CurrentNumber字段，代表着这个Game对象的一个当前状态，也就是报数的一个数字。Players呢，是参加的人员，在构造函数的时候，会去准备一下，也就是初始化这个Players属性，每一个人呢，我们会分配一个ID，然后会委托一个Person_Said的委托，目的是让Game知道，Play报数了，然后根据这个数多少来反应一个动作。这个题目中呢，也就是“到3退出”。

一切都准备好了之后，我们就开始Start了，刚开始，从1开始，当前数字转变为1（为了区分结果，我把人的初始序号，是从0开始的），每个人开始报数，在Go这个方法中呢，会判断一下，如果还剩下一个人的时候，游戏结束，好，我们看下运行结果吧。

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/OO_584/image_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/OO_584/image_2.png)

ok，程序结束，运行正确，也是我们预料的。

# 总结

这次呢，正好有时间，有机会让自己体验一下面向对象的编程，其实题目并不是很难，要看大家的理解是如何的，不是说用了面向对象的特性就是面向对象的一个开发，这完全是一个误区，就好象你在项目中，用了一个接一个的模式一样，模式狂人并不代表你的程序是一个模式的程序，模式是在开发以后逐渐形成，能让我们更好的进行扩展、封装等，让每个人能更好的理解（比如UML），所以面向对象也是一样，它的特性完全是因为在开发过程中，人们发觉了这些特性，把它列举出来，并形成了一个规范文档，让大家能快速的上手了解面向对象，并不是说有了这些特性，就是面向对象开发。再通俗一点，歌手的特性会唱歌，但不是会唱歌的人就是歌手一样。

# 不足

我不能说我的解答非常完美，只是借此机会阐述自己的一些看法和观点。不足之处也有，因为我完全没有考虑算法，完全没有考虑性能。除此之外，其中也有一个败笔，那就是CurrentQuitPersons这个字段，原先我想是在Person_Said的时候，到3直接退出Players的，但发觉Remove后，序号会直接重新排列，造成了误差，所以利用这个字段，我在每一轮结束的时候，Remove这一轮需要去除的玩家，这样保证了报数的连续性，实在大为不爽，不知道大家有什么好的方法来解决呢？

