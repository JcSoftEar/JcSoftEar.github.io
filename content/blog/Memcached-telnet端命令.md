---
title: "Memcached telnet端命令"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Memcached telnet端命令

> 原文链接: https://www.cnblogs.com/inday/p/memcached-telnet-client-command.html | 迁移自博客园

---

Command |  Description |  Example  
---|---|---  
get |  Reads a value |  get mykey  
set |  Set a key unconditionally |  set mykey 0 60 5  
add |  Add a new key |  add newkey 0 60 5  
replace |  Overwrite existing key |  replace key 0 60 5  
append |  Append data to existing key |  append key 0 60 15  
prepend |  Prepend data to existing key |  prepend key 0 60 15  
incr |  Increments numerical key value by given number |  incr mykey 2  
decr |  Decrements numerical key value by given number |  decr mykey 5  
delete |  Deletes an existing key |  delete mykey  
flush_all |  Invalidate specific items immediately |  flush_all  
Invalidate all items in n seconds |  flush_all 900  
stats |  Prints general statistics |  stats  
Prints memory statistics |  stats slabs  
Prints memory statistics |  stats malloc  
Print higher level allocation statistics |  stats items  
|  stats detail  
|  stats sizes  
Resets statistics |  stats reset  
version |  Prints server version. |  version  
verbosity |  Increases log level |  verbosity  
quit |  Terminate telnet session |  quit

