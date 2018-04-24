import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { PortfolioListComponent } from './portfolio-list/portfolio-list.component';
import { PortfolioItemComponent } from './portfolio-list/portfolio-item/portfolio-item.component';
import { ProjectComponent } from './project/project.component';

import { ProjectService } from './project.service';
import { ProjectNodeService } from './project-node.service';
import { ProjectNodeComponent } from './project/node/node.component';

const portfolioRoutes: Routes = [
  { path: 'portfolio',  component: PortfolioListComponent },
  { path: 'portfolio/project/:client', component: ProjectComponent }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(portfolioRoutes)
  ],
  declarations: [
    PortfolioListComponent,
    PortfolioItemComponent,
    ProjectComponent,
    ProjectNodeComponent
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ProjectService,
    ProjectNodeService
  ]
})
export class PortfolioModule { }
