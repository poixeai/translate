# 宝塔面板部署 Poixe Translate

> 本教程适用于使用宝塔面板部署 Poixe Translate 的场景。
>
> 本节演示中的宝塔面板为 v11.2.0 版本

## 前置准备

在开始之前，请确保你已经准备好以下内容：

- 一台已安装宝塔面板的服务器
- 一个已解析到服务器的域名
- 已安装 Nginx
- 已获取 Poixe Translate 前端构建产物
- 如需配置 AI 模型，请自行准备 API Key

## 部署流程

第一步：DNS 解析（以 Cloudflare 为参考）。

![dns](../assets/bt-0.png)

第二步：进入宝塔面板，打开**网站**，点击 **添加站点**。

![add site](../assets/bt-1.png)

第三步：进入站点的 **SSL** 页面，申请并开启 HTTPS。

![add ssl](../assets/bt-2.png)

第四步：检查网站是否可访问（DNS / Nginx 配置是否生效）。

![check dns and nginx](../assets/bt-3.png)

第五步：打开 [GitHub Release](https://github.com/poixeai/translate/releases) 页面，下载最新的前端构建产物，

![download release](../assets/bt-4.png)

第六步：进入站点目录，将前端打包后的文件上传到网站根目录并解压。

![upload package](../assets/bt-5.png)

第七步：调整配置，更新 **运行目录** 至 `/dist`

![update site](../assets/bt-6.png)

第八步：完成配置后，直接访问你的域名，确认页面是否可以正常打开。

![final check](../assets/bt-7.png)
