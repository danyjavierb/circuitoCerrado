var socket = io.connect('http://localhost:8080');//cambiar por url servidor final
var time=0;
var tiempoInformacion=800;

var nivel;
var fichasUnPunto = 1;
var fichasDosPuntos = 8;
var fichasTresPuntos = 7;

var maxFichas = 0;
var minFichas = 0;

var fichas= Array();
var matrizFichas = Array();
var columnasMatrizFichas = 3;
var matrizTablero = Array();
var tamanoTablero = 4;

var fichaSeleccionada;
var casillaSeleccionada;

var currentFicha;
var currentCell;
var x=0;
var y=0;

var up=38;
var down=40;
var left=37;
var right=39;
var spacebar=32;
var c = 67;

var ubicacionObligatoria={
	x:undefined,
	y:undefined
}

var orientacion = 1; //right
var contadorGirar = 0;

var contadorFichasPuestas=0;

var puntaje=0;
var puntajeTemporal=0;
var contadorCircuitos=0;

var fichasUtilizadas=0; //se reinicia para cada circuito

var timeOut;
var tiempoMaximo=1500;

var contenedorFichas = document.getElementById("contenedorFichas");
var contenedorTablero = document.getElementById("contenedorTablero");
var fichaParaGirar;
contenedorFichas.addEventListener("keydown", seleccionarFicha,false);

//colores bordes

var bordeNormal="rgb(44, 62, 80)";
var bordeIteracion = "rgb(24, 188, 156)";
var bordeSeleccion = "rgb(231, 76, 60)";
var bordeAncho = "5px";


/*********************EVENTOS MENU********************/
$("#inicio").focus();

$("#inicio").click(function () {
	$(".intro").fadeOut();
	$(".preferencias").fadeIn();
	$("#inicio").blur();
	$(".preferencias #enviarPreferencias").focus();
});

$("#enviarPreferencias").click(function () {
	$(".preferencias").fadeOut();
	$(".modalidad").fadeIn();
	$("#enviarPreferencias").blur();
	$(".modalidad .botones .btn:first-child").focus();
	iterarMenu("modalidad");
});

$("#individual").click(function () {
	$(".modalidad").fadeOut();
	$(".menu").fadeIn();
	$(".modalidad .botones .btn:first-child").blur();
	$(".menu .botones .btn:first-child").focus();
	crearFichas();
	crearMatrizFichas();
	crearMatrizTablero();
	iterarMenu("menu");
});

$("#grupal").click(function () {
	$(".modalidad").fadeOut();
	$(".datosGrupo").fadeIn();
	$(".modalidad .botones .btn:first-child").blur();
	$(".datosGrupo #nombre").focus();
});

$("#enviar").click(function () {
	$(".datosGrupo").fadeOut();
	$(".menu").fadeIn();
	$(".datosGrupo #nombre").blur();
	$(".menu .botones .btn:first-child").focus();
	crearFichas();
	crearMatrizFichas();
	crearMatrizTablero();
});

$("#nombre").keydown(function(e){
	if ( event.which == spacebar ) {
	   $(".datosGrupo").fadeOut();
		$(".rooms").fadeIn();
		$(".datosGrupo #nombre").blur();
		$(".menu .botones .btn:first-child").focus();
		crearFichas();
		crearMatrizFichas();
		crearMatrizTablero();
		iterarMenu("rooms");
		$(".rooms div .botones:first-child .btn:first-child").focus();
		 socket.emit('loginUser', $('#nombre').val());
	}
});

$(".rooms .btn").click(function(){
	$(".rooms").fadeOut();	
	$(".menu").fadeIn();
	var room = $(this).index();
	$(".menu .botones .btn:first-child").focus();
	iterarMenu("menu");
	/////////////////////////////////ENVIAR ROOM
});

$(".menu .btn").click(function () {
	nivel = $(this).attr("id");
	if(nivel=="individualPrincipiante"){
		maxFichas=4;
		minFichas=2;
	}else if(nivel=="individualIntermedio"){
		maxFichas=10;
		minFichas=6;
	}else if(nivel=="individualExperto"){
		maxFichas=16;
		minFichas=16;
	}
	window.location.hash="#"+nivel;
	$(".menu").fadeOut();
	$(".instrucciones."+nivel).fadeIn();
	$(".menu .botones .btn:first-child").blur();
	$(".jugar").focus();
});

$(".jugar").click(function () {
	$("#"+nivel).blur();
	$(".instrucciones."+nivel).fadeOut();
	$(".tablero").fadeIn();
	window.location.hash="#contenedorFichas";
	$("#contenedorFichas div:first-child div:first-child").css(
		{"border-color":bordeIteracion,
		"border-width":bordeAncho});
	incrementarTiempo();
});

$("#reiniciar, .close").click(function(){
	incrementarTiempo();
	$(".modal").css("display","none");
	$(".container").css("opacity",1);
	$("#contenedorFichas div:first-child div:first-child").css(
		{"border-color":bordeIteracion,
		"border-width":bordeAncho});
	window.location.hash=("#contenedorFichas");
});

$("#menuPrincipal").click(function(){
	$(".tablero").fadeOut();
	$(".modalidad").fadeIn();
	$(".modal").css("display","none");
	$(".container").css("opacity",1);
	window.location.hash=("#individual");
	iterarMenu("modalidad");
});

$("#creditos").click(function(){
	$(".tablero").fadeOut();
	$(".creditos").fadeIn();
	$(".modal").css("display","none");
	$(".container").css("opacity",1);
	window.location.hash=("#regresar");
});

$("#regresar").click(function(){
	$(".creditos").fadeOut();
	$(".modalidad").fadeIn();
	window.location.hash=("#individual");
	iterarMenu("modalidad");
});
/**********************************************************/

/****************************LOGICA JUEGO*****************************/

var crearFichas = function(){
	for(var i=0;i<fichasTresPuntos;i++){
		var ficha = {
			direccion:"derecha",
			puntos:3,
			posicionFila:0,
			posicionColumna:0,
			estado:0 //no seleccionada
		}
		fichas.push(ficha);
	}
	for(var i=0;i<fichasDosPuntos;i++){
		var ficha = {
			direccion:"derecha",
			puntos:2,
			posicionFila:0,
			posicionColumna:0,
			estado:0 //no seleccionada
		}
		fichas.push(ficha);
	}

	for(var i=0;i<fichasUnPunto;i++){
		var ficha = {
			direccion:"derecha",
			puntos:1,
			posicionFila:0,
			posicionColumna:0,
			estado:0 //no seleccionada
		}
		fichas.push(ficha);
	}

};

var crearMatrizFichas = function(){
	var j=0;
	var temp = Array();
	for(var i=0;i<fichas.length;i++){
		fichas[i].id=i;
		if(temp.length < columnasMatrizFichas){
			temp.push(fichas[i]);
		}else{
			matrizFichas.push(temp);
			temp = Array();
			temp.push(fichas[i]);
			if(i==fichas.length-1){
				matrizFichas.push(temp);
			}
			j=0;
		}
		j++;		
	}
	setCurrentFicha(0,0,matrizFichas);
};

var crearMatrizTablero = function(){
	var contId=0;
	var temp=Array();
	for(var i=0;i<tamanoTablero;i++){
		temp=Array();
		for(var j=0;j<tamanoTablero;j++){
			var casilla={
				estado:0, //vacia
				id:contId,
				primera:0 //no es la primera casilla usada
			}
			temp.push(casilla);
			contId++;
		}
		matrizTablero.push(temp);
	}
};

var setCurrentFicha = function(i,j,matriz) {
	if (i<0) i=0;
	if (i>=matriz.length) i=matriz.length-1;
	if (j<0) j=0;
	if (j>=matriz[i].length) j=matriz[i].length-1;
	currentFicha = $("#"+matriz[i][j].id);
	$(currentFicha).css({
		"border-color":bordeIteracion,
		"border-width":bordeAncho});
	x=i;
	y=j;
};

var setCurrentCell = function(i,j,matriz) {
	if (i<0) i=0;
	if (i>=matriz.length) i=matriz.length-1;
	if (j<0) j=0;
	if (j>=matriz[i].length) j=matriz[i].length-1;
	currentCell = $("#t"+matriz[i][j].id);
	$(currentCell).css(
		{"border-color":bordeIteracion,
		"border-width":bordeAncho});
	x=i;
	y=j;
};

function seleccionarFicha(e){	
		
		$(currentFicha).css({"border-color":bordeNormal,"border-width":"3px"});		
		if (e.keyCode == left) {
			// left
			setCurrentFicha(x,y-1,matrizFichas);			
			e.preventDefault();
		} else if (e.keyCode == up) {
			// up  
			setCurrentFicha(x-1,y,matrizFichas);
			
			e.preventDefault();
		} else if (e.keyCode == right) {
			// right
			setCurrentFicha(x,y+1,matrizFichas);
			
			e.preventDefault();
		} else if (e.keyCode == down) {
			// down
			setCurrentFicha(x+1,y,matrizFichas);
			
			e.preventDefault();
		}else if (e.keyCode == spacebar) {
			if(matrizFichas[x][y].estado==0){
				$(".informacion *").remove();
			$(".informacion").append("<span class='label label-success'>FICHA SELECCIONADA...</span>");
				fichaSeleccionada = fichas[$(currentFicha).attr("id")];
				$(currentFicha).css({
					"border-color":bordeSeleccion,
					"border-width":bordeAncho});
				contenedorFichas.removeEventListener("keydown", seleccionarFicha,false);
				contenedorTablero.addEventListener("keydown", seleccionarCasilla,false);
				setCurrentCell(0,0,matrizTablero);
				x=0;
				y=0;
				window.location.hash="#contenedorTablero";
			}else{
				$(".informacion *").remove();
				$(".informacion").append("<span class='label label-success'>FICHA UTILIZADA...SELECCIONA OTRA FICHA</span>");
				window.location.hash="#contenedorFichas";
			}
			
			e.preventDefault();
		}	
}

function seleccionarCasilla(e){			
		$(currentCell).css({"border-color":bordeNormal,"border-width":"3px"});		
		if (e.keyCode == left) {
			// left
			setCurrentCell(x,y-1,matrizTablero);
			
			e.preventDefault();
		} else if (e.keyCode == up) {
			// up  
			setCurrentCell(x-1,y,matrizTablero);
			
			e.preventDefault();
		} else if (e.keyCode == right) {
			// right
			setCurrentCell(x,y+1,matrizTablero);
			
			e.preventDefault();
		} else if (e.keyCode == down) {
			// down
			setCurrentCell(x+1,y,matrizTablero);
			
			e.preventDefault();
		}else if(e.keyCode == c){
			contenedorTablero.removeEventListener("keydown", seleccionarCasilla,false);
			contenedorFichas.addEventListener("keydown", seleccionarFicha,false);
			window.location.hash=("#contenedorFichas");
			$(".informacion *").remove();
			$(".informacion").append("<span class='label label-success'>INICIANDO NUEVO CIRCUITO...</span>");
			reiniciarTablero();		
		}else if (e.keyCode == spacebar) {
			if(matrizTablero[x][y].estado==0 && 
				((x==ubicacionObligatoria.x && y==ubicacionObligatoria.y) || ubicacionObligatoria.x==undefined) ){
				if(ubicacionObligatoria.x==undefined){
					matrizTablero[x][y].primera=1;
				}
				casillaSeleccionada = matrizTablero[x][y];
				console.log(currentCell);
				$(currentCell).css({
					"border-color":bordeSeleccion,
					"border-width":bordeAncho});
				$(currentCell).append('<img class="img-responsive" id="img'+casillaSeleccionada.id+'" tabindex="0" src="'+$("#"+$(currentFicha).attr("id")+" img").attr("src")+'" />');
				contenedorTablero.removeEventListener("keydown", seleccionarCasilla,false);
				fichaParaGirar = document.getElementById($(currentCell).attr("id")).firstChild;
				fichaParaGirar.addEventListener("keydown", orientarFicha,false);
				$(".informacion *").remove();
				$(".informacion").append("<span class='label label-info'>CASILLA SELECCIONADA...</span>");
				window.location.hash=("#img"+casillaSeleccionada.id);
				e.preventDefault();
			}else{
				$(".informacion *").remove();
				$(".informacion").append("<span class='label label-danger'>MOVIMIENTO INVALIDO...ELIGE OTRA CASILLA</span>");
			}	
		}	
}

var orientarFicha = function(e){
	if (e.keyCode == left) {
		// left
		$(fichaParaGirar).css("transform","rotate(180deg)");
		orientacion = 3;				
		e.preventDefault();
	} else if (e.keyCode == up) {
		// up  
		$(fichaParaGirar).css("transform","rotate(270deg)");
		orientacion = 4;
		e.preventDefault();
	} else if (e.keyCode == right) {
		// right
		$(fichaParaGirar).css("transform","rotate(360deg)");
		orientacion = 1;
		e.preventDefault();
	} else if (e.keyCode == down) {
		// down
		$(fichaParaGirar).css("transform","rotate(90deg)");
		orientacion = 2;
		e.preventDefault();
	} else if(e.keyCode == c){
		fichaParaGirar.removeEventListener("keydown", orientarFicha,false);
		contenedorFichas.addEventListener("keydown", seleccionarFicha,false);
		reiniciarTablero();
		$(".informacion *").remove();
		$(".informacion").append("<span class='label label-success'>INICIANDO NUEVO CIRCUITO...</span>");
		window.location.hash=("#contenedorFichas");
	}else if (e.keyCode == spacebar){
		validarPosicion();
		if(contadorGirar==4){
			$(".informacion *").remove();
			$(".informacion").append("<span class='label label-info'>NO ES POSIBLE PONER FICHA...</span>");
			fichaParaGirar.removeEventListener("keydown", orientarFicha,false);
			contenedorFichas.addEventListener("keydown", seleccionarFicha,false);
			setCurrentFicha(0,0,matrizFichas);
			$(currentCell).children().remove();
			contadorGirar=0;
			orientacion=1;	
			window.location.hash=("#contenedorFichas");		
		}
		
	}
};

var validarPosicion = function(){
	var puntos = fichas[$(currentFicha).attr("id")].puntos;
	var casilla = matrizTablero[x][y];
	if((orientacion==1 && (y+puntos)<tamanoTablero && (matrizTablero[x][y+puntos].estado==0 || (matrizTablero[x][y+puntos].primera==1 && contadorFichasPuestas>=minFichas-1))) ||
		(orientacion==4 && (x-puntos)>=0 && (matrizTablero[x-puntos][y].estado==0 || (matrizTablero[x-puntos][y].primera==1 && contadorFichasPuestas>=minFichas-1))) ||
		(orientacion==3 && (y-puntos)>=0 && (matrizTablero[x][y-puntos].estado==0 || (matrizTablero[x][y-puntos].primera==1 && contadorFichasPuestas>=minFichas-1))) ||
		(orientacion==2 && (x+puntos)<tamanoTablero && (matrizTablero[x+puntos][y].estado==0 || (matrizTablero[x+puntos][y].primera==1 && contadorFichasPuestas>=minFichas-1)))){
		//ponerFicha
		puntajeTemporal+=puntos;
		matrizTablero[x][y].estado=1; //casilla llena
		ponerFicha($(currentFicha).attr("id"));
		$(".informacion *").remove();
		$(".informacion").append("<span class='label label-success'>FICHA PUESTA...</span>");
		$(currentFicha).css("opacity",0.2);
		switch(orientacion){
			case 1:
				ubicacionObligatoria.x=x;
				ubicacionObligatoria.y=y+puntos;
				break;
			case 2:
				ubicacionObligatoria.x=x+puntos;
				ubicacionObligatoria.y=y;
				break;
			case 3:
				ubicacionObligatoria.x=x;
				ubicacionObligatoria.y=y-puntos;
				break;
			case 4:
				ubicacionObligatoria.x=x-puntos;
				ubicacionObligatoria.y=y;
				break;
			default:
				ubicacionObligatoria.x=undefined;
				ubicacionObligatoria.y=undefined;
				break;
		}	
		contadorFichasPuestas++;
		
		if(contadorFichasPuestas==maxFichas && matrizTablero[ubicacionObligatoria.x][ubicacionObligatoria.y].primera==0){			
			fichaParaGirar.removeEventListener("keydown", orientarFicha,false);
			$(".informacion *").remove();
			$(".informacion").append("<span class='label label-danger'>NO ES CIRCUITO CERRADO, INTENTALO DE NUEVO...</span>");
			reiniciarTablero();	
		}else if(contadorFichasPuestas<=maxFichas && contadorFichasPuestas>=minFichas && matrizTablero[ubicacionObligatoria.x][ubicacionObligatoria.y].primera==1){
			$(".informacion *").remove();
			$(".informacion").append("<span class='label label-success'>HAS CREADO UN CIRCUITO CERRADO!</span>");
			contadorCircuitos++;
			puntaje+=puntajeTemporal;
			$("#puntaje").text("Puntaje "+puntaje);
			$("#circuitos").text(contadorCircuitos+" circuitos");
			reiniciarTablero();			
		}
		fichaParaGirar.removeEventListener("keydown", orientarFicha,false);
		contenedorFichas.addEventListener("keydown", seleccionarFicha,false);
		setCurrentFicha(0,0,matrizFichas);
		window.location.hash=("#contenedorFichas");
		contadorGirar=0;		
				
	}else{
		$(".informacion *").remove();
		$(".informacion").append("<span class='label label-danger'>DIRECCION INVALIDA...</span>");
		contadorGirar++;
	}
};

var reiniciarTablero = function(){
	vaciarTablero();
	llenarContenedorFichas();
	reiniciarFichas();
	contadorGirar=0;
	contadorFichasPuestas=0;
	ubicacionObligatoria={x:undefined,y:undefined};
	puntajeTemporal=0;
	orientacion=1;
	fichasUtilizadas=0;
	$("#time").text(time+" segundos");
	$("#puntaje").text("Puntaje "+puntaje);
	$("#contenedorFichas div div, #contenedorTablero div div").css({"border-color":bordeNormal,"border-width":"3px"});
};

var ponerFicha = function(id){
	for(var i=0;i<matrizFichas.length;i++){
		for(var j=0;j<matrizFichas[i].length;j++){
			if(id==matrizFichas[i][j].id){
				matrizFichas[i][j].estado=1; //puesta
			}
		}
	}
	fichasUtilizadas++;
};

var vaciarTablero = function(){
	$("#contenedorTablero img").remove();
	for(var i =0;i<tamanoTablero;i++){
		for(var j=0;j<tamanoTablero;j++){
			matrizTablero[i][j].estado=0;
			matrizTablero[i][j].primera=0;
		}
	}
};

var llenarContenedorFichas = function(){
	$("#contenedorFichas div div").css("opacity",1);
};

var reiniciarFichas = function(){
	for(var i =0;i<matrizFichas.length;i++){
		for(var j=0;j<matrizFichas[i].length;j++){
			matrizFichas[i][j].estado=0;
		}
	}
	orientacion = 1;
};

var incrementarTiempo = function(){
	time++;
	$("#time").text(time+" segundos");
	timeOut = setTimeout(incrementarTiempo,tiempoMaximo);
	if(time==180){
		time=0;
		stopTimeOut();
		$(".modal").css("display","block");	 
		$(".container").css("opacity",0.2);
		$(".puntaje").text(puntaje);
		puntaje=0;
		reiniciarTablero(); 
		iterarMenu("modal-footer");
		window.location.hash="#reiniciar";	    
	}
};

var stopTimeOut = function () {
    clearTimeout(timeOut);
};

var iterarMenu = function(contenedor){
	var boton = $('.'+contenedor+' button');
	var botonSeleccionado=$('.'+contenedor+' button:first-child');
	$(window).keydown(function(e){
	    if(e.which === down || e.which === right){
	        if(botonSeleccionado){
	            next = botonSeleccionado.next();
	            if(next.length > 0){
	                botonSeleccionado = next;
	                var id=$(botonSeleccionado).attr("id");
	            	window.location.hash="#"+id;
	            }
	        }else{
	            botonSeleccionado = boton.eq(0).addClass('selected');
	            var id=$(botonSeleccionado).attr("id");
	            window.location.hash="#"+id;
	        }
	    }else if(e.which === up || e.which === left){
	        if(botonSeleccionado){
	            next = botonSeleccionado.prev();
	            if(next.length > 0){
	                botonSeleccionado = next;
	                var id=$(botonSeleccionado).attr("id");
	            	window.location.hash="#"+id;
	            }
	        }else{
	            botonSeleccionado = boton.last();
	            var id=$(botonSeleccionado).attr("id");
	            window.location.hash="#"+id;
	        }
	    }
	});
};