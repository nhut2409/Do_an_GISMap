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
//ham1: doc cac layer trong ban do
$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/geoserver/QLBDS/wfs?request=getCapabilities",
    dataType: "xml",
    success: function (xml) {
      var select = $("#selectLayer");
      $(xml)
        .find("FeatureType")
        .each(function () {
          $(this)
            .find("Name")
            .each(function () {
              var value = $(this).text();
              select.append(
                "<option class='ddindent' value='" +
                  value +
                  "'>" +
                  value +
                  "</option>"
              );
            });
        });
    },
  });
});
// // ham 2
$(function () {
  //ham2.1: doc cac thuoc tinh trong tung chuc nang
  document.getElementById("selectLayer").onchange = function () {
    var select = document.getElementById("selectAttribute");
    while (select.options.length > 0) {
      select.remove(0);
    }
    var value_layer = $(this).val();
    $(document).ready(function () {
      $.ajax({
        type: "GET",
        url:
          "http://localhost:8080/geoserver/QLBDS/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" +
          value_layer,
        dataType: "xml",
        success: function (xml) {
          var select = $("#selectAttribute");
          //var title = $(xml).find('xsd\\:complexType').attr('name');
          //	alert(title);
          select.append("<option class='ddindent' value=''></option>");
          $(xml)
            .find("xsd\\:sequence")
            .each(function () {
              $(this)
                .find("xsd\\:element")
                .each(function () {
                  var value = $(this).attr("name");
                  //alert(value);
                  var type = $(this).attr("type");
                  //alert(type);
                  if (value != "geom" && value != "the_geom") {
                    select.append(
                      "<option class='ddindent' value='" +
                        type +
                        "'>" +
                        value +
                        "</option>"
                    );
                  }
                });
            });
        },
      });
    });
  };
  document.getElementById("selectAttribute").onchange = function () {
    var operator = document.getElementById("selectOperator");
    while (operator.options.length > 0) {
      operator.remove(0);
    }

    var value_type = $(this).val();
    // alert(value_type);
    var value_attribute = $("#selectAttribute option:selected").text();
    operator.options[0] = new Option("Select operator", "");

    if (
      value_type == "xsd:short" ||
      value_type == "xsd:int" ||
      value_type == "xsd:double"
    ) {
      var operator1 = document.getElementById("selectOperator");
      operator1.options[1] = new Option("Greater than", ">");
      operator1.options[2] = new Option("Less than", "<");
      operator1.options[3] = new Option("Equal to", "=");
    } else if (value_type == "xsd:string") {
      var operator1 = document.getElementById("selectOperator");
      operator1.options[1] = new Option("Like", "Like");
      operator1.options[2] = new Option("Equal to", "=");
    }
  };

  document.getElementById("attQryRun").onclick = function () {
    map.set("isLoading", "YES");

    if (featureOverlay) {
      featureOverlay.getSource().clear();
      map.removeLayer(featureOverlay);
    }

    var layer = document.getElementById("selectLayer");
    var attribute = document.getElementById("selectAttribute");
    var operator = document.getElementById("selectOperator");
    var txt = document.getElementById("enterValue");

    if (layer.options.selectedIndex == 0) {
      alert("Select Layer");
    } else if (attribute.options.selectedIndex == -1) {
      alert("Select Attribute");
    } else if (operator.options.selectedIndex <= 0) {
      alert("Select Operator");
    } else if (txt.value.length <= 0) {
      alert("Enter Value");
    } else {
      var value_layer = layer.options[layer.selectedIndex].value;
      var value_attribute = attribute.options[attribute.selectedIndex].text;
      var value_operator = operator.options[operator.selectedIndex].value;
      var value_txt = txt.value;
      if (value_operator == "Like") {
        value_txt = "%25" + value_txt + "%25";
      } else {
        value_txt = value_txt;
      }
      alert(value_layer);
      var url =
        "http://localhost:8080/geoserver/QLBDS/GISSimplified/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        value_layer +
        "&CQL_FILTER=" +
        value_attribute +
        "+" +
        value_operator +
        "+'" +
        value_txt +
        "'&outputFormat=application/json";
      // console.log(url);
      newaddGeoJsonToMap(url);
      newpopulateQueryTable(url);
      setTimeout(function () {
        newaddRowHandlers(url);
      }, 300);
      map.set("isLoading", "NO");
    }
  };
});

// $(function() {
//   $("#layer").change(function() {
//       var attributes = document.getElementById("attributes");
//       var length = attributes.options.length;
//       for (i = length - 1; i >= 0; i--) {
//           attributes.options[i] = null;
//       }

//       var value_layer = $(this).val();
//       //alert(value_crop);

//       //var level = document.getElementById("level");
//       //var value_level = level.options[level.selectedIndex].value;

//       // var url = "http://localhost:8082/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName="+value_layer;

//       //  alert(url);

//       attributes.options[0] = new Option("Select attributes", "");
//       //  alert(url);

//       $(document).ready(function() {
//           $.ajax({
//               type: "GET",
//               url: "http://localhost:8080/geoserver/QLBDS/wms?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" +
//                   value_layer,
//               dataType: "xml",
//               success: function(xml) {
//                   var select = $("#attributes");
//                   //var title = $(xml).find('xsd\\:complexType').attr('name');
//                   //	alert(title);
//                   $(xml)
//                       .find("xsd\\:sequence")
//                       .each(function() {
//                           $(this)
//                               .find("xsd\\:element")
//                               .each(function() {
//                                   var value = $(this).attr("name");
//                                   //alert(value);
//                                   var type = $(this).attr("type");
//                                   //alert(type);
//                                   if (value != "geom" && value != "the_geom") {
//                                       select.append(
//                                           "<option class='ddindent' value='" +
//                                           type +
//                                           "'>" +
//                                           value +
//                                           "</option>"
//                                       );
//                                   }
//                               });
//                       });
//               },
//           });
//       });
//   });
// });
// // ham 3
// $(function() {
//   $("#attributes").change(function() {
//       var operator = document.getElementById("operator");
//       var length = operator.options.length;
//       for (i = length - 1; i >= 0; i--) {
//           operator.options[i] = null;
//       }

//       var value_type = $(this).val();
//       // alert(value_type);
//       var value_attribute = $("#attributes option:selected").text();
//       operator.options[0] = new Option("Select operator", "");

//       if (
//           value_type == "xsd:short" ||
//           value_type == "xsd:int" ||
//           value_type == "xsd:double"
//       ) {
//           var operator1 = document.getElementById("operator");
//           operator1.options[1] = new Option("Greater than", ">");
//           operator1.options[2] = new Option("Less than", "<");
//           operator1.options[3] = new Option("Equal to", "=");
//       } else if (value_type == "xsd:string") {
//           var operator1 = document.getElementById("operator");
//           operator1.options[1] = new Option("Like", "ILike");
//       }
//   });
// });
