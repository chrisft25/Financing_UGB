/**control validation form */
(function () {
  "use strict";
  window.addEventListener(
    "load",
    function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName("needs-validation");
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );
})();

const formatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "USD",
});

/**
 * Calculadora de Amortización
 */
function changeMethod() {
  const modalidad = document.querySelector("#modalidad").value;
  if (modalidad == 1) {
    document.querySelector("#input_rate").style.display = "none";
  } else {
    document.querySelector("#input_rate").style.display = "";
  }
}

function showAmortization(e) {
  const form = document.querySelector("#amortization_card");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  var cpendiente, amortizacion, cuotainicial;

  cpendiente = document.querySelector("#capital").value;
  amortizacion = document.querySelector("#amortizado").value;
  cuotainicial = document.querySelector("#cuota").value;
  modalidad = document.querySelector("#modalidad").value;
  const interes = document.querySelector("#interes").value / 1200;

  document.querySelector("#result_capital").innerHTML = formatter.format(
    cpendiente
  );
  document.querySelector("#result_interes").innerHTML =
    interes.toFixed(4) + " %";
  document.querySelector("#result_cuota").innerHTML = formatter.format(
    cuotainicial
  );
  document.querySelector("#result_amortizado").innerHTML = formatter.format(
    amortizacion
  );

  //Cálculo de la variación de cuota
  if (
    modalidad == 1 &&
    cpendiente != "" &&
    cuotainicial != "" &&
    amortizacion != ""
  ) {
    document.querySelector("#title_collapse_mobile").innerHTML =
      "Nueva cuota del Préstamo";
    document.querySelector("#title_collapse_desktop").innerHTML =
      "Nueva cuota del Préstamo";
    factor = amortizacion / cpendiente;
    factor = 1 - factor;
    cuotafinal = cuotainicial * factor;
    document.querySelector(
      "#result_collapse_mobile"
    ).innerHTML = formatter.format(cuotafinal);
    document.querySelector(
      "#result_collapse_desktop"
    ).innerHTML = formatter.format(cuotafinal);
    $("#result").fadeIn();
    $("#result").fadeIn("slow");
    $("#result").fadeIn(3000);
  }

  // Cálculo de la reducción de plazo
  else if (
    modalidad == 2 &&
    cpendiente != "" &&
    cuotainicial != "" &&
    amortizacion != "" &&
    interes != ""
  ) {
    $("#result").fadeIn();
    $("#result").fadeIn("slow");
    $("#result").fadeIn(3000);

    document.querySelector("#title_collapse_mobile").innerHTML =
      "Nuevo Plazo del Préstamo";
    document.querySelector("#title_collapse_desktop").innerHTML =
      "Nuevo Plazo del Préstamo";
    var capital2, nplazo, mplazo, aplazo;

    capital2 = cpendiente - amortizacion;

    factor1 = 1 + interes;
    factor1 = Math.log(factor1);
    factor2 = (capital2 * interes) / cuotainicial;
    factor2 = 1 - factor2;
    factor2 = Math.log(factor2);

    nplazo = (-1 * (factor2 / factor1)) / 12;
    aplazo = Math.round(nplazo);
    if (aplazo > nplazo) {
      aplazo = aplazo - 1;
      mplazo = nplazo - aplazo;
    } else {
      mplazo = nplazo - aplazo;
    }

    mplazo = Math.round(mplazo * 12);
    if (aplazo == 1 && mplazo > 1) {
      document.querySelector("#result_collapse_mobile").innerHTML =
        aplazo + " Año y " + mplazo + " Meses";
      document.querySelector("#result_collapse_desktop").innerHTML =
        aplazo + " Año y " + mplazo + " Meses";
    } else if (aplazo == 1 && mplazo == 1) {
      document.querySelector("#result_collapse_mobile").innerHTML =
        aplazo + " Año y " + mplazo + " Mes";
      document.querySelector("#result_collapse_desktop").innerHTML =
        aplazo + " Año y " + mplazo + " Mes";
    } else if (aplazo < 1 && mplazo > 1) {
      document.querySelector("#result_collapse_mobile").innerHTML =
        mplazo + " Meses";
      document.querySelector("#result_collapse_desktop").innerHTML =
        mplazo + " Meses";
    } else if (aplazo > 1 && mplazo > 1) {
      document.querySelector("#result_collapse_mobile").innerHTML =
        aplazo + " Años y " + mplazo + " Meses";
      document.querySelector("#result_collapse_desktop").innerHTML =
        aplazo + " Años y " + mplazo + " Meses";
    } else if (aplazo > 1 && mplazo == 1) {
      document.querySelector("#result_collapse_mobile").innerHTML =
        aplazo + " Años y " + mplazo + " Mes";
      document.querySelector("#result_collapse_desktop").innerHTML =
        aplazo + " Años y " + mplazo + " Mes";
    }
  }
}

/**
 * Calculadora Tasa interés
 */
function iValue(pv, pmt, n) {
  var S = pv / pmt;
  var t = 1 / S - S / n / n;
  for (cont = 0; cont < 100; cont++) {
    A = Math.pow(1 + t, n);
    B = Math.pow(1 + t, n + 1);
    t = t - (((A - 1) / (t * A) - S) * B * t * t) / (1 + t * (n + 1) - B);
  }
  return (i =
    t - (((A - 1) / (t * A) - S) * B * t * t) / (1 + t * (n + 1) - B));
}
function showTAX() {
  const form = document.querySelector("#form_tasa_interes");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const capitalInicial = Number(document.querySelector("#pv").value);
  const interesMensual = Number(document.querySelector("#pmt").value);
  const meses = Number(document.querySelector("#n").value);
  //const i = iValue(Number(pv), Number(pmt), Number(n));

  const capitalFinal = capitalInicial * (interesMensual / 100) * meses;
  const interesTotal =
    (capitalFinal * interesMensual) / (capitalInicial * (interesMensual / 100));

  if (capitalInicial && interesMensual && meses) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#r_cantidad").innerHTML = formatter.format(
      capitalInicial
    );
    document.querySelector("#r_pago").innerHTML = interesMensual + " %";
    document.querySelector("#r_plazo").innerHTML = meses + " meses";
    document.querySelector(
      "#interes_value_mobile"
    ).innerHTML = formatter.format(capitalFinal);
    document.querySelector(
      "#interes_value_desktop"
    ).innerHTML = formatter.format(capitalFinal);
    document.querySelector("#interesTotalDesktop").innerHTML =
      interesTotal + " %";
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**
 * Calculadora de Descuento
 */
function showDiscount() {
  const form = document.querySelector("#form_descuento");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
  const card = document.getElementById("result");
  card.style.display = "block";
  var ciento1 = document.getElementById("ciento1").value;
  ciento1 = ciento1.toString().replace(",", ".");
  var cantidad1 = document.getElementById("cantidad1").value;
  cantidad1 = cantidad1.toString().replace(",", ".");
  var resultado = (ciento1 * cantidad1) / 100;
  document.getElementById("total1").innerHTML = formatter.format(resultado);
  document.getElementById("r_precio").innerHTML = formatter.format(cantidad1);
  document.getElementById("r_porcentaje").innerHTML = ciento1 + " %";
  var total = Math.round((cantidad1 - resultado) * 100) / 100;
  document.getElementById("total2").innerHTML = formatter.format(total);
  document.getElementById("value_mobile").innerHTML = formatter.format(total);
}

/**
 * Calculadora de TAE
 */
function showTAE() {
  const form = document.querySelector("#form_tae");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const plazo = document.getElementById("plazos").value;
  const tin = document.getElementById("tin").value;

  if (plazo && tin) {
    document.querySelector("#result").style.display = "block";
    if (plazo == 0) {
      document.getElementById("result_value_mobile").innerHTML =
        Math.round(
          ((Math.pow((2 * tin.replace(",", ".")) / 100 + 1, 2) - 1) / 4) *
            100000
        ) /
          1000 +
        " %";
      document.getElementById("result_value_desktop").innerHTML =
        Math.round(
          ((Math.pow((2 * tin.replace(",", ".")) / 100 + 1, 2) - 1) / 4) *
            100000
        ) /
          1000 +
        " %";
    } else {
      document.getElementById("result_value_mobile").innerHTML =
        Math.round(
          (Math.pow(1 + tin.replace(",", ".") / (100 * plazo), plazo) - 1) *
            100000
        ) /
          1000 +
        " %";
      document.getElementById("result_value_desktop").innerHTML =
        Math.round(
          (Math.pow(1 + tin.replace(",", ".") / (100 * plazo), plazo) - 1) *
            100000
        ) /
          1000 +
        " %";
    }
    document.querySelector("#result_tin").innerHTML = tin + " %";
    document.querySelector("#result_frecuencia").innerHTML =
      plazo == 1
        ? "Anual"
        : plazo == 2
        ? "Semestral"
        : plazo == 4
        ? "Trimestral"
        : plazo == 12
        ? "Mensual"
        : "Anticipado";
  }
}

/**
 * Calculadora de Hipoteca
 */
function showHipoteca() {
  const form = document.querySelector("#form_hipoteca");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  var importe = parseInt(document.querySelector("#PropertyImporte").value);
  var meses = parseInt(document.querySelector("#fin_amortizacion").value);
  var plazo = parseInt(
    document.querySelector("#PropertyPlazoAmortizacion").value
  );
  var interes2 = document.querySelector("#fin_interes2").value / 100;

  if (!plazo) {
    document.querySelector("#result").style.display = "none";
  } else {
    document.querySelector("#result").style.display = "block";
    var total =
      importe /
      ((1 - Math.pow(1 + interes2 / meses, -1 * meses * plazo)) /
        (interes2 / meses));
    document.getElementById("result_value_mobile").innerHTML =
      formatter.format(total) + "/mes";
    document.getElementById("result_value_desktop").innerHTML =
      formatter.format(total) + "/mes";

    document.getElementById("result_importe").innerHTML = formatter.format(
      importe
    );
    document.getElementById("result_plazo").innerHTML = plazo * 12 + " meses";
    document.getElementById("result_interes").innerHTML = interes2 * 100 + " %";
  }
}

/**
 * Calculadora de IRPF
 */
function calculoRetencion(baseImponibleGeneral) {
  let cuotaUNO = 0;

  if (baseImponibleGeneral <= 12450) {
    cuotaUNO = baseImponibleGeneral * 0.19;
  } else if (baseImponibleGeneral <= 20200) {
    cuotaUNO = 12450 * 0.19;
    const cuota_uno = baseImponibleGeneral - 12450;
    cuotaUNO += cuota_uno * 0.24;
  } else if (baseImponibleGeneral <= 35200) {
    cuotaUNO = 12450 * 0.19;
    const cuota_uno = 20200 - 12450;
    cuotaUNO += cuota_uno * 0.24;
    const cuota_dos = baseImponibleGeneral - 20200;
    cuotaUNO += cuota_dos * 0.3;
  } else if (baseImponibleGeneral <= 60000) {
    cuotaUNO = 12450 * 0.19;
    const cuota_uno = 20200 - 12450;
    cuotaUNO += cuota_uno * 0.24;
    const cuota_dos = 35200 - 20200;
    cuotaUNO += cuota_dos * 0.3;
    const cuota_tres = baseImponibleGeneral - 35200;
    cuotaUNO += cuota_tres * 0.37;
  } else {
    cuotaUNO = 12450 * 0.19;
    const cuota_uno = 20200 - 12450;
    cuotaUNO += cuota_uno * 0.24;
    const cuota_dos = 35200 - 20200;
    cuotaUNO += cuota_dos * 0.3;
    const cuota_tres = 60000 - 35200;
    cuotaUNO += cuota_tres * 0.37;
    const cuota_cuatro = baseImponibleGeneral - 35200;
    cuotaUNO += cuota_cuatro * 0.45;
  }

  return cuotaUNO;
}
function showIRPF() {
  const form = document.querySelector("#form_irpf");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const sueldoAnual = document.querySelector("#sueldoBruto").value;
  const situacionContribuyente = document.querySelector(
    "#situacionContribuyente"
  ).value;
  const numeroHijos = document.querySelector("#numeroHijos").value;
  const reduccionRendimiento = document.querySelector("#reduccionRendimiento")
    .value;
  const edad = document.querySelector("#edad").value;
  const ascendientes = document.querySelector("#ascendientes").value;
  const gastosSinJustificar = 2000;
  const nuevoSueldo = sueldoAnual - gastosSinJustificar;

  //situacionContribuyente x numeroHijos
  const tablaSituacion = [
    [0, 15168, 16730],
    [14641, 15845, 17492],
    [12643, 13455, 14251],
  ];

  const tablaReduccion = [nuevoSueldo, 3000, 9000, 600, 600, 1200, 0];

  if (
    !sueldoAnual ||
    !situacionContribuyente ||
    !numeroHijos ||
    !reduccionRendimiento ||
    !edad ||
    !ascendientes
  ) {
    document.querySelector("#result").style.display = "none";
  } else {
    document.querySelector("#result").style.display = "block";
    const situacionActual = tablaSituacion[situacionContribuyente][numeroHijos];
    if (sueldoAnual > situacionActual) {
      const baseImponibleGeneral =
        nuevoSueldo - tablaReduccion[reduccionRendimiento];
      const cuotaUNO = calculoRetencion(baseImponibleGeneral);

      const coutaHijos = numeroHijos == 0 ? 0 : numeroHijos == 1 ? 2400 : 3700;
      const descuento =
        Number(edad) + Number(ascendientes) + Number(coutaHijos);
      const cuotaDOS = calculoRetencion(descuento);

      const irpf = Number(cuotaUNO) - Number(cuotaDOS);
      const porcIRPF = (irpf / sueldoAnual) * 100;

      document.getElementById(
        "result_value_mobile"
      ).innerHTML = formatter.format(irpf);
      document.getElementById(
        "result_value_desktop"
      ).innerHTML = formatter.format(irpf);
      document.getElementById("result_sueldo").innerHTML = formatter.format(
        sueldoAnual
      );
      document.getElementById("result_base").innerHTML = formatter.format(
        baseImponibleGeneral
      );
      document.getElementById("result_porcentaje").innerHTML =
        porcIRPF.toFixed(2) + " %";
    } else {
      document.getElementById("result_value_mobile").innerHTML = "0,00 $";
      document.getElementById("result_value_desktop").innerHTML = "0,00 $";
      document.getElementById("result_sueldo").innerHTML = formatter.format(
        sueldoAnual
      );
      document.getElementById("result_base").innerHTML = formatter.format(0);
      document.getElementById("result_porcentaje").innerHTML = "0,00 %";
    }
  }
}

/**
 * Calculadora de Paga Extra
 */
function calcular_dias_transcurridos(fecha1, fecha2) {
  const diferencia = fecha2 - fecha1;
  const dias = diferencia / (60 * 60 * 24);

  return dias / 1000;
}

function showPAGAEXTRA() {
  const form = document.querySelector("#form_paga_extra");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const pagoProporcional = document.querySelector("#pagoProporcional").value;
  const salarioMensual = document.querySelector("#salarioMensual").value;
  const fechaContrato = document.querySelector("#fechaContrato").value;
  const fechaPagaExtra = document.querySelector("#fechaPagaExtra").value;

  if (fechaContrato) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#head_table_fechaConvenio").style.display = "none";
    document.querySelector("#result_convenio").style.display = "none";

    const fecha1 = new Date(fechaContrato);
    const fecha2 = new Date(fechaPagaExtra);

    const dias = calcular_dias_transcurridos(fecha1, fecha2);

    const dias_periodo_semestral = 180;
    const dias_periodo_anual = 360;

    const total_semestral = (salarioMensual * dias) / dias_periodo_semestral;
    let total_anual = 0;

    if (pagoProporcional == "anual") {
      document.querySelector("#head_table_fechaConvenio").style.display =
        "block";
      document.querySelector("#result_convenio").style.display = "block";

      const fechaConvenio = new Date(
        fecha1.getFullYear() - 1,
        fecha1.getMonth(),
        fecha1.getDate()
      );
      document.querySelector("#result_convenio").innerHTML =
        fechaConvenio.getDate() +
        "/" +
        fechaConvenio.getMonth() +
        "/" +
        fechaConvenio.getFullYear();
      total_anual = (salarioMensual * dias) / dias_periodo_anual;
    }

    const result = formatter.format(total_semestral + total_anual);
    document.getElementById("result_value_mobile").innerHTML = result;
    document.getElementById("result_value_desktop").innerHTML = result;
    document.getElementById("result_salario").innerHTML = formatter.format(
      salarioMensual
    );
    document.getElementById("result_dias").innerHTML = dias;
  }
}

/**
 * Calculadora de (Nueva) Gastos e Ingresos
 */
function showENDEUDAMIENTO() {
  const form = document.querySelector("#form_endeudamiento");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const sueldoNeto = document.querySelector("#txtRenta").value;
  const honorarios = document.querySelector("#txtHonorarios").value;
  const premios = document.querySelector("#txtComisiones").value;
  const otrosIngresos = document.querySelector("#txtBonos").value;
  const aguinaldos = document.querySelector("#txtAguinaldos").value;

  const TotalIngresos =
    Number(sueldoNeto) +
    Number(honorarios) +
    Number(premios) +
    Number(otrosIngresos) +
    Number(aguinaldos);

  const serviciosBasicos = Number(document.querySelector("#txtSrvBasic").value);
  const serviciosExtra = Number(document.querySelector("#txtSrvAdic").value);
  const alimentacion = Number(document.querySelector("#txtAlimentacion").value);
  const educacion = Number(document.querySelector("#txtEducacion").value);
  const pagoAlquiler = Number(document.querySelector("#txtArriendo").value);
  const pagoHipoteca = Number(
    document.querySelector("#txtCrdHipotecario").value
  );
  const pagoCredito = Number(document.querySelector("#txtCrdConsumo").value);
  const creditoEducacional = Number(
    document.querySelector("#txtCrdEducacional").value
  );
  const tarjetasCredito = Number(
    document.querySelector("#txtTrjCredito").value
  );
  const seguro = Number(document.querySelector("#txtSeguro").value);
  const gastosSalud = Number(document.querySelector("#txtSalud").value);
  const ocio = Number(document.querySelector("#txtRecreacion").value);
  const ropa = Number(document.querySelector("#txtVestuario").value);
  const transporte = Number(document.querySelector("#txtMovilizacion").value);
  const otrosGastos = Number(document.querySelector("#txtOtros").value);

  const TotalEgresos =
    serviciosBasicos +
    serviciosExtra +
    alimentacion +
    educacion +
    pagoAlquiler +
    pagoHipoteca +
    creditoEducacional +
    tarjetasCredito +
    seguro +
    gastosSalud +
    ocio +
    ropa +
    transporte +
    otrosGastos +
    pagoCredito;

  const TotalLiquido = TotalIngresos - (pagoAlquiler + pagoHipoteca);
  const CapacidadAhorro = TotalIngresos - TotalEgresos;

  let CargaFinanciera = 0;
  let RentaDividendo = 0;
  if (TotalIngresos != 0) {
    CargaFinanciera =
      ((pagoHipoteca +
        pagoCredito +
        tarjetasCredito +
        creditoEducacional +
        pagoAlquiler) /
        TotalIngresos) *
      100;
    RentaDividendo = (pagoHipoteca / TotalIngresos) * 100;
  }

  if (sueldoNeto) {
    document.querySelector("#result").style.display = "block";

    document.getElementById("txtTotalIngresos").innerHTML = formatter.format(
      TotalIngresos
    );
    document.getElementById("txtTotalLiquido").innerHTML = formatter.format(
      TotalLiquido
    );
    document.getElementById("txtTotalEgresos").innerHTML = formatter.format(
      TotalEgresos
    );
    document.getElementById("txtCargaFinanciera").innerHTML =
      CargaFinanciera.toFixed(2) + " %";
    document.getElementById("divCapacidadAhorro").innerHTML = formatter.format(
      CapacidadAhorro
    );
    document.getElementById("divRentaDividendo").innerHTML = formatter.format(
      RentaDividendo
    );

    document.getElementById("txtCargaFinanciera_mobile").innerHTML =
      CargaFinanciera.toFixed(2) + " %";
    document.getElementById(
      "divCapacidadAhorro_mobile"
    ).innerHTML = formatter.format(CapacidadAhorro);
  }
}

/**
 * Calculadora de Paro
 */
function ayudaOrigen() {
  document.getElementById("panel-ayuda-contenido").style.height = "70px";
  document.getElementById("panel-ayuda-contenido").innerHTML =
    "A la izquierda de cada uno de los campos le facilitamos un bot&oacute;n de ayuda. Si necesita informaci&oacute;n extra sobre los datos que hay que introducir, por favor, deslicese sobre dicho bot&oacute;n y aparecer&aacute; la ayuda en este panel.";
}
function ayudaBase() {
  document.getElementById("panel-ayuda-contenido").style.height = "45px";
  document.getElementById("panel-ayuda-contenido").innerHTML =
    "Media de la base de cotización de los &uacute;ltimos 6 meses. La base de cotización de un mes es el salario bruto dividido entre 12.";
}
function ayudaTiempo() {
  document.getElementById("panel-ayuda-contenido").style.height = "55px";
  document.getElementById("panel-ayuda-contenido").innerHTML =
    "Introduzca el periodo de tiempo que ha trabajado en los &uacute;ltimos 6 años. Deber&aacute; seleccionar del desplegable de la derecha el n&uacute;mero de d&iacute;as correspondiente.";
}
function ayudaHijos() {
  document.getElementById("panel-ayuda-contenido").style.height = "70px";
  document.getElementById("panel-ayuda-contenido").innerHTML =
    "Se considera como hijos aquellos que convivan con la persona y no tengan ingresos brutos superiores a 633,30 &euro; mensuales. Deben tener menos de 26 a&ntilde;os o m&aacute;s de 26 a&ntilde;os pero con una incapacidad igual o superior al 33&#37;. ";
}
function ayudaOtrasRentas() {
  document.getElementById("panel-ayuda-contenido").style.height = "55px";
  document.getElementById("panel-ayuda-contenido").innerHTML =
    "Si la persona que est&aacute; interesada en recibir el paro tiene otro tipo de rentas superiores a 474.98 &euro;, tendr&aacute; que marcar s&iacute; en el desplegable de la derecha.";
}
function ayudaResponsabilidades() {
  document.getElementById("panel-ayuda-contenido").style.height = "100px";
  document.getElementById("panel-ayuda-contenido").innerHTML =
    "Tiene responsabilidades familiares si tiene a su cargo a su c&oacute;nyuge, hijos menores de 26 a&ntilde;os o hijos mayores discapacitados, y la renta de toda la familia dividida por el n&uacute;mero de miembros no supera 474,98 &euro; mensuales. Para este c&aacute;lculo no se tienen en cuenta familiares a su cargo que tengan rentas superiores a 474,98 &euro; mensuales.";
}
function desaparecerAparecerMenos360dias() {
  var indiceTiempo = document.getElementById("tiempoTrabajado").selectedIndex;
  //document.getElementById("errorTiempo").innerHTML="";
  if (indiceTiempo > 5) {
    document.getElementById("menos360dias").style.display = "none";
  } else if (indiceTiempo > 0) {
    document.getElementById("menos360dias").style.display = "";
  }
}
function redondeo(num, precision) {
  num = num.toString().replace(/\ |\,/g, "");
  if (isNaN(num)) num = "0";
  cents = Math.floor((num * 100 + 0.5) % 100);
  num = Math.floor((num * 100 + 0.5) / 100).toString();
  if (cents < 10) cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      num.substring(num.length - (4 * i + 3));
  if (precision > 0) {
    return " " + num + "," + cents;
  } else if (precision == 0) {
    return " " + num;
  }
}
function calculoparo() {
  const form = document.querySelector("#formulario1");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  /*Definimos variables*/
  var baseReguladora = document.getElementById("salario").value;
  baseReguladora = baseReguladora.toString().replace(",", ".");

  var indiceTiempo = document.getElementById("tiempoTrabajado").selectedIndex;
  var tiempoTrabajado = document.getElementById("tiempoTrabajado").options[
    indiceTiempo
  ].value;

  var hijos = document.getElementById("hijos").selectedIndex;

  var indiceResponsabilidades = document.getElementById("responsabilidades")
    .selectedIndex;
  var responsabilidades = document.getElementById("responsabilidades").options[
    indiceResponsabilidades
  ].value;

  var indiceRentas = document.getElementById("otrasRentas").selectedIndex;
  var otrasRentas = document.getElementById("otrasRentas").options[indiceRentas]
    .value;

  document.querySelector("#result").style.display = "block";

  if (indiceTiempo < 1) {
    document.getElementById("errorParo").innerHTML =
      "Por favor, introduzca su periodo de tiempo trabajado en los ultimos 6 a&ntilde;os";
    document.querySelector(".mesesPrimeros").innerHTML = "";
    document.querySelector(".mesesPrimeros_desktop").innerHTML = "";
    document.getElementById("tiempoTrabajado").focus();
  } else {
    document.querySelector(".errorResultados").innerHTML = "";
    document.querySelector(".errorResultados_desktop").innerHTML = "";
    document.getElementById("errorParo").innerHTML = "";
    if (indiceTiempo > 5) {
      document.querySelector(".resultadoPrimero").style.display = "";
      document.querySelector(".resultadoPrimero_desktop").style.display = "";
      document.querySelector(".resultadoUltimo").style.display = "";
      if (baseReguladora == "") {
        document.getElementById("errorParo").innerHTML =
          "Por favor, introduzca su salario medio de los &uacute;ltimos 6 meses.";
        document.querySelector(".mesesPrimeros").innerHTML = "";
        document.querySelector(".mesesPrimeros_desktop").innerHTML = "";
        document.getElementById("salario").focus();
      } else if (baseReguladora < 0) {
        document.getElementById("errorParo").innerHTML =
          "La base reguladora no puede ser negativa.";
        document.querySelector(".mesesPrimeros").innerHTML = "";
        document.querySelector(".mesesPrimeros_desktop").innerHTML = "";
        document.getElementById("salario").focus();
      } else {
        document.getElementById("errorParo").innerHTML = "";
        var minimo = 497;
        var maximo = 1397.83;
        if (hijos == 0) {
          minimo = 497;
          maximo = 1087.2;
        } else if (hijos == 1) {
          minimo = 664.74;
          maximo = 1242.52;
        } else if (hijos == 2) {
          minimo = 664.74;
          maximo = 1397.83;
        }
        var basePrincipio = baseReguladora * 0.7;

        if (basePrincipio > maximo) {
          basePrincipio = maximo;
        } else if (basePrincipio < minimo) {
          duracion;
          basePrincipio = minimo;
        }
        document.querySelector(
          ".salarioPrimerosMeses"
        ).innerHTML = formatter.format(basePrincipio);
        document.querySelector(
          ".salarioPrimerosMeses_desktop"
        ).innerHTML = formatter.format(basePrincipio);
        var baseFinal = baseReguladora * 0.5;

        //var salarioTotal = salarioTotal_desktop; -> aquí

        if (baseFinal > maximo) {
          baseFinal = maximo;
        } else if (baseFinal < minimo) {
          baseFinal = minimo;
        }
        document.querySelector(".salarioUltimosMeses").innerHTML = redondeo(
          baseFinal,
          2
        );
        document.querySelector(
          ".salarioUltimosMeses_desktop"
        ).innerHTML = redondeo(baseFinal, 2);
        var duracion = 4;
        switch (indiceTiempo) {
          case 6:
            duracion = 4;

            var total_1 = basePrincipio * duracion;

            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + duracion + " meses";
            document.querySelector(
              ".mesesPrimeros_desktop"
            ).innerHTML = duracion;
            document.querySelector(".mesesUltimos").innerHTML = 0;
            document.querySelector(".mesesUltimos_desktop").innerHTML = 0;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_1 + " $";
            document.querySelector(".resultadoUltimo").style.display = "none";
            break;
          case 7:
            duracion = 6;

            var total_1 = basePrincipio * duracion;

            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + 6 + " meses";
            document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
            document.querySelector(".mesesUltimos").innerHTML = 0;
            document.querySelector(".mesesUltimos_desktop").innerHTML = 0;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_1 + " $";
            document.querySelector(".resultadoUltimo").style.display = "none";
            break;
          case 8:
            duracion = 8;

            var total_2 = baseFinal * duracion;

            console.log(basePrincipio);
            console.log(duracion);
            console.log(total_2);
            console.log(baseFinal);
            console.log(duracion - 6);
            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + 6 + " meses";
            document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
            document.querySelector(".mesesUltimos").innerHTML =
              "siguientes " + (duracion - 6) + " meses";
            document.querySelector(".mesesUltimos_desktop").innerHTML =
              duracion - 6;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_2 + " $";
            document.querySelector(".resultadoUltimo").style.display = "";
            break;
          case 9:
            duracion = 10;

            var total_2 = baseFinal * duracion;

            console.log(basePrincipio);
            console.log(duracion);
            console.log(total_2);
            console.log(baseFinal);
            console.log(duracion - 6);
            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + 6 + " meses";
            document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
            document.querySelector(".mesesUltimos").innerHTML =
              "siguientes " + (duracion - 6) + " meses";
            document.querySelector(".mesesUltimos_desktop").innerHTML =
              duracion - 6;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_2 + " $";
            document.querySelector(".resultadoUltimo").style.display = "";
            break;
          case 10:
            duracion = 12;

            var total_2 = baseFinal * duracion;

            console.log(basePrincipio);
            console.log(duracion);
            console.log(total_2);
            console.log(baseFinal);
            console.log(duracion - 6);
            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + 6 + " meses";
            document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
            document.querySelector(".mesesUltimos").innerHTML =
              "siguientes " + (duracion - 6) + " meses";
            document.querySelector(".mesesUltimos_desktop").innerHTML =
              duracion - 6;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_2 + " $";
            document.querySelector(".resultadoUltimo").style.display = "";
            break;
          case 11:
            duracion = 14;

            var total_2 = baseFinal * duracion;

            console.log(basePrincipio);
            console.log(duracion);
            console.log(total_2);
            console.log(baseFinal);
            console.log(duracion - 6);
            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + 6 + " meses";
            document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
            document.querySelector(".mesesUltimos").innerHTML =
              "siguientes " + (duracion - 6) + " meses";
            document.querySelector(".mesesUltimos_desktop").innerHTML =
              duracion - 6;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_2 + " $";
            document.querySelector(".resultadoUltimo").style.display = "";
            break;
          case 12:
            duracion = 16;

            var total_2 = baseFinal * duracion;

            console.log(basePrincipio);
            console.log(duracion);
            console.log(total_2);
            console.log(baseFinal);
            console.log(duracion - 6);
            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + 6 + " meses";
            document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
            document.querySelector(".mesesUltimos").innerHTML =
              "siguientes " + (duracion - 6) + " meses";
            document.querySelector(".mesesUltimos_desktop").innerHTML =
              duracion - 6;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_2 + " $";
            document.querySelector(".resultadoUltimo").style.display = "";
            break;
          case 13:
            duracion = 18;

            var total_2 = baseFinal * duracion;

            console.log(basePrincipio);
            console.log(duracion);
            console.log(total_2);
            console.log(baseFinal);
            console.log(duracion - 6);
            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + 6 + " meses";
            document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
            document.querySelector(".mesesUltimos").innerHTML =
              "siguientes " + (duracion - 6) + " meses";
            document.querySelector(".mesesUltimos_desktop").innerHTML =
              duracion - 6;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_2 + " $";
            document.querySelector(".resultadoUltimo").style.display = "";
            break;
          case 14:
            duracion = 20;

            var total_2 = baseFinal * duracion;

            console.log(basePrincipio);
            console.log(duracion);
            console.log(total_2);
            console.log(baseFinal);
            console.log(duracion - 6);
            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + 6 + " meses";
            document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
            document.querySelector(".mesesUltimos").innerHTML =
              "siguientes " + (duracion - 6) + " meses";
            document.querySelector(".mesesUltimos_desktop").innerHTML =
              duracion - 6;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_2 + " $";
            document.querySelector(".resultadoUltimo").style.display = "";
            break;
          case 15:
            duracion = 22;

            var total_2 = baseFinal * duracion;

            console.log(basePrincipio);
            console.log(duracion);
            console.log(total_2);
            console.log(baseFinal);
            console.log(duracion - 6);
            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + 6 + " meses";
            document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
            document.querySelector(".mesesUltimos").innerHTML =
              "siguientes " + (duracion - 6) + " meses";
            document.querySelector(".mesesUltimos_desktop").innerHTML =
              duracion - 6;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_2 + " $";
            document.querySelector(".resultadoUltimo").style.display = "";
            break;
          case 16:
            duracion = 24;

            var total_2 = baseFinal * duracion;

            console.log(basePrincipio);
            console.log(duracion);
            console.log(total_2);
            console.log(baseFinal);
            console.log(duracion - 6);
            document.querySelector(".mesesPrimeros").innerHTML =
              "primeros " + 6 + " meses";
            document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
            document.querySelector(".mesesUltimos").innerHTML =
              "siguientes " + (duracion - 6) + " meses";
            document.querySelector(".mesesUltimos_desktop").innerHTML =
              duracion - 6;
            document.querySelector(".salarioTotal_desktop").innerHTML =
              total_2 + " $";
            document.querySelector(".resultadoUltimo").style.display = "";
            break;
        }
      }
    } else {
      if (otrasRentas == 1) {
        document.querySelector(".resultadoPrimero").style.display = "none";
        document.querySelector(".resultadoPrimero_desktop").style.display =
          "none";
        document.querySelector(".resultadoUltimo").style.display = "none";
        document.querySelector(".errorResultados").innerHTML =
          "No tiene derecho a la prestación del Subsidio por desempleo, puesto que tiene otras rentas de cualquier naturaleza superiores a 474,98 euros.";
        document.querySelector(".errorResultados_desktop").innerHTML =
          "No tiene derecho a la prestación del Subsidio por desempleo, puesto que tiene otras rentas de cualquier naturaleza superiores a 474,98 euros.";
      } else {
        if (indiceTiempo == 1) {
          document.querySelector(".resultadoPrimero").style.display = "none";
          document.querySelector(".resultadoPrimero_desktop").style.display =
            "none";
          document.querySelector(".resultadoUltimo").style.display = "none";
          document.querySelector(".errorResultados").innerHTML =
            "No tiene derecho al paro, puesto que ha trabajado menos de 90 días en los últimos 6 años.";
          document.querySelector(".errorResultados_desktop").innerHTML =
            "No tiene derecho al paro, puesto que ha trabajado menos de 90 días en los últimos 6 años.";
        } else {
          if (indiceTiempo < 5 && responsabilidades == 0) {
            document.querySelector(".resultadoPrimero").style.display = "none";
            document.querySelector(".resultadoPrimero_desktop").style.display =
              "none";
            document.querySelector(".resultadoUltimo").style.display = "none";
            document.querySelector(".errorResultados").innerHTML =
              "No tiene derecho al paro, puesto que ha trabajado menos de 360 días en los últimos 6 años y no tiene responsabilidades familiares.";
            document.querySelector(".errorResultados_desktop").innerHTML =
              "No tiene derecho al paro, puesto que ha trabajado menos de 360 días en los últimos 6 años y no tiene responsabilidades familiares.";
          } else {
            basePrincipio = 426;
            document.querySelector(
              ".salarioPrimerosMeses"
            ).innerHTML = formatter.format(basePrincipio);
            document.querySelector(
              ".salarioPrimerosMeses_desktop"
            ).innerHTML = formatter.format(basePrincipio);
            baseFinal = 426;
            document.querySelector(
              ".salarioUltimosMeses"
            ).innerHTML = baseFinal;
            document.querySelector(
              ".salarioUltimosMeses_desktop"
            ).innerHTML = formatter.format(baseFinal);
            document.querySelector(".resultadoPrimero").style.display = "";
            document.querySelector(".resultadoPrimero_desktop").style.display =
              "";
            document.querySelector(
              ".salarioTotal_desktop"
            ).innerHTML = formatter.format(basePrincipio * 6);
            if (indiceTiempo == 5 && responsabilidades == 0) {
              var total_1 = basePrincipio * duracion;

              document.querySelector(".mesesPrimeros").innerHTML =
                "primeros " + 6 + " meses";
              document.querySelector(".mesesPrimeros_desktop").innerHTML = 6;
              document.querySelector(".mesesUltimos").innerHTML = 0;
              document.querySelector(".mesesUltimos_desktop").innerHTML = 0;
              document.querySelector(".salarioTotal_desktop").innerHTML =
                total_1 + " $";
              document.querySelector(".resultadoUltimo").style.display = "none";
            } else if (responsabilidades == 1) {
              switch (indiceTiempo) {
                case 2:
                  duracion = 3;

                  var total_1 = basePrincipio * duracion;

                  document.querySelector(".mesesPrimeros").innerHTML =
                    "primeros " + duracion + " meses";
                  document.querySelector(
                    ".mesesPrimeros_desktop"
                  ).innerHTML = duracion;
                  document.querySelector(".mesesUltimos").innerHTML = 0;
                  document.querySelector(".mesesUltimos_desktop").innerHTML = 0;
                  document.querySelector(".salarioTotal_desktop").innerHTML =
                    total_1 + " $";
                  document.querySelector(".resultadoUltimo").style.display =
                    "none";
                  break;
                case 3:
                  duracion = 4;

                  var total_1 = basePrincipio * duracion;

                  document.querySelector(".mesesPrimeros").innerHTML =
                    "primeros " + duracion + " meses";
                  document.querySelector(
                    ".mesesPrimeros_desktop"
                  ).innerHTML = duracion;
                  document.querySelector(".mesesUltimos").innerHTML = 0;
                  document.querySelector(".mesesUltimos_desktop").innerHTML = 0;
                  document.querySelector(".salarioTotal_desktop").innerHTML =
                    total_1 + " $";
                  document.querySelector(".resultadoUltimo").style.display =
                    "none";
                  break;
                case 4:
                  duracion = 5;

                  var total_1 = basePrincipio * duracion;

                  document.querySelector(".mesesPrimeros").innerHTML = duracion;
                  document.querySelector(
                    ".mesesPrimeros_desktop"
                  ).innerHTML = duracion;
                  document.querySelector(".mesesUltimos").innerHTML = 0;
                  document.querySelector(".mesesUltimos_desktop").innerHTML = 0;
                  document.querySelector(".salarioTotal_desktop").innerHTML =
                    total_1 + " $";
                  document.querySelector(".resultadoUltimo").style.display =
                    "none";
                  break;
                case 5:
                  duracion = 21;

                  var total_2 = baseFinal * duracion;

                  console.log(basePrincipio);
                  console.log(duracion);
                  console.log(total_2);
                  console.log(baseFinal);
                  console.log(duracion - 6);
                  document.querySelector(".mesesPrimeros").innerHTML =
                    "primeros " + 6 + " meses";
                  document.querySelector(
                    ".mesesPrimeros_desktop"
                  ).innerHTML = 6;
                  document.querySelector(".mesesUltimos").innerHTML =
                    "siguientes " + (duracion - 6) + " meses";
                  document.querySelector(".mesesUltimos_desktop").innerHTML =
                    duracion - 6;
                  document.querySelector(".salarioTotal_desktop").innerHTML =
                    total_2 + " $";
                  document.querySelector(".resultadoUltimo").style.display = "";
                  break;
              }
            }
          }
        }
      }
    }
  }
}

/**
 * Calculadora de WACC
 */
function showWACC() {
  const form = document.querySelector("#form_wacc");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const valueOfEquity = Number(document.querySelector("#capital").value);
  const valueOfDebt = Number(document.querySelector("#montoDeuda").value);
  const costOfEquity = Number(document.querySelector("#tasaOportinudad").value);
  const costOfDebt = Number(document.querySelector("#tasaDeuda").value);
  const taxRate = Number(document.querySelector("#tasaImpuestos").value);

  var finance = new Finance();
  const wacc = finance.WACC(
    valueOfEquity,
    valueOfDebt,
    costOfEquity,
    costOfDebt,
    taxRate
  );

  if (wacc) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#result_value_mobile").innerHTML = wacc + " %";
    document.querySelector("#result_value_desktop").innerHTML = wacc + " %";
    document.querySelector("#result_capital").innerHTML = formatter.format(
      valueOfEquity
    );
    document.querySelector("#result_deuda").innerHTML = formatter.format(
      valueOfDebt
    );
  } else document.querySelector("#result").style.display = "none";
}

/**
 * Calculadora de TIN
 */
function showTIN() {
  const form = document.querySelector("#form_tin");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const plazo = document.getElementById("plazos").value;
  const tae = document.getElementById("tae").value;

  if (plazo && tae) {
    document.querySelector("#result").style.display = "block";
    if (plazo == 0) {
      document.getElementById("result_value_mobile").innerHTML =
        Math.round(
          ((Math.pow(1 + (4 * tae.replace(",", ".")) / 100, 0.5) - 1) / 2) *
            100000
        ) /
          1000 +
        " %";
      document.getElementById("result_value_desktop").innerHTML =
        Math.round(
          ((Math.pow(1 + (4 * tae.replace(",", ".")) / 100, 0.5) - 1) / 2) *
            100000
        ) /
          1000 +
        " %";
    } else {
      document.getElementById("result_value_mobile").innerHTML =
        Math.round(
          (Math.pow(1 + tae.replace(",", ".") / 100, 1 / plazo) - 1) *
            plazo *
            100000
        ) /
          1000 +
        " %";
      document.getElementById("result_value_desktop").innerHTML =
        Math.round(
          (Math.pow(1 + tae.replace(",", ".") / 100, 1 / plazo) - 1) *
            plazo *
            100000
        ) /
          1000 +
        " %";
    }
    document.querySelector("#result_tae").innerHTML = tae + " %";
    document.querySelector("#result_frecuencia").innerHTML =
      plazo == 1
        ? "Anual"
        : plazo == 2
        ? "Semestral"
        : plazo == 4
        ? "Trimestral"
        : plazo == 12
        ? "Mensual"
        : "Anticipado";
  }
}

/**
 * Calculadora Periodo Medio de Pago a
 * Proveedores
 */
function showPYMES() {
  const form = document.querySelector("#form_pymes");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const saldoMedio = Number(document.querySelector("#saldoMedio").value);
  const comprasNetas = Number(document.querySelector("#comprasNetas").value);

  if (saldoMedio && comprasNetas) {
    document.querySelector("#result").style.display = "block";
    const periodoMedio = (saldoMedio / comprasNetas) * 365;
    document.querySelector("#result_value_mobile_pymes").innerHTML =
      periodoMedio.toFixed(2) + " dias";
    document.querySelector("#r_saldoMedio").innerHTML = formatter.format(
      saldoMedio
    );
    document.querySelector("#r_comprasNetas").innerHTML = formatter.format(
      comprasNetas
    );
    document.querySelector("#result_value_desktop_pyme").innerHTML =
      periodoMedio.toFixed(2) + " dias";
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

function showOTRAS() {
  const form = document.querySelector("#form_resto_empresas");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const diasPago = Number(document.querySelector("#diasPago").value);
  const diasTotal = Number(document.querySelector("#diasTotal").value);
  const importePagado = Number(document.querySelector("#importePagado").value);
  const diasPendientes = Number(
    document.querySelector("#diasPendientes").value
  );
  const importePendiente = Number(
    document.querySelector("#importePendiente").value
  );
  const totalDiasPendiente = Number(
    document.querySelector("#totalDiasPendiente").value
  );

  if (
    diasPago &&
    diasTotal &&
    importePagado &&
    importePendiente &&
    diasPendientes &&
    totalDiasPendiente
  ) {
    document.querySelector("#result_second").style.display = "block";

    const ratioOperacionesPagadas = (diasPago * importePagado) / diasTotal;
    const ratioOperacionesPendientes =
      (diasPendientes * importePendiente) / totalDiasPendiente;
    const periodoMedio =
      (ratioOperacionesPagadas * diasTotal +
        ratioOperacionesPendientes * totalDiasPendiente) /
      (diasTotal + totalDiasPendiente);

    document.querySelector("#r_ratioPagadas").innerHTML =
      ratioOperacionesPagadas.toFixed(2) + " dias";
    document.querySelector("#r_ratioPendientes").innerHTML =
      ratioOperacionesPendientes.toFixed(2) + " dias";
    document.querySelector("#r_pagosRealizados").innerHTML = formatter.format(
      diasTotal
    );
    document.querySelector("#r_pagosPendientes").innerHTML = formatter.format(
      totalDiasPendiente
    );
    document.querySelector("#result_value_desktop_otras").innerHTML =
      periodoMedio.toFixed(2) + " dias";
    document.querySelector("#result_value_mobile_otras").innerHTML =
      periodoMedio.toFixed(2) + " dias";
  } else {
    document.querySelector("#result_second").style.display = "none";
  }
}

/**
 * Calculadora de Amortización de Productos
 */
function showAmrtProducts() {
  const form = document.querySelector("#form_amrt_prod");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const valorProducto = Number(document.querySelector("#valorProducto").value);
  const valorResidual = Number(document.querySelector("#valorResidual").value);
  const numerosAnos = Number(document.querySelector("#numerosAnos").value);

  if (valorProducto && valorResidual && numerosAnos) {
    document.querySelector("#result").style.display = "block";

    const cuotaAmortizacion = (valorProducto - valorResidual) / numerosAnos;
    document.querySelector("#r_valorProducto").innerHTML = formatter.format(
      valorProducto
    );
    document.querySelector("#r_valorResidual").innerHTML = formatter.format(
      valorResidual
    );
    document.querySelector("#r_numerosAnos").innerHTML = numerosAnos + " años";
    document.querySelector("#result_value_desktop").innerHTML =
      formatter.format(cuotaAmortizacion) + "/año";
    document.querySelector("#result_value_mobile").innerHTML =
      formatter.format(cuotaAmortizacion) + "/año";
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**
 * Calculadora de Factor de Decuento
 */
const showFactDescuento = () => {
  const form = document.querySelector("#form_fact_desc");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const tasaDescuento =
    Number(document.querySelector("#tasaDescuento").value) / 100;
  const tiempo = Number(document.querySelector("#tiempo").value);

  const factor = 1 / Math.pow(1 + tasaDescuento, tiempo);

  if (tasaDescuento && tiempo) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#result_value_mobile").innerHTML = factor.toFixed(
      4
    );
    document.querySelector("#result_value_desktop").innerHTML = factor.toFixed(
      4
    );
    document.querySelector("#r_interes").innerHTML = tasaDescuento * 100 + " %";
    document.querySelector("#r_tiempo").innerHTML = tiempo + " años";
  } else {
    document.querySelector("#result").style.display = "none";
  }
};

/**
 * Calculadora de Regla 72
 */
function showR72() {
  const form = document.querySelector("#form_72");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const card = document.getElementById("result");
  const rate = document.getElementById("annual_rate").value;

  var finance = new Finance();
  const period = finance.R72(rate);

  if (!rate) {
    card.style.display = "none";
  } else {
    card.style.display = "block";
    document.getElementById("r_rentab").innerHTML = rate + " %";
    document.getElementById("value").innerHTML = period.toFixed(2) + " años";
    document.getElementById("value_mobile").innerHTML =
      period.toFixed(2) + " años";
  }
}

const showR72_2 = () => {
  const form = document.querySelector("#form_72_second");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const anosDoblar = Number(document.getElementById("anosDoblar").value);

  const interes = 72 / anosDoblar;

  if (anosDoblar) {
    document.getElementById("result_second").style.display = "block";
    document.getElementById("r_años").innerHTML = anosDoblar + " años";
    document.getElementById("value_interes_mobile").innerHTML =
      interes.toFixed(2) + " %/año";
    document.getElementById("value_interes_desktop").innerHTML =
      interes.toFixed(2) + " %/año";
  } else {
    document.getElementById("result_second").style.display = "none";
  }
};

/**
 * Calculadora de CAGR
 */
function showCagr() {
  const form = document.querySelector("#form_cagr");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const beginning = document.querySelector("#beginning").value;
  const ending = document.querySelector("#ending").value;
  const periods = document.querySelector("#periods").value;

  var finance = new Finance();
  const cagr = finance.CAGR(beginning, ending, periods);

  if (cagr) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#r_inicial").innerHTML = formatter.format(
      beginning
    );
    document.querySelector("#r_finale").innerHTML = formatter.format(ending);
    document.querySelector("#r_numero").innerHTML = periods;
    document.getElementById("value").innerHTML = cagr + " %";
    document.getElementById("value_mobile").innerHTML = cagr + " %";
  }
}

/**
 * Calculadora del Valor Presente
 */
const showValorPresente = () => {
  const form = document.querySelector("#form_v_presente");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const tasaDescuento =
    Number(document.querySelector("#tasaDescuento").value) / 100;
  const flujos = Number(document.querySelector("#flujos").value);
  const anyos = Number(document.querySelector("#anyos").value);

  //var finance = new Finance();
  const denominador = 1 + tasaDescuento;
  const pow_denom = Math.pow(denominador, anyos);
  const PV = flujos / pow_denom;

  if (PV) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#result_value_mobile").innerHTML = formatter.format(
      PV
    );
    document.querySelector(
      "#result_value_desktop"
    ).innerHTML = formatter.format(PV);
    document.querySelector("#r_interes").innerHTML = tasaDescuento * 100 + " %";
    document.querySelector("#r_tiempo").innerHTML = formatter.format(flujos);
    document.querySelector("#r_anyos").innerHTML = anyos;
  } else {
    document.querySelector("#result").style.display = "none";
  }
};

/**
 * Calculadora Punto de Equilibrio
 */
function showSingle() {
  const form = document.querySelector("#form_equilibrio_unidad");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const cost = Number(document.querySelector("#cost").value);
  const singlePrice = Number(document.querySelector("#single_price").value);
  const singleVariablePost = Number(
    document.querySelector("#single_variable_cost").value
  );

  if (cost < 1 || singlePrice < 1 || singleVariablePost < 1) {
    document.querySelector("#single_result").style.display = "none";
    document.querySelector(".container_chart").style.display = "block";
  } else {
    const single_value = cost / (singleVariablePost - singlePrice);
    document.querySelector("#single_result").style.display = "block";
    document.querySelector(".container_chart").style.display = "block";

    document.getElementById("v_coste_fijo").innerHTML = formatter.format(cost);
    document.getElementById("v_precio_unitario").innerHTML = formatter.format(
      singlePrice
    );
    document.getElementById("v_coste_unitario").innerHTML = formatter.format(
      singleVariablePost
    );
    document.querySelector("#single_value_mobile").innerHTML =
      Math.round(single_value * 100) / 100 + " unidades";
    document.querySelector("#single_value_desktop").innerHTML =
      Math.round(single_value * 100) / 100 + " unidades";

    const arrUnits = [];
    const arrCost = [];
    const profit = singleVariablePost - singlePrice;
    const arrProfit = [];

    for (let i = 1; i <= single_value + 6; i++) {
      arrUnits.push(i);
      arrCost.push(cost);
      arrProfit.push(i * profit);
    }

    var ctxL = document.getElementById("lineChart").getContext("2d");
    var myChart = new Chart(ctxL, {
      type: "line",
      data: {
        labels: arrUnits,
        datasets: [
          {
            label: "# Coste Fijo",
            data: arrCost,
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "rgba(0, 0, 255, 0.7)",
            borderWidth: 1,
            order: 2,
            //yAxisID: 'first-y-axis',
            //xAxisID: 'first-x-axis'
          },
          {
            label: "# Ingreso Unidad",
            data: arrProfit,
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "rgba(207, 0, 15, 0.2)",
            // this dataset is drawn on top
            order: 3,
            //yAxisID: 'second-y-axis',
            //xAxisID: 'second-x-axis'
          },
          {
            label: "# Punto de Equilibrio",
            data: [
              {
                x: single_value,
                y: cost,
              },
            ],
            order: 1,
            backgroundColor: "rgba(255, 0, 0, 1)",
            borderColor: "rgba(255, 0, 0, 1)",
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Costes Fijos",
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Unidades",
              },
            },
          ],
        },
      },
    });
  }
}

function showValues() {
  const form = document.querySelector("#form_equilibrio_valores");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const costs = Number(document.querySelector("#cost_values").value);
  const sell = Number(document.querySelector("#total_sell").value);
  const total = Number(document.querySelector("#total_variable_cost").value);

  if (costs < 1 || sell < 1 || total < 1) {
    document.querySelector("#values_result").style.display = "none";
    document.querySelector(".container_chart_values").style.display = "none";
  } else {
    const output_values = costs / (1 - Math.round((total / sell) * 100) / 100);
    document.querySelector("#values_result").style.display = "block";
    document.querySelector(".container_chart_values").style.display = "block";

    document.getElementById("v_coste_fijo_values").innerHTML = formatter.format(
      costs
    );
    document.getElementById("v_coste_variable").innerHTML = formatter.format(
      total
    );
    document.getElementById("v_ingresos").innerHTML = formatter.format(sell);
    document.querySelector("#total_value_desktop").innerHTML = formatter.format(
      output_values
    ); //Math.round(output_values * 100) / 100;
    document.querySelector("#total_value_mobile").innerHTML = formatter.format(
      output_values
    ); //Math.round(output_values * 100) / 100;

    const arrCost = [];
    const arrProfit = [];
    const arrValues = [];

    for (let i = 0; i <= costs * 1.5; i++) {
      arrCost.push(costs);
      arrValues.push(i / (1 - Math.round((total / sell) * 100) / 100));
      arrProfit.push((costs * arrValues[i]) / output_values);
    }

    var ctxL = document.getElementById("lineChart_values").getContext("2d");
    var myChart = new Chart(ctxL, {
      type: "line",
      data: {
        labels: arrValues,
        datasets: [
          {
            label: "# Coste Fijo",
            data: arrCost,
            pointRadius: 0,
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "rgba(0, 0, 255, 0.7)",
            borderWidth: 1,
            order: 2,
            //yAxisID: 'first-y-axis',
            xAxisID: "first-x-axis",
          },
          {
            label: "# Ingreso Unidad",
            data: arrProfit,
            pointRadius: 0,
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "rgba(207, 0, 15, 0.2)",
            // this dataset is drawn on top
            order: 3,
            //yAxisID: 'second-y-axis',
            xAxisID: "second-x-axis",
          },
          {
            label: "# Punto de Equilibrio",
            data: [
              {
                x: output_values,
                y: costs,
              },
            ],
            order: 1,
            backgroundColor: "rgba(255, 0, 0, 1)",
            borderColor: "rgba(255, 0, 0, 1)",
            //yAxisID: 'third-y-axis',
            xAxisID: "third-x-axis",
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Costes",
              },
              ticks: {
                callback: function (value, index, values) {
                  return formatter.format(value);
                },
                stepSize: costs / 6,
              },
            },
          ],
          xAxes: [
            {
              display: false,
              id: "first-x-axis",
              scaleLabel: {
                display: false,
                labelString: "Unidades",
              },
            },
            {
              id: "second-x-axis",
              scaleLabel: {
                display: true,
                labelString: "Valores",
              },
              ticks: {
                callback: function (value, index, values) {
                  return formatter.format(value);
                },
                stepSize: output_values / 8,
              },
            },
            {
              id: "third-x-axis",
              display: false,
            },
          ],
        },
      },
    });
  }
}

const showMargin = () => {
  const form = document.querySelector("#form_equilibrio_margen");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const costesFijosTotales = Number(
    document.querySelector("#costesFijosTotales").value
  );
  const precioVenta = Number(document.querySelector("#precioVenta").value);
  const costoVariable = Number(document.querySelector("#costoVariable").value);

  const porMargenBruto = (precioVenta - costoVariable) / precioVenta;
  const PEM = costesFijosTotales / porMargenBruto;

  if (costesFijosTotales && precioVenta && costoVariable) {
    document.querySelector("#result_third").style.display = "block";
    document.querySelector("#margin_value_mobile").innerHTML =
      PEM + " unidades";
    document.querySelector("#margin_value_desktop").innerHTML =
      PEM + " unidades";
    document.querySelector("#v_coste_fijo_margen").innerHTML = formatter.format(
      costesFijosTotales
    );
    document.querySelector("#v_porc_margen").innerHTML =
      (porMargenBruto * 100).toFixed(2) + " %";
    document.querySelector(".container_chart_porcent").style.display = "block";

    const arrCost = [];
    const arrProfit = [];
    const arrPEM = [];

    for (let i = 0; i <= costesFijosTotales * 1.5; i++) {
      arrCost.push(costesFijosTotales);
      //arrValues.push(i / (1 - (Math.round((total / sell) * 100) / 100)));
      arrPEM.push(i / porMargenBruto);
      arrProfit.push((costesFijosTotales * (i / porMargenBruto)) / PEM);
    }

    var ctxL = document.getElementById("lineChart_porcent").getContext("2d");
    var myChart = new Chart(ctxL, {
      type: "line",
      data: {
        labels: arrPEM,
        datasets: [
          {
            label: "# Coste Fijo",
            data: arrCost,
            pointRadius: 0,
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "rgba(0, 0, 255, 0.7)",
            borderWidth: 1,
            order: 2,
            //yAxisID: 'first-y-axis',
            xAxisID: "first-x-axis",
          },
          {
            label: "# Ingreso Unidad",
            data: arrProfit,
            pointRadius: 0,
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "rgba(207, 0, 15, 0.2)",
            // this dataset is drawn on top
            order: 3,
            //yAxisID: 'second-y-axis',
            xAxisID: "second-x-axis",
          },
          {
            label: "# Punto de Equilibrio",
            data: [
              {
                x: PEM,
                y: costesFijosTotales,
              },
            ],
            order: 1,
            backgroundColor: "rgba(255, 0, 0, 1)",
            borderColor: "rgba(255, 0, 0, 1)",
            //yAxisID: 'third-y-axis',
            xAxisID: "third-x-axis",
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Costes",
              },
              ticks: {
                callback: function (value, index, values) {
                  return formatter.format(value);
                },
                stepSize: costesFijosTotales / 6,
              },
            },
          ],
          xAxes: [
            {
              id: "first-x-axis",
              scaleLabel: {
                display: true,
                labelString: "Unidades",
              },
            },
            {
              display: false,
              id: "second-x-axis",
              scaleLabel: {
                display: false,
                labelString: "Valores",
              },
              ticks: {
                stepSize: PEM / 6,
              },
            },
            {
              id: "third-x-axis",
              display: false,
            },
          ],
        },
      },
    });
  } else {
    document.querySelector("#result_third").style.display = "none";
    document.querySelector(".container_chart_porcent").style.display = "none";
  }
};

/**
 * Calculadora de Interés Compuesto
 */
function showCompoundings() {
  const form = document.querySelector("#form_compuesto");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const card = document.getElementById("result");
  const rate = document.getElementById("rate").value;
  const compoundings = document.getElementById("compoundings").value;
  const principal = document.getElementById("principal").value;
  const periods = document.getElementById("periods").value;

  var finance = new Finance();
  const ci = finance.CI(rate, compoundings, principal, periods);

  if (!ci) {
    card.style.display = "none";
  } else {
    card.style.display = "block";
    document.querySelector("#r_interes").innerHTML = rate + " %";
    document.querySelector("#r_compuesto").innerHTML = compoundings + " al año";
    document.querySelector("#r_candidad").innerHTML = formatter.format(
      principal
    );
    document.querySelector("#r_tiempo").innerHTML = periods + " años";
    document.getElementById("value_mobile").innerHTML = formatter.format(ci);
    document.getElementById("value").innerHTML = formatter.format(ci);
  }
}

/**
 * Calculadora del Valor Futuro
 */
const showValorFuturo = () => {
  const form = document.querySelector("#form_v_futuro");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const valorPresente = Number(document.querySelector("#valorPresente").value);
  const tasaInteres = Number(document.querySelector("#tasaInteres").value);
  const numeroAños = Number(document.querySelector("#numeroAños").value);

  var finance = new Finance();
  const FV = finance.FV(tasaInteres, valorPresente, numeroAños);

  const arrFV = [];
  const arrYear = [];
  const arrBackgroundColor = [];
  for (var i = 0; i <= numeroAños; i++) {
    arrFV.push(finance.FV(tasaInteres, valorPresente, i));
    arrYear.push("Año " + i);
    const o = Math.round,
      r = Math.random,
      s = 255;
    arrBackgroundColor.push(
      "rgba(" +
        o(r() * s) +
        "," +
        o(r() * s) +
        "," +
        o(r() * s) +
        "," +
        0.2 +
        ")"
    );
  }
  var resta = FV - valorPresente;
  if (FV) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#result_value_mobile").innerHTML =
      formatter.format(FV) + " (+" + resta + "$)";
    document.querySelector("#result_value_desktop").innerHTML =
      formatter.format(FV) + " (+" + resta + "$)";
    document.querySelector("#r_interes").innerHTML = tasaInteres + " %";
    document.querySelector("#r_presente").innerHTML = formatter.format(
      valorPresente
    );

    var ctxL = document.getElementById("lineChart").getContext("2d");
    var myChart = new Chart(ctxL, {
      type: "bar",
      data: {
        labels: arrYear,
        datasets: [
          {
            label: "# Valor Futuro",
            data: arrFV,
            backgroundColor: arrBackgroundColor,
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  } else {
    document.querySelector("#result").style.display = "none";
  }
};

/**
 * Calculadora de Vacaciones
 */
const showVacaciones = () => {
  const form = document.querySelector("#form_vacaciones");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const diasDeVacas = Number(document.querySelector("#diasDeVacas").value);
  const mesesTrabajo = Number(document.querySelector("#mesesTrabajo").value);
  const diasPorMes = diasDeVacas / 12;
  const numeroDias = mesesTrabajo * diasPorMes;

  if (diasDeVacas && mesesTrabajo < 13 && mesesTrabajo > 0) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#result_value_mobile").innerHTML =
      numeroDias.toFixed(0) + " días de vacaciones";
    document.querySelector("#result_value_desktop").innerHTML =
      numeroDias.toFixed(0) + " días de vacaciones";
    document.querySelector("#r_porMes").innerHTML =
      diasPorMes.toFixed(1) + " días de vacaciones por mes";
  } else {
    document.querySelector("#result").style.display = "none";
  }
};

/**
 * Calculadora de Préstamo Personal
 */
const showInteresPrestamo = () => {
  const form = document.querySelector("#form_interes_prestamo");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const cantidad = Number(document.querySelector("#importePrestamo").value);
  const tipo =
    Number(document.querySelector("#tipoInteres").value) / (100 * 12); //  multiplicamos por 100, para disolver el %, y por 12, para tener valor mensual
  const tiempo = Number(document.querySelector("#numeroAños").value) * 1 * 12; // multiplicamos por 12 para devolver valor mensual

  function valor(cantidad, tipo, tiempo) {
    const potencia = 1 + tipo;
    const xxx = Math.pow(potencia, -tiempo); //  funcion matematica donde la base es la potencia y el exponente el tiempo

    const xxx1 = cantidad * tipo;
    let equivalencia = xxx1 / (1 - xxx);

    equivalencia = Math.round(equivalencia); //  limitamos el número de decimales a cero
    return equivalencia;
  }
  var equivalencia;
  equivalencia = valor(cantidad, tipo, tiempo); // la valor depende de la cantidad, el tipo de interes y el tiempo solicitado

  if (equivalencia) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#r_importe").innerHTML = formatter.format(cantidad);
    document.querySelector("#r_interes").innerHTML =
      document.querySelector("#tipoInteres").value + " %";
    document.querySelector("#result_value_mobile").innerHTML = formatter.format(
      equivalencia
    );
    document.querySelector(
      "#result_value_desktop"
    ).innerHTML = formatter.format(equivalencia);
  } else {
    document.querySelector("#result").style.display = "none";
  }
};

/**
 * Calculadora de Préstamo Personal
 */
const showJornadaLaboral = () => {
  const form = document.querySelector("#form_jornada_laboral");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const diasAnyoTotal = Number(document.querySelector("#diasAnyoTotal").value);
  const numeroDiasFinde = Number(
    document.querySelector("#numeroDiasFinde").value
  );
  const diasFestivos = Number(document.querySelector("#diasFestivos").value);
  const diasVacaciones = Number(
    document.querySelector("#diasVacaciones").value
  );
  const horasDiarias = Number(document.querySelector("#horasDiarias").value);

  const diasNoLab = numeroDiasFinde + diasFestivos + diasVacaciones;
  const diasLab = diasAnyoTotal - diasNoLab;
  const horasAnual = diasLab * horasDiarias;

  if (diasAnyoTotal && horasDiarias) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#r_noLab").innerHTML = diasNoLab + " días";
    document.querySelector("#r_lab").innerHTML = diasLab + " días";
    document.querySelector("#result_value_mobile").innerHTML =
      horasAnual + " horas";
    document.querySelector("#result_value_desktop").innerHTML =
      horasAnual + " horas";

    //ChartJS
    var ctxL = document.getElementById("lineChart").getContext("2d");
    var myChart = new Chart(ctxL, {
      type: "pie",
      data: {
        labels: ["Días Laboral", "Días no Laboral"],
        datasets: [
          {
            label: "# Valor Futuro",
            data: [diasLab, diasNoLab],
            backgroundColor: [
              "rgba(169, 61, 94, 0.2)",
              "rgba(20, 72, 117, 0.2)",
            ],
            borderWidth: 2,
          },
        ],
      },
    });
  } else {
    document.querySelector("#result").style.display = "none";
  }
};

/**
 * Calculadora de Payback
 */
const addFlows = () => {
  const anyosFlujos = Number(document.querySelector("#anyosFlujos").value);

  let arrInputFlujos = "";
  for (let i = 1; i <= anyosFlujos; i++) {
    arrInputFlujos +=
      '<div class="input-group mb-4">' +
      '<input type="number" class="form-control" id="flujo' +
      i +
      '" placeholder="Valor del flujos de caja del año ' +
      i +
      '" required>' +
      '<div class="input-group-append">' +
      '<span class="input-group-text">$</span>' +
      '<span class="input-group-text">0,00</span>' +
      "</div>" +
      '<div class="invalid-feedback">Por favor, introduce la cantidad de ingresos del año ' +
      i +
      "</div>" +
      "</div>";
  }

  document.querySelector("#periodos").innerHTML = arrInputFlujos;
};

function showPayback() {
  const form = document.querySelector("#payback_card");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const inversion = Number(document.getElementById("inversion").value);
  const anyosFlujos = Number(document.querySelector("#anyosFlujos").value);

  let flowCash = 0;
  let arrYear = [];
  arrYear.push(0);
  let arrPayBack = [];
  arrPayBack.push(-inversion);
  let arrBackgroundColor = [];
  for (let i = 1; i <= anyosFlujos; i++) {
    flowCash += Number(document.querySelector("#flujo" + i).value);
    arrYear.push(i);
    arrPayBack[i] = Number(document.querySelector("#flujo" + i).value);
    const o = Math.round,
      r = Math.random,
      s = 255;
    arrBackgroundColor.push(
      "rgba(" +
        o(r() * s) +
        "," +
        o(r() * s) +
        "," +
        o(r() * s) +
        "," +
        0.2 +
        ")"
    );
  }

  const flujoPromedio = (flowCash / anyosFlujos).toFixed(2);
  let result = (inversion / flujoPromedio).toFixed(2);

  if (result) {
    document.getElementById("result").style.display = "block";
    document.querySelector(".container_chart").style.display = "block";
    document.querySelector("#result_inversion").innerHTML = formatter.format(
      inversion
    );
    document.querySelector("#result_ingresos").innerHTML = formatter.format(
      flowCash
    );
    document.querySelector("#result_collapse_desktop").innerHTML =
      result + " años";
    document.querySelector("#result_collapse_mobile").innerHTML =
      result + " años";

    var ctxL = document.getElementById("lineChart").getContext("2d");
    var myChart = new Chart(ctxL, {
      type: "bar",
      data: {
        labels: arrYear,
        datasets: [
          {
            label: "# Flujos",
            data: arrPayBack,
            backgroundColor: arrBackgroundColor,
            borderWidth: 2,
            order: 1,
            yAxisID: "first-y-axis",
            xAxisID: "first-x-axis",
          },
          {
            label: "# Payback",
            data: [
              {
                x: 0.5,
                y: -inversion,
              },
              {
                x: result,
                y: 0.5,
              },
              {
                x: anyosFlujos + 1,
                y: flowCash,
              },
            ],
            backgroundColor: "rgba(207, 0, 15, 0.2)",
            type: "line",
            // this dataset is drawn on top
            order: 2,
            yAxisID: "second-y-axis",
            xAxisID: "second-x-axis",
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              id: "first-y-axis",
              ticks: {
                beginAtZero: true,
                max: flowCash,
                min: -inversion,
              },
              scaleLabel: {
                display: true,
                labelString: "Cantidad",
              },
            },
            {
              id: "second-y-axis",
              display: false,
              ticks: {
                beginAtZero: true,
                max: flowCash,
                min: -inversion,
              },
            },
          ],
          xAxes: [
            {
              id: "first-x-axis",
              scaleLabel: {
                display: true,
                labelString: "Año",
              },
              ticks: {
                max: anyosFlujos + 1,
              },
            },
            {
              id: "second-x-axis",
              display: false,
              type: "linear",
              ticks: {
                min: 0,
                max: anyosFlujos + 1,
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
  } else {
    document.getElementById("result").style.display = "none";
    document.querySelector(".container_chart").style.display = "none";
  }
}

/**
 * Calculadoras de las retenciones
 */
const showRetenciones = () => {
  const form = document.querySelector("#retenciones_card");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const salarioBruto = Number(document.querySelector("#salarioBruto").value);
  const ingresoIRPF = Number(document.querySelector("#ingresoIRPF").value);
  const ingresoSS = Number(document.querySelector("#ingresoSS").value);

  const totalBruto = salarioBruto + ingresoIRPF + ingresoSS;
  const rtosTrabajo = 2000;
  let seguridadSocial = 0;

  if (totalBruto + ingresoSS < 12 * 3751.2) {
    if (totalBruto + ingresoSS > 12 * 1199.1) {
      seguridadSocial = 0.0635 * (totalBruto + ingresoSS);
    } else {
      seguridadSocial = 0.0635 * 12 * 1199.1;
    }
  } else {
    seguridadSocial = 0.0635 * 12 * 3751.2;
  }

  const totalDeducciones = rtosTrabajo + seguridadSocial;
  const baseIRPF = totalBruto - totalDeducciones;

  const tablaTramos = [0, 12450, 20200, 35200, 60000];
  const ratioRetencion = [0.095, 0.12, 0.15, 0.185, 0.225];

  let retencion = 0;
  let retencionBruto = 0;
  for (let i = 0; i < tablaTramos.length; i++) {
    const list0 = baseIRPF - tablaTramos[i] < 0 ? 0 : baseIRPF - tablaTramos[i];
    const list1 =
      baseIRPF - tablaTramos[i + 1] < 0 ? 0 : baseIRPF - tablaTramos[i + 1];

    if (list1) {
      retencionBruto = list0 - list1;
    } else {
      retencionBruto = list0;
    }

    const retencionSingle = retencionBruto * ratioRetencion[i];

    retencion += retencionSingle;
  }

  const retencionIRPF = retencion * 2 - 721.05 * 2;
  let tipoRetencion = 0;

  if (retencionIRPF > 0) {
    tipoRetencion = ((retencionIRPF / totalBruto) * 100).toFixed(2);
  }

  if (salarioBruto) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#result_value_mobile").innerHTML = formatter.format(
      retencionIRPF
    );
    document.querySelector(
      "#result_value_desktop"
    ).innerHTML = formatter.format(retencionIRPF);
    document.querySelector("#result_inversion").innerHTML =
      tipoRetencion + " %";
  } else {
    document.querySelector("#result").style.display = "none";
  }
};

/**Calculadora de Salario Neto para autónomos */
const showSalarioAutonomo = () => {
  const form = document.querySelector("#salario_autonomo_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const sueldoNeto = Number(document.querySelector("#sueldoNeto").value);
  const irpf = Number(document.querySelector("#irpf").value);
  const gastos = Number(document.querySelector("#gastos").value);

  const calculoIRPF = sueldoNeto / (1 - irpf / 100);
  const cuotaSS = 283.32;
  const calculoSS = calculoIRPF + cuotaSS;
  const calculoGastos = calculoSS + gastos;

  const iva = calculoGastos / (1 - 0.21);
  const ivaGastos = gastos * 0.21;
  const facturacionMensual = iva - ivaGastos;

  if (facturacionMensual) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#result_value_mobile").innerHTML = formatter.format(
      facturacionMensual
    );
    document.querySelector(
      "#result_value_desktop"
    ).innerHTML = formatter.format(facturacionMensual);
    document.querySelector("#result_cuota").innerHTML = formatter.format(
      cuotaSS
    );
  } else {
    document.querySelector("#result").style.display = "none";
  }
};

/**Calculdaora de Conversión */
function showConvertion() {
  const form = document.querySelector("#form_conversion");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const card = document.getElementById("result");
  const total = document.getElementById("total").value;
  const users = document.getElementById("users").value;

  if (total < 1 || users < 1) {
    card.style.display = "none";
  } else {
    card.style.display = "block";
    document.getElementById("result_realizada").innerHTML = total;
    document.getElementById("result_visitantes").innerHTML = users;

    const result = Math.round((total / users) * 100 * 10) / 10;
    document.getElementById("value_desktop").innerHTML = result + " %";
    document.getElementById("value_mobile").innerHTML = result + " %";
  }
}

/**Calculdaora de Liquidez */
function showLiquidez() {
  const form = document.querySelector("#liquidez_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const activo = Number(document.querySelector("#activo").value);
  const pasivo = Number(document.querySelector("#pasivo").value);

  const ratio = (activo / pasivo).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " %";
    document.getElementById("result_value_desktop").innerHTML = ratio + " %";
    document.querySelector("#result_activo").innerHTML = formatter.format(
      activo
    );
    document.querySelector("#result_pasivo").innerHTML = formatter.format(
      pasivo
    );
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Solvencia */
function showSolvencia() {
  const form = document.querySelector("#solvencia_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const activo = Number(document.querySelector("#activo").value);
  const pasivo = Number(document.querySelector("#pasivo").value);

  const ratio = (activo / pasivo).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " %";
    document.getElementById("result_value_desktop").innerHTML = ratio + " %";
    document.querySelector("#result_activo").innerHTML = formatter.format(
      activo
    );
    document.querySelector("#result_pasivo").innerHTML = formatter.format(
      pasivo
    );
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Tesoreria */
function showTesoreria() {
  const form = document.querySelector("#tesoreria_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const disponible = Number(document.querySelector("#disponible").value);
  const realizable = Number(document.querySelector("#realizable").value);
  const pcorriente = Number(document.querySelector("#pcorriente").value);

  const ratio = (disponible + realizable) / pcorriente.toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " %";
    document.getElementById("result_value_desktop").innerHTML = ratio + " %";
    document.querySelector("#result_disponible").innerHTML = formatter.format(
      disponible
    );
    document.querySelector("#result_realizable").innerHTML = formatter.format(
      realizable
    );
    document.querySelector("#result_pcorriente").innerHTML = formatter.format(
      pcorriente
    );
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Periodo Medio de Cobro */
function showPeriodoMedioCobro() {
  const form = document.querySelector("#pm_cobro_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const sm_clientes = Number(document.querySelector("#sm_clientes").value);
  const ventas = Number(document.querySelector("#ventas").value);
  const anyo = 365;

  const ratio = (sm_clientes / ventas) * anyo.toFixed(2);

  if (sm_clientes && ventas) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      ratio.toFixed(2) + " días";
    document.getElementById("result_value_desktop").innerHTML =
      ratio.toFixed(2) + " días";
    document.querySelector("#result_smClientes").innerHTML = formatter.format(
      sm_clientes
    );
    document.querySelector("#result_ventas").innerHTML = formatter.format(
      ventas
    );
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Periodo Medio de Pago */
function showPeriodoMedioPago() {
  const form = document.querySelector("#pm_pago_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const sm_proveedores = Number(
    document.querySelector("#sm_proveedores").value
  );
  const compras = Number(document.querySelector("#compras").value);
  const anyo = 365;

  const ratio = (sm_proveedores / compras) * anyo.toFixed(2);

  if (sm_proveedores && compras) {
    document.querySelector("#result_bis").style.display = "block";
    document.getElementById("result_value_mobile_bis").innerHTML =
      ratio.toFixed(2) + " días";
    document.getElementById("result_value_desktop_bis").innerHTML =
      ratio.toFixed(2) + " días";
    document.querySelector(
      "#result_smProveedores"
    ).innerHTML = formatter.format(sm_proveedores);
    document.querySelector("#result_compras").innerHTML = formatter.format(
      compras
    );
  } else {
    document.querySelector("#result_bis").style.display = "none";
  }
}

/**Calculdaora de Coste por Clic */
function showCosteClic() {
  const form = document.querySelector("#coste_clic_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const costes = Number(document.querySelector("#costes").value);
  const clics = Number(document.querySelector("#clics").value);

  const ratio = costes / clics.toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      ratio.toFixed(2) + " $";
    document.getElementById("result_value_desktop").innerHTML =
      ratio.toFixed(2) + " $";
    document.querySelector("#result_costes").innerHTML = formatter.format(
      costes
    );
    document.querySelector(
      "#result_clics"
    ).innerHTML = Intl.NumberFormat().format(clics);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Coste por Descarga */
function showCosteDescarga() {
  const form = document.querySelector("#coste_descarga_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const costes = Number(document.querySelector("#costes").value);
  const descargas = Number(document.querySelector("#descargas").value);

  const ratio = costes / descargas.toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      ratio.toFixed(2) + " $";
    document.getElementById("result_value_desktop").innerHTML =
      ratio.toFixed(2) + " $";
    document.querySelector("#result_costes").innerHTML = formatter.format(
      costes
    );
    document.querySelector(
      "#result_descargas"
    ).innerHTML = Intl.NumberFormat().format(descargas);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Coste por Adquisición */
function showCosteAdquisicion() {
  const form = document.querySelector("#coste_adquisicion_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const costes = Number(document.querySelector("#costes").value);
  const conversiones = Number(document.querySelector("#conversiones").value);

  const ratio = costes / conversiones.toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      ratio.toFixed(2) + " $";
    document.getElementById("result_value_desktop").innerHTML =
      ratio.toFixed(2) + " $";
    document.querySelector("#result_costes").innerHTML = formatter.format(
      costes
    );
    document.querySelector(
      "#result_conversiones"
    ).innerHTML = Intl.NumberFormat().format(conversiones);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Ingreso Anual Recurrente */
function showIngresoAnual() {
  const form = document.querySelector("#ingreso_anual_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const suscripciones = Number(document.querySelector("#suscripciones").value);
  const ingresos = Number(document.querySelector("#ingresos").value);
  const cancelaciones = Number(document.querySelector("#cancelaciones").value);

  const ratio = suscripciones + ingresos - cancelaciones.toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      ratio.toFixed(2) + " $";
    document.getElementById("result_value_desktop").innerHTML =
      ratio.toFixed(2) + " $";
    document.querySelector(
      "#result_suscripciones"
    ).innerHTML = formatter.format(suscripciones);
    document.querySelector("#result_ingresos").innerHTML = formatter.format(
      ingresos
    );
    document.querySelector(
      "#result_cancelaciones"
    ).innerHTML = formatter.format(cancelaciones);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Tasa Abandono de Carritos */
function showTasaAbandono() {
  const form = document.querySelector("#tasa_abandono_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const ventas = Number(document.querySelector("#ventas").value);
  const numero_carritos = Number(
    document.querySelector("#numero_carritos").value
  );

  const tasa_ventas = 100 * (ventas / numero_carritos);
  const tasa_abandono = 100 - tasa_ventas.toFixed(2);

  if (tasa_abandono) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      tasa_abandono.toFixed(2) + " %";
    document.getElementById("result_value_desktop").innerHTML =
      tasa_abandono.toFixed(2) + " %";
    document.querySelector(
      "#result_ventas"
    ).innerHTML = Intl.NumberFormat().format(ventas);
    document.querySelector(
      "#result_numero_carritos"
    ).innerHTML = Intl.NumberFormat().format(numero_carritos);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Ratio de Rotación de Inventario */
function showRotacionInventario() {
  const form = document.querySelector("#rotacion_inventario_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const aprovisionamientos = Number(
    document.querySelector("#aprovisionamientos").value
  );
  const existencias = Number(document.querySelector("#existencias").value);

  const ratio = aprovisionamientos / existencias.toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      ratio.toFixed(2) + " veces";
    document.getElementById("result_value_desktop").innerHTML =
      ratio.toFixed(2) + " veces";
    document.querySelector(
      "#result_aprovisionamientos"
    ).innerHTML = Intl.NumberFormat().format(aprovisionamientos);
    document.querySelector(
      "#result_existencias"
    ).innerHTML = Intl.NumberFormat().format(existencias);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora Tasa de Conversion Test A/B */
function showTestAB() {
  const form = document.querySelector("#test_ab_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const visitas_a = Number(document.querySelector("#visitas_a").value);
  const conversiones_a = Number(
    document.querySelector("#conversiones_a").value
  );

  const visitas_b = Number(document.querySelector("#visitas_b").value);
  const conversiones_b = Number(
    document.querySelector("#conversiones_b").value
  );

  const ratio = 100 * (conversiones_a / visitas_a).toFixed(3);
  const ratio_b = 100 * (conversiones_b / visitas_b).toFixed(3);

  if (ratio && ratio_b) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      ratio.toFixed(1) + " %";
    document.getElementById("result_value_desktop").innerHTML =
      ratio.toFixed(1) + " %";
    document.querySelector(
      "#result_visitas_a"
    ).innerHTML = Intl.NumberFormat().format(visitas_a);
    document.querySelector(
      "#result_conversiones_a"
    ).innerHTML = Intl.NumberFormat().format(conversiones_a);

    document.getElementById("result_value_mobile_b").innerHTML =
      ratio_b.toFixed(1) + " %";
    document.getElementById("result_value_desktop_b").innerHTML =
      ratio_b.toFixed(1) + " %";
    document.querySelector(
      "#result_visitas_b"
    ).innerHTML = Intl.NumberFormat().format(visitas_b);
    document.querySelector(
      "#result_conversiones_b"
    ).innerHTML = Intl.NumberFormat().format(conversiones_b);
  } else {
    document.querySelector("#result").style.display = "none";
  }

  if (ratio > ratio_b) {
    document.getElementById("result_value_desktop").style.color = "green";
    document.getElementById("result_value_desktop").style.fontSize = "15px";
    document.getElementById("result_value_desktop").style.fontWeight = "700";
  } else {
    document.getElementById("result_value_desktop_b").style.color = "green";
    document.getElementById("result_value_desktop_b").style.fontSize = "15px";
    document.getElementById("result_value_desktop_b").style.fontWeight = "700";
  }
}

/**Calculdaora de Endeudamiento */
function showCalcEndeudamiento() {
  const form = document.querySelector("#calc_endeudamiento_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const deudas = Number(document.querySelector("#deudas").value);
  const pneto_pasivo = Number(document.querySelector("#pneto_pasivo").value);

  const ratio = (deudas / pneto_pasivo).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio;
    document.getElementById("result_value_desktop").innerHTML = ratio;
    document.querySelector("#result_deudas").innerHTML = formatter.format(
      deudas
    );
    document.querySelector("#result_pneto_pasivo").innerHTML = formatter.format(
      pneto_pasivo
    );
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Valor de Empresa (Contable) */
function showValorEmpresa() {
  const form = document.querySelector("#valor_empresa_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const cap_bursatil = Number(document.querySelector("#cap_bursatil").value);
  const deuda = Number(document.querySelector("#deuda").value);
  const ac_pref = Number(document.querySelector("#ac_pref").value);
  const tesoreria = Number(document.querySelector("#tesoreria").value);

  const ratio = (cap_bursatil + deuda + ac_pref - tesoreria).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = formatter.format(
      ratio
    );
    document.getElementById(
      "result_value_desktop"
    ).innerHTML = formatter.format(ratio);
    document.querySelector("#result_cap_bursatil").innerHTML = formatter.format(
      cap_bursatil
    );
    document.querySelector("#result_deuda").innerHTML = formatter.format(deuda);
    document.querySelector("#result_ac_pref").innerHTML = formatter.format(
      ac_pref
    );
    document.querySelector("#result_tesoreria").innerHTML = formatter.format(
      tesoreria
    );
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Valor de Empresa (PER) */
function showValorEmpresaPER() {
  const form = document.querySelector("#valor_empresa_per_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const precio = Number(document.querySelector("#precio").value);
  const beneficio = Number(document.querySelector("#beneficio").value);

  const ratio = (precio / beneficio).toFixed(2);

  if (precio && beneficio) {
    document.querySelector("#result_bis").style.display = "block";
    document.getElementById(
      "result_value_mobile_bis"
    ).innerHTML = Intl.NumberFormat().format(ratio);
    document.getElementById(
      "result_value_desktop_bis"
    ).innerHTML = Intl.NumberFormat().format(ratio);
    document.querySelector("#result_precio").innerHTML = formatter.format(
      precio
    );
    document.querySelector("#result_beneficio").innerHTML = formatter.format(
      beneficio
    );
  } else {
    document.querySelector("#result_bis").style.display = "none";
  }
}

/**Calculdaora de Coste de la Deuda */
function showCosteDeuda() {
  const form = document.querySelector("#coste_deuda_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const gastos = Number(document.querySelector("#gastos").value);
  const deuda = Number(document.querySelector("#deuda").value);

  const ratio = (gastos / deuda).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById(
      "result_value_mobile"
    ).innerHTML = Intl.NumberFormat().format(ratio);
    document.getElementById(
      "result_value_desktop"
    ).innerHTML = Intl.NumberFormat().format(ratio);
    document.querySelector("#result_gastos").innerHTML = formatter.format(
      gastos
    );
    document.querySelector("#result_deuda").innerHTML = formatter.format(deuda);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Calidad de la Deuda */
function showCalidadDeuda() {
  const form = document.querySelector("#calidad_deuda_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const pasivo = Number(document.querySelector("#pasivo").value);
  const total_pasivo = Number(document.querySelector("#total_pasivo").value);

  const ratio = (pasivo / total_pasivo).toFixed(3);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById(
      "result_value_mobile"
    ).innerHTML = Intl.NumberFormat().format(ratio);
    document.getElementById(
      "result_value_desktop"
    ).innerHTML = Intl.NumberFormat().format(ratio);
    document.querySelector("#result_pasivo").innerHTML = formatter.format(
      pasivo
    );
    document.querySelector("#result_total_pasivo").innerHTML = formatter.format(
      total_pasivo
    );
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Ciclo de Vida de un Cliente  (CLV)*/
function showVidaCliente() {
  const form = document.querySelector("#vida_cliente_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const ventas = Number(document.querySelector("#ventas").value);
  const productos = Number(document.querySelector("#productos").value);

  const recurrencia = Number(document.querySelector("#recurrencia").value);
  const vida = Number(document.querySelector("#vida").value);

  const margen = Number(document.querySelector("#margen").value) / 100;
  const tasa_dto = Number(document.querySelector("#tasa_dto").value) / 100;
  const tasa_reten = Number(document.querySelector("#tasa_reten").value) / 100;

  const tm = (ventas / productos).toFixed(2);
  const ltvSimple = (tm * recurrencia * vida).toFixed(2);
  const ltvMB = (ltvSimple * margen).toFixed(2);

  const denominador = (1 + tasa_dto - tasa_reten).toFixed(2);
  const ratio = ltvMB * (tasa_reten / denominador).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      Intl.NumberFormat().format(ratio) + " $";
    document.getElementById("result_value_desktop").innerHTML =
      Intl.NumberFormat().format(ratio) + " $";
    document.querySelector("#result_ventas").innerHTML = formatter.format(
      ventas
    );
    document.querySelector(
      "#result_productos"
    ).innerHTML = Intl.NumberFormat().format(productos);
    document.querySelector(
      "#result_recurrencia"
    ).innerHTML = Intl.NumberFormat().format(recurrencia);
    document.querySelector(
      "#result_vida"
    ).innerHTML = Intl.NumberFormat().format(vida);
    document.querySelector("#result_margen").innerHTML =
      Intl.NumberFormat().format(margen * 100) + " %";
    document.querySelector("#result_tasa_reten").innerHTML =
      Intl.NumberFormat().format(tasa_reten * 100) + " %";
    document.querySelector("#result_tasa_dto").innerHTML =
      Intl.NumberFormat().format(tasa_dto * 100) + " %";
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Tesoreria 
function showTesoreria() {
    const form = document.querySelector("#tesoreria_form");
    form.addEventListener("submit", function(event){
        event.preventDefault()
    });

    const disponible = Number(document.querySelector("#disponible").value);
    const realizable = Number(document.querySelector("#realizable").value);
    const pcorriente = Number(document.querySelector("#pcorriente").value);

    const ratio = (disponible+realizable)/pcorriente.toFixed(2);

    if(ratio){
        document.querySelector("#result").style.display = "block";
        document.getElementById("result_value_mobile").innerHTML = ratio+" %";
        document.getElementById("result_value_desktop").innerHTML = ratio+" %";
        document.querySelector("#result_disponible").innerHTML = formatter.format(disponible);
        document.querySelector("#result_realizable").innerHTML = formatter.format(realizable);
        document.querySelector("#result_pcorriente").innerHTML = formatter.format(pcorriente);
    } else {
        document.querySelector("#result").style.display = "none";
    }
}*/

/**Calculdaora de Cotización Autónomo */
function showCotizacionAutonomo() {
  const form = document.querySelector("#cotizacion_autonomo_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const base_cotizacion = Number(
    document.querySelector("#base_cotizacion").value
  );
  const edad = Number(document.querySelector("#edad").value);
  const genero = String(document.querySelector("#genero").value);
  const base_minima = 944.4;
  const base_maxima = 4070.1;
  //const otras_condiciones = Number(document.querySelector("#otras_condiciones").value);

  //Datos actualizados para 2020
  const per_cc = 0.283;
  const per_cp = 0.011;
  const per_ca = 0.008;
  const per_fc = 0.001;
  const dto = 0.2; //dto de 80% por lo que se multiplica por 0.2 para obtener cifra con dto

  const cc = base_cotizacion * per_cc;
  const cc_dto = cc * dto;
  const cp = base_cotizacion * per_cp;
  const ca = base_cotizacion * per_ca;
  const fc = base_cotizacion * per_fc;

  const cuota_dto = (cc_dto + cp + ca + fc).toFixed(3);
  const cuota_fija = 60;
  const cuota = (base_cotizacion * 0.303).toFixed(3);

  let autonomo = document.getElementById("autonomo").checked;
  let no_autonomo = document.getElementById("no_autonomo").checked;
  let no_autonomo2 = document.getElementById("no_autonomo2").checked;
  let no_autonomo3 = document.getElementById("no_autonomo3").checked;

  //Autonomo Normal
  if (autonomo) {
    let autonomo = document.getElementById("autonomo").value;
    console.log(autonomo);

    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      Intl.NumberFormat().format(cuota) + " $";
    document.getElementById("result_value_desktop").innerHTML =
      Intl.NumberFormat().format(cuota) + " $";
    document.querySelector("#result_estado").innerHTML = autonomo;
    document.querySelector(
      "#result_base_cotizacion"
    ).innerHTML = formatter.format(base_cotizacion);
    document.querySelector("#result_edad").innerHTML = edad;
    document.querySelector("#result_genero").innerHTML = genero;
  }
  //Nunca Autonomo -> Tarifa Plana
  else if (no_autonomo) {
    console.log(base_cotizacion);
    console.log(base_minima);

    console.log(document.getElementById("result_value_desktop").innerHTML);
    let nunca_autonomo = document.getElementById("no_autonomo").value;
    console.log(nunca_autonomo);

    if (base_cotizacion === base_minima) {
      document.getElementById("result_value_mobile").innerHTML =
        cuota_fija + " $";
      document.getElementById("result_value_desktop").innerHTML =
        cuota_fija + " $";
    } else {
      console.log(cuota);

      document.getElementById("result_value_mobile").innerHTML =
        Intl.NumberFormat().format(cuota_dto) + " $";
      document.getElementById("result_value_desktop").innerHTML =
        Intl.NumberFormat().format(cuota_dto) + " $";
    }

    document.querySelector("#result").style.display = "block";
    document.querySelector("#result_estado").innerHTML = nunca_autonomo;
    document.querySelector(
      "#result_base_cotizacion"
    ).innerHTML = formatter.format(base_cotizacion);
    document.querySelector("#result_edad").innerHTML = edad;
    document.querySelector("#result_genero").innerHTML = genero;
  }

  // No Autonomo SIN derecho a Tarifa Plana
  // Hace menos de dos años que me di de baja
  else if (no_autonomo3) {
    let no_autonomo_3 = document.getElementById("no_autonomo3").value;
    console.log(no_autonomo_3);

    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      Intl.NumberFormat().format(cuota) + " $";
    document.getElementById("result_value_desktop").innerHTML =
      Intl.NumberFormat().format(cuota) + " $";
    document.querySelector("#result_estado").innerHTML = no_autonomo_3;
    document.querySelector(
      "#result_base_cotizacion"
    ).innerHTML = formatter.format(base_cotizacion);
    document.querySelector("#result_edad").innerHTML = edad;
    document.querySelector("#result_genero").innerHTML = genero;
  }
  //No Autonomo CON derecho a Tarifa Plana
  //Hace mas de dos años que me di de baja
  else if (no_autonomo2) {
    let no_autonomo_2 = document.getElementById("no_autonomo2").value;
    console.log(no_autonomo_2);

    if (base_cotizacion === base_minima) {
      document.getElementById("result_value_mobile").innerHTML =
        cuota_fija + " $";
      document.getElementById("result_value_desktop").innerHTML =
        cuota_fija + " $";
    } else {
      console.log(cuota);

      document.getElementById("result_value_mobile").innerHTML =
        Intl.NumberFormat().format(cuota_dto) + " $";
      document.getElementById("result_value_desktop").innerHTML =
        Intl.NumberFormat().format(cuota_dto) + " $";
    }

    document.querySelector("#result").style.display = "block";
    document.querySelector("#result_estado").innerHTML = no_autonomo_2;
    document.querySelector(
      "#result_base_cotizacion"
    ).innerHTML = formatter.format(base_cotizacion);
    document.querySelector("#result_edad").innerHTML = edad;
    document.querySelector("#result_genero").innerHTML = genero;
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/*Calculadora Sueldo Neto*/
function showSalary() {
  const form = document.querySelector("#form_sueldo");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const card = document.querySelector("#result");
  const sueldo = document
    .querySelector("#sueldo")
    .value.toString()
    .replace(",", ".");
  const pagas = document.querySelector("#pagas").value;
  const contrato = document.querySelector("#contrato").value;
  const laboral = document.querySelector("#laboral").value;
  let hijos = document.querySelector("#hijos").value;
  const tipo = document.querySelector("#tipo").value;
  const horas = document.querySelector("#horas").value;
  let limite_a = "";
  let limite_b = "";
  let limite_c = "";

  if (hijos === "") {
    hijos = 0;
  }

  // LIMITE A
  if (hijos == 0 && tipo == 1) {
    limite_a = "";
  } else {
    if (hijos == 1 && tipo == 1) {
      limite_a = 10750;
    } else {
      if (hijos > 1 && tipo == 1) {
        limite_a = 12030;
      } else {
        limite_a = "";
      }
    }
  }
  // LIMITE B
  if (hijos == 0 && tipo == 2) {
    limite_b = 10600;
  } else {
    if (hijos == 1 && tipo == 2) {
      limite_b = 11825;
    } else {
      if (hijos > 1 && tipo == 2) {
        limite_b = 13135;
      } else {
        limite_b = "";
      }
    }
  }

  // LIMITE C

  if (hijos == 0 && tipo == 3) {
    limite_c = 7515;
  } else {
    if (hijos == 1 && tipo == 3) {
      limite_c = 8215;
    } else {
      if (hijos > 1 && tipo == 3) {
        limite_c = 8965;
      } else {
        limite_c = "";
      }
    }
  }

  let limite = limite_a + limite_b + limite_c;

  if (contrato == 0) {
    ss_mensual = sueldo * (0.0635 / 12);
  } else {
    ss_mensual = sueldo * (0.064 / 12);
  }

  if (hijos > 2) {
    e12 = 600;
  } else {
    e12 = 0;
  }
  if (laboral == 2) {
    e11 = 600;
  }
  if (laboral == 1) {
    e11 = 1200;
  }
  if (laboral == 0) {
    e11 = 0;
  }
  if (sueldo <= 8200) {
    e10 = 3500;
  } else {
    if (sueldo <= 13000) {
      e10 = 3500 - 0.2291 * (sueldo - 8200);
    } else {
      e10 = 2400;
    }
  }

  if ((hijos = "") || hijos == 0) {
    e9 = 3400;
  } else {
    if (hijos == 1) {
      e9 = 4800;
    } else {
      if (hijos == 2) {
        e9 = 4900;
      } else {
        if (hijos == 3) {
          e9 = 5600;
        } else {
          if (hijos > 3) {
            e9 = 5700;
          }
        }
      }
    }
  }

  let e13 = sueldo - e12 - e11 - e10 - e9;

  if (e13 < 4161.6) {
    cuota_retencion = 0.18 * e13;
  } else {
    if (e13 < 14357.52 && e13 >= 4161.6) {
      cuota_retencion = 624.24 + (e13 - 4161.6) * 0.24;
    } else {
      if (e13 < 26842.32 && e13 >= 14357.52) {
        cuota_retencion = 3071.26 + (e13 - 14357.52) * 0.28;
      } else {
        if (e13 < 46818 && e13 >= 26842.32) {
          cuota_retencion = 6567 + (e13 - 26842.32) * 0.37;
        } else {
          cuota_retencion = 13958 + (e13 - 46818) * 0.45;
        }
      }
    }
  }
  let tipo_retencion = (cuota_retencion / sueldo) * 100;

  if (limite == "") {
    irpf = 0;
  } else {
    if (sueldo < limite_a) {
      irpf = 0;
    } else {
      irpf = Math.round(tipo_retencion, 0);
    }
  }

  if (pagas > 12) {
    extra = ((1 - irpf / 100) * sueldo) / pagas;
  } else {
    extra = "";
  }

  let neto = ((1 - irpf / 100) * sueldo) / pagas - ss_mensual;

  let neto_hora_anual = (1 - irpf / 100) * sueldo - ss_mensual;
  let horas_totales = horas * 52;
  let neto_hora = neto_hora_anual / horas_totales;
  let bruto_hora = sueldo / horas_totales;

  console.log(horas_totales);
  //console.log(pagas);
  console.log(neto_hora_anual);

  document.querySelector("#irpf").innerHTML = formatCurrency(irpf, 2) + " %";
  document.querySelector("#extra").innerHTML = formatCurrency(extra, 2) + " $";
  document.querySelector("#neto").innerHTML = formatCurrency(neto, 2) + " $";
  document.querySelector("#neto_hora").innerHTML =
    formatCurrency(neto_hora, 2) + " $";
  document.querySelector("#irpf_mobile").innerHTML =
    formatCurrency(irpf, 2) + " %";
  document.querySelector("#extra_mobile").innerHTML =
    formatCurrency(extra, 2) + " $";
  document.querySelector("#neto_mobile").innerHTML =
    formatCurrency(neto, 2) + " $";
  //document.querySelector("#bruto_hora").innerHTML = formatCurrency(bruto_hora, 2) + " $";

  card.style.display = "block";
}

function formatCurrency(num, precision) {
  num = num.toString().replace(/\ |\,/g, "");
  if (isNaN(num)) num = "0";
  cents = Math.floor((num * 100 + 0.5) % 100);
  num = Math.floor((num * 100 + 0.5) / 100).toString();
  if (cents < 10) cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      "." +
      num.substring(num.length - (4 * i + 3));
  if (precision > 0) {
    return " " + num + "," + cents;
  } else if (precision == 0) {
    return " " + num;
  }
}

function LP_data() {
  var key = window.event.keyCode; //codigo de tecla.

  if (key != 44 && key != 46) {
    if (key < 48 || key > 57) {
      //si no es numero
      window.event.keyCode = 0; //anula la entrada de texto.
    }
  }
}

/**Calculdaora de Horas Extra */
function showHorasExtra() {
  const form = document.querySelector("#hora_extra_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const max_anual = Number(document.querySelector("#max_anual").value);
  const horas_dia = Number(document.querySelector("#horas_dia").value);
  const dias_sem = Number(document.querySelector("#dias_sem").value);
  const dias_vac = Number(document.querySelector("#dias_vac").value);

  const sem = 52;
  const fest = 14;

  console.log(sem);
  console.log(fest);

  const dias_totales_brutos = dias_sem * sem;
  //Se suma 1 para calcularlo en base a dias anuales totales (365)
  const dias_totales_netos = dias_totales_brutos - fest - dias_vac + 1;
  const horas_totales = dias_totales_netos * horas_dia;
  const horas_extras = horas_totales - max_anual;

  console.log(dias_totales_netos);
  console.log(horas_extras);

  //const horas_extras = (base_cotizacion*0.3).toFixed(3);

  if (horas_extras) {
    document.querySelector("#result").style.display = "block";
    document.getElementById(
      "result_value_mobile"
    ).innerHTML = Intl.NumberFormat().format(horas_extras);
    document.getElementById(
      "result_value_desktop"
    ).innerHTML = Intl.NumberFormat().format(horas_extras);
    document.querySelector(
      "#result_max_anual"
    ).innerHTML = Intl.NumberFormat().format(max_anual);
    document.querySelector("#result_horas_dia").innerHTML = horas_dia;
    document.querySelector("#result_dias_sem").innerHTML = dias_sem;
    document.querySelector("#result_dias_vac").innerHTML = dias_vac;
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/*Calculadora Precio Hora*/
function showPrecioHora() {
  const form = document.querySelector("#precio_hora_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const card = document.querySelector("#result");
  const sueldo = document
    .querySelector("#sueldo")
    .value.toString()
    .replace(",", ".");
  const contrato = document.querySelector("#contrato").value;
  const laboral = document.querySelector("#laboral").value;
  let hijos = document.querySelector("#hijos").value;
  const tipo = document.querySelector("#tipo").value;
  const horas = document.querySelector("#horas").value;
  let limite_a = "";
  let limite_b = "";
  let limite_c = "";

  if (hijos === "") {
    hijos = 0;
  }

  // LIMITE A
  if (hijos == 0 && tipo == 1) {
    limite_a = "";
  } else {
    if (hijos == 1 && tipo == 1) {
      limite_a = 10750;
    } else {
      if (hijos > 1 && tipo == 1) {
        limite_a = 12030;
      } else {
        limite_a = "";
      }
    }
  }
  // LIMITE B
  if (hijos == 0 && tipo == 2) {
    limite_b = 10600;
  } else {
    if (hijos == 1 && tipo == 2) {
      limite_b = 11825;
    } else {
      if (hijos > 1 && tipo == 2) {
        limite_b = 13135;
      } else {
        limite_b = "";
      }
    }
  }

  // LIMITE C

  if (hijos == 0 && tipo == 3) {
    limite_c = 7515;
  } else {
    if (hijos == 1 && tipo == 3) {
      limite_c = 8215;
    } else {
      if (hijos > 1 && tipo == 3) {
        limite_c = 8965;
      } else {
        limite_c = "";
      }
    }
  }

  let limite = limite_a + limite_b + limite_c;

  if (contrato == 0) {
    ss_mensual = sueldo * (0.0635 / 12);
  } else {
    ss_mensual = sueldo * (0.064 / 12);
  }

  if (hijos > 2) {
    e12 = 600;
  } else {
    e12 = 0;
  }
  if (laboral == 2) {
    e11 = 600;
  }
  if (laboral == 1) {
    e11 = 1200;
  }
  if (laboral == 0) {
    e11 = 0;
  }
  if (sueldo <= 8200) {
    e10 = 3500;
  } else {
    if (sueldo <= 13000) {
      e10 = 3500 - 0.2291 * (sueldo - 8200);
    } else {
      e10 = 2400;
    }
  }

  if ((hijos = "") || hijos == 0) {
    e9 = 3400;
  } else {
    if (hijos == 1) {
      e9 = 4800;
    } else {
      if (hijos == 2) {
        e9 = 4900;
      } else {
        if (hijos == 3) {
          e9 = 5600;
        } else {
          if (hijos > 3) {
            e9 = 5700;
          }
        }
      }
    }
  }

  let e13 = sueldo - e12 - e11 - e10 - e9;

  if (e13 < 4161.6) {
    cuota_retencion = 0.18 * e13;
  } else {
    if (e13 < 14357.52 && e13 >= 4161.6) {
      cuota_retencion = 624.24 + (e13 - 4161.6) * 0.24;
    } else {
      if (e13 < 26842.32 && e13 >= 14357.52) {
        cuota_retencion = 3071.26 + (e13 - 14357.52) * 0.28;
      } else {
        if (e13 < 46818 && e13 >= 26842.32) {
          cuota_retencion = 6567 + (e13 - 26842.32) * 0.37;
        } else {
          cuota_retencion = 13958 + (e13 - 46818) * 0.45;
        }
      }
    }
  }
  let tipo_retencion = (cuota_retencion / sueldo) * 100;

  if (limite == "") {
    irpf = 0;
  } else {
    if (sueldo < limite_a) {
      irpf = 0;
    } else {
      irpf = Math.round(tipo_retencion, 0);
    }
  }

  let neto_hora_anual = (1 - irpf / 100) * sueldo - ss_mensual;
  let neto_hora = neto_hora_anual / 12 / 30 / horas;
  let bruto_hora = sueldo / 12 / 30 / horas;

  document.querySelector("#result_sueldo_bruto").innerHTML =
    formatCurrency(sueldo, 2) + " $";
  document.querySelector("#neto_hora").innerHTML =
    formatCurrency(neto_hora, 2) + " $";
  document.querySelector("#bruto_hora").innerHTML =
    formatCurrency(bruto_hora, 2) + " $";
  document.querySelector("#result_value_mobile").innerHTML =
    formatCurrency(neto_hora, 2) + " $";
  document.querySelector("#result_value_mobile_b").innerHTML =
    formatCurrency(bruto_hora, 2) + " $";

  card.style.display = "block";
}

function formatCurrency(num, precision) {
  num = num.toString().replace(/\ |\,/g, "");
  if (isNaN(num)) num = "0";
  cents = Math.floor((num * 100 + 0.5) % 100);
  num = Math.floor((num * 100 + 0.5) / 100).toString();
  if (cents < 10) cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      "." +
      num.substring(num.length - (4 * i + 3));
  if (precision > 0) {
    return " " + num + "," + cents;
  } else if (precision == 0) {
    return " " + num;
  }
}

function LP_data() {
  var key = window.event.keyCode; //codigo de tecla.

  if (key != 44 && key != 46) {
    if (key < 48 || key > 57) {
      //si no es numero
      window.event.keyCode = 0; //anula la entrada de texto.
    }
  }
}

/**Calculdaora SEM*/
function showSEM() {
  const form = document.querySelector("#sem_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const impresiones = Number(document.querySelector("#impresiones").value);
  const clics = Number(document.querySelector("#clics").value);
  const conversiones = Number(document.querySelector("#conversiones").value);
  const coste = Number(document.querySelector("#coste").value);

  const cpm = ((coste / impresiones) * 1000).toFixed(2);
  const cpc = (coste / clics).toFixed(2);
  const cpl = (coste / conversiones).toFixed(2);
  const ctr = ((clics / impresiones) * 100).toFixed(2);
  const rc = ((conversiones / clics) * 100).toFixed(2);

  if (cpm && rc) {
    document.querySelector("#result").style.display = "block";

    document.querySelector("#result_value_mobile_cpm").innerHTML =
      Intl.NumberFormat().format(cpm) + " $";
    document.querySelector("#result_value_mobile_cpc").innerHTML =
      Intl.NumberFormat().format(cpc) + " $";
    document.querySelector("#result_value_mobile_cpl").innerHTML =
      Intl.NumberFormat().format(cpl) + " $";
    document.querySelector("#result_value_mobile_ctr").innerHTML =
      Intl.NumberFormat().format(ctr) + " $";
    document.querySelector("#result_value_mobile_rc").innerHTML =
      Intl.NumberFormat().format(cpm) + " $";

    document.querySelector("#result_value_desktop_cpm").innerHTML =
      Intl.NumberFormat().format(cpm) + " $";
    document.querySelector("#result_value_desktop_cpc").innerHTML =
      Intl.NumberFormat().format(cpc) + " $";
    document.querySelector("#result_value_desktop_cpl").innerHTML =
      Intl.NumberFormat().format(cpl) + " $";
    document.querySelector("#result_value_desktop_ctr").innerHTML =
      Intl.NumberFormat().format(ctr) + " %";
    document.querySelector("#result_value_desktop_rc").innerHTML =
      Intl.NumberFormat().format(rc) + " %";

    //document.querySelector("#result_ventas").innerHTML = formatter.format(ventas);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora Precio Hora Autónomo*/
function showPrecioHoraAut() {
  const form = document.querySelector("#precio_hora_aut_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const salario = Number(document.querySelector("#salario").value);
  const gastos = Number(document.querySelector("#gastos").value);
  const horas_mes = Number(document.querySelector("#horas_mes").value);
  const horas_improductivas = Number(
    document.querySelector("#horas_improductivas").value
  );

  const nom = (salario + gastos).toFixed(2);
  const denom = (horas_mes - horas_improductivas).toFixed(2);
  const total = (nom / denom).toFixed(2);

  console.log(salario);
  console.log(gastos);
  console.log(horas_mes);
  console.log(horas_improductivas);

  console.log(nom);
  console.log(denom);
  console.log(total);

  if (nom && denom) {
    document.querySelector("#result_second").style.display = "block";

    document.querySelector("#result_salario").innerHTML = salario + " $";
    document.querySelector("#result_gastos").innerHTML = gastos + " $";
    document.querySelector("#result_horas_mes").innerHTML = horas_mes + " h";
    document.querySelector("#result_horas_improductivas").innerHTML =
      horas_improductivas + " h";

    document.querySelector("#result_value_desktop_aut").innerHTML =
      total + " $/h";
    document.querySelector("#result_value_mobile_aut").innerHTML =
      total + " $/h";

    //document.querySelector("#result_ventas").innerHTML = formatter.format(ventas);
  } else {
    document.querySelector("#result_second").style.display = "none";
  }
}

/**Calculdaora de Calidad de interes simple */
function showInteresSimple() {
  const form = document.querySelector("#interes_simple_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const kInicial = Number(document.querySelector("#kInicial").value);
  const interes = Number(document.querySelector("#interes").value) / 100;
  var tiempo = Number(document.querySelector("#tiempo").value);
  const tiempoValue = Number(document.querySelector("#tiempoValue").value);

  var mesAnyo = document.getElementById("tiempoValue");
  var selected = mesAnyo.options[mesAnyo.selectedIndex].text;

  console.log("Tetxto tiempo: " + mesAnyo);

  if (tiempoValue == 1) {
    tiempo = tiempo / 12;
  }

  const ratio = (kInicial * interes * tiempo).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      Intl.NumberFormat().format(ratio) + " $";
    document.getElementById("result_value_desktop").innerHTML =
      Intl.NumberFormat().format(ratio) + " $";
    document.querySelector("#result_kInicial").innerHTML = formatter.format(
      kInicial
    );
    document.querySelector("#result_interes").innerHTML = interes * 100 + " %";
    if (selected == "meses") {
      document.querySelector("#result_tiempo").innerHTML =
        (tiempo * 12).toFixed(0) + " " + selected;
    } else {
      document.querySelector("#result_tiempo").innerHTML =
        tiempo + " " + selected;
    }
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/* Test Nueva Calculadora Bitcoin */
function showBitcoinTest() {
  const form = document.querySelector("#form_bitcoin_test");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  $.getJSON("https://api.coindesk.com/v1/bpi/currentprice/eur.json", function (
    data
  ) {
    //var amountInBtc = 1; //convert 0.005 btc to usd

    var amountInBtc = Number(document.querySelector("#cantidad").value);
    var exchangeRateEUR = parseInt(data.bpi.EUR.rate_float);
    var exchangeRateUSD = parseInt(data.bpi.USD.rate_float);
    var amountEUR = amountInBtc * exchangeRateEUR;
    var amountUSD = amountInBtc * exchangeRateUSD;
    console.log("$: " + amountEUR);
    console.log("$: " + amountUSD);

    if (amountInBtc) {
      document.querySelector("#result").style.display = "block";
      document.getElementById("result_value_mobile_eur").innerHTML =
        amountEUR.toFixed(2) + " EUR";
      document.getElementById("result_value_desktop_eur").innerHTML =
        amountEUR.toFixed(2) + " EUR";

      document.getElementById("result_value_mobile_usd").innerHTML =
        amountUSD.toFixed(2) + " USD";
      document.getElementById("result_value_desktop_usd").innerHTML =
        amountUSD.toFixed(2) + " USD";
      document.querySelector("#result_bitcoin").innerHTML =
        amountInBtc + " BTC";
    } else {
      document.querySelector("#result").style.display = "none";
    }
  });
}

/**Calculdaora de Beneficios por Acción */
function showBeneficiosAccion() {
  const form = document.querySelector("#beneficios_accion_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const ganancias = Number(document.querySelector("#ganancias").value);
  const acciones = Number(document.querySelector("#acciones").value);

  const ratio = (ganancias / acciones).toFixed(3);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      Intl.NumberFormat().format(ratio) + " $";
    document.getElementById("result_value_desktop").innerHTML =
      Intl.NumberFormat().format(ratio) + " $";
    document.querySelector("#result_ganancias").innerHTML = formatter.format(
      ganancias
    );
    document.querySelector("#result_acciones").innerHTML = acciones;
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Valor en libros por acción */
function showValorLibroAccion() {
  const form = document.querySelector("#valor_libro_accion_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const capital = Number(document.querySelector("#capital").value);
  const acciones = Number(document.querySelector("#acciones").value);

  const ratio = (capital / acciones).toFixed(3);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      Intl.NumberFormat().format(ratio) + " $";
    document.getElementById("result_value_desktop").innerHTML =
      Intl.NumberFormat().format(ratio) + " $";
    document.querySelector("#result_capital").innerHTML = formatter.format(
      capital
    );
    document.querySelector("#result_acciones").innerHTML = acciones;
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Periodo Medio de Venta - PMV */
function showPMV() {
  const form = document.querySelector("#pmv_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  var ei_pt = Number(document.querySelector("#ei_pt").value);
  var ca_pt = Number(document.querySelector("#ca_pt").value);
  var ef_pt = Number(document.querySelector("#ef_pt").value);

  var ei = Number(document.querySelector("#ei").value);
  var ef = Number(document.querySelector("#ef").value);

  const dias = 365;

  var costeVentas = ei_pt + ca_pt - ef_pt;
  var existenciasMedias = (ei + ef) / 2;
  var rpt = costeVentas / existenciasMedias;

  var ratio = (dias / rpt).toFixed(2);

  console.log("Coste Ventas = " + costeVentas);
  console.log("Existencias Medias = " + existenciasMedias);
  console.log("RPT = " + rpt);
  console.log("PMV = " + ratio);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      Intl.NumberFormat().format(ratio) + " días";
    document.getElementById("result_value_desktop").innerHTML =
      Intl.NumberFormat().format(ratio) + " días";
    document.querySelector("#result_ei_pt").innerHTML = ei_pt;
    document.querySelector("#result_ca_pt").innerHTML = formatter.format(ca_pt);
    document.querySelector("#result_ef_pt").innerHTML = ef_pt;
    document.querySelector("#result_ei").innerHTML = ei;
    document.querySelector("#result_ef").innerHTML = ef;
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Tasa Retencion Cliente - CRR */
function showCRR() {
  const form = document.querySelector("#crr_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  var c_iniciales = Number(document.querySelector("#c_iniciales").value);
  var c_finales = Number(document.querySelector("#c_finales").value);
  var c_nuevos = Number(document.querySelector("#c_nuevos").value);

  var crr = (c_finales - c_nuevos) / c_iniciales;
  var ratio = (crr * 100).toFixed(2);

  console.log("crr(sin x100) = " + crr);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML =
      Intl.NumberFormat().format(ratio) + " %";
    document.getElementById("result_value_desktop").innerHTML =
      Intl.NumberFormat().format(ratio) + " %";
    document.querySelector("#result_c_iniciales").innerHTML = c_iniciales;
    document.querySelector("#result_c_finales").innerHTML = c_finales;
    document.querySelector("#result_c_nuevos").innerHTML = c_nuevos;
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Sueldo Neto Autónomo 

function showNetoAutonomo() {
    const form = document.querySelector("#form_neto_aut");
    form.addEventListener("submit", function(event){
        event.preventDefault()
    });
    
    const prof = 0.15;
    const agric = 0.09;
    const forest = 0.02;

    const dtoIVA = 0.79; // IVA del 21%
    var sueldoBruto = Number(document.querySelector("#sueldoBruto").value);
    //IVA
    const siIVA = document.getElementById("siIVA").checked;
    const noIVA = document.getElementById("noIVA").checked;
    //Tarifa
    const siTarifa = document.getElementById("siTarifa").checked;
    const noTarifa = document.getElementById("noTarifa").checked;
    //Actividades
    const actProfesional = document.getElementById("actProfesional").checked;
    const actAgricolas = document.getElementById("actAgricolas").checked;
    const actForestales = document.getElementById("actForestales").checked;

    const cotizacion = Number(document.querySelector("#cotizacion").value);


    if (siIVA) {
        console.log("IVA", siIVA);
        var sueldoBruto = sueldoBruto*dtoIVA;
    }

    const netoAnual = sueldoBruto - ; 

    if (actProfesional) {
        var irpf = sueldoBruto*prof;
        console.log("IRPF Prof", irpf);
        document.querySelector("#result").style.display = "block";
        document.getElementById("result_value_mobile").innerHTML = Intl.NumberFormat().format(sueldoBruto)+" $";
        document.getElementById("result_value_desktop").innerHTML = Intl.NumberFormat().format(sueldoBruto)+" $";
        document.querySelector("#result_brutoAnual").innerHTML = autonomo;
        document.querySelector("#result_iva").innerHTML = formatter.format(base_cotizacion);
        document.querySelector("#result_act").innerHTML = edad;
        document.querySelector("#result_gastosFijos").innerHTML = genero;
    }


    if (actAgricolas) {
        var irpf = sueldoBruto*agric;
        console.log("IRPF Agric", irpf);
        document.querySelector("#result").style.display = "block";
        document.getElementById("result_value_mobile").innerHTML = Intl.NumberFormat().format(sueldoBruto)+" $";
        document.getElementById("result_value_desktop").innerHTML = Intl.NumberFormat().format(sueldoBruto)+" $";
        document.querySelector("#result_brutoAnual").innerHTML = autonomo;
        document.querySelector("#result_iva").innerHTML = formatter.format(base_cotizacion);
        document.querySelector("#result_act").innerHTML = edad;
        document.querySelector("#result_gastosFijos").innerHTML = genero;
    }


    if (actForestales) {
        var irpf = sueldoBruto*forest;
        console.log("IRPF Forest", irpf);
        document.querySelector("#result").style.display = "block";
        document.getElementById("result_value_mobile").innerHTML = Intl.NumberFormat().format(sueldoBruto)+" $";
        document.getElementById("result_value_desktop").innerHTML = Intl.NumberFormat().format(sueldoBruto)+" $";
        document.querySelector("#result_brutoAnual").innerHTML = autonomo;
        document.querySelector("#result_iva").innerHTML = formatter.format(base_cotizacion);
        document.querySelector("#result_act").innerHTML = edad;
        document.querySelector("#result_gastosFijos").innerHTML = genero;
    }
    
    else { 
        document.querySelector("#result").style.display = "none";
    }
}*/

/**Calculdaora de Coste de Venta (Industrial) */
function costeVentaIndustrial() {
  const form = document.querySelector("#coste_venta_industrial_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const industrialExistencias = Number(
    document.querySelector("#industrialExistencias").value
  );
  const costProd = Number(document.querySelector("#costProd").value);
  const industrialTerminados = Number(
    document.querySelector("#industrialTerminados").value
  );

  const ratio = (
    industrialExistencias +
    costProd -
    industrialTerminados
  ).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = formatter.format(
      ratio
    );
    document.getElementById(
      "result_value_desktop"
    ).innerHTML = formatter.format(ratio);
    document.querySelector(
      "#result_industrialExistencias"
    ).innerHTML = formatter.format(industrialExistencias);
    document.querySelector("#result_costProd").innerHTML = formatter.format(
      costProd
    );
    document.querySelector(
      "#result_industrialTerminados"
    ).innerHTML = formatter.format(industrialTerminados);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Coste de Venta (Comercial) */
function costeVentaComercial() {
  const form = document.querySelector("#coste_venta_comercial_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const comercialExistencias = Number(
    document.querySelector("#comercialExistencias").value
  );
  const comprasNetas = Number(document.querySelector("#comprasNetas").value);
  const comercialTerminados = Number(
    document.querySelector("#comercialTerminados").value
  );

  const ratio = (
    comercialExistencias +
    comprasNetas -
    comercialTerminados
  ).toFixed(2);

  if (ratio) {
    document.querySelector("#result_bis").style.display = "block";
    document.getElementById(
      "result_value_mobile_bis"
    ).innerHTML = Intl.NumberFormat().format(ratio);
    document.getElementById(
      "result_value_desktop_bis"
    ).innerHTML = Intl.NumberFormat().format(ratio);
    document.querySelector(
      "#result_comercialExistencias"
    ).innerHTML = formatter.format(comercialExistencias);
    document.querySelector("#result_comprasNetas").innerHTML = formatter.format(
      comprasNetas
    );
    document.querySelector(
      "#result_comercialTerminados"
    ).innerHTML = formatter.format(comercialTerminados);
  } else {
    document.querySelector("#result_bis").style.display = "none";
  }
}

/**Calculdaora de Tasa de Apertura */
function showTasaApertura() {
  const form = document.querySelector("#tasa_apertura_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const mailsAbiertos = Number(document.querySelector("#mailsAbiertos").value);
  const totalMails = Number(document.querySelector("#totalMails").value);

  const ratio = ((mailsAbiertos / totalMails) * 100).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " %";
    document.getElementById("result_value_desktop").innerHTML = ratio + " %";
    document.querySelector("#result_mailsAbiertos").innerHTML = Number(
      mailsAbiertos
    );
    document.querySelector("#result_totalMails").innerHTML = Number(totalMails);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Capacidad de Endeudamiento */
function showCapEndeudamiento() {
  const form = document.querySelector("#cap_endeudamiento_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const tasaEndeu = 0.4;
  const ingresos = Number(document.querySelector("#ingresos").value);
  const gastos = Number(document.querySelector("#gastos").value);

  const ratio = ((ingresos - gastos) * tasaEndeu).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = formatter.format(
      ratio
    );
    document.getElementById(
      "result_value_desktop"
    ).innerHTML = formatter.format(ratio);
    document.querySelector("#result_ingresos").innerHTML = formatter.format(
      ingresos
    );
    document.querySelector("#result_gastos").innerHTML = formatter.format(
      gastos
    );
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Stock de Seguridad */
function showStockSeguridad() {
  const form = document.querySelector("#stock_seguridad_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const pme = Number(document.querySelector("#pme").value);
  const pe = Number(document.querySelector("#pe").value);
  const dm = Number(document.querySelector("#dm").value);

  const ratio = (pme - pe) * dm;

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " uds.";
    document.getElementById("result_value_desktop").innerHTML = ratio + " uds.";
    document.querySelector("#result_pme").innerHTML = pme;
    document.querySelector("#result_pe").innerHTML = pe;
    document.querySelector("#result_dm").innerHTML = dm;
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Periodo Medio de Fabricación PMF */
function showPMF() {
  const form = document.querySelector("#pmf_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const existencias = Number(document.querySelector("#existencias").value);
  const produccion = Number(document.querySelector("#produccion").value);

  const ratio = ((existencias / produccion) * 365).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " días";
    document.getElementById("result_value_desktop").innerHTML = ratio + " días";
    document.querySelector("#result_existencias").innerHTML = Number(
      existencias
    );
    document.querySelector("#result_produccion").innerHTML = Number(produccion);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Periodo Medio de Capital de Trabajo */
function showCapitalTrabajo() {
  const form = document.querySelector("#capital_trabajo_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const activos = Number(document.querySelector("#activos").value);
  const pasivos = Number(document.querySelector("#pasivos").value);

  const ratio = (activos - pasivos).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " $";
    document.getElementById("result_value_desktop").innerHTML = ratio + " $";
    document.querySelector("#result_activos").innerHTML = Number(activos);
    document.querySelector("#result_pasivos").innerHTML = Number(pasivos);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Paro Autónomo */
function showParoAut() {
  const form = document.querySelector("#paro_autonomo_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const mes1 = Number(document.querySelector("#mes1").value);
  const mes2 = Number(document.querySelector("#mes2").value);
  const mes3 = Number(document.querySelector("#mes3").value);
  const mes4 = Number(document.querySelector("#mes4").value);
  const mes5 = Number(document.querySelector("#mes5").value);
  const mes6 = Number(document.querySelector("#mes6").value);
  const mes7 = Number(document.querySelector("#mes7").value);
  const mes8 = Number(document.querySelector("#mes8").value);
  const mes9 = Number(document.querySelector("#mes9").value);
  const mes10 = Number(document.querySelector("#mes10").value);
  const mes11 = Number(document.querySelector("#mes11").value);
  const mes12 = Number(document.querySelector("#mes12").value);

  const sumaMeses = (
    mes1 +
    mes2 +
    mes3 +
    mes4 +
    mes5 +
    mes6 +
    mes7 +
    mes8 +
    mes9 +
    mes10 +
    mes11 +
    mes12
  ).toFixed(2);
  const mediaMeses = (sumaMeses / 12).toFixed(2);
  const ratio = (mediaMeses * 0.7).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " $";
    document.getElementById("result_value_desktop").innerHTML = ratio + " $";
    document.querySelector("#result_media").innerHTML = Number(mediaMeses);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de ERTE con Reduccion */
function showErteReducc() {
  const form = document.querySelector("#erte_reduccion_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const salario = Number(document.querySelector("#salario").value);
  const horas = Number(document.querySelector("#horas").value);
  const horas_antes = Number(document.querySelector("#horas_antes").value);

  const salario_hora = salario / horas_antes;
  const salario_empresa = salario_hora * horas;
  const horas_estado = horas_antes - horas;
  const porcentaje_erte = 0.7;
  const salario_estado = salario_hora * horas_estado * porcentaje_erte;

  const ratio = (salario_empresa + salario_estado).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " $";
    document.getElementById("result_value_desktop").innerHTML = ratio + " $";
    document.querySelector("#result_salario").innerHTML =
      Number(salario) + " $";
    document.querySelector("#result_horas").innerHTML =
      Number(horas) + "h" + " (" + salario_empresa + "$)";
    document.querySelector("#result_horas_antes").innerHTML =
      Number(horas_antes) + "h";
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Churn Rate */
function showChurnRate() {
  const form = document.querySelector("#churn_rate_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const perdidos = Number(document.querySelector("#perdidos").value);
  const iniciales = Number(document.querySelector("#iniciales").value);

  const ratio = (perdidos / iniciales).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " $";
    document.getElementById("result_value_desktop").innerHTML = ratio + " $";
    document.querySelector("#result_perdidos").innerHTML = Number(perdidos);
    document.querySelector("#result_iniciales").innerHTML = Number(iniciales);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**Calculdaora de Valor visita página */
function showValorVisita() {
  const form = document.querySelector("#valor_visita_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const ingresos = Number(document.querySelector("#ingresos").value);
  const visitas = Number(document.querySelector("#visitas").value);

  const ratio = (ingresos / visitas).toFixed(2);

  if (ratio) {
    document.querySelector("#result").style.display = "block";
    document.getElementById("result_value_mobile").innerHTML = ratio + " $";
    document.getElementById("result_value_desktop").innerHTML = ratio + " $";
    document.querySelector("#result_ingresos").innerHTML = Number(ingresos);
    document.querySelector("#result_visitas").innerHTML = Number(visitas);
  } else {
    document.querySelector("#result").style.display = "none";
  }
}

/**
 * Calculadora de Vacaciones
 */
const showVacacionesErteFull = () => {
  const form = document.querySelector("#form_vacaciones_erte_full");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const vacaciones = Number(document.querySelector("#vacaciones").value);
  const diasErte = Number(document.querySelector("#diasErte").value);
  console.log(vacaciones);
  console.log(diasErte);
  const anual = 365;

  const vacaciones_dia = vacaciones / anual;
  const no_vacaciones = vacaciones_dia * diasErte;

  const numeroDias = vacaciones - no_vacaciones;

  if (vacaciones_dia && no_vacaciones) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#result_vacaciones").innerHTML = vacaciones;
    document.querySelector("#result_diasErte").innerHTML = diasErte;
    document.querySelector("#result_value_mobile").innerHTML =
      numeroDias.toFixed(2) + " días de vacaciones tras ERTE";
    document.querySelector("#result_value_desktop").innerHTML =
      numeroDias.toFixed(2) + " días de vacaciones tras ERTE";
  } else {
    document.querySelector("#result").style.display = "none";
  }
};
