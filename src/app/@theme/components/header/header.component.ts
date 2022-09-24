import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
//import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  users: any;
  users$: Subscription;
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
    //private auth: AuthService,

    //private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService) {
  }
  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    // this.users$ = this.auth.getUser().subscribe(x => {
    //   this.users = x;
    //   console.log(x);
      
    //});


    // this.menuService.onItemClick().subscribe((event) => {
    //   if (event.item.title == "Cerrar sesión"){
    //     this.auth.logout();
    //     console.log("Cerrando...");
        
    //   }
        
    // })

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
    this.users$.unsubscribe();
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
