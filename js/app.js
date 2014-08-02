
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

var ubicacionObligatoria={
	x:undefined,
	y:undefined
}

var orientacion = 1; //right
var contadorGirar = 0;

var contadorFichasPuestas=0;

var puntaje=0;
var puntajeTemporal=0;

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


/*********************EVENTOS MENU********************/
$("#inicio").focus();

$("#inicio").click(function () {
	$(".intro").fadeOut();
	$(".menu").fadeIn();
	$("#inicio").blur();
	$(".menu .botones .btn:first-child").focus();
	crearFichas();
	crearMatrizFichas();
	crearMatrizTablero();
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
	$(".instrucciones."+nivel).fadeOut();
	$(".tablero").fadeIn();
	window.location.hash="#contenedorFichas";
	$("#contenedorFichas div:first-child div:first-child").css("border-color",bordeIteracion);
	incrementarTiempo();
});

$("#reiniciar, .close").click(function(){
	incrementarTiempo();
	$(".modal").css("display","none");
	$(".container").css("opacity",1);
	$("#contenedorFichas div:first-child div:first-child").css("border-color",bordeIteracion);
	window.location.hash=("#contenedorFichas");
});

$("#menuPrincipal").click(function(){
	$(".tablero").fadeOut();
	$(".menu").fadeIn();
	$(".modal").css("display","none");
	$(".container").css("opacity",1);
	window.location.hash=("#contenedorFichas");
	window.location.hash=("#contenedorFichas");
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
	$(currentFicha).css("border-color",bordeIteracion);
	x=i;
	y=j;
};

var setCurrentCell = function(i,j,matriz) {
	if (i<0) i=0;
	if (i>=matriz.length) i=matriz.length-1;
	if (j<0) j=0;
	if (j>=matriz[i].length) j=matriz[i].length-1;
	currentCell = $("#t"+matriz[i][j].id);
	$(currentCell).css("border-color",bordeIteracion);
	x=i;
	y=j;
};

function seleccionarFicha(e){	
		
		$(currentFicha).css("border-color",bordeNormal);		
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
		} else if (e.keyCode == spacebar) {
			if(matrizFichas[x][y].estado==0){
				$(".informacion *").remove();
			$(".informacion").fadeIn().append("<span class='label label-success'>FICHA SELECCIONADA...</span>").delay(tiempoInformacion).fadeOut();
				fichaSeleccionada = fichas[$(currentFicha).attr("id")];
				$(currentFicha).css("border-color",bordeSeleccion);
				contenedorFichas.removeEventListener("keydown", seleccionarFicha,false);
				contenedorTablero.addEventListener("keydown", seleccionarCasilla,false);
				setCurrentCell(0,0,matrizTablero);
				x=0;
				y=0;
				window.location.hash="#contenedorTablero";
			}else{
				$(".informacion *").remove();
				$(".informacion").fadeIn().append("<span class='label label-success'>FICHA UTILIZADA...SELECCIONA OTRA FICHA</span>").delay(tiempoInformacion).fadeOut();
				window.location.hash="#contenedorFichas";
			}
			
			e.preventDefault();
		}	
}

function seleccionarCasilla(e){			
		$(currentCell).css("border-color",bordeNormal);		
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
		} else if (e.keyCode == spacebar) {
			if(matrizTablero[x][y].estado==0 && 
				((x==ubicacionObligatoria.x && y==ubicacionObligatoria.y) || ubicacionObligatoria.x==undefined) ){
				if(ubicacionObligatoria.x==undefined){
					matrizTablero[x][y].primera=1;
				}
				casillaSeleccionada = matrizTablero[x][y];
				console.log(currentCell);
				$(currentCell).css("border-color",bordeSeleccion);
				$(currentCell).append('<img class="img-responsive" id="img'+casillaSeleccionada.id+'" tabindex="0" src="'+$("#"+$(currentFicha).attr("id")+" img").attr("src")+'" />');
				contenedorTablero.removeEventListener("keydown", seleccionarCasilla,false);
				fichaParaGirar = document.getElementById($(currentCell).attr("id")).firstChild;
				fichaParaGirar.addEventListener("keydown", orientarFicha,false);
				$(".informacion *").remove();
				$(".informacion").fadeIn().append("<span class='label label-danger'>CASILLA SELECCIONADA...</span>").delay(tiempoInformacion).fadeOut();
				window.location.hash=("#img"+casillaSeleccionada.id);
				e.preventDefault();
			}else{
				$(".informacion *").remove();
				$(".informacion").fadeIn().append("<span class='label label-danger'>MOVIMIENTO INVALIDO...ELIGE OTRA CASILLA</span>").delay(tiempoInformacion).fadeOut();
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
	} else if (e.keyCode == spacebar){
		validarPosicion();

		if(contadorGirar==4){
			$(".informacion *").remove();
			$(".informacion").fadeIn().append("<span class='label label-info'>NO ES POSIBLE PONER FICHA...</span>").delay(tiempoInformacion).fadeOut();
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
	if((orientacion==1 && (y+puntos)<tamanoTablero && (matrizTablero[x][y+puntos].estado==0 || matrizTablero[x][y+puntos].primera==1)) ||
		(orientacion==4 && (x-puntos)>=0 && (matrizTablero[x-puntos][y].estado==0 || matrizTablero[x-puntos][y].primera==1)) ||
		(orientacion==3 && (y-puntos)>=0 && (matrizTablero[x][y-puntos].estado==0 || matrizTablero[x][y-puntos].primera==1)) ||
		(orientacion==2 && (x+puntos)<tamanoTablero && (matrizTablero[x+puntos][y].estado==0 || matrizTablero[x+puntos][y].primera==1))){
		//ponerFicha
		puntajeTemporal+=puntos;
		matrizTablero[x][y].estado=1; //casilla llena
		ponerFicha($(currentFicha).attr("id"));
		$(".informacion *").remove();
		$(".informacion").fadeIn().append("<span class='label label-success'>FICHA PUESTA...</span>").delay(tiempoInformacion).fadeOut();
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
			$(".informacion").fadeIn().append("<span class='label label-danger'>NO ES CIRCUITO CERRADO, INTENTALO DE NUEVO...</span>").delay(tiempoInformacion).fadeOut();
			reiniciarTablero();	
		}else if(contadorFichasPuestas<=maxFichas && contadorFichasPuestas>=minFichas && matrizTablero[ubicacionObligatoria.x][ubicacionObligatoria.y].primera==1){
			$(".informacion *").remove();
			$(".informacion").fadeIn().append("<span class='label label-success'>HAS CREADO UN CIRCUITO CERRADO!</span>").delay(tiempoInformacion).fadeOut();
			puntaje+=puntajeTemporal;
			$("#puntaje").text("Puntaje "+puntaje);
			reiniciarTablero();			
		}
		fichaParaGirar.removeEventListener("keydown", orientarFicha,false);
		contenedorFichas.addEventListener("keydown", seleccionarFicha,false);
		setCurrentFicha(0,0,matrizFichas);
		window.location.hash=("#contenedorFichas");
		contadorGirar=0;		
				
	}else{
		$(".informacion *").remove();
		$(".informacion").fadeIn().append("<span class='label label-danger'>DIRECCION INVALIDA...</span>").delay(tiempoInformacion).fadeOut();
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
	$("#contenedorFichas div div, #contenedorTablero div div").css("border-color",bordeNormal);
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
	if(time==60){

		console.log("JUEGO TERMINADO!!!!");
		time=0;
		var mensaje = "GAME OVER Puntaje: "+puntaje;
		stopTimeOut();
		$(".modal").css("display","block");	 
		$(".container").css("opacity",0.2);
		$(".puntaje").text(puntaje);
		puntaje=0;
		reiniciarTablero(); 
		window.location.hash="#reiniciar";	    
	}
};

var stopTimeOut = function () {
    clearTimeout(timeOut);
};