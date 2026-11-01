# library-plugin

资料库：文件 + 笔记。DSH Web 客户端插件。侧栏文案是「资料库」，槽位 id 是 `ziliaoku`，和 desk-panel 自带的 `desk-hub` 分开，可以同时装着，以后也可以只留这一份。

界面跟工作台里的资料库一致：标题「资料库」，副标题「文件 + 笔记 · 放进来 = 全员可见」，页签「📁 文件 / 📝 笔记」。文件走公司盘（上传、文件夹、下载、移动、删除），笔记走知识库（搜索、记一条、查看；删除只给管理员）。

## 安装和卸下

在这个目录：

```sh
npm pack
dsh plugin --profile web add ./library-plugin-0.1.0.tgz
```

`--profile` 写在子命令前面。`add` 会把本包写进该 profile 的 `dsh.profile.bundles`。浏览器入口是导出的 `./client`（`dsh.client.platform` 为 `web`，并依赖 `@deepseek-ai/dsh-client-ui-slots` 和 `@deepseek-ai/dsh-client-ui-sidebar`）。

卸下：

```sh
dsh plugin --profile web remove library-plugin
```

装上或卸下之后重启那个实例。`file:` 或 tgz 装进去的是副本，改源码不会自动更新。

需要 Anywork 门户已经提供 `/portal/api/drive/*` 和 `/portal/api/kb/*`，并且浏览器带着登录会话打开工作台。没登录时面板会提示从门户再进。本包不自带盘和知识库服务。

本地 Docker / 工作台安装先不做。

## 开发

```sh
npm test
```

改 `lib/api.js` 或 `lib/panel.js` 之后执行 `npm run assemble`，再提交生成的 `lib/client.js`。
