import { FormControl } from "@angular/forms";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";

export class Util {
  constructor() {}

  //Métodos para fechas
  // 1.1. Transformar una hora de 12 horas a 24 horas en objeto Date
  public static getHoraDate(horaAmPm: string) {
    //Con numeros
    // let date: Date = new Date(null, null, null, 17, 23, null, null);
    //Thu Dec 01 2022 22:32:36 GMT-0600 (hora estándar central)

    return new Date(
      "Thu Dec 01 2022 " + horaAmPm + " GMT-0600 (hora estándar central)"
    );
  }
  //1.2. Transformar un objeto date de 24 hrs. a 12 hrs en string
  public static getHoraAmPm(hora: Date) {
    //Formato ampm
    let horaLocal = hora.toLocaleString("en-US");
    //Formato 24hrs
    //let horaLocal = hora.toLocaleString("en-GB");
    return horaLocal.substring(11);
  }

  //Métodos para controles de formularios

  // 2.1. Valida si un campo del formulario está vacío
  /**
   * If the value of the control is empty, return an object with the key "incorrecto" and the value true.
   * Otherwise, return null.
   * @param {FormControl} control - FormControl - The form control to validate.
   */
  public static esVacio(control: FormControl) {
    const esValido = (control.value || "").trim().length === 0;
    return esValido ? { incorrecto: true } : null;

    //return  (control.value || "").trim().length === 0?{incorrecto:true}:null;
  }

  // 2.2. Limpiar formulario
  /**
   * It takes an object, iterates over its properties, and trims the string values.
   * @param {any} formulario - any
   * @returns The form object with the values trimmed.
   */
  public static limpiarForm(formulario: any) {
    let claves = Object.keys(formulario);
    let propiedades = Object.values(formulario);
    for (let i = 0; i < claves.length; i++) {
      let p = propiedades[i];
      if (typeof p === "string" || p instanceof String) {
        formulario[claves[i]] = p.toString().trim();
      }
    }
    return formulario;
  }
  // 2.3. Valida que el combobox seleccione un objeto
  /**
   * If the value of the control is a string, return an object with a property called incorrecto and a
   * value of true. Otherwise, return null.
   * @param {FormControl} control - FormControl - The control to validate.
   * @returns an object with a property called incorrecto.
   */
  public static noObjeto(control: FormControl) {
    const seleccion = control.value;
    return typeof seleccion === "string" ? { incorrecto: true } : null;
    // if (typeof seleccion === "string") {
    //   return { incorrecto: true };
    // }
    // return null;
  }

  //3. Configuración del mensaje Toast
  public static showToast(
    estado: string,
    titulo: string,
    cuerpo: string,
    duracion: number,
    toastrService: any
  ) {
    const config = {
      status: estado,
      destroyByClick: true,
      duration: duracion,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    toastrService.show(cuerpo, titulo, config);
  }

  public static aplicarMascaraCedula(input) {
    let cadena: string = "";
    for (let i = 0; i < input.length; i++) {
      cadena += input[i];
      if (i == 2 || i == 8) cadena += "-";
    }
    return cadena;
  }

  //4. Métodos para caché
  //4.1 Almacenar en caché
  public static saveInCache(
    llave: string,
    elemento: string | any,
    isObject: boolean = false
  ): void {
    if (isObject) {
      localStorage.setItem(llave, JSON.stringify(elemento));
    } else {
      localStorage.setItem(llave, elemento);
    }
  }
  //4.2 Obtener de cache
  public static getFromCache(llave: string) {
    return localStorage.getItem(llave);
  }
  //4.3 Remover de cache
  public static removeFromCache(llave: string) {
    localStorage.removeItem(llave);
  }
}
