function getBienes() {
    let datos = [];
    let plantilla = ""
    $.getJSON({ url: "data-1.json", crossDomain: false }, function(bienes) {
        bienes.forEach(bien => {
            plantilla += printCard(bien);
        });
    });
    $('#tabs-1').children('#cards').html(plantilla);
}

function printCard(bien) {

    let card =
        `<div class="card blue-grey darken-1">
            <div class="card-content white-text">
                <span class="card-title"><b>Direccion</b>${bien.direccion}</span>
            </div>
            <div class="card-action">
                <a href="#">Guardar</a>
            </div>
        </div>
        `
    return card
}