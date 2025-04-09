require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/Graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/widgets/BasemapToggle"
], (WebMap, MapView, LayerList, Search, Graphic, SimpleMarkerSymbol, BasemapToggle) => {

    const mapaWeb = new WebMap({
        portalItem: {
            id: '1248906447844c058a54a3a2f2dfd117'
        }
    });

    const vistaMapa = new MapView({
        container: "viewDiv",
        map: mapaWeb,
        center: [-3.7, 40.47],
        zoom: 10,
        popup: {
            dockEnabled: true, 
            dockOptions: {
                breakpoint: false,
                position: 'top-right',
                buttonEnabled: false
            }
        }
    });

    const widgetCapas = new LayerList({
        view: vistaMapa
    });

    vistaMapa.ui.add(widgetCapas, {
        position: "bottom-right"
    });

    const widgetSearch = new Search({
        view: vistaMapa
    });

    vistaMapa.ui.add(widgetSearch, {
        position: "top-right"
    });

    const widgetMapaBase = new BasemapToggle({
        view: vistaMapa,
        basemap: 'streets',
        nextBasemap: 'topo-vector',
    })

    vistaMapa.ui.add(widgetMapaBase, {
        position: "top-right"
    })

    let capaBus, capaMetro, capaCercanias;

    mapaWeb.when(() => {
        mapaWeb.layers.forEach((layer, index) => {
            console.log(`Capa ${index}:`, layer.title);
        });

        capaBus = mapaWeb.layers.getItemAt(6);
        capaMetro = mapaWeb.layers.getItemAt(7);
        capaCercanias = mapaWeb.layers.getItemAt(8);

        console.log("Capa de Bus:", capaBus);
        console.log("Capa de Metro:", capaMetro);
        console.log("Capa de Cercanías:", capaCercanias);
    });

    function crearPunto(color, tamaño, punto) {
        const simbolo = new SimpleMarkerSymbol({
            color: 'none',
            size: 5,
            outline: {
                color: [0, 0, 0],
                width: 2
            }
        });

        const graphic = new Graphic({
            geometry: punto,
            symbol: simbolo
        });

        vistaMapa.graphics.add(graphic);
    }

    function crearPuntoCruz(color, tamaño, punto) {
        const simbolo = new SimpleMarkerSymbol({
            style: "cross",
            color: 'none',
            size: 5,
            outline: {
                color: [0, 0, 0],
                width: 2
            }
        });

        const graphic = new Graphic({
            geometry: punto,
            symbol: simbolo,
        });

        vistaMapa.graphics.add(graphic);
    }

    function consultarEstacionesCercanas(punto, distancia = 100) {
        const capas = [capaBus, capaMetro, capaCercanias];
        const nombres = ["Autobús", "Metro", "Cercanías"];
        const contadores = [0, 0, 0];
        let resultadosHTML = `
            <h3>Estaciones Cercanas (${distancia}m)</h3>
        `;

        let consultasRealizadas = 0;

        capas.forEach((capa, index) => {
            if (!capa) return;

            const query = capa.createQuery();
            query.geometry = punto;
            query.distance = distancia;
            query.units = "meters";
            query.spatialRelationship = "intersects";
            query.returnGeometry = true;
            query.outFields = ["*"];

            capa.queryFeatures(query)
                .then((resultado) => {
                    contadores[index] = resultado.features.length;

                    resultado.features.forEach((feature) => {
                        feature.symbol = {
                            type: "simple-marker",
                            style: "diamond",
                            color: [200, 150, 255, 0.8],
                            size: 10,
                            outline: {
                                color: [0, 0, 0],
                                width: 1
                            }
                        };
                        vistaMapa.graphics.add(feature);
                    });

                    resultadosHTML += `<p>Estaciones de ${nombres[index]}: ${contadores[index]}</p>`;

                    consultasRealizadas++;
                    if (consultasRealizadas === capas.length) {
                        document.querySelector("#resultado-estaciones").innerHTML = resultadosHTML;
                    }
                })
                .catch((error) => {
                    console.error(`Error al consultar estaciones (${distancia}m):`, error);
                });
        });
    }

    // Evento doble clic: consulta a 100m
    vistaMapa.on("double-click", (event) => {
        event.stopPropagation();
        
        // Limpiar gráficos anteriores
        vistaMapa.graphics.removeAll();

        const punto = event.mapPoint;

        const colorInput = document.getElementById("color");
        const tamanoInput = document.getElementById("tamano");

        const colorSeleccionado = colorInput ? colorInput.value : "#ff0000";
        const tamañoSeleccionado = tamanoInput ? parseInt(tamanoInput.value) : 12;

        crearPunto(colorSeleccionado, tamañoSeleccionado, punto);
        consultarEstacionesCercanas(punto, 100);
    });

    // Evento clic derecho (botón 2 del ratón): consulta a 250m
    vistaMapa.on("pointer-down", (event) => {
        if (event.button === 2) { // Botón derecho
            event.stopPropagation();
            
            // Limpiar gráficos anteriores
            vistaMapa.graphics.removeAll();

            const punto = vistaMapa.toMap({ x: event.x, y: event.y });

            const colorInput = document.getElementById("color");
            const tamanoInput = document.getElementById("tamano");

            const colorSeleccionado = colorInput ? colorInput.value : "#00ffff";
            const tamañoSeleccionado = tamanoInput ? parseInt(tamanoInput.value) : 12;

            crearPuntoCruz(colorSeleccionado, tamañoSeleccionado, punto);
            consultarEstacionesCercanas(punto, 250);
        }
    });

    const tabs = document.querySelectorAll('.tab')
    const containers = document.querySelectorAll('.pestana')

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab')
        
            tabs.forEach(tab => tab.classList.remove('active'))
            tab.classList.add('active');
        
            containers.forEach(container => {
                if (container.id === targetTab) {
                    container.classList.add('active')
                } else {
                    container.classList.remove('active')
                }
            })
        })
    })

    tabs[0].click()
});







