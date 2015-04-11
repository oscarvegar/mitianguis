/*
  tiendaCtrl.consultarVentas = function(){
    console.log("Consulta Ventas");
    console.log(tiendaCtrl.venta);
     console.log(tiendaCtrl.venta.fechaInicial);
     console.log(tiendaCtrl.venta.fechaFinal);

      var anio = tiendaCtrl.venta.fechaInicial.substring(0,4);
      var mes = tiendaCtrl.venta.fechaInicial.substring(5,7);
      var dia = tiendaCtrl.venta.fechaInicial.substring(8,10);
      var aniofin = tiendaCtrl.venta.fechaFinal.substring(0,4);
      var mesfin = tiendaCtrl.venta.fechaFinal.substring(5,7);
      var diafin = tiendaCtrl.venta.fechaFinal.substring(8,10);
      mes = parseInt(mes)-1;
      mesfin =parseInt(mesfin)-1;
      diafin =parseInt(diafin)+1;

      var fechaInicial = new Date(anio,mes,dia-1);
      var fechaFinal= new Date(aniofin,mesfin,diafin);

console.log(fechaInicial);
console.log(fechaFinal);


      $http.get("/misventas/" +fechaInicial.getTime() +'/'+ fechaFinal.getTime()).then(function(result){
      tiendaCtrl.misventas = result.data;
     
     console.log("Termino Consulta Ventas");
      console.log(  tiendaCtrl.misventas);
    });


  }


    

  tiendaModule.directive('uiDatepicker', function ($parse) {

    console.log("Entra directiva");
      return function (scope, element, attrs, controller) {

      var ngModel = $parse(attrs.ngModel);

      $parse.fechaMax = new Date(); 
    $parse.fechaMinIni = new Date($parse.fechaMax.getFullYear(), $parse.fechaMax.getMonth()-1, $parse.fechaMax.getDate());
          $(function(){
              element.datepicker({
                  changeYear:true,
                  changeMonth:true,
                  dateFormat:'yy-mm-dd',
                 // minDate: $parse.fechaMinIni,
                  maxDate: $parse.fechaMax,
                  yearRange: '1920:new Date().getFullYear()',
                   beforeShow: function(input,instance) {
                        var oldMethod = $.datepicker._generateMonthYearHeader;
                        $.datepicker._generateMonthYearHeader = function(){
                            var html = $("<div />").html(oldMethod.apply(this,arguments));
                            var monthselect = html.find(".ui-datepicker-month");
                            monthselect.insertAfter(monthselect.next());
                            return html.html();
                        }
                    },
                    onSelect:function (dateText, inst) {

                        scope.$apply(function(scope){
                            
                            $('#fechaFinal').datepicker('option','minDate', new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay));
                            var toDate = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);//Date one month after selected date
                            var oneDay = new Date(toDate.getTime()+86400000);
                           // document.getElementById('end_date').value =$.datepicker.formatDate('dd/mm/yy', oneDay);
                            ngModel.assign(scope, dateText);
                        });
                    }
              });
          });
      }
  });*/