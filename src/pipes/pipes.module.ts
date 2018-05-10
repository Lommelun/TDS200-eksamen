import { NgModule } from '@angular/core';
import { HumanifyPipe } from './humanify/humanify';
@NgModule({
	declarations: [HumanifyPipe],
	imports: [],
	exports: [HumanifyPipe]
})
export class PipesModule {}
