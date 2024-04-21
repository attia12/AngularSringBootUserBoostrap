import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User, UserService} from "../service/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string = '';


  constructor(private formBuilder: FormBuilder,private userService:UserService,private router:Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],

    });
  }

  // onSubmit() {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //
  //   this.isLoading = true;
  //   this.errorMessage = '';
  //
  //   const { email, password } = this.loginForm.value;
  //   this.userService.login({ email, password })
  //     .subscribe(
  //       (data) => {
  //         console.log('Login successful:', data);
  //         this.userService.storeTokenAndRole(data.token);
  //         // Redirect to dashboard or handle success as needed
  //         // For example, navigate to the dashboard page
  //         this.router.navigate(['/admin']);
  //       },
  //       (error) => {
  //         console.error('Error logging in:', error);
  //         this.errorMessage = 'Invalid email or password. Please try again.'; // Display error message
  //       }
  //     )
  //     .add(() => {
  //       // This block will execute after the login attempt completes (either success or error)
  //       this.isLoading = false; // Stop loading spinner
  //     });
  //
  // }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.userService.login({ email, password })
      .subscribe(
        (data) => {
          console.log('Login successful:', data);
          this.userService.storeTokenAndRole(data.token);

          // Fetch user information after successful login
          this.userService.getUserInfo()
            .subscribe(
              (user: User) => {
                // Store user info in local storage or service
                localStorage.setItem('currentUser', JSON.stringify(user));

                // Redirect to dashboard with user info
                this.router.navigate(['/admin'], { state: { user } });
              },
              (error) => {
                console.error('Error fetching user info:', error);
              }
            )
            .add(() => {
              // This block will execute after fetching user info
              this.isLoading = false; // Stop loading spinner
            });
        },
        (error) => {
          console.error('Error logging in:', error);
          this.errorMessage = 'Invalid email or password. Please try again.'; // Display error message
          this.isLoading = false; // Stop loading spinner
        }
      );
  }
}
