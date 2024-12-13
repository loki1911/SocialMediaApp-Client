import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsfeedComponent } from './postsfeed.component';

describe('PostsfeedComponent', () => {
  let component: PostsfeedComponent;
  let fixture: ComponentFixture<PostsfeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsfeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
