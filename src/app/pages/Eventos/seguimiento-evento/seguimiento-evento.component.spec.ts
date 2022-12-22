import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoEventoComponent } from './seguimiento-evento.component';

describe('SeguimientoEventoComponent', () => {
  let component: SeguimientoEventoComponent;
  let fixture: ComponentFixture<SeguimientoEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoEventoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
