import TipsListComponent from '../pages/TipsList';
import HomePageComponent from '../pages/HomePage/HomeTipsContainer';

export default [
  {
    path: '/',
    component: TipsListComponent,
  },  
  {
    path: '/test',
    component: HomePageComponent,
  },
  {
    path: '/home',
    component: HomePageComponent,
  },
];
