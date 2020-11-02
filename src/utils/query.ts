export const getNearQuery = (selectedFields: string, latColumn:string, lonColumn:string, lat:number, lon:number, table:string, where:string, orderField:string, orderWay:"ASC"|"DESC"): string => {
    return `SELECT ${selectedFields}, SQRT( POW(69.1 * (${latColumn} - ${lat}), 2) + POW(69.1 * (${lon} - ${lonColumn}) * COS(${latColumn} / 57.3), 2)) AS distance FROM \`${table}\` ${where} ORDER BY \`${orderField}\` ${orderWay}`;
}
