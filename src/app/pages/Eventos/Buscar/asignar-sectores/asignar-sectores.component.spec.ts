import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSectoresComponent } from './asignar-sectores.component';

describe('AsignarSectoresComponent', () => {
  let component: AsignarSectoresComponent;
  let fixture: ComponentFixture<AsignarSectoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarSectoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarSectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
