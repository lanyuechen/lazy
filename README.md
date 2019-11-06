## Lazy Ant

本工具基于**Ant Design Pro**，[https://umijs.org/zh/guide](https://umijs.org/zh/guide/)

用于（业务逻辑 + Ant Design Pro的项目结构）快速生成页面代码

### 使用方法
#### 初始化Ant Design Pro项目
1. 初始化项目
    ```shell
    $ mkdir myapp && cd myapp
    $ npm create umi
    ```

2. 选择project（ant-design-pro）
    ```shell
    ? Select the boilerplate type (Use arrow keys)
    ❯ ant-design-pro  - Create project with an layout-only ant-design-pro boilerplate, use together with umi block.
      app             - Create project with a simple boilerplate, support typescript.
      block           - Create a umi block.
      library         - Create a library with umi.
      plugin          - Create a umi plugin.
    ```

3. 选择是否使用typescript（y）
    ```shell
    ? Do you want to use typescript? (y/N)
    ```

4. 选择你需要的功能（至少选择antd、dva）
    ```shell
    ? What functionality do you want to enable? (Press <space> to select, <a> to toggle all, <i> to invert selection)
    ❯◯ antd
     ◯ dva
     ◯ code splitting
     ◯ dll
    ```
#### 添加页面(在根目录下执行命令，可以不写```--src```参数，src参数默认为./src)
1. 安装依赖
    ```shell
    npm i lazy-ant --global
    ```
2. 添加页面
    ```shell
    lazy-ant add <name> --src=./src --columns='xxx'
    ```
    注：[columns参数](#add)定义参考下文
3. 在config中加入对应的路由配置
```js
routes: [
  {
    path: '/[name]',
    name: '[name]',
    component: './[Name]',
  },
  ...
]
```

### add命令

```shell
$ lazy-ant add <name> [--src="xxx"] [--columns="xxx"] [--batch]
```

以上命令会在当前项目添加demo页面，目录结构如下：
```
src
 ├─ pages
 │   └─ Demo
 │       ├─ index.tsx
 │       ├─ ModalUpsert.tsx
 │       ├─ model.ts
 │       ├─ service.ts
 │       └─ _mock.ts
 └─ utils
     └─ lazy-ant
         ├─ filter.tsx
         └─ sorter.ts
```

#### 参数
```
-b, --batch                       enable batch delete
-s, --src <path>                  src root (default: "./src")
-c, --columns <string|json|path>  columns config (default: "name, date|date")
-h, --help                        output usage information
```

1. -b, --batch
    如果有该参数的话，生成的页面列表页会包含批量删除功能，表格每一行前会有选择框
2. -s, --src
    src根目录，建议命令操作在项目根目录进行，可以省略该参数
3. -c, --columns
    columns参数有多种定义方式
    - 字符串简写（推荐）
        每个column描述使用逗号分隔，每个column包含三个描述：dataIndex|type|title，使用竖线分隔
        ```shell
        $ lazy-ant add demo --columns='name, age|number, ct|date|日期, intro||介绍'
        ```
    - json字符串
        columns通过json字符串描述，[字段定义](#Columns)
        ```shell
        $ lazy-ant add demo --columns='[{"dataIndex": "name"}, {"dataIndex": "age", "type": "number"}]'
        ```
        json数组中的每一项还可以使用简写方式进行定义
        ```shell
        $ lazy-ant add demo --columns='[{"dataIndex": "name"}, "age|number", "ct|date|日期"]'
        ```
    - 配置文件路径
        columns可以是一个指向配置文件的路径,其结构同json字符串
        ```shell
        $ lazy-ant add demo --columns='path-to-columns/columns.json';
        ```

#### Columns

| 名称 | 类型 | 描述 | 默认值 | 是否必须 |
| ---- | ---- | ---- | ---- | ---- |
| dataIndex | string | 该字段在数据中的映射索引,支持 a.b.c、a[0].b.c[1] 的嵌套写法 | - | 是 |
| title | string | 字段显示名称 | column.dataIndex | 否 |
| type | enum[text/number/date/enum] | 字段类型 | text | 否 |
| sorter | boolean | 该字段是否支持排序 | false | 否 |
| filter | boolean | 该字段是否支持筛选 | false | 否 |
| pattern | string | [mock数据格式描述](http://mockjs.com/examples.html) | - | 否 |
| options | array | 如果type=enum，options表示具体的枚举值 | [] | 如果type=enum，options必填 |

### remove命令

```shell
$ lazy-ant remove <name> [--src="xxx"]
```

#### 参数
```
-s, --src <path>  src root (default: "./src")
-h, --help        output usage information
```