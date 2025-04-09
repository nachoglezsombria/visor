require(["esri/Map", "esri/views/MapView","esri/layers/ImageryTileLayer"], (Map, MapView, ImageryTileLayer) => {

    // Creación del mapa
    const mapa = new Map({
        basemap: 'streets-navigation-vector'
    })

    // Creación de la vista del mapa
    const vistaMapa = new MapView({
        container: 'viewDiv',
        map: mapa,
        center: [-3.7, 40.40],
        zoom: 11
    })

    // Creación de las capas ImageryTileLayer
    const capas = {
        'NO2': [
            new ImageryTileLayer({ 
                url: 'https://tiledimageservices8.arcgis.com/BtkRLT3YBKaVGV3g/arcgis/rest/services/NO2Idw_F25_12_2018_csv_NO2/ImageServer',
                title: 'NO2: 24/12/2018'
            }),
            new ImageryTileLayer({ 
                url: 'https://tiledimageservices8.arcgis.com/BtkRLT3YBKaVGV3g/arcgis/rest/services/NO2Idw_F25_12_2018_csv_NO2/ImageServer',
                title: 'NO2: 25/12/2018'
            }),
            new ImageryTileLayer({ 
                url: 'https://tiledimageservices8.arcgis.com/BtkRLT3YBKaVGV3g/arcgis/rest/services/NO2Idw_F26_12_2018_csv_NO2/ImageServer',
                title: 'NO2: 26/12/2018'
            })
        ],
        'O3': [
            new ImageryTileLayer({
            })
        ],
        'PM10': [
            new ImageryTileLayer({
            })
        ]
    }

    // Evento para la selección de los botones NO2, O3 y PM10
    const seleccionCategoria = null
    document.getElementById('btnNO2').addEventListener('click', () => {
        seleccionCategoria = 'NO2',
        capaActualizada = (seleccionCategoria)
    })

    document.getElementById('btnO3').addEventListener('click', () => {
        seleccionCategoria = 'O3',
        capaActualizada = (seleccionCategoria)
    })

    document.getElementById('btnPM10').addEventListener('click', () => {
        seleccionCategoria = 'PM10',
        capaActualizada = (seleccionCategoria)
    })

    // Función para actualizar la selección en función de la categoría seleccionada
    function capaActualizada(categoria) {
        const seleccion = document.getElementById('layerSelect')
        const seleccionCapa = document.getElementById('layerSelectDiv')

        // Limpiar las opciones previas
        seleccion.innerHTML = '<option value="">--Seleccionar Capa--</option>'

        // Agregar las capas asociadas a la categoría seleccionada
        const listaCapas = capas [categoria]
        listaCapas.forEach(function(capa, indice) {
            const opcion = document.createElement('option')
            opcion.value = indice
            opcion.text = 'Capa ' + (indice + 1)
            seleccion.appendChild(opcion)
        })

        // Mostrar el selector de capas
        seleccionCapa.style.display = 'block'
    }

    // Evento para agregar la capa seleccionada al mapa
    document.getElementById('agregarCapa').addEventListener('click', () => {
        const seleccion = document.getElementById('layerSelect')
        const seleccionCapa = seleccion.value

        if (seleccionCapa !== '') {
            const capaSeleccionada = capas [capaActualizada] [seleccionCapa]
            mapa.add(capaSeleccionada)
            console.log('Capa añadida al mapa', capaSeleccionada)
        } else{
            alert('Por favor, selecciona una capa')
        }
    })
})