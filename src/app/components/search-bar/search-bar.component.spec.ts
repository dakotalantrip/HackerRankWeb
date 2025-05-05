import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  const currentItemCount: number = 5;
  const totalItemCount: number = 100;
  const searchTerm: string = 'testSearchTerm';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        SearchBarComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind @Input() currentItemCount and @Input() totalItemCount', () => {
    component.currentItemCount = currentItemCount;
    component.totalItemCount = totalItemCount;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(currentItemCount);
    expect(compiled.textContent).toContain(totalItemCount);
  });

  it('should emit the search term when onSearch() is called', () => {
    spyOn(component.search, 'emit');
    component.searchTerm = searchTerm;
    component.onSearch();

    expect(component.search.emit).toHaveBeenCalledWith(searchTerm);
  });

  it('should clear the search term and emit an empty string when onClear() is called', () => {
    spyOn(component.search, 'emit');
    component.searchTerm = searchTerm;
    component.onClear();

    expect(component.search.emit).toHaveBeenCalledWith('');
  });

  it('should update the search term when input is affected', () => {
    const inputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    inputElement.value = searchTerm;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.searchTerm).toBe(searchTerm);
  });

  it('should call onClear() when clear button in mat-suffix is clicked', () => {
    spyOn(component, 'onClear');
    const buttonElement = fixture.debugElement.query(
      By.css('.mat-mdc-form-field-icon-suffix button')
    ).nativeElement;
    buttonElement.click();

    expect(component.onClear).toHaveBeenCalled();
  });

  it('should render "{currentItemCount} or {totalItemCount}" when both values are not null', () => {
    component.currentItemCount = currentItemCount;
    component.totalItemCount = totalItemCount;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent;

    expect(textContent).toContain(`${currentItemCount} of ${totalItemCount}`);
  });
});
