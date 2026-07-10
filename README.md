# Clash Campus Rules

南京航空航天大学（NUAA）校园网络分流规则，供 Clash Verge Rev / Mihomo 使用。

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

## 维护

每行一个域名后缀，使用 `+.` 同时匹配根域名和所有子域名。例如：

```text
+.ieee.org
```

如机构登录跳转失败，请在 Clash Verge 的连接日志中查看未命中的认证域名，再补充到
`campus.list`。域名清单只决定流量出口，实际访问权限仍取决于学校订阅和校园网出口。
