import { DataGrid } from '@material-ui/data-grid';

const cols = [{
    field: 'tablename'
}];
export default function PGDBTableList({ data, onSelect, columns = cols }) {

    function onSelectionChange(selectedIndexes = []) {
        if (selectedIndexes.length === 1) {
            let index = selectedIndexes[0];
            let table = data[index].tablename
            onSelect(table)
        }

    }

    return (
        <div className="db_tables" style={{ height: 600, width: 400, fontSize: 10 }}>
            <h2>DB Tables</h2>
            <DataGrid
                rows={data}
                style={{ fontSize: 10 }}
                columns={columns}
                onSelectionModelChange={onSelectionChange}
                checkboxSelection
                hideFooter
                disableSelectionOnClick
            />
        </div>
    )
}