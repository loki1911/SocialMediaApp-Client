import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsfeedComponent } from './Componets/postsfeed/postsfeed.component';
import { LoginComponent } from './Componets/login/login.component';
import { SignUpComponent } from './Componets/sign-up/sign-up.component';
import { ProfileComponent } from './Componets/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  
    { path: 'login', component: LoginComponent },         
    { path: 'signup', component: SignUpComponent },      
    { path: 'postsfeed', component: PostsfeedComponent },
    { path: 'profile', component: ProfileComponent },      
    { path: '**', redirectTo: 'postsfeed' }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
