import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  #titleService = inject (Title);
  ngOnInit(): void {
    this.#titleService.setTitle("Posts|Login ")
  }
#router = inject (Router);
  login () {
    this.#router.navigate(['/posts']);
  }

}
