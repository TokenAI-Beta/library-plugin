# anywork-library-plugin

资料库是单独的 DSH Web 插件，不并进门户插件。侧栏「资料库」，槽位 id 是 `ziliaoku`。

打开后是一栏安静的页面：写一句，或把文件拖进来。文件和记事本写在这个工作台自己的目录 `~/.dsh/anywork-library-plugin`（设置了 `DSH_HOME` 就写在那里）。不调用门户的 `/portal/api/drive` 或 `/portal/api/kb`。

## 安装和卸下

```sh
npm pack anywork-library-plugin --registry https://registry.npmjs.org
dsh plugin --profile web add ./anywork-library-plugin-0.2.13.tgz
```

`--profile` 写在子命令前面。`add` 会把本包写进该 profile 的 `dsh.profile.bundles`。浏览器入口是导出的 `./client`（`dsh.client.platform` 为 `web`，并依赖 `@deepseek-ai/dsh-client-ui-slots` 和 `@deepseek-ai/dsh-client-ui-sidebar`）。

卸下：

```sh
dsh plugin --profile web remove anywork-library-plugin
```

装上或卸下之后重启那个实例。`file:` 或 tgz 装进去的是副本，改源码不会自动更新。

## 开发

```sh
npm test
```

改 `lib/api.js` 或 `lib/panel.js` 之后执行 `npm run assemble`，再提交生成的 `lib/client.js`。
