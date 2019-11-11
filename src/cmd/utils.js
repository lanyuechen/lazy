const { toUpperFirstCase, isJsonString } = require('../utils/common');

module.exports = {
  prepareColumns
};

function prepareColumns(columns) {
  if (isJsonString(columns)) {
    columns = JSON.parse(columns);
  } else {
    try {
      columns = fs.readFileSync(columns, 'utf8');
      columns = JSON.parse(columns);
    } catch(err) {
      columns = columns.split(',').map(c => c.trim());
    }
  }
  return columns.map(column => {
    if (typeof (column) === 'string') {
      const [ dataIndex, type, title ] = column.split('|').map(c => c.trim());
      return {
        dataIndex,
        type,
        title: title || toUpperFirstCase(dataIndex),
      }
    }
    return {
      ...column,
      title: column.title || toUpperFirstCase(column.dataIndex),
    };
  });
}