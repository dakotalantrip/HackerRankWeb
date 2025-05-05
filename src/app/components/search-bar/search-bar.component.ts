import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  @Input() currentItemCount: number = 0;
  @Input() totalItemCount: number = 0;

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  public searchTerm: string = '';

  //#region Events

  public onClear(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  public onSearch(): void {
    this.search.emit(this.searchTerm);
  }

  //#endregion
}
