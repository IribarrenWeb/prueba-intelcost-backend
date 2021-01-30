// <============== Init Variables ==============>
var $bienes = [];
var $listBienes = [];
var $mySavedData = [];
var URL = 'backend/controllers/BienController.php'



// <============== Functions Triggers ==============>
$(document).ready(function() {

    $('#tabs-1').on('click', '.save', function(e) {

        let id = $(this).data('id')

        let index = $bienes.findIndex(x => x.Id == id);
        let dataBien = $bienes[index];

        save(dataBien);

    });

    $('#tabs-2').on('click', '.delete', function(e) {

        let id = $(this).data('id')
        swal({
                title: "Estas seguro de eliminar este registro?",
                text: "Una vez eliminado se ira para siempre.",
                icon: "warning",
                buttons: true,
            })
            .then((willDelete) => {
                if (willDelete) {

                    deleteSaveData(id);

                } else {
                    swal("La data se encuentra a salvo");
                }
            })


    });

    $('a[href="#tabs-2"]').on('click', function() {
        getMySavedData();
    });

    $('#formulario').on('submit', function(e) {
        e.preventDefault();

        $('#tabs a[href="#tabs-1"]').click();

        let tipo = $('#formulario .selectTipo').val();
        let ciudad = $('#formulario .selectCiudad').val();

        tipo = tipo.split('-')[0];
        ciudad = ciudad.split('-')[0];


        if (tipo == '' && ciudad == '') {
            swal('No has seleccionado nada', 'No has seleccionado ningun filtro para usar', 'warning')

        } else {

            applyFilters(tipo, ciudad);

        }

    })

    $('#divReportes button[type="submit"]').on('click', function(e) {
        e.preventDefault();

        let ciudad = $('#divReportes #select-form-1').val();
        let tipo = $('#divReportes #select-form-2').val();
        let url = URL + '?option=filterReport';

        tipo = tipo ? tipo.split('-')[1] : null;
        ciudad = ciudad ? ciudad.split('-')[1] : null;

        if (tipo || ciudad) {
            if (tipo && ciudad) {
                url += '&tipo_id=' + tipo + '&ciudad_id=' + ciudad;;
            } else if (tipo) {
                url += '&tipo_id=' + tipo;
            } else {
                url += '&ciudad_id=' + ciudad;
            }
        }
        window.open(url, '_blank');
    })
});


// <============== Ajax functions ==============>

async function getBienes() {
    let template = ""

    await $.getJSON({ url: "data-1.json", crossDomain: false },
        function(bienes) {
            $bienes = bienes
            $listBienes = bienes

            $bienes.forEach(bien => {
                template += printCard(bien);
            });
            $('#cards-r').html(template);

        }).done((e) => {
        return e
    });
}



function getDataFilters() {

    $.ajax({
        type: "POST",
        url: URL,
        data: { option: 'getFilterData' },
        success: function(response) {
            let data = JSON.parse(response);
            let ciudades = data.ciudades;
            let tipos = data.tipos;

            $('.selectCiudad').append(printTemplate(ciudades))
            $('.selectTipo').append(printTemplate(tipos))
        }
    });
}

function save(dataBien) {
    $.ajax({
        type: "POST",
        url: URL,
        data: { data: dataBien, option: 'save' },
        success: function(response) {
            let data = JSON.parse(response);

            swal(data.title, data.msg, data.color)
        }
    });
}

function getMySavedData() {
    let template = '';

    $.ajax({
        type: "POST",
        url: URL,
        data: { option: 'mySavedData' },
        success: function(response) {
            let data = JSON.parse(response);

            data.bienes.forEach(bien => {
                template += printCard(bien, 'delete');
            })
            $('#cards-g').html(template);
        }
    });
}

async function deleteSaveData(id) {

    await $.post(URL, { option: 'delete', id },
        function(response) {

            let data = JSON.parse(response);

            swal(data.title, data.msg, data.color)
        }
    );

    getMySavedData();

}

function applyFilters(tipoNombre, ciudadNombre) {

    let filteredList = [];
    let template = '';

    $bienes.forEach(bien => {

        if (tipoNombre != '' && ciudadNombre != '') {
            if (bien.Tipo == tipoNombre && bien.Ciudad == ciudadNombre) {
                filteredList.push(bien)
                return
            }

        } else if (tipoNombre != '' || ciudadNombre != '') {
            if (bien.Tipo == tipoNombre || bien.Ciudad == ciudadNombre) {
                filteredList.push(bien)
                return
            }
        }
    });

    if (filteredList.length <= 0) {
        swal('No se encontro nada!', 'No se encontro nada con los filtros aplicados', 'error')
    } else {

        filteredList.forEach(bien => {

            template += printCard(bien);

        })

        $('#cards-r').html(template);
        swal('Busqueda realizada', 'Se ha realizado la busqueda solicitada', 'success');

        document.querySelector('#removeFilters').classList.remove('d-none')

    }

}



// <============== Print functions ==============>

function printTemplate(datas, isform = false) {
    let template = '';

    datas.forEach(data => {
        template +=
            `
            <option value="${ data.nombre + '-' + data.id }">${data.nombre}</option>
            `
    });

    return template;
}

function printCard(bien, option = 'save') {

    let card =
        `
        <div class="col s12">
            <div class="card-panel">
                <div class="row">
                    <div class="col s4">
                        <img class="responsive-img" src="img/home.jpg">
                    </div>
                    <div class="col s8">
                        <ul>
                            <li>
                                <b>Direccion:</b> ${bien.Direccion ? bien.Direccion : bien[1]}
                            </li>
                            <li>
                                <b>Ciudad:</b> ${bien.Ciudad ? bien.Ciudad : bien[2]}
                            </li>
                            <li>
                                <b>Codigo Postal:</b> ${bien.Codigo_Postal ? bien.Codigo_Postal : bien[3]}
                            </li>
                            <li>
                                <b>Telefono:</b> ${bien.Telefono ? bien.Telefono : bien[4]}
                            </li>
                            <li>
                                <b>Tipo:</b> ${bien.Tipo ? bien.Tipo : bien[5]}
                            </li>
                            <li>
                                <b>Precio:</b> ${bien.Precio ? bien.Precio : bien[6]}
                            </li>
                        </ul>
                        <button class="btn waves-effect waves-light ${option == 'save' ? 'save' : 'red darken-2'}" data-id="${bien.Id ? bien.Id : bien.id}" type="submit" name="action">
                            ${option == 'save' ? 'Guardar' : 'Eliminar'}
                            <i class="material-icons right">${option == 'save' ? 'add' : 'delete'}</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `
    return card
}

function resetFilters(search = false) {

    if (search) {
        $('#divReportes .selects').val('')
        return
    }
    $('#formulario .selects').val('');

    getBienes();

    document.querySelector('#removeFilters').classList.add('d-none')

}