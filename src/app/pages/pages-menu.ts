import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'E-commerce',
    icon: 'shopping-cart-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'IoT Dashboard',
    icon: 'home-outline',
    link: '/pages/iot-dashboard',
  },
  {
    title: 'Catálogos',
    icon: 'book-open-outline',
    link: '/pages',
    children: [
      {
        title: 'Areas',
        icon: 'grid-outline',
        link: '/pages/Area',
        children: [
          {
            title: 'Registrar',
            link: '/pages/Area/RegistrarArea',
          },

          {
            title: 'Listar',
            link: '/pages/Area/ListarAreas',
          }
        ]
      },
      {
        title: 'Categorías',
        icon: 'folder-add-outline',
        link: '/pages/Categoria',
        children: [
          {
            title: 'Registrar',
            link: '/pages/Categoria/RegistrarCategoria',
          },

          {
            title: 'Listar',
            link: '/pages/Categoria/ListarCategoria',
          }
        ]
      },
      {
        title: 'Sector',
        icon: 'globe-outline',
        link: '/pages/Sector',
        children: [
          {
            title: 'Registrar',
            link: '/pages/Sector/RegistrarSector',
          },

          {
            title: 'Listar',
            link: '/pages/Sector/ListarSector',
          }
        ]
      },
      {
        title: 'Unidad de medida',
        icon: 'pantone-outline',
        link: '/pages/UnidadMedida',
        children: [
          {
            title: 'Registrar',
            link: '/pages/UnidadMedida/RegistrarUnidadMedida',
          },

          {
            title: 'Listar',
            link: '/pages/UnidadMedida/ListarUnidadMedida',
          }
        ]
      },
      {
        title: 'Productos',
        icon: 'map-outline',
        link: '/pages/Producto',
        children: [
          {
            title: 'Registrar',
            link: '/pages/Producto/RegistrarProducto',
          },

          {
            title: 'Listar',
            link: '/pages/Producto/ListarProducto',
          }
        ]
      },
      {
        title: 'Persona',
        icon: 'people-outline',
        link: '/pages/Persona',
        children: [
          {
            title: 'Registrar',
            link: '/pages/Persona/RegistrarPersona',
          },

          {
            title: 'Listar',
            link: '/pages/Persona/ListarPersona',
          }
        ]
      },
      {
        title: 'Vehículo',
        icon: 'car-outline',
        link: '/pages/Vehiculo',
        children: [
          {
            title: 'Registrar',
            link: '/pages/Vehiculo/RegistrarVehiculo',
          },

          {
            title: 'Listar',
            link: '/pages/Vehiculo/ListarVehiculo',
          }
        ]
      },
      {
        title: 'Rol',
        icon: 'award-outline',
        link: '/pages/Rol',
        children: [
          {
            title: 'Registrar',
            link: '/pages/Rol/RegistrarRol',
          },

          {
            title: 'Listar',
            link: '/pages/Rol/ListarRol',
          }
        ]
      },


    ]
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Layout',
    icon: 'layout-outline',
    children: [
      {
        title: 'Stepper',
        link: '/pages/layout/stepper',
      },
      {
        title: 'List',
        link: '/pages/layout/list',
      },
      {
        title: 'Infinite List',
        link: '/pages/layout/infinite-list',
      },
      {
        title: 'Accordion',
        link: '/pages/layout/accordion',
      },
      {
        title: 'Tabs',
        pathMatch: 'prefix',
        link: '/pages/layout/tabs',
      },
    ],
  },
  {
    title: 'Forms',
    icon: 'edit-2-outline',
    children: [
      {
        title: 'Form Inputs',
        link: '/pages/forms/inputs',
      },
      {
        title: 'Form Layouts',
        link: '/pages/forms/layouts',
      },
      {
        title: 'Buttons',
        link: '/pages/forms/buttons',
      },
      {
        title: 'Datepicker',
        link: '/pages/forms/datepicker',
      },
    ],
  },
  {
    title: 'UI Features',
    icon: 'keypad-outline',
    link: '/pages/ui-features',
    children: [
      {
        title: 'Grid',
        link: '/pages/ui-features/grid',
      },
      {
        title: 'Icons',
        link: '/pages/ui-features/icons',
      },
      {
        title: 'Typography',
        link: '/pages/ui-features/typography',
      },
      {
        title: 'Animated Searches',
        link: '/pages/ui-features/search-fields',
      },
    ],
  },
  {
    title: 'Modal & Overlays',
    icon: 'browser-outline',
    children: [
      {
        title: 'Dialog',
        link: '/pages/modal-overlays/dialog',
      },
      {
        title: 'Window',
        link: '/pages/modal-overlays/window',
      },
      {
        title: 'Popover',
        link: '/pages/modal-overlays/popover',
      },
      {
        title: 'Toastr',
        link: '/pages/modal-overlays/toastr',
      },
      {
        title: 'Tooltip',
        link: '/pages/modal-overlays/tooltip',
      },
    ],
  },
  {
    title: 'Extra Components',
    icon: 'message-circle-outline',
    children: [
      {
        title: 'Calendar',
        link: '/pages/extra-components/calendar',
      },
      {
        title: 'Progress Bar',
        link: '/pages/extra-components/progress-bar',
      },
      {
        title: 'Spinner',
        link: '/pages/extra-components/spinner',
      },
      {
        title: 'Alert',
        link: '/pages/extra-components/alert',
      },
      {
        title: 'Calendar Kit',
        link: '/pages/extra-components/calendar-kit',
      },
      {
        title: 'Chat',
        link: '/pages/extra-components/chat',
      },
    ],
  },
  {
    title: 'Maps',
    icon: 'map-outline',
    children: [
      {
        title: 'Google Maps',
        link: '/pages/maps/gmaps',
      },
      {
        title: 'Leaflet Maps',
        link: '/pages/maps/leaflet',
      },
      {
        title: 'Bubble Maps',
        link: '/pages/maps/bubble',
      },
      {
        title: 'Search Maps',
        link: '/pages/maps/searchmap',
      },
    ],
  },
  {
    title: 'Charts',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'Echarts',
        link: '/pages/charts/echarts',
      },
      {
        title: 'Charts.js',
        link: '/pages/charts/chartjs',
      },
      {
        title: 'D3',
        link: '/pages/charts/d3',
      },
    ],
  },
  {
    title: 'Editors',
    icon: 'text-outline',
    children: [
      {
        title: 'TinyMCE',
        link: '/pages/editors/tinymce',
      },
      {
        title: 'CKEditor',
        link: '/pages/editors/ckeditor',
      },
    ],
  },
  {
    title: 'Tables & Data',
    icon: 'grid-outline',
    children: [
      {
        title: 'Smart Table',
        link: '/pages/tables/smart-table',
      },
      {
        title: 'Tree Grid',
        link: '/pages/tables/tree-grid',
      },
    ],
  },
  {
    title: 'Miscellaneous',
    icon: 'shuffle-2-outline',
    children: [
      {
        title: '404',
        link: '/pages/miscellaneous/404',
      },
    ],
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
