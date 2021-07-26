import axios from 'axios';
const base = process.env.REACT_APP_API_BASE;

export default async function getTableRows(table) {
    const res = await axios.get(`${base}/pg/tables/${table}`);
    return res.data;

}