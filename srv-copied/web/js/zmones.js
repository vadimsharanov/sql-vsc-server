let zmones = [];
async function getPeople() {
    try {
     const res = await fetch("/json/zmogus");
     if (res.ok) {
        zmones = await res.json();
        showPeople();
     }
     else {
        console.log(res.status, res.statusText);
        alert(`klaida gaunant duomenis is serverio:  ${res.statusText}` )
    }
}
catch (err) {
    console.log(err);
}
}
function showOnePeople(event) {
    let zmogus;
    if (event && event.target && event.target.zmogusId) { 
        zmogus =  zmones.find(z => z.id === event.target.zmogusId )
    }
    const app = document.getElementById("app")
    cleanElement(app);
    let input;
    if (zmogus) {
        input = document.createElement("input");
        input.type = "hidden";
        input.id = "id";
        input.value = zmogus.id
        app.appendChild(input);

    }
    app.appendChild(document.createTextNode("Vardas"));
    input = document.createElement("input");
    input.id = "vardas";
    if (zmogus) {
        input.value = zmogus.vardas
    }
    app.appendChild(input);
    app.appendChild(document.createElement("br"))
    
    app.appendChild(document.createTextNode("Pavarde"));
    input = document.createElement("input");
    input.id = "pavarde";
    if (zmogus) {
        input.value = zmogus.pavarde
    }
    app.appendChild(input);
    app.appendChild(document.createElement("br"))
    
    app.appendChild(document.createTextNode("Alga"));
    input = document.createElement("input");
    input.id = "alga";
    if (zmogus) {
        input.value = zmogus.alga
    }
    app.appendChild(input);
    app.appendChild(document.createElement("br"))

    let button;
    button = document.createElement("button");
    button.appendChild(document.createTextNode("save"));
    button.onclick = savePeople;
    app.appendChild(button)
    
    button = document.createElement("button");
    button.appendChild(document.createTextNode("Back"));
    button.onclick = showPeople;
    app.appendChild(button);
}


async function showPeople() {

const app = document.getElementById("app");
cleanElement(app)
const table = document.createElement("table");
for (const zmogus of zmones) {
    let a = document.createElement("a");
    a.appendChild(document.createTextNode(`${zmogus.vardas} ${zmogus.pavarde} (${zmogus.alga})`));
    a.zmogusId = zmogus.id;
    a.onclick = showOnePeople;
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.appendChild(a);
    tr.appendChild(td);
    table.appendChild(tr);


    const deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("delete"));
    deleteButton.zmogusId = zmogus.id
    deleteButton.onclick = deletePeople
    td.appendChild(deleteButton)
}
app.appendChild(table)
}

 async function savePeople() {

     let id;
     const idEl = document.getElementById("id");
     if (idEl) {
         id = idEl.value;
     }
    let vardas = document.getElementById("vardas").value
        if ( vardas === "") {
            vardas = "Bevardis"
        }
    let pavarde = document.getElementById("pavarde").value
        if ( pavarde === "") {
            pavarde = "Bepavardis"
        }
    let alga = (document.getElementById("alga")).value
        if (alga === "" || alga === "null") {
            alga = 0
        }
    let zmogus = {
        id,
        vardas,
        pavarde,
        alga,
    };
    if (id) {
        zmogus.id = id;
    }
    try {
        let res = await fetch("/json/zmogus" + (id ? "/" + zmogus.id : ""), {
            method:( id ? "PUT" : "POST"),
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(zmogus)
        });
        if (res.ok) {
            zmogus = await res.json();
            if (id) {
                const index =  zmones.findIndex(z => z.id === zmogus.id);
                if ( index >=0) {
                    zmones.splice(index, 1, zmogus)
                }
            }
            else {
                zmones.push(zmogus);
            }
            showPeople()
            // console.log("Save failed with status :" + res.status);
        }
        else {
            console.log(res.status, res.statusText);
            alert(`Klaida issaugant: ${res.statusText}`)
        }
} 
catch (err) {
    console.log(err);
} 
}


async function deletePeople(event) {
if (event && event.target && event.target.zmogusId) {
    const index =  zmones.findIndex(z => z.id === event.target.zmogusId)
    const zmogus = zmones[index]; // priskiriame kintamajam "zmogus" tikslu json masyvo elemento numeri
    try {
        const res = await fetch("/json/zmogus/" + zmogus.id, {
        method: "DELETE"
    });
        if (res.ok) {
            zmones.splice(index,1);
            showPeople();
        }
        else {
            console.log(res.status, res.statusText);
            alert("klaida trinant: " + res.statusText )
        }
    }
    catch (err) {
        console.log(err);
    }
}
}



function cleanElement(el) {
    if (el instanceof Element) {
        while (el.firstChild) {
            el.firstChild.remove()
        }
    }
}