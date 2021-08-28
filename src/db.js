import mysql from "mysql";

const options = {
    host: "localhost",
    database: "adresu_knyga",
    port: 3306,
    user:"adresu_knyga_prog",
    password:"adresu_knyga_prog"
}
function query(connection, sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results, fields) => {
            if (err) {
               return reject(err)
            }
           return resolve({
                results,
                fields
            }) 
        })
    })
}
async function getPeople() {
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        let  {results: r} = await query(
        connection,
        `select id, vardas, pavarde, gim_data as gimData, alga from zmones order by vardas, pavarde`);
        return r;
}
finally {
   connection.end();
   console.log('connection ended');
}}

async function getOnePeople(id) {
    id = parseInt(id);
    if (!isFinite(id)) {
        return null;
    }
    let connection;    
try {
    connection = mysql.createConnection(options)
    connection.connect();
    let  {results: r} = await query(
    connection,
    `select id, vardas, pavarde, gim_data as gimData, alga 
    from zmones 
    where id = ?`, 
    [id]);
    return console.log(r[0]), r[0];
}
finally {
connection.end();
console.log('connection ended');
}   
}

async function deletePeople(id) {
    id = parseInt(id);
    if (!isFinite(id)) {
        return;
    }
    let connection;    
try {
    connection = mysql.createConnection(options)
    connection.connect();
    let  {results: r} = await query(
    connection,
    `delete 
    from zmones 
    where id = ?`, 
    [id]);
    return;
}
finally {
connection.end();
console.log('connection ended');
        }   
}

async function savePeople(zmogus) {
    let connection;  
    if (typeof zmogus.id === "undefined") {
        try {
            connection = mysql.createConnection(options)
            connection.connect();
            await query(
            connection,
            `insert into 
            zmones 
            (vardas, pavarde, alga)
            values (?,?,?)`, 
            [zmogus.vardas, zmogus.pavarde, zmogus.alga]);
            return ;
        }
        finally {
        connection.end();
        console.log('connection ended');
        }  
    }
    else {
        zmogus.id = parseInt(zmogus.id)
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        await query(
        connection,
        `update zmones
        set vardas = ?, pavarde = ?, alga = ? 
        where id = ?`, 
        [zmogus.vardas, zmogus.pavarde, zmogus.alga,zmogus.id]);
        return;
    }
    finally {
    connection.end();
    console.log('connection ended');
    }   
    }
}
export {getPeople, getOnePeople, deletePeople, savePeople};