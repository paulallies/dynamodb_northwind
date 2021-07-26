import * as React from 'react';
import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import getAllTables from './domain/use_cases/get_all_tables';
import getTableRows from './domain/use_cases/get_table_rows';
import getTableInfo from './domain/use_cases/get_table_info';
import DBTableList from './components/pg_table_list';
import DBTableContents from './components/pg_table_contents';


setConfig({
  showReactDomPatchNotification: false
})

function App() {

  const [table_list, setTableList] = React.useState([])
  const [table_rows, setTableRows] = React.useState([])
  const [columns, setColumns] = React.useState([])

  React.useEffect(() => {
    fetchTables()
  }, [])

  async function fetchTables() {
    let data = await getAllTables();
    setTableList(data.map((item, i) => ({ tablename: item.tablename, id: i.toString() })));
  }

  async function onSelect(table) {
    let data = await getTableRows(table);
    let table_info = await getTableInfo(table);
    let columns = [];

    for (const key in table_info) {
      columns.push({ field: `${table_info[key].column_name}`, width: 150, padding: 0 })
    }

    setColumns(columns)

    setTableRows(data.map((item, i) => ({

      id: i.toString(),
      ...item
    })));
  }

  return (
    <div className="table-master-child">
      <DBTableList
        data={table_list}
        columns={[{
          field: "tablename",
          width: 200
        }]}
        onSelect={onSelect}
      />
      <DBTableContents
        title={`Table Contents: ${table_rows.length}`}
        data={table_rows}
        columns={columns} />
    </div>

  );
}

export default hot(App);
