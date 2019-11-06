module.exports = {
  digestColumns,
};

function digestColumns(columns, spaceCount = 0) {
  let obj = columns.reduce((p, n) => ({
    ...p,
    [n.dataIndex]: {
      ...n,
      _column: true,
    },
  }), {id: 1});

  obj = digest(obj);

  return stringifyMock(obj, spaceCount);
}

/**
 * 解析形如{'a.b': 1, 'a.c': 2} 为 { a: { b: 1, c: 2 } }
 * @param {*} data 
 */
function digest(data) {
  if (typeof(data) !== 'object' || data === null) {
    return data;
  }
  const res = Array.isArray(data) ? [] : {};
  Object.entries(data).map(([key, value]) => {
    const idx = key.indexOf('.');
    if (idx === -1) {
      res[key] = digest(value);
    } else {
      const a = key.substr(0, idx);
      const b = key.substr(idx + 1);
      res[a] = digest({
        ...(res[a] || {}),
        [b]: value
      })
    }
  });
  return res;
}

function stringifyMock(obj, spaceCount = 0) {
  const space = ' '.repeat(spaceCount);

  let res = '';
  Object.entries(obj).map(([key, value]) => {
    res += `\n${space}  `;
    if (key === 'id') {
      res += `id: '@guid()',`;
    } else if (!value._column) {
      res += `${key}: ${stringifyMock(value, spaceCount + 2)},`;
    } else if (value.pattern) {
      const [ suffix, pattern ] = value.pattern.split(':');
      res += `${suffix ? `'${key}|${suffix}'` : key}: ${pattern},`;
    } else if (value.type === 'number') {
      res += `'${key}|0-100.0-4': 1,`;
    } else if (value.type === 'date') {
      res += `${key}: '@datetime("yyyy-MM-dd HH:mm:ss")',`;
    } else if (value.type === 'enum') {
      res += `'${key}|1': [${value.options.map(o => `'${o.key}'`)}],`;
    } else {
      res += `${key}: '@string()',`;
    }
  });
  return `{${res}\n${space}}`;
}

