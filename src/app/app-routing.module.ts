import {ModuleWithProviders, NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CadastroExpressComponent } from './cadastro-express/cadastro-express.component';
import {InventarioComportamentalComponent} from './inventario-comportamental/inventario-comportamental.component';
import {AnexarCurriculoComponent} from './anexar-curriculo/anexar-curriculo.component';
import {ProvasComponent} from './provas/provas.component';

const routes: Routes = [
  {path: '', redirectTo: 'cadastro-express', pathMatch: 'full'},
  {path: 'cadastro-express', component: CadastroExpressComponent},
  {path: 'inventario-comportamental', component: InventarioComportamentalComponent},
  {path: 'anexar-curriculo', component: AnexarCurriculoComponent},
  {path: 'provas', component: ProvasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
