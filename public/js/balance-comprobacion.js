var totalMvDeudor = 0;
var totalMvAcreedor = 0;
var totalSalDeudor = 0;
var totalSalAcreedor = 0;

function getBalanceComprobacion() {
    let count = 0;
    fetch('/get-cuentas', { method: 'GET' }).then(
        res => { return res.json() }
    ).then(
        data => {
            const libroMayor = document.querySelector("#filasBalance");
            let html = "";
            data.catalogo.forEach(cuenta => {
                if (cuenta.tipo == "mayor") {
                    count++;
                    html += `
                    <tr>
                        <td>${count}</td>
                        <td>${cuenta.nombre}</td>
                        <td id="mv-deudor-${cuenta.id}"></td>
                        <td id="mv-acreedor-${cuenta.id}"></td>
                        <td id="s-deudor-${cuenta.id}"></td>
                        <td id="s-acreedor-${cuenta.id}"></td>
                    </tr>
                    `;
                    getSaldos(cuenta.id);
                }
            });
            html+=`<tr id="saldos"><tr>`;
            libroMayor.innerHTML = html;
        }
    );
}


// lee las partidas y las muestra en la pantalla
function getSaldos(cuentaId) {
    fetch('/get-partidas', { method: 'GET' }).then(
        res => { return res.json() }
    ).then(
        data => {
            const mvDeudor = document.querySelector(`#mv-deudor-${cuentaId}`);
            const mvAcreedor = document.querySelector(`#mv-acreedor-${cuentaId}`);
            const salDeudor = document.querySelector(`#s-deudor-${cuentaId}`);
            const salAcreedor = document.querySelector(`#s-acreedor-${cuentaId}`);
            const saldos = document.querySelector(`#saldos`);
            
            let totalDebe = 0;
            let totalHaber = 0;
            data.libro.forEach(partida => {
                partida.cuentas.forEach(cuenta => {
                    if (cuenta.idCuenta == cuentaId) {
                        if (cuenta.debe != 0) {
                            totalDebe+=cuenta.debe;
                        } else if (cuenta.haber != 0) {
                            totalHaber+=cuenta.haber;
                        }
                    }
                });
                let moviento = totalDebe - totalHaber;

                mvDeudor.innerHTML = (totalDebe > 0) ? `<input class="form-control input-mv-deudor" type="number" value="${totalDebe.toFixed(2)}" disabled>` : "";
                mvAcreedor.innerHTML = (totalHaber > 0) ? `<input class="form-control input-mv-acreedor" type="number" value="${totalHaber.toFixed(2)}" disabled>` : "";
                salDeudor.innerHTML = (moviento > 0) ? `<input class="form-control input-sal-deudor" type="number" value="${Math.abs(moviento).toFixed(2)}" disabled>` : "";
                salAcreedor.innerHTML = (moviento < 0) ? `<input class="form-control input-sal-acreedor" type="number" value="${Math.abs(moviento).toFixed(2)}" disabled>` : "";
            });
            cacularTotales();
            saldos.innerHTML = setRowTotales();
        }
    );
}

function cacularTotales() {
    let inputMvDeudor = document.getElementsByClassName("input-mv-deudor");
    let inputMvAcreedor = document.getElementsByClassName("input-mv-acreedor");
    let inputSalDeudor = document.getElementsByClassName("input-sal-deudor");
    let inputSalAcreedor = document.getElementsByClassName("input-sal-acreedor");

    totalMvDeudor = getTotalSuma(inputMvDeudor);
    totalMvAcreedor = getTotalSuma(inputMvAcreedor);
    totalSalDeudor = getTotalSuma(inputSalDeudor);
    totalSalAcreedor = getTotalSuma(inputSalAcreedor);
}

function getTotalSuma(lista){
    let saldo = 0;
    for (let i = 0; i < lista.length; i++) {
        saldo += parseFloat(lista[i].value);
    }
    return saldo;
}

function setRowTotales() {
    let html = `
        <td></td>
        <th>Totales</th>
        <td><input type="number" class="form-control text-success" value="${totalMvDeudor.toFixed(2)}" disabled ></td>
        <td><input type="number" class="form-control text-success" value="${totalMvAcreedor.toFixed(2)}" disabled ></td>
        <td><input type="number" class="form-control text-success" value="${totalSalDeudor.toFixed(2)}" disabled ></td>
        <td><input type="number" class="form-control text-success" value="${totalSalAcreedor.toFixed(2)}" disabled ></td>
    `;
    return html;
}

getBalanceComprobacion();