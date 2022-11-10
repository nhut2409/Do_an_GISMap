var map, geojson, layer_name, layerSwitcher, featureOverlay;
var container, content, closer;

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
        new ol.layer.Image({
            title: "Quy hoạch sử dụng đất",
            source: new ol.source.ImageWMS({
                url: "http://localhost:8080/geoserver/QLBDS/wms?",
                params: {
                    LAYERS: "QLBDS:htsd",
                },
                ratio: 1,
                serverType: "geoserver",
            }),
        }),
        // Tạo layer htsdd
        new ol.layer.Image({
            title: "Hiện trạng sử dụng đất",
            source: new ol.source.ImageWMS({
                url: "http://localhost:8080/geoserver/QLBDS/wms?",
                params: {
                    LAYERS: "QLBDS:ndc",
                },
                ratio: 1,
                serverType: "geoserver",
            }),
        }),
        // Tạo layer ndc
        new ol.layer.Image({
            title: "Nền địa chính",
            source: new ol.source.ImageWMS({
                url: "http://localhost:8080/geoserver/QLBDS/wms?",
                params: {
                    LAYERS: "QLBDS:qhsd",
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



var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");

// Tao overlay chua banng show thong tin thua dat
var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});

map.addOverlay(popup);

closer.onclick = function() {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};


// the hien chi tiet tua dat
map.on("singleclick", function(evt) {
    content.innerHTML = "";
    var resolution = view.getResolution();
    var url = IndiaDsTile.getSource().getFeatureInFoUrl(
        evt.coordinate,
        resolution,
        "EPSG:5899", {
            'INFO_FORMAT': "text/html",
            'propertyName': "sh_to, sh_thua",
        }
    );
    if (url) {
        $.getJSON(url, function(data) {
            var featute = data.featutes[0];
            var props = featute.properties;

            content.innerHTML =
                "<h3> State: </h3><p>" +
                props.sh_to.toUpperCase() +
                "</p><h3> State: </h3><p>" +
                props.sh_thua.toUpperCase() +
                "</p>";
            popup.setPosition(evt.coordinate);
        });
    } else {
        popup.setPosition(undefined);
    }
    alert("haah");
});


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