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
    lazy-ant add <name> --src=./src --option='{"id": "uuid", "columns": [...]}'
    ```
    注：[option](#Option)也可以定义在文件中，通过```--option='path-to-option/option.json'```的方式引入
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

### Option

| 名称 | 类型 | 描述 | 默认值 | 是否必须 |
| ---- | ---- | ---- | ---- | ---- |
| id | string | 数据唯一索引 | - | 是 |
| columns | Column[] | 数据字段映射定义 | [] | 是 |

### Column

注：Column为字符串时，等价为
```js
{
  dataIndex: Column,
  title: toUpperFirstCase(Column)
}
```

| 名称 | 类型 | 描述 | 默认值 | 是否必须 |
| ---- | ---- | ---- | ---- | ---- |
| dataIndex | string | 该字段在数据中的映射索引 | - | 是 |
| title | string | 字段显示名称 | column.dataIndex | 否 |
| sorter | boolean | 该字段是否支持排序 | false | 否 |
| filter | boolean | 该字段是否支持筛选 | false | 否 |
| type | enum[text/number/date/enum] | 字段类型 | text | 否 |
| options | array | 如果type=enum，options表示具体的枚举值 | [] | 如果type=enum，options必填 |

### Option 例子
```json
{
  "id": "uuid",
  "columns": [
    {
      "dataIndex": "name",
      "title": "Name",
      "sorter": true,
      "filter": true
    },
    "sex",
    {
      "dataIndex": "age",
      "type": "number"
    },
  ]
}
```
对应的数据
```json
[
  {
    "uuid": "1",
    "name": "xiaoming",
    "sex": "male",
    "age": 19,
  },
  {
    "uuid": "2",
    "name": "xiaohong",
    "sex": "famale",
    "age": 17,
  }
]
```

### 脚本
```shell
lazy-ant add <name> --src=./src --option=./option.json
lazy-ant remove <name> --src=./src
```