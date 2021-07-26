import axios from 'axios';
const base = process.env.REACT_APP_API_BASE;

/**
 * 
 * @param {String} table 
 * @returns 
 */
export default async function getTableInfo(table) {
    const res = await axios.get(`${base}/pg/tables/${table}/info`);
    return res.data;

}