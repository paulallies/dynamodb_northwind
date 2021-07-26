import axios from 'axios';
const base = process.env.REACT_APP_API_BASE;

export default async function getAllTables() {
    const res = await axios.get(`${base}/pg/tables`);
    return res.data;
}