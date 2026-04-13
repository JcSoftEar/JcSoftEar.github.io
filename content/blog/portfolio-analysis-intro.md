---
title: "开源作品 | 股票持仓分析系统"
date: 2026-04-13
description: "一个轻量级的股票持仓管理工具，支持实时价格、盈亏分析、操作记录与报告生成。"
categories: ["开源"]
tags: ["Python", "Flask", "投资", "工具"]
---

# 📊 股票持仓分析系统

今天分享一个最近写的工具——**股票持仓分析系统**。

做投资的同学应该都有感受：用 Excel 记持仓麻烦，第三方 App 广告太多，数据还不一定准确。与其凑合，不如自己动手。

## 🎯 功能一览

### 持仓管理
添加、编辑、删除股票持仓，支持字段：
- 股票代码 / 名称
- 持仓数量
- 成本价

所有修改都会生成**操作日志**，随时可查、可追溯。

### 实时价格更新
手动一键更新所有持仓价格。系统在交易时间内自动执行，非交易时间会跳过，不会浪费资源。

### 盈亏分析
自动计算：
- **总市值** vs **总成本**
- **总盈亏额** + **盈亏比例**
- 个股盈亏明细
- 仓位占比（哪只股仓位最重，一目了然）

盈亏用颜色区分——**红色代表盈利**，绿色代表亏损。

### 报告生成
一键生成 Markdown 格式持仓报告，可直接下载，方便存档或分享。

## 🛠 技术栈

- **Python** — 核心逻辑
- **Flask** — 轻量 Web API
- **SQLite** — 数据持久化（无需额外部署数据库）
- **requests** — 股票数据请求

无依赖数据库，零配置，开箱即用。

## 🚀 快速上手

```python
from portfolio_system import PortfolioManager, start_server

# 启动 Web 服务器
start_server(host='0.0.0.0', port=5000, auto_update=True)
```

然后浏览器打开 `http://localhost:5000`，管理界面就在那里。

## 📡 API 接口

不想用 Web 界面？也可以直接调 API：

```bash
# 获取持仓
curl http://localhost:5000/api/portfolio

# 添加持仓
curl -X POST http://localhost:5000/api/portfolio/add \
  -H "Content-Type: application/json" \
  -d '{"symbol":"600519","name":"贵州茅台","quantity":100,"cost_price":1800}'

# 更新价格
curl -X POST http://localhost:5000/api/portfolio/update

# 生成报告
curl http://localhost:5000/api/portfolio/report
```

## ⚙️ 数据精度

所有价格计算精确到 **4 位小数**，避免累积误差。系统会自动处理上海/深圳/创业板股票代码。

## 📌 待完善

目前还是 MVP 阶段，欢迎 Star 和 PR：
- 支持基金、ETF
- 支持多账号管理
- 图表可视化

---

代码即生活，生活即代码。有兴趣的朋友可以研究研究，源码稍后公开。

*以上仅为个人投资记录分享，不构成投资建议。*
