
import HomePage from '../pages/home.vue';
import AboutPage from '../pages/about.vue';
import FormPage from '../pages/form.vue';
import CatalogPage from '../pages/catalog.vue';
import SettingsPage from '../pages/settings.vue';

import DynamicRoutePage from '../pages/dynamic-route.vue';
import RequestAndLoad from '../pages/request-and-load.vue';
import NotFoundPage from '../pages/404.vue';

import NewsPage from '../pages/news.vue';
import EventsPage from '../pages/events.vue';
import WatpolPage from '../pages/watpol.vue';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/news/',
    component: NewsPage,
  },
  {
    path: '/events/',
    component: EventsPage,
  },
  {
    path: '/watpol/',
    component: WatpolPage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/catalog/',
    component: CatalogPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },

  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
