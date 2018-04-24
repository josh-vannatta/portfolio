// Base modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Helper modules
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {NgxPageScrollModule} from 'ngx-page-scroll';

// Modules
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { PortfolioModule } from './portfolio/portfolio.module';

// Component
import { AppComponent } from './app.component';
import { GlobalService } from './shared/global.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    NgxPageScrollModule,
    AuthModule,
    PortfolioModule,
    CoreModule,
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  bootstrap: [AppComponent],
  providers: [GlobalService]
})
export class AppModule { }
