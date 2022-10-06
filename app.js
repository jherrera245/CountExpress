// importando modulos
const express = require('express');
const path = require('path');
const fs = require('fs');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('Welcome');
});

app.get('/get-partidas', (req, res) => {
    const file = fs.readFileSync('./partidas.json', 'utf8');
    //console.log(file);
    res.setHeader('Content-Type', 'text/json');
    res.send(file);
});

app.get('/get-cuentas', (req, res) => {
    const file = fs.readFileSync('./cuentas.json', 'utf8');
    //console.log(file);
    res.setHeader('Content-Type', 'text/json');
    res.send(file);
});

app.get('/add-partida', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    let file = fs.readFileSync('./partidas.json', 'utf8'); //abrir el archivo
    const json = JSON.parse(file); //Convertir en arreglo
    json.libro.push(
        {
            "fecha": "",
            "folio": "",
            "cuentas": [{ "idCuenta": 1, "parcial": 0, "debe": 0, "haber": 0 }],
            "concepto": ""
        }
    );
    file = fs.writeFileSync('./partidas.json', JSON.stringify(json));
    res.send("Partida Agregada Correctamente");
});

app.get('/add-cuenta', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    let file = fs.readFileSync('./partidas.json', 'utf8'); //abrir el archivo
    const json = JSON.parse(file); //Convertir en arreglo
    json.libro[json.libro.length - 1].cuentas.push(
        { "idCuenta": 1, "parcial": 0, "debe": 0, "haber": 0 }
    );
    file = fs.writeFileSync('./partidas.json', JSON.stringify(json));
    res.send("Cuenta Agregada Correctamente");
});


app.get('/del-partida', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    let file = fs.readFileSync('./partidas.json', 'utf8'); //abrir el archivo
    const json = JSON.parse(file); //Convertir en arreglo

    if (json.libro.length > 0) {
        json.libro.pop();
        file = fs.writeFileSync('./partidas.json', JSON.stringify(json));
        res.send("La partida se removio correctamente");
    } else {
        res.send("Actualmente no hay ninguna partida");
    }
});

app.post('/save-partida', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    let id = req.body.id;
    let fecha = req.body.fecha;
    let idCuenta = parseInt(req.body.idCuenta);
    let folio = req.body.folio;
    let parcial = parseFloat(req.body.parcial);
    let debe = parseFloat(req.body.debe);;
    let haber = parseFloat(req.body.haber);
    let concepto = req.body.concepto;

    let file = fs.readFileSync('./partidas.json', 'utf8'); //abrir el archivo
    const json = JSON.parse(file); //Convertir en arreglo

    anterior = json.libro[id].cuentas;

    if (anterior.length >= 1) {
        anterior[anterior.length - 1] = { "idCuenta": idCuenta, "parcial": parcial, "debe": debe, "haber": haber }
    }

    json.libro[id] = { "fecha": fecha, "folio": folio, "cuentas": anterior, "concepto": concepto };

    file = fs.writeFileSync('./partidas.json', JSON.stringify(json));
    res.send("Datos Guardados Correctamente");
});

app.listen(3000, () => {
    console.log('Servidor se ha iniciado')
});