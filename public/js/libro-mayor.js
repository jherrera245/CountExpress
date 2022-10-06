function getLibroMayor() {
    fetch('/get-cuentas', { method: 'GET' }).then(
        res => { return res.json() }
    ).then(
        data => {
            const libroMayor = document.querySelector("#libroMayor");
            let html = "";
            data.catalogo.forEach(cuenta => {
                if (cuenta.tipo == "mayor") {
                    html += `
                    <div class="col-4">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th class="text-center" colspan="2">${cuenta.nombre}</th>
                                </tr>
                            </thead>
                            <tbody id="filasLibroMayor-${cuenta.id}">
                            </tbody>
                        </table>
                    </div>`;
                    getPartidas(cuenta.id);
                }
            });
            libroMayor.innerHTML = html;
        }
    );
}


// lee las partidas y las muestra en la pantalla
function getPartidas(cuentaId) {
    fetch('/get-partidas', { method: 'GET' }).then(
        res => { return res.json() }
    ).then(
        data => {
            const filas = document.querySelector(`#filasLibroMayor-${cuentaId}`);
            let html = "";
            let totalDebe = 0;
            let totalHaber = 0;
            data.libro.forEach(partida => {
                partida.cuentas.forEach(cuenta => {
                    if (cuenta.idCuenta == cuentaId) {
                        if (cuenta.debe != 0) {
                            html += `
                            <tr>
                                <td><input type="text" class="form-control" value="${cuenta.debe.toFixed(2)}" disabled="disabled"></td>
                                <td><input type="text" class="form-control" value="0" disabled="disabled"></td>
                            </tr>`;
                            totalDebe+=cuenta.debe;
                        } else if (cuenta.haber != 0) {
                            html += `
                            <tr>
                                <td><input type="text" class="form-control" value="0" disabled="disabled"></td>
                                <td><input type="text" class="form-control" value="${cuenta.haber.toFixed(2)}" disabled="disabled"></td>
                            </tr>`;
                            totalHaber+=cuenta.haber;
                        }
                    }
                });
            });
            html += `
                <tr>
                    <td><input type="text" class="form-control text-success" value="${totalDebe.toFixed(2)}" disabled="disabled"></td>
                    <td><input type="text" class="form-control text-success" value="${totalHaber.toFixed(2)}" disabled="disabled"></td>
                </tr>`;
            let moviento = totalDebe - totalHaber;
            if (moviento > 0) {
                html += `
                <tr>
                    <td><input type="text" class="form-control text-primary" value="${Math.abs(moviento.toFixed(2))}" disabled="disabled"></td>
                    <td></td>
                </tr>`;
            }else {
                html += `
                <tr>
                    <td></td>
                    <td><input type="text" class="form-control text-primary" value="${Math.abs(moviento.toFixed(2))}" disabled="disabled"></td>
                </tr>`;
            }
            filas.innerHTML = html;
        }
    );
}



getLibroMayor();