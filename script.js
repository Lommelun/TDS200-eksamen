var count = 0;
var elements = document.getElementsByClassName("QvSelected");
[].forEach.call(elements, function (el) { el.id = "uipath_uniqueid_" + count });
var elements = document.getElementsByClassName("QvExcluded");
[].forEach.call(elements, function (el) { el.id = "uipath_uniqueid_" + count });