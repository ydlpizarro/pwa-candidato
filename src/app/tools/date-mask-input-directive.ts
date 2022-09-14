/**
 * Adiciona a máscara de data no input que utiliza o MatDatePicker
 * A função `mask` não funciona quando utilizamos o recurso `MatDatePicker` (que adiciona o calendário no input), porque não
 * é possível ter dois recursos manipulando o mesmo elemento.
 * A solução DateMaskInputDirective foi encontrada na issues no repositório do Angular:
 * https://github.com/angular/angular/issues/16755
 * Para utilizá-la basta adicionar o seletor `customInputDateMask` no input que utiliza o `matDatepicker`
 */

import { Directive, ElementRef, OnDestroy } from '@angular/core';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

@Directive({
  selector: '[customInputDateMask]'
})

export class DateMaskInputDirective implements OnDestroy {

  mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]; // dd/mm/yyyy
  maskedInputController;

  constructor(private element: ElementRef) {
    this.maskedInputController = textMask.maskInput({
      inputElement: this.element.nativeElement,
      mask: this.mask
    });
  }

  ngOnDestroy() {
    this.maskedInputController.destroy();
  }

}