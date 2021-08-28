import express, { response } from "express";
import { readFile, writeFile } from "fs/promises";
import exphbs from "express-handlebars";

const SERVER_PORT = 3000;
const WEB_DIR = "web";
const DATA_FILE = "zmones.json"
const KLAIDA = "404-mergaite.html"

const app = express()
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
                    // midlewar'u registravimo tvarka, turi reiksme
app.use(express.static(WEB_DIR, {
    index: false,   // pagal default'ine reiksme, programa skaitys is pradziu index.html,
                    // bet boolean'u false mes pasakome, kad default'a panaikiname
}));                // Reaguoja i visas uzklausas, patikrina, ar web direktorijoje yra toks failas, 
                    //jeigu yra - uzklausa apdorojama[nusius atsakyma narsyklej],
                    // ir next() nekvieciamas, o jei yra yra, tai kviecia funckjia next, ir ziures, kokius middlewar'us reikia atlikti.

// app.use((req, res, next) => { // login middleWar'as
//     console.log(req);        // kiekviena uzklausa(request) bus atspausdinta;
//                             // iskviesdamas sia funckija, sakau, kad apdorojimas dar nebaigtas, liepiu dirbti kitiem savo darba.
// })

app.use(express.urlencoded( {
    extended:true
}))
app.use(express.json());

app.get("/", async function (req, res) {  // generuojame zmoniu sarasa
    try {
        let zmones = await readFile(DATA_FILE, {
        encoding:"utf-8"
    })
    zmones = JSON.parse(zmones);
    res.render("zmones", { zmones , title: "Pilnas zmoniu sarasas"});
}
    catch (err) {
        res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
}
});

app.get("/zmogus/:id?", async (req, res) => { // sukuriame atskira puslapy, kiekvienam zmogui
    try {
        let zmogus = null;
        if (req.params.id) {
        let zmones = await readFile(DATA_FILE, {
        encoding:"utf-8"
    })
    zmones = JSON.parse(zmones);

    const id = parseInt(req.params.id);
    zmogus = zmones.find(z => z.id === id);
}
    res.render("zmogus", { zmogus, title: "Zmogaus informacija"});
}
    catch (err) {
    res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
}
});

app.post("/zmogus", async (req, res) => {  // naujo zmogaus kurimas
    try {
        let zmones = await readFile(DATA_FILE, {
        encoding:"utf-8"
    })
    zmones = JSON.parse(zmones);
    if (req.body.id) {
        const id = parseInt(req.body.id);
        const zmogus = zmones.find(z => z.id === id);
         if (zmogus) {
             zmogus.vardas = req.body.vardas
             zmogus.pavarde = req.body.pavarde
             zmogus.alga = parseFloat(req.body.alga);
         }
         else {
             res.render("nera", {id})
             return;
         }
    }
    
    else {
        let nextId = 0;
        for (const zmogus of zmones) {
            if (zmogus.id > nextId) {
                nextId = zmogus.id
                nextId++;
        }
    }
    const zmogus = {
        id: nextId,
        vardas: req.body.vardas,
        pavarde: req.body.pavarde,
        alga: parseFloat(req.body.alga),
    }
    zmones.push(zmogus);
    }
    await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
        encoding:"utf8"
    })
    res.redirect("/")
}
catch (err) {
        res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
}

})
// app.post("/", async (req, res) => {
//     try {
//         let zmones = await readFile(DATA_FILE, {
//             encoding:"utf-8"
//         })
//         let id;
//         zmones = JSON.parse(zmones);
//         for (const zmogus of zmones) {
//             if (Number((Object.keys(req.body))) === zmogus.id){
//                 id = zmogus.id;
//             }
//         }
//         const zmogus = zmones.find(z => z.id === id)
//         zmones.splice((zmones.indexOf(zmogus)),1);
//         await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
//             encoding:"utf8"
//         })
        
//         res.redirect("/")
//     }
//     catch (err) {
//             res.status(500).end(await readFile(KLAIDA, {
//         encoding:"utf-8"
//     }));
//     }
    
// })

app.get("/zmones/:id/delete", async (req, res) => { // padarom linka, i kuri nuejus zmogus trinamas
    try {
        let zmones = await readFile(DATA_FILE, {
        encoding:"utf-8"
    })
    zmones = JSON.parse(zmones);

    const id = parseInt(req.params.id);
    const index = zmones.findIndex(z => z.id === id);
    if (index >=0) {
        zmones.splice(index, 1)
        await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
            encoding:"utf-8"
        })
    }
    res.redirect("/")

}
    catch (err) {
    res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
}
});

// app.get("/redagavimas/:id", async (req, res) => { // zmogaus redagavimas
//     try {
//         let zmones = await readFile(DATA_FILE, {
//             encoding:"utf-8"
//         })
//         zmones = JSON.parse(zmones);
//         const id = parseInt(req.params.id);
//         const zmogus = zmones.find(z => z.id === id);
//         res.render("redagavimas", { zmogus, title: "Zmogaus redagavimas"});
//         if (req.query.naujasVardas === undefined || req.query.naujasVardas === ""){
//         }
//         else {
//         zmones[zmones.indexOf(zmogus)].vardas = req.query.naujasVardas;
//         zmones[zmones.indexOf(zmogus)].pavarde = req.query.naujaPavarde;
//         zmones[zmones.indexOf(zmogus)].alga = parseFloat(req.query.naujaAlga);
//         }
//         await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
//             encoding:"utf8"
//         })
//     }
//     catch (err) {
//             res.status(500).end(await readFile(KLAIDA, {
//         encoding:"utf-8"
//     }));
//     }
// });
app.get("/json/zmogus", async(req, res) => {
        try {
            let zmones = await readFile(DATA_FILE, {
            encoding:"utf-8"
        })
        zmones = JSON.parse(zmones);
        res.set("Content-Type", "application/json") // siunciant respons'a atgal, nustatome tipa
        res.send(JSON.stringify(zmones))
    
    }
        catch (err) {
        res.status(500).end(await readFile(KLAIDA, {
            encoding:"utf-8"
        }));
    }
});

app.delete("/json/zmogus/:id", async(req, res) => { 
    try {
        let zmones = await readFile(DATA_FILE, {
        encoding:"utf-8"
    })
    zmones = JSON.parse(zmones); 
    const id = parseInt(req.params.id);
    const index = zmones.findIndex(z => z.id === id);
    if (index >=0) {
        zmones.splice(index, 1)
        await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
            encoding:"utf-8"
        })
    }
    res.status(200).end();
    }
    catch (err) {
    res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
    }
    
}); // zmogaus trinimas, naudojant DOM



    app.post("/json/zmogus", async(req, res) => { // naujo zmogaus kurimas, naudojant DOM
        try {
            let zmones = await readFile(DATA_FILE, {
            encoding:"utf-8"
        })
        zmones = JSON.parse(zmones);

        let zmogus;
        if (req.body.id) {
            const id = parseInt(req.body.id);
            zmogus = zmones.find(z => z.id === id);
             if (zmogus) {
                 zmogus.vardas = req.body.vardas
                 zmogus.pavarde = req.body.pavarde
                 zmogus.alga = parseFloat(req.body.alga);
             }
             else {
                 res.render("nera", {id})
                 return;
             }
        }
        
        else {
            let nextId = 0;
            for (const zmogus of zmones) {
                if (zmogus.id > nextId) {
                    nextId = zmogus.id
                }
            }
            nextId++;
            zmogus = {
            id: nextId,
            vardas: req.body.vardas,
            pavarde: req.body.pavarde,
            alga: parseFloat(req.body.alga),
        };
        zmones.push(zmogus);
        };
        await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
            encoding:"utf8"
        })
        res.set("Content-Type", "application/json") // siunciant respons'a atgal, nustatome tipa
        res.send(JSON.stringify(zmogus))
        res.status(201).end()
    }
    catch (err) {
            res.status(500).end(await readFile(KLAIDA, {
            encoding:"utf-8"
        }));
    }
    
    })
    app.put("/json/zmogus/:id", async(req, res) => { 
        try {
            let zmones = await readFile(DATA_FILE, {
            encoding:"utf-8"
        })
        zmones = JSON.parse(zmones); 
        const id = parseInt(req.params.id);
        const zmogus = zmones.find(z => z.id === id);
        if (zmogus) {
            zmogus.vardas = req.body.vardas;
            zmogus.pavarde = req.body.pavarde;
            zmogus.alga = parseFloat(req.body.alga)
            await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
                encoding:"utf-8"
            })
            res.status(200).end(JSON.stringify(zmogus));
        }
        else {
            res.status(404).end()
        }
        }
        catch (err) {
        res.status(500).end(await readFile(KLAIDA, {
            encoding:"utf-8"
        }));
        }
        
    });
app.listen(SERVER_PORT)

console.log(`Server started at port: ${SERVER_PORT}`);


    