import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
    console.log('Online: ', window.navigator.onLine);
    if ('serviceWorker' in navigator && environment.production) {
        console.log('PWA: ', true);
        navigator.serviceWorker.register('./ngsw-worker.js').then(reg => {
            // console.log(reg);
            console.log('Registro do PWA concluído. Identificação do scope: ' + reg.scope);
        }).catch(error => {
            console.log('Registro do PWA falhou: ' + error);
        });
    } else {
        console.log('PWA: ', false);
    }
})
.catch(err => console.error(err));
