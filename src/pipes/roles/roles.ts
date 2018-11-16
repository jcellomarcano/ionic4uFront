import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the RolesPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'rolesPipe',
})
export class RolesPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */

  public roles = {
    Admin: 'Administrador',
    Vendor: 'Vendedor',
    Dispatch: 'Despacho',
    Pending: 'Pendiente',
    Bloqued: 'Bloqueado',
    Undefined: 'Por definir'
  };
  transform(value: string, ...args) {
    if (this.roles[value] == null){
      return null
    }
    return this.roles[value];
  }
}
