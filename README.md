# Clash Campus Rules

南京航空航天大学（NUAA）校园网络分流规则，供 Clash Verge Rev / Mihomo 使用。
规则采用严格白名单：只收录南航图书馆数字资源导航中能够确认订购或校园访问的站点，
不把“常见学术网站”自动视为学校支持的资源。

> [!IMPORTANT]
> 当前规则仅收录了部分已核实站点，并不是南航全部馆购数据库的完整清单。
> 不同学院、数据库订购范围和认证跳转域名也可能发生变化。建议 Fork 本仓库，按自己的实际需求维护。

## 使用方法

在 Clash Verge Rev 的配置中加入：

```yaml
rule-providers:
  campus:
    behavior: domain
    format: text
    interval: 86400
    path: ./ruleset/campus.list
    type: http
    url: https://raw.githubusercontent.com/kings669/clash-campus-rules/main/campus.list

proxy-groups:
  - name: 校园服务
    type: select
    proxies:
      - DIRECT
      - 节点选择

rules:
  - RULE-SET,campus,校园服务
```

请将 `节点选择` 改成你现有的代理组名称，并把
`RULE-SET,campus,校园服务` 放在通用代理、`GEOIP` 和 `MATCH` 规则之前。

- 在南京航空航天大学校园网：将“校园服务”切换为 `DIRECT`
- 离开校园网：将“校园服务”切换为你的代理组

## 文件

- `campus.list`：NUAA 与常用学术资源域名，可直接被 Mihomo 作为 `text` 规则集读取
- `clash-verge-example.yaml`：可复制的完整配置片段

## 收录约束

一个域名只有满足以下条件才加入 `campus.list`：

1. 南航自有域名；或
2. 南航图书馆官方数字资源页面明确列出，并说明本馆订购、IP 控制、CARSI 或校外访问方式。

开放访问站点、只有检索摘要但没有南航订购说明的站点，以及仅因出版社知名而推测可访问的站点，
均不加入。当前清单依据南航图书馆公开页面核对，包括 IEEE/IEL、ScienceDirect、SpringerLink、
Wiley、Taylor & Francis/CRC、AIP、APS、IOP、Emerald、EBSCO、Web of Science/Inspec、
CNKI、万方和维普等平台。订购范围可能只覆盖平台内的部分期刊、年份或学科包。

## 维护

每行一个域名后缀，使用 `+.` 同时匹配根域名和所有子域名。例如：

```text
+.ieee.org
```

## Fork 后自行添加规则

1. 登录 GitHub，点击本仓库右上角的 **Fork**，将仓库复制到自己的账号。
2. 打开自己仓库中的 `campus.list`，点击铅笔图标编辑。
3. 按照“一行一个域名后缀”的格式添加站点，例如：

   ```text
   # 数据库名称或用途
   +.example.com
   ```

4. 点击 **Commit changes** 保存修改。
5. 将 Clash Verge 配置中的 `url` 改成自己 Fork 后的 Raw 地址：

   ```yaml
   url: https://raw.githubusercontent.com/你的GitHub用户名/clash-campus-rules/main/campus.list
   ```

6. 在 Clash Verge 中更新规则提供器或重新加载配置。连接校园网时，将“校园服务”切换到
   `DIRECT`，再通过浏览器和连接日志确认规则是否命中。

添加规则时不要填写完整网页地址。例如网页地址是
`https://example.com/article/123`，规则中只写 `+.example.com`。如果登录过程中跳转到其他认证域名，
应根据连接日志补充该域名，但不要把无关的 CDN、统计或广告域名整批加入。

如果新增站点已经通过南航校园网机构权限验证，也欢迎向本仓库提交 Pull Request，并在说明中附上
南航图书馆对应资源页面或其他可核实依据。

如机构登录跳转失败，请先在南航图书馆数字资源导航确认该数据库仍在订购，再根据 Clash Verge
连接日志补充必要的认证域名。域名清单只决定流量出口，实际访问权限仍取决于学校订阅范围和
校园网出口；不要批量下载馆购资源。

核对入口：<https://lib.nuaa.edu.cn/engine2/m/C033AF58F1DD8665?p=254235&pageId=226566&typeId=4493755&websiteId=136822&wfwfid=21318>
