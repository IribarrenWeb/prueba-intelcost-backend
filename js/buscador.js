// <============== Init Variables ==============>

// Inicializacion de la variable global bienes
// en la cual se van a almacenar todos los datos de
// los bienes para luego poder filtralos.
var $bienes = [];

// Inicializacion de la constante URL en la cual se va
// a almacenar de manera estatica la url a donde van a
// ir dirigidas todas las peticiones ajax en el servidor. 
const URL = 'backend/controllers/BienController.php'



// <============== Jquery Triggers ==============>
$(document).ready(function() {

    /**
     * Funcion trigger para ejecutar el metodo 'save' para
     * almacenar los datos del bien seleccionado de la lista de 
     * bienes.
     */
    $('#tabs-1').on('click', '.save', function(e) {

        let id = $(this).data('id')

        let index = $bienes.findIndex(x => x.Id == id);
        let dataBien = $bienes[index];

        save(dataBien);

    });

    /**
     * Funcion trigger para ejecutar el metodo 'delete' para
     * eliminar los datos del bien seleccionado de la base de datos.
     */
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

    /**
     * Funcion trigger que se ejecuta al hacer click en la pestana
     * 'Mis bienes'
     */
    $('a[href="#tabs-2"]').on('click', function() {
        getMySavedData();
    });

    /**
     * Funcion trigger que valida y aplica los filtros
     * seleccionados por el usuario para la lista de bienes.
     */
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

    /**
     * Funcion trigger encargado de validar y enviar por metodo get
     * las variables que van a ser utilizadas para los filtros en caso de
     * que se hallan seleccionado.
     */
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
// Funciones que hacen llamadas ajax para luego ejecutar metodos 
// mas especificos segun se requiera

/**
 * Funcion que se ejecuta al cargar la pagina
 * para obtener los datos de los bienes almacenados en 
 * el archivo 'data-1.json'.
 * 
 */
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


/**
 * Funcion que se ejecuta al cargar la pagina
 * para obtener los datos de los filtros 'ciudad' y 
 * 'tipo'.
 * 
 */
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

/**
 * Funcion utilizada para guardar/almacenar un bien en 
 * la base de datos.
 * 
 * @param {object} dataBien 
 */
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

/**
 * Funcion que obtiene todos los bienes que se encuentran
 * almacenados en la base de datos.
 */
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

/**
 * Funcion utilizada para eliminar un registro de bien 
 * almacenado en la base de datos.
 * 
 * @param {string} id 
 */
async function deleteSaveData(id) {

    await $.post(URL, { option: 'delete', id },
        function(response) {

            let data = JSON.parse(response);

            swal(data.title, data.msg, data.color)
        }
    );

    getMySavedData();

}

/**
 * Funcion que contiene la logica para filtrar los datos
 * del archivo 'data-1.json' segun los filtros aplicados.
 * 
 * @param {string} tipoNombre 
 * @param {string} ciudadNombre 
 */
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

/**
 * Funcion que permite almacenar en la variable 'template' 
 * la plantilla utilizada para cargar los datos de los filtros
 * para luego pintarlos en el html.
 * 
 * @param {object} datas 
 */
function printTemplate(datas) {
    let template = '';

    datas.forEach(data => {
        template +=
            `
            <option value="${ data.nombre + '-' + data.id }">${data.nombre}</option>
            `
    });

    return template;
}


/**
 * Funcion utilizada para pintar el tempate de la card que 
 * va a contener los datos de los bienes.
 * 
 * @param {object} bien 
 * @param {string} option 
 */
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
                        <button class="btn waves-effect waves-light ${option}" data-id="${bien.Id ? bien.Id : bien.id}" type="submit" name="action">
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

/**
 * Funcion que permite resetear los filtos dependiendo de 
 * que formulario sea.
 * 
 * @param {boolean} search 
 */
function resetFilters(search = false) {

    if (search) {
        $('#divReportes .selects').val('')
        return
    }
    $('#formulario .selects').val('');

    getBienes();

    document.querySelector('#removeFilters').classList.add('d-none')

}