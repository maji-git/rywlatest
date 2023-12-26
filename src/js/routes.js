
import HomePage from '../pages/home.vue';
import AboutPage from '../pages/about.vue';
import FormPage from '../pages/form.vue';
import SettingsPage from '../pages/settings.vue';

import DynamicRoutePage from '../pages/dynamic-route.vue';
import RequestAndLoad from '../pages/request-and-load.vue';
import NotFoundPage from '../pages/404.vue';

import NewsPage from '../pages/news.vue';
import EventsPage from '../pages/events.vue';
import WatpolPage from '../pages/watpol.vue';
import BehaviourPage from '../pages/behaviour.vue';
import DocsPage from '../pages/docs.vue';
import SportsPage from '../pages/sports.vue';
import CalendarPage from '../pages/calendar.vue';
import TeachersPage from '../pages/teachers.vue';
import PreferencesPage from '../pages/pref.vue';
import AttendeePage from '../pages/attendee.vue';
import NotificationsPage from '../pages/notifications.vue';
import RoomsPage from '../pages/rooms.vue';
import QuotaPage from '../pages/quota.vue';
import ClassworksPage from '../pages/classworks.vue';

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
    path: '/notifications/',
    component: NotificationsPage,
  },
  {
    path: '/events/',
    component: EventsPage,
  },
  {
    path: '/calendar/',
    component: CalendarPage,
  },
  {
    path: '/watpol/',
    component: WatpolPage,
  },
  {
    path: '/behaviour/',
    component: BehaviourPage,
  },
  {
    path: '/docs/',
    component: DocsPage,
  },
  {
    path: '/sports/',
    component: SportsPage,
  },
  {
    path: '/teachers/',
    component: TeachersPage,
  },
  {
    path: '/prefs/',
    component: PreferencesPage,
  },
  {
    path: '/attendee/',
    component: AttendeePage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/rooms/',
    component: RoomsPage,
  },
  {
    path: '/quota/',
    component: QuotaPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
    options: {
      transition: 'f7-dive',
    },
  },
  {
    path: '/classworks/',
    component: ClassworksPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
