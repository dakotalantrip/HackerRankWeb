import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSidenavModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  public isLoading: boolean = true;

  private subscription: Subscription = new Subscription();

  constructor(private loadingService: LoadingService) {
    this.subscription.add(this.loadingService.loading$.subscribe((isLoading: boolean) => (this.isLoading = isLoading)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
