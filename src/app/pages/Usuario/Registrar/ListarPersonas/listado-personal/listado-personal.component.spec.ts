import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPersonalComponent } from './listado-personal.component';

describe('ListadoPersonalComponent', () => {
  let component: ListadoPersonalComponent;
  let fixture: ComponentFixture<ListadoPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPersonalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
