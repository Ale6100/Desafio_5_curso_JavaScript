function verificar(numero) { // Devuelve true si "numero" es un número mayor a 1
    return !(numero < 1 || isNaN(numero));
}

class Numero { // Creo un objeto
    constructor (numero, pasos = null) { // El objeto tiene un número y un "pasos" que indica la cantidad de pasos que le tomó llegar a 1. Por defecto le digo que es nulo
        this.numero = numero;
        this.pasos = pasos;
        this.numeroOriginal = numero; // Poco antes de terminar el código se me ocurrió hacer esto para que se guarde el "número original" de este objeto
    }

    collatz() { // Esta función modifica el valor de "pasos" y del número original. Se detiene cuando llega a 1. 
        this.pasos = 1
        while (this.numero !== 1) { 
            if (this.numero%2 == 0) {
                this.numero = this.numero/2;
            } else {
                this.numero = 3*this.numero + 1;
            }
            this.pasos = this.pasos + 1;
        };
    }
}

function leTomo(numero, pasos) {  // Defino una funcion sin return para que diga los pasos que le toma a un numero llegar al 1, siguiendo la secuencia de collatz que definí arriba
    let res    
    if (pasos == 1) {
        res = `<p>Al número ${numero} le tomó <b>un</b> paso llegar al 1</p>`;

    } else {
        res = `<p>Al número ${numero} le tomó <b>${pasos}</b> pasos llegar al 1</p>`;
    }
    return res
}

function stringAArraySinEspaciosExtra(stringOriginal){ // Obtiene un string con numeros y devuelve un array sin espacios
    let arrayLimpio = []
    stringOriginal = stringOriginal.split(" ") // Separa el string y lo convierte en un array, creo
    
    for(let i = 0; i < stringOriginal.length; i++){
        if (stringOriginal[i] != ""){
            arrayLimpio.push(parseInt(stringOriginal[i])); // Crea un nuevo array donde sus elementos solo sean números
        }
    }
    return arrayLimpio
}

let continuar;  // Declaro una variable que uso más tarde numero
let historial = document.getElementById("registroHistorial") // "Agarra" la etiqueta con id "registroHistorial"
historial.innerHTML = "<p>Historial:<br></p>" // Coloco una etiqueta p que tenga un "Historial" y un salto de línea

do {
    let cantidadDeNumeros
    do { // Verifica que ingresamos un número
        cantidadDeNumeros = prompt("Cuántos números desea ingresar?");
        cantidadDeNumeros = stringAArraySinEspaciosExtra(cantidadDeNumeros)[0] // Aunque ingrese por ejemplo " 2 " o "2 " o "2 numeros" igual se queda con el "2"
        if(isNaN(cantidadDeNumeros) || cantidadDeNumeros == 0){ // Verifica que el primer elemento del array sea un número
            alert("Error: debes ingresar un número")
        }
    } while(isNaN(cantidadDeNumeros) || cantidadDeNumeros == 0)

    if(cantidadDeNumeros == 1) { // Ingreso un texto distinto dependiendo de la cantidad de números "prometidos"
        historial.innerHTML = historial.innerHTML + `
        <p>1) Prometió que ingresaría <b>un</b> número</p>
        `
    } else {
        historial.innerHTML = historial.innerHTML + `
        <p>1) Prometió que ingresaría <b>${cantidadDeNumeros}</b> números</p>
        `
    }    

    let stringConNumeros, arrayDeNumeros, numerosValidos;
    do { // Este do...while se va a repetir hasta que los números ingresados sean iguales o mayores a uno
        
        if (cantidadDeNumeros == 1) {
            stringConNumeros = prompt(`Ingrese un número natural`);
        } else {
            stringConNumeros = prompt(`Ingrese ${cantidadDeNumeros} números naturales separados con espacios`);
        }
        arrayDeNumeros = stringAArraySinEspaciosExtra(stringConNumeros) // Un string válido sería por ejemplo " 2 8 49 " si nos pide tres números

        numerosValidos = true;
        for(let i = 0; i < arrayDeNumeros.length; i++) {
            if (verificar(arrayDeNumeros[i]) == false) { // Verifica que hayamos ingresado números, y que dichos números sean mayores o iguales que uno
                numerosValidos = false
                alert("Error: un número natural es un número entero positivo (número no decimal mayor o igual a uno)")
                break // Termina con el for, ya que no tendría sentido verificar los demás números
            }
        }
    
        if ((cantidadDeNumeros != arrayDeNumeros.length) && (numerosValidos == true)) { // Verifico que la cantidad de numeros ingresada sea la misma que se prometió
            numerosValidos = false
            alert(`Error: ingresó ${arrayDeNumeros.length} números, no ${cantidadDeNumeros} como dijo que ingresaría`)
        }
    }while(numerosValidos == false)

    if(arrayDeNumeros.length == 1) { //Toma nota de los números ingresados en el prompt
        historial.innerHTML = historial.innerHTML + `\n\n<p>2) El número ingresado es <b>${arrayDeNumeros}</b></p>`
    } else {
        historial.innerHTML = historial.innerHTML + `\n\n<p>2) Los números ingresados son: [<b>${arrayDeNumeros.join(", ")}</b>]</p>`
    }

    let textoAnunciandoPasos = "3)"
    let arrayDeObjetos = []
    for (let i = 0; i < arrayDeNumeros.length; i++) { // Creo los objetos y modifico sus propiedades
        let numeroNuevo = new Numero(arrayDeNumeros[i])
        arrayDeObjetos.push(numeroNuevo)
        numeroNuevo.collatz()
        textoAnunciandoPasos = textoAnunciandoPasos + leTomo(arrayDeNumeros[i], numeroNuevo.pasos)
    }

    if(arrayDeObjetos.length != 1){
        let pasoMasGrande = arrayDeObjetos[0].pasos // Voy a suponer que el primer objeto hizo la mayor cantidad de pasos, despues lo modifico en caso de que no sea así
        arrayDeObjetos.forEach((elemento)=>{
            if (elemento.pasos > pasoMasGrande){ // De esta manera obtengo la mayor cantidad de pasos que se hicieron
                pasoMasGrande = elemento.pasos
            }
        })
    
        let objetosConMasPasos = arrayDeObjetos.filter((elemento) => elemento.pasos == pasoMasGrande) // Obtengo los objetos que más pasos requirieron llegar al 1
        
        let alertAnunciandoGanador
        let numerosGanadores = ""
    
        if (objetosConMasPasos.length == 1){ // El el if/else tomo nota de los "ganadores"
            alertAnunciandoGanador = `<p>4) Al número <b>${objetosConMasPasos[0].numeroOriginal}</b> le costó más pasos llegar al 1</p>` 
        }else{
            objetosConMasPasos.forEach((elemento) => {
                if (elemento == objetosConMasPasos[objetosConMasPasos.length-2]){
                    numerosGanadores = numerosGanadores + `${elemento.numeroOriginal} y `
                }else{
                    numerosGanadores = numerosGanadores + `${elemento.numeroOriginal}, `
                }
            })
            alertAnunciandoGanador = `<p>4) Los números <b>${numerosGanadores.slice(0, -2)}</b> empataron. A estos les cuesta más pasos llegar al 1</p>`
        }
        historial.innerHTML = historial.innerHTML + textoAnunciandoPasos + alertAnunciandoGanador
    }else{
        historial.innerHTML = historial.innerHTML + textoAnunciandoPasos + `<p>4) El número <b>${arrayDeObjetos[0].numeroOriginal}</b> fue el único ingresado</p>`
    }

    do { // Le pregunto al usuario si quiere empezar de nuevo. Le exijo que responda "si" o "no"
        continuar = prompt("¿Desea empezar de nuevo? (si/no)").toLowerCase();
    } while (continuar != "si" && continuar != "no");

    if(continuar == "si") { // Tomo nota de si el usuario decidió empezar de nuevo o no
        historial.innerHTML = historial.innerHTML + `<p>5) Decidió empezar de nuevo</p>`
    } else {
        historial.innerHTML = historial.innerHTML + `<p>5) Decidió no empezar de nuevo</p>`
    }

    historial.innerHTML = historial.innerHTML + `<p>----------------------------------------------------------------------</p>`

} while (continuar == "si"); // Si la respuesta es si, entonces el programa vuelve a empezar