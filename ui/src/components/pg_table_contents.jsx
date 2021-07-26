import { DataGrid } from '@material-ui/data-grid';


export default function PGDBTableContents({ data = [], title = "", columns = [] }) {



    return (
        <div className="db_tables" style={{ height: 600, width: "100%", fontSize: 10 }}>
            <h2>{title}</h2>
            <DataGrid
                rows={data}
                style={{ fontSize: 10 }}
                columns={columns}
                checkboxSelection
                hideFooter
                disableSelectionOnClick
            />
        </div>
    )
}