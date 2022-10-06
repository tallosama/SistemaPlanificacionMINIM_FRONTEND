import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { authService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
//import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  menu$: Subscription;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Perfil' }, { title: 'Cerrar sesión' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private auth: authService,

    //private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService ) {
  }
  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.auth.getUser().then(u => this.user = u).catch(error => {

      console.error(error);

    });


    this.menu$= this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title == "Cerrar sesión"){
        this.auth.logout().then(resp=>{
          console.log(resp);
          
          window.location.reload();
        }    
        ).catch(e=>console.error(e)
        );
        

      }
    })

    //     this.userService.getUsers()
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe((users: any) => this.user = users.eva);
    // console.log(this.user);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.menu$.unsubscribe();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
