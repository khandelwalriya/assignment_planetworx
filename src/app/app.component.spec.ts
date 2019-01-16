import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { SortPipe } from './sort.pipe';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,ReactiveFormsModule],
      declarations: [
        AppComponent,
        SortPipe
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
   
});
