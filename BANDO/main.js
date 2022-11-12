var map, geojson, layer_name, layerSwitcher, featureOverlay;
var container, content, closer;

var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");

var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});


// dong bang
closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};


// Tao viewmap
$(document).ready(function() {
    $("p").click(function() {
        $(this).hide();
    });
});
var view = new ol.View({
    projection: "EPSG:4326",
    center: [106.95, 11.03],
    zoom: 12,
});

var view_ov = new ol.View({
    projection: "EPSG:4326",
    center: [104.26, 11.04089],
    zoom: 20,
});

// tao mot map
var map = new ol.Map({
    target: "map",
    view: view,
    overlays: [overlay],
    control: [],
});

// Tao overlays Group chứa OSM và không chứa OSM
var base_maps = new ol.layer.Group({
    title: "Base maps",
    layers: [
        new ol.layer.Tile({
            title: "Open Stret Map",
            type: "base",
            visible: true,
            source: new ol.source.OSM(),
        }),
        // new ol.layer.Tile({
        //     title: "Open Stret Map",
        //     type: "base",
        //     visible: true,
        //     source: new ol.source.OSM(),
        // }),
        new ol.layer.Tile({
            title: "None",
            type: "base",
            visible: false,
            // source: new ol.source.OSM()
        }),
    ],
    fold: true,
});

var OSM = new ol.layer.Tile({
    source: new ol.source.OSM(),
    type: "base",
    title: "OSM",
});

// Tạo overlays Group chứa các layer
var overlays = new ol.layer.Group({
    title: "Overlays",
    fold: true,
    // Tạo layer qhsdd
    layers: [
        // Tạo layer htsdd
        new ol.layer.Image({
            title: "htsd",
            source: new ol.source.ImageWMS({
                url: "http://localhost:8080/geoserver/QLBDS/wms?",
                params: {
                    LAYERS: "QLBDS:htsd",
                },
                ratio: 1,
                serverType: "geoserver",
            }),
        }),

        // Tạo layer ndc
        new ol.layer.Image({
            title: "qhsd",
            source: new ol.source.ImageWMS({

                url: "http://localhost:8080/geoserver/QLBDS/wms?",
                params: {
                    LAYERS: "QLBDS:qhsd",
                },
                ratio: 1,
                serverType: "geoserver",
            }),
        }),
        new ol.layer.Image({
            title: "ndc",
            source: new ol.source.ImageWMS({
                url: "http://localhost:8080/geoserver/QLBDS/wms?",
                params: {
                    LAYERS: "QLBDS:ndc",
                },
                ratio: 1,
                serverType: "geoserver",
            }),
        }),
    ],
});


// add layergroup base_maps vào map
map.addLayer(base_maps);
// add layergroup overlays vào map
map.addLayer(overlays);

// Hiển thị vị trí tọa độ của trỏ chuột
var mouse_position = new ol.control.MousePosition({
    projection: "EPSG:4326",
    coordinateFormat: function(coordinate) {
        return ol.coordinate.format(coordinate, "{x},{y}", 6);
    },
    // coordinateFormat: createStringXY(4),
});
map.addControl(mouse_position);

// Tạo một overview để coi tổng quát map
var overview = new ol.control.OverviewMap({
    view: view_ov,
    collapseLabel: "O",
    label: "O",
    layers: [OSM],
});
map.addControl(overview);

// Tạo thanh trượt(slide) zoom
var slider = new ol.control.ZoomSlider();
map.addControl(slider);
var zoom_ex = new ol.control.ZoomToExtent({
    extent: [65.9, 7.48, 98.96, 40.3],
});
map.addControl(zoom_ex);

// Phóng to map toàn màn hình
var full_sc = new ol.control.FullScreen({
    label: "F",
});
map.addControl(full_sc);


// Tạo layerSwitcher để tắt mở layer
var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: "click",
    // startActive: true, // mặc định là mở hay tắt
    tipLabel: "Layers", // Optional label for button
    groupSelectStyle: "group", // Can be 'none' [default], 'group' or 'none'
    collapseTipLabel: "Collapse layers",
});
map.addControl(layerSwitcher);

// Tạo hàm để hiển thị chú thích
function legend() {
    $("#legend").empty();
    var no_layers = overlays.getLayers().get("length");
    var head = document.createElement("h4");
    var txt = document.createTextNode("Chú thích");
    head.appendChild(txt);
    var element = document.getElementById("legend");
    element.appendChild(head);
    var ar = [];
    var i;
    ar.push(
        "http://localhost:8080/geoserver/QLBDS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=QLBDS:qhsd"
    );
    ar.push(
        "http://localhost:8080/geoserver/QLBDS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=QLBDS:htsd"
    );
    ar.push(
        "http://localhost:8080/geoserver/QLBDS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=QLBDS:ndc"
    );

    for (i = 0; i < no_layers; i++) {
        // Tạo một thẻ  <p>
        var head = document.createElement("p");
        // thêm title từng layer đã được đặt ở lớp trên vô thẻ <p>
        var txt = document.createTextNode(
            overlays.getLayers().item(i).get("title")
        );
        head.appendChild(txt);
        // Thêm head vào giao diện
        var element = document.getElementById("legend");
        element.appendChild(head);
        // Tạo hình ảnh chú thích
        var img = new Image();
        img.src = ar[i];
        // Thêm hìn ảnh chú thích vào thư viện
        var src = document.getElementById("legend");
        src.appendChild(img);
    }
}
legend();

// reload de tro ve man hinh index chinh
var homeButton = document.createElement('button');
homeButton.innerHTML = '<img src="../img/home-icon.jpg" alt="home-icon" style="width: 25;height: 25px;margin-left: -6px; margin-top: -6px;  border-color:  rgba(112, 172, 250, 0.575);">';
homeButton.className = "myButton";
var homeElement = document.createElement("div");
homeElement.className = "homButtonDiv";
homeElement.appendChild(homeButton);
var homControl = new ol.control.Control({
    element: homeElement,
});
homeButton.addEventListener("click", () => {
    location.href = "index.html";
});

map.addControl(homControl);

// Tao bang xuat thong tin bang tai noi click


function getinfo(evt) {
    var coordinate = evt.coordinate;
    var viewResolution = /** @type {number} */ (view.getResolution());

    //alert(coordinate1);
    $("#popup-content").empty();

    document.getElementById("info").innerHTML = "";
    var no_layers = overlays.getLayers().get("length");
    // alert(no_layers);
    var url = new Array();
    var wmsSource = new Array();
    var layer_title = new Array();

    var i;
    for (i = 0; i < no_layers; i++) {
        //alert(overlays.getLayers().item(i).getVisible());
        var visibility = overlays.getLayers().item(i).getVisible();
        //alert(visibility);
        if (visibility == true) {
            //alert(i);
            layer_title[i] = overlays.getLayers().item(i).get("title");
            //alert(layer_title[i]);
            wmsSource[i] = new ol.source.ImageWMS({
                url: "http://localhost:8080/geoserver/QLBDS/wms",
                params: {
                    LAYERS: layer_title[i]
                },
                serverType: "geoserver",
                crossOrigin: "anonymous",
            });
            //alert(wmsSource[i]);
            //var coordinate2 = evt.coordinate;
            // alert(coordinate);
            url[i] = wmsSource[i].getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                "EPSG:4326", {
                    INFO_FORMAT: "text/html"
                }
            );
            //  alert(url[i]);

            //assuming you use jquery
            $.get(url[i], function(data) {
                //alert(i);
                //append the returned html data

                // $("#info").html(data);
                //document.getElementById('info').innerHTML = data;
                //document.getElementById('popup-content').innerHTML = '<p>Feature Info</p><code>' + data + '</code>';

                //alert(dat[i]);
                $("#popup-content").append(data);
                //document.getElementById('popup-content').innerHTML = '<p>Feature Info</p><code>' + data + '</code>';

                overlay.setPosition(coordinate);

                layerSwitcher.renderPanel();
            });
            //alert(layer_title[i]);
            //alert(fid1[0]);
        }
    }
}


// function getinfo(evt) {
//     var coordinate = evt.coordinate;
//     var viewResolution = /** @type {number} */ (view.getResolution());
//     $("#popup-content").empty();

//     document.getElementById("info").innerHTML = "";
//     var no_layers = overlays.getLayers().get("length");
//     var url = new Array();
//     var wmsSource = new Array();
//     var layer_title = new Array();

//     var i;
//     // ney layer do ton tai se hien thong tin chi tiet cua layer do
//     for (i = 0; i < no_layers; i++) {
//         var visibility = overlays.getLayers().item(i).getVisible();
//         if (visibility == true) {

//             layer_title[i] = overlays.getLayers().item(i).get("title");
//             wmsSource[i] = new ol.source.ImageWMS({
//                 url: "http://localhost:8080/geoserver/QLBDS/wms",
//                 params: {
//                     LAYERS: layer_title[i]
//                 },
//                 serverType: "geoserver",
//                 crossOrigin: "anonymous",
//             });

//             url[i] = wmsSource[i].getFeatureInfoUrl(
//                 evt.coordinate,
//                 viewResolution,
//                 "EPSG:4326", {
//                     INFO_FORMAT: "text/html"
//                 }
//             );
//             $.get(url[i], function(data) {

//                 $("#popup-content").append(data);
//                 overlay.setPosition(coordinate);
//                 layerSwitcher.renderPanel();
//             });
//         }
//     }
// }


map.on('singleclick', getinfo);
// map.un('singleclick', getinfo);


// getinfotype.onchange = function() {
//     map.removeInteraction(draw);
//     if (vectorLayer) {
//         vectorLayer.getSource().clear();
//     }
//     map.removeOverlay(helpTooltip);
//     if (measureTooltipElement) {
//         var elem = document.getElementsByClassName("tooltip tooltip-static");

//         for (var i = elem.length - 1; i >= 0; i--) {
//             elem[i].remove();
//             //alert(elem[i].innerHTML);
//         }
//     }

//     if (getinfotype.value == "activate_getinfo") {
//         map.on("singleclick", getinfo);
//     } else if (
//         getinfotype.value == "select" ||
//         getinfotype.value == "deactivate_getinfo"
//     ) {
//         map.un("singleclick", getinfo);
//         overlay.setPosition(undefined);
//         closer.blur();
//     }
// };