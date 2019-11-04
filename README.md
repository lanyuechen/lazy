## Lazy Ant

### 使用方法
```shell
lazy-ant add <name> --src=./src --option=./option.json
lazy-ant remove <name> --src=./src
```

### Option (option.json)

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