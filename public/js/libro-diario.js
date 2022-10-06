const btnNuevaPartida = document.querySelector("#btnNuevaPartida");
const btnNuevaCuenta = document.querySelector("#btnNuevaCuenta");
const btnGuadarPartida = document.querySelector("#btnGuadarPartida");
const btnRemoverPartida = document.querySelector("#btnRemoverPartida");

var countIDCuenta = 0;
var countIDPartida = 0;
var totalDebe = 0;
var totalHaber = 0;

// este boton agrega una partida
btnNuevaPartida.addEventListener("click", (e) => {
    fetch("/add-partida", { method: "GET" }).then(
        res => {
            refrescarPantalla();
            return res.text();
        }
    ).then(
        data => {
            alert(data);
        }
    );
});

// este boton remueve una partida
btnRemoverPartida.addEventListener("click", (e) => {
    fetch("/del-partida", { method: "GET"}).then(
        res => {
            refrescarPantalla();
            return res.text();
        }
    ).then(
        data => {
            alert(data);
        }
    );
});

// este boton agrega una nueva cuenta
btnNuevaCuenta.addEventListener("click", (e) => {
    fetch("/add-cuenta", { method:"GET"}).then(
        res => {
            refrescarPantalla();
            return res.text();
        }
    ).then(
        data => {
            alert(data);
        }
    )
});

// este boton guarda los datos de la cuenta actual
btnGuadarPartida.addEventListener("click", (e) => {
    fetch(
        "/save-partida",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getDataForm())
        }
    ).then(
        res => {
            refrescarPantalla();
            return res.text()
        }
    ).then(
        data => { alert(data) }
    );
});

// obtiene la informacion de los valores del input acutal
function getDataForm() {
    let fecha = document.querySelector(`#fecha-${countIDPartida}`).value;
    let idCuenta = document.querySelector(`#cuenta-${countIDCuenta}`).value;
    let folio = document.querySelector(`#folio-${countIDPartida}`).value;
    let parcial = document.querySelector(`#parcial-${countIDCuenta}`).value;
    let debe = document.querySelector(`#debe-${countIDCuenta}`).value;
    let haber = document.querySelector(`#haber-${countIDCuenta}`).value;
    let concepto = document.querySelector(`#concepto-${countIDPartida}`).value;

    return {
        "id": countIDPartida - 1,
        "fecha": fecha,
        "folio": folio,
        "idCuenta": idCuenta,
        "parcial": parcial,
        "debe": debe,
        "haber": haber,
        "concepto": concepto
    }
}

// lee las cuentas y las muestra en un select
function getCuentas(locationId, selectedId) {
    let html = "";
    fetch('/get-cuentas', { method: 'GET' }).then(
        res => { return res.json() }
    ).then(
        data => {
            const opciones = document.querySelector(`#location-cuenta-${locationId}`);
            let html = "";
            html += `<select class="form-control catalago-cuentas js-states mt-1" id="cuenta-${locationId}">`;
            data.catalogo.forEach(element => {
                if (selectedId == element.id) {
                    html += `<option value="${element.id}" selected>${element.nombre}</option>`;
                } else {
                    html += `<option value="${element.id}">${element.nombre}</option>`;
                }
            });
            html += `</select>`;
            opciones.innerHTML = html;
        }
    );
}

// lee las partidas y las muestra en la pantalla
function loadPartidas() {
    fetch('/get-partidas', { method: 'GET' }).then(
        res => { return res.json() }
    ).then(
        data => {
            const filas = document.querySelector('#filasLibroDiario');
            let html = "";
            data.libro.forEach(element => {
                countIDPartida++;
                html += `
                <tr>
                    <td class="col-1">
                        <input class="form-control" id="fecha-${countIDPartida}" type="date" value="${element.fecha}" />
                    </td>
                    <td class="text-center" colspan="5">
                        Partida n&deg; ${countIDPartida}
                    </td>
                </tr>
                `;
                html += nuevaPartida(element.cuentas);
                html += `
                <tr>
                    <td colspan="6"><input type="text" placeholder="Ingrese el concepto" id="concepto-${countIDPartida}" class="form-control" value="${element.concepto}"></td>
                </tr>
                `;
            });
            html += totalesLibroDiario();
            filas.innerHTML = html;
        }
    );
}

// agrega una nueva fila para el registro de un nueva partida
function nuevaPartida(cuentas) {
    let data = "";
    cuentas.forEach(cuenta => {
        countIDCuenta++;
        data += `
        <tr>
            <td></td>
            <td class="col-3" id="location-cuenta-${countIDCuenta}"></td>
            <td class="col-1"><input id="folio-${countIDCuenta}" class="form-control mt-1" type="text"></td>
            <td class="col-1"><input id="parcial-${countIDCuenta}" min="0" step="0.01" class="form-control mt-1" type="number" value="${cuenta.parcial.toFixed(2)}"></td>
            <td class="col-1"><input id="debe-${countIDCuenta}" min="0" step="0.01" class="form-control mt-1" type="number" value="${cuenta.debe.toFixed(2)}"></td>
            <td class="col-1"><input id="haber-${countIDCuenta}" min="0" step="0.01" class="form-control mt-1" type="number" value="${cuenta.haber.toFixed(2)}"></td>
        </tr>
        `;
        getCuentas(countIDCuenta, cuenta.idCuenta);
        totalDebe+=cuenta.debe;
        totalHaber+=cuenta.haber;
    });
    return data;
}

// muestra el total final del libro diario
function totalesLibroDiario() {
    let html = `
    <tr>
        <td colspan="4"></td>
        <td><input type="text" class="form-control" disabled step="0.01" value="${totalDebe.toFixed(2)}"></td>
        <td><input type="text" class="form-control" disabled step="0.01" value="${totalHaber.toFixed(2)}"></td>
    </tr>
    `;
    return html;
}

// refresca la pantalla para actualizar el contenido de esta
function refrescarPantalla() {
    countIDCuenta = 0;
    countIDPartida = 0;
    totalDebe  = 0;
    totalHaber = 0;
    loadPartidas();
}

// carga la informacion predeterminada en la ventana
loadPartidas();