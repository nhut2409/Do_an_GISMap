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
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

// Tao viewmap
$(document).ready(function () {
  $("p").click(function () {
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
    new ol.layer.Tile({
      title: "None",
      type: "base",
      visible: false,
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
  coordinateFormat: function (coordinate) {
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

// Tao chu thich de giai thich cac ky tu dac biet
function chuthich() {
  // chu thich hien trang su dung dat
  var chuthich_htsd = document.getElementById("chuthich_htsd");
  var img = new Image();
  img.src =
    "http://localhost:8080/geoserver/QLBDS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=QLBDS:qhsd";
  chuthich_htsd.appendChild(img);
  // chu thich quy hoach su dung
  var chuthich_htsd = document.getElementById("chuthich_qhsd");
  var img = new Image();
  img.src =
    "http://localhost:8080/geoserver/QLBDS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=QLBDS:htsd";
  chuthich_qhsd.appendChild(img);
  // chu thich nen dia chinh
  var chuthich_ndc = document.getElementById("chuthich_ndc");
  var img = new Image();
  img.src =
    "http://localhost:8080/geoserver/QLBDS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=QLBDS:ndc";
  chuthich_ndc.appendChild(img);
}
chuthich();

// Tao bang xuat thong tin bang tai noi click
function getinfo(evt) {
  var coordinate = evt.coordinate;
  var viewResolution = /** @type {number} */ (view.getResolution());
  $("#popup-content").empty();

  document.getElementById("info").innerHTML = "";
  var no_layers = overlays.getLayers().get("length");
  var url = new Array();
  var wmsSource = new Array();
  var layer_title = new Array();

  var i;
  // Neu layer do dang hien moi hien thi thong tin
  for (i = 0; i < no_layers; i++) {
    var visibility = overlays.getLayers().item(i).getVisible();
    //alert(visibility);
    if (visibility == true) {
      layer_title[i] = overlays.getLayers().item(i).get("title");
      wmsSource[i] = new ol.source.ImageWMS({
        url: "http://localhost:8080/geoserver/QLBDS/wms",
        params: {
          LAYERS: layer_title[i],
        },
        serverType: "geoserver",
        crossOrigin: "anonymous",
      });
      url[i] = wmsSource[i].getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        "EPSG:4326",
        {
          INFO_FORMAT: "text/html",
        }
      );

      if (url) {
        $.get(url[i], function (data) {
          $("#popup-content").append(data);
          overlay.setPosition(coordinate);
          layerSwitcher.renderPanel();
        });
      } else {
        popup.setPosition(undefined);
      }
    }
  }
}
map.on("singleclick", getinfo);

//Bo Loc va thanh tim kiem
