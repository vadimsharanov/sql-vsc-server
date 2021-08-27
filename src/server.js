import readline from "readline";
import  mysql from "mysql";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
   
  
  function inputText(msg) {
      return new Promise((resolve) => {
          rl.question(msg, (answer) => {
              resolve(answer);
          });
      });
  }
  function inputNumber(msg) {
      return new Promise((resolve, reject) => {
          rl.question(msg, (answer) => {
              const num = parseFloat(answer);
              if (!isNaN(num) && Number.isFinite(num)) {
                  resolve(num);
              } else {
                  reject(new Error(`${answer} is not a number`));
              }
          });
      });
  }

const connection = mysql.createConnection({
    host: "localhost",
    database: "adresu_knyga",
    port: 3306,
    user:"adresu_knyga_prog",
    password:"adresu_knyga_prog"
});
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
 try {
     connection.connect();
     let vardas = await inputText("Ivesk varda: ")
     let  {results: r, fields: f} = await query(
         connection,`select * from zmones where vardas like ?`,
         [`%${vardas}%`]);
     
     console.log(f);
     console.log(r);
 }
 catch (err) {
     console.log("ASHIBKA: ", err);
 }
 finally {
    connection.end();
    rl.close();
    console.log('connection ended');
 }

