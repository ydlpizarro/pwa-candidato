import { Directive, HostListener, ElementRef, Input, Renderer } from '@angular/core';

@Directive({
    selector: '[appPreventEnterSubmit]'
})

export class PreventEnterSubmitDirective {
    private el: ElementRef;

    @Input() onReturn: string;

    constructor(private _el: ElementRef, public renderer: Renderer) {
        console.log('preventEnterSubmit', true);
        this.el = this._el;
    }

    @HostListener('keydown', ['$event']) onkeydown (e) {
        if ((e.keyCode === 13 || e.which === 13)) {
            e.preventDefault();

            if (e.srcElement.nextElementSibling) {
                e.srcElement.nextElementSibling.focus();
            }

            return;
        }
    }
}
