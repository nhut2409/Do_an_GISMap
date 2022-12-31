var map, geojson, layer_name, layerSwitcher, featureOverlay;
var container, content, closer;
var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");
var center = [107.105, 11.165];
var zoom = 12;
var ndc_click_show;
var ndcShare;

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
  center: center,
  zoom: zoom,
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
    // Tạo layer qhsd
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
  ],
});

map.addLayer(base_maps);
map.addLayer(overlays);
var select_xa =
  "ma_xa IN ( '26191', '26197', '26185', '26182',  '26173','26170', '26188', '26194', '26179')";

var select_qhsd =
  "loaidat IN ('BCS','BHK','CAN','CLN','CQP','DBV','DCH','DCK','DCS','DDL','DDT','DGD','DGT','DKH','DKV','DNG','DNL','DRA','DSH','DSK','DTL','DTS','DTT','DVH','DXH','DYT','LMU','LUK','LUN','MNC','NCS','NHK','NKH','NTD','NTS','ODT','ONT','PNK','RDD','RPH','RSX','SKC','SKK','SKN','SKS','SKT','SKX','SON','TIN','TMD','TON','TSC')";

var select_dientich = "dien_tich < 3602415.27972696";

var select = select_xa + " AND " + select_qhsd + " AND " + select_dientich;

var ndc_search = new ol.layer.Image({
  title: "ndc",
  source: new ol.source.ImageWMS({
    url: "http://localhost:8080/geoserver/QLBDS/wms?",
    params: {
      LAYERS: "QLBDS:ndc",
      cql_filter: select,
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});
overlays.getLayers().push(ndc_search);
var ttn_layer = new ol.layer.Image({
  title: "thongtinnha",
  source: new ol.source.ImageWMS({
    url: "http://localhost:8080/geoserver/QLBDS/wms?",
    params: {
      LAYERS: "QLBDS:thongtinnha",
    },
    ratio: 1,
    serverType: "geoserver",
  }),
});
overlays.getLayers().push(ttn_layer);

// 26191, 26197, 26185, 26203, 26176, 26182, 26200,  26173,26170, 26188, 26194, 26179

var ndcDataCopy = JSON.parse(ndcData);

function moveNdcAnm(index) {
  ndc_click_show = ndcDataCopy[index].geom;
  console.log(ndc_click_show);
  view.animate({
    projection: "EPSG:4326",
    center: ndc_click_show,
    duration: 2000,
  });
}

function submitSearch() {
  xa = document.getElementById("select_xa").value;
  qhsd = document.getElementById("select_qhsd").value;
  dientich = document.getElementById("input_dientich").value;
  sothua = document.getElementById("input_sothua").value;
  soto = document.getElementById("input_soto").value;
  dem = 0;
  $("#detail_div").empty();
  if (sothua != "" && soto != "") {
    var select = "sh_to=" + sothua + " AND " + "sh_thua=" + sothua;
    for (let index = 0; index < ndcDataCopy.length; index++) {
      if (
        ndcDataCopy[index].sh_to == soto &&
        ndcDataCopy[index].sh_thua == sothua
      ) {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  } else if (sothua !== "") {
    var select = "sh_thua=" + sothua;
    for (let index = 0; index < ndcDataCopy.length; index++) {
      if (ndcDataCopy[index].sh_thua == sothua) {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  } else if (soto !== "") {
    var select = "sh_to=" + soto;
    for (let index = 0; index < ndcDataCopy.length; index++) {
      if (ndcDataCopy[index].sh_to == soto) {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  } else if (xa == 0 && qhsd == 0 && dientich == 0) {
    var select = select;

    for (let index = 0; index < ndcDataCopy.length; index++) {
      {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  } else if (xa == 0 && qhsd == 0) {
    var select = "dien_tich>" + dientich;
    for (let index = 0; index < ndcDataCopy.length; index++) {
      if (ndcDataCopy[index].dien_tich > dientich) {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  } else if (xa == 0 && dientich == 0) {
    var select = "loaidat=" + "'" + qhsd + "'";
    for (let index = 0; index < ndcDataCopy.length; index++) {
      if (ndcDataCopy[index].loaidat == qhsd) {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  } else if (qhsd == 0 && dientich == 0) {
    var select = "ma_xa=" + xa;
    for (let index = 0; index < ndcDataCopy.length; index++) {
      if (ndcDataCopy[index].ma_xa == xa) {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  } else if (xa == 0) {
    // xa = select_xa;
    var select =
      select_xa +
      " AND " +
      "loaidat=" +
      "'" +
      qhsd +
      "'" +
      " AND " +
      "dien_tich>" +
      dientich;
    for (let index = 0; index < ndcDataCopy.length; index++) {
      if (
        ndcDataCopy[index].dien_tich > dientich &&
        ndcDataCopy[index].loaidat == qhsd
      ) {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  } else if (qhsd == 0) {
    // qhsd = select_qhsd;
    var select =
      select_qhsd + " AND " + "ma_xa=" + xa + " AND " + "dien_tich>" + dientich;
    for (let index = 0; index < ndcDataCopy.length; index++) {
      if (
        ndcDataCopy[index].ma_xa == xa &&
        ndcDataCopy[index].dien_tich > dientich
      ) {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  } else if (dientich == 0) {
    var select =
      select_dientich +
      " AND " +
      "ma_xa=" +
      xa +
      " AND " +
      "loaidat=" +
      "'" +
      qhsd +
      "'";
    for (let index = 0; index < ndcDataCopy.length; index++) {
      if (
        ndcDataCopy[index].ma_xa == xa &&
        ndcDataCopy[index].loaidat == qhsd
      ) {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  } else {
    xa = "ma_xa=" + xa;
    qhsd = "loaidat=" + "'" + qhsd + "'";
    var select = xa + " AND " + qhsd + " AND " + "dien_tich>" + dientich;
    for (let index = 0; index < ndcDataCopy.length; index++) {
      console.log(
        ndcDataCopy[index].dien_tich,
        dientich,
        ndcDataCopy[index].dien_tich > dientich,
        type(dientich),
        type(ndcDataCopy[index].dien_tich)
      );

      if (
        ndcDataCopy[index].ma_xa == xa &&
        ndcDataCopy[index].loaidat == qhsd &&
        parseInt(ndcDataCopy[index].dien_tich) > dientich
      ) {
        $("<ul ></ul>")
          .html(
            "<li onclick='moveNdcAnm(this.id)'  id=" +
              index +
              " style='width: 6%' >" +
              index +
              "</li><li style='width: 7%'>" +
              ndcDataCopy[index].sh_to +
              "</li><li  style='width: 9%'>" +
              ndcDataCopy[index].sh_thua +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ten_chusd +
              "</li><li  style='width: 18%'>" +
              ndcDataCopy[index].dien_tich +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].ma_xa +
              "</li><li  style='width: 20%'>" +
              ndcDataCopy[index].loaidat +
              "</li>"
          )
          .appendTo("#detail_div");
      }
    }
  }
  console.log(select);
  ndc_search.values_.source.params_.cql_filter = select;

  ndc_search.getSource().refresh();
}

function showsearchInfore() {
  var element = document.getElementById("table_search_info");
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}

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

// Tạo layerSwitcher để lua chon an hay hien layer
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

// Tao nut dieu khien an hien thong tin
var infoElement = document.getElementById("infoElement");
var infoButton = document.getElementById("infoButton");
var infoControl = new ol.control.Control({
  element: infoElement,
});
var infoFlag = false;
infoButton.addEventListener("click", () => {
  infoButton.classList.toggle("clicked");
  infoFlag = !infoFlag;
});
map.addControl(infoControl);
// Tao bang xuat thong tin bang tai noi click
function getinfo(evt) {
  if (infoFlag) {
    var coordinate = evt.coordinate;
    var viewResolution = /** @type {number} */ (view.getResolution());

    $("#popup-content").empty();
    document.getElementById("info").innerHTML = "";
    var no_layers = overlays.getLayers().get("length");
    var url = new Array();
    var wmsSource = new Array();
    var layer_title = new Array();
    var i;
    for (i = 0; i < no_layers; i++) {
      var visibility = overlays.getLayers().item(i).getVisible();
      // neu layer ton tai

      if (visibility == true) {
        // lay title
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
}

map.on("singleclick", function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    if (layer == ttn_layer) {
      return feature;
    }
  });
  console.log(evt.pixel);

  if (feature) {
    console.log(feature);
  }
});

map.on("singleclick", getinfo);
map.on("singleclick", function (evt) {
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));
  content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";
  overlay.setPosition(coordinate);
});

// tao thanh cong cu tinh do dai
var lengthElement = document.getElementById("lengthElement");
var lengthButton = document.getElementById("lengthButton");
var lengthControl = new ol.control.Control({
  element: lengthElement,
});
var lengthFlag = false;
lengthButton.addEventListener("click", () => {
  lengthButton.classList.toggle("clicked");
  lengthFlag = !lengthFlag;
  document.getElementById("map").style.cursor = "default";
  if (lengthFlag) {
    map.removeInteraction(draw);
    addInteraction("LineString");
  } else {
    map.removeInteraction(draw);
    source.clear();
    const elements = document.getElementsByClassName(
      "ol-tooltip ol-tooltip-static"
    );
    while (elements.length > 0) elements[0].remove();
  }
});

map.addControl(lengthControl);

// tao thanh cong cu tinh dien tich
var areaElement = document.getElementById("areaElement");
var areaButton = document.getElementById("areaButton");
var areaControl = new ol.control.Control({
  element: areaElement,
});
var areaFlag = false;
areaButton.addEventListener("click", () => {
  areaButton.classList.toggle("clicked");
  areaFlag = !areaFlag;
  document.getElementById("map").style.cursor = "default";
  if (areaFlag) {
    map.removeInteraction(draw);
    addInteraction("Polygon");
  } else {
    map.removeInteraction(draw);
    source.clear();
    const elements = document.getElementsByClassName(
      "ol-tooltip ol-tooltip-static"
    );
    while (elements.length > 0) elements[0].remove();
  }
});
/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = "Click to continue polygon, Double click to complete";

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = "Click to continue line, Double click to complete";
var draw;
var source = new ol.source.Vector();
// Them cac layer sau khi ve vao map de tin dien tich
var vector = new ol.layer.Vector({
  // chon kieu source = Vector
  source: source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      // mau cua hinh sau khi ke
      color: "rgb(240, 110, 170, 0.2)",
    }),
    stroke: new ol.style.Stroke({
      // mau cua duong vien hinh sau khi ke
      color: "rgb(240, 110, 170, 0.9)",
      width: 2,
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: "rgb(240, 110, 170)",
      }),
    }),
  }),
});

map.addLayer(vector);

// then một tuong tac ve
function addInteraction(intType) {
  draw = new ol.interaction.Draw({
    source: source,
    type: intType,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        // mau cua hinh trong khi ke
        color: "rgb(240, 110, 170, 0.2)",
      }),
      stroke: new ol.style.Stroke({
        // mau cua duong vien (net duc doan)
        color: "rgb(240, 110, 170, 0.9)",
        lineDash: [10, 10],
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 5,
        // Mau vien cua hinh tron nho
        stroke: new ol.style.Stroke({
          color: "rgb(240, 110, 170, 0.9)",
        }),
        // mau cua hinh tron nho
        fill: new ol.style.Fill({
          color: "rgb(240, 110, 170, 0.3)",
        }),
      }),
    }),
  });
  map.addInteraction(draw);

  createMeasureTooltip();
  createHelpTooltip();

  /**
   * Currently drawn feature.
   * @type {import("../src/ol/Feature.js").default}
   */
  var sketch;
  /**
   * Handle pointer move.
   * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
   */

  var pointerMoveHandler = function (evt) {
    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    var helpMsg = "Click to start drawing";

    if (sketch) {
      var geom = sketch.getGeometry();
    }
  };

  map.on("pointermove", pointerMoveHandler);

  // var listener;
  draw.on("drawstart", function (evt) {
    // set sketch
    sketch = evt.feature;

    /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
    var tooltipCoord = evt.coordinate;
    sketch.getGeometry().on("change", function (evt) {
      var geom = evt.target;
      var output;
      if (geom instanceof ol.geom.Polygon) {
        output = formatArea(geom);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof ol.geom.LineString) {
        output = formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
      }
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(tooltipCoord);
    });
  });

  draw.on("drawend", function () {
    measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
    measureTooltip.setOffset([0, -7]);
    // unset sketch
    sketch = null;
    // unset tooltip so that a new one can be created
    measureTooltipElement = null;
    createMeasureTooltip();
    //ol.Observable.unByKey(listener);
  });
}

/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
var helpTooltipElement;

/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
var helpTooltip;

/**
 * Creates a new help tooltip
 */

function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement("div");
  helpTooltipElement.className = "ol-tooltip hidden";
  helpTooltip = new ol.Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: "center-left",
  });
  map.addOverlay(helpTooltip);
}

// map.getViewport().addEventListener('mouseout', function () {
//     helpTooltipElement.classList.add('hidden');
// });

/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
var measureTooltipElement;

/**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
var measureTooltip;

/**
 * Creates a new measure tooltip
 */

function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: "bottom-center",
  });
  map.addOverlay(measureTooltip);
}
/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {
  var length = ol.sphere.getLength(line);
  var output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
};

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
var formatArea = function (polygon) {
  var area = ol.sphere.getArea(polygon);
  var output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
  return output;
};

// Bo Loc va thanh tim kiem
map.addControl(areaControl);
//ham1: doc cac layer trong ban do
// $(document).ready(function () {
//   $.ajax({
//     type: "GET",
//     url: "http://localhost:8080/geoserver/QLBDS/wfs?request=getCapabilities",
//     dataType: "xml",
//     success: function (xml) {
//       var select = $("#selectLayer");
//       $(xml)
//         .find("FeatureType")
//         .each(function () {
//           $(this)
//             .find("Name")
//             .each(function () {
//               var value = $(this).text();
//               select.append(
//                 "<option class='ddindent' value='" +
//                   value +
//                   "'>" +
//                   value +
//                   "</option>"
//               );
//             });
//         });
//     },
//   });
// });
// // ham 2
