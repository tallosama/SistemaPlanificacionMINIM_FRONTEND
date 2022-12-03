export class Util {
  public static getHoraDate(horaAmPm: string) {
    //Con numeros
    // let date: Date = new Date(null, null, null, 17, 23, null, null);
    //Thu Dec 01 2022 22:32:36 GMT-0600 (hora estándar central)

    return new Date(
      "Thu Dec 01 2022 " + horaAmPm + " GMT-0600 (hora estándar central)"
    );
  }
  public static getHoraAmPm(hora: Date) {
    //Formato ampm
    let horaLocal = hora.toLocaleString("en-US");
    //Formato 24hrs
    //let horaLocal = hora.toLocaleString("en-GB");
    return horaLocal.substring(11);
  }
}
