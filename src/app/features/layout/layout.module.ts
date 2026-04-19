import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [ShellComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [ShellComponent]
})
export class LayoutModule {}
