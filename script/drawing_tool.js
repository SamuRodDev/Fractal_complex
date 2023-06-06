const labelRec = $("#recepcion");
var urlParams = new URLSearchParams(window.location.search);
var realR = urlParams.get("real");
var imagR = urlParams.get("imag");

if (realR && imagR) labelRec[0].innerText = "Recibido número complejo:" + realR + "" + imagR + "i";
