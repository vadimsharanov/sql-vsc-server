function showDOM() {
    printTags(document.body)
}

function printTags(el, indent = 0) {
    if (el) {
        if (el instanceof Element) {
            console.log(" ".repeat(indent) + el.tagName);
            for(const child of el.childNodes) {
                printTags(child, indent + 4)
            }
        }
        else {
            console.log(" ".repeat(indent) +  "'" + el.nodeValue + "'");
        }
    }
}

function addNewButton () {
    const newButton = document.createElement("button")
    newButton.appendChild(document.createTextNode("button"))
    const t = document.getElementById("t")
    document.body.insertBefore(newButton, t)
}
function addNewText () {
     const newNode = document.createTextNode("This text was added dynamic");
     document.body.appendChild(newNode)
}