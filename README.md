# library-plugin

资料库：文件 + 笔记。这是一个 DSH Web 客户端插件，侧栏文案是「资料库」，面板 id 是 `ziliaoku`（跟工作台 desk-panel 自带的 `desk-hub` 不是同一个 id）。

界面：标题「资料库」，副标题「文件 + 笔记 · 放进来 = 全员可见」，「文件 / 笔记」两个页签，笔记可以搜索、记一条、查看、删除。

## 打包后装进 Web profile

在这个目录执行：

```sh
npm pack
dsh plugin --profile web add ./library-plugin-0.1.0.tgz
```

`--profile` 要写在子命令前面（dsh 0.2.1 起）。`add` 会把本包装进该 profile 的 `dsh.profile.bundles`。浏览器入口是包导出的 `./client`（`dsh.client`，`platform: web`）。

装完需要重启那个实例。`file:` 装进去的是副本，改了源码不会自动更新；要换版本就先 `remove` 再 `add`。

本地 Docker / 工作台安装先不做。上面的命令留给之后在目标实例上自己装。

## 数据存在哪

这个独立包没有接公司盘或知识库接口。笔记和文件写在浏览器 `localStorage`，键名 `library-plugin:ziliaoku`。界面上标了「本机暂存」：只有这个浏览器看得到，清站点数据或换设备会丢。第一次打开会放一条示例笔记，删掉之后不会再自动补。

文本文件（约 200KB 以内）会留下正文，方便点「查看」。更大的文件或二进制只留文件名和大小。

## 开发

```sh
npm test
```

改 `lib/store.js` 或 `lib/panel.js` 之后执行 `npm run assemble`，再提交生成的 `lib/client.js`。`dsh plugin add` 读的是这份已经拼好的客户端脚本，不需要构建步骤。
