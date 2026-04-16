import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  scrolled = signal(false);
  menuOpen = signal(false);
  hidden = signal(false);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        // Hide navbar on builder and auth pages; dashboard has its own sidebar
        const hiddenRoutes = ['/login', '/signup', '/resume-builder', '/dashboard'];
        this.hidden.set(hiddenRoutes.some(r => e.urlAfterRedirects.startsWith(r)));
        this.menuOpen.set(false);
      });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 20);
  }

  toggleMenu() { this.menuOpen.set(!this.menuOpen()); }
  closeMenu() { this.menuOpen.set(false); }
}
