import { App } from 'core';

import DevBlogsScraper from './scrapers/DevBlogsScraper'
import HabrScraper from './scrapers/HabrScraper'
import KubernetesScraper from './scrapers/KubernetesScraper'

const app = new App(() => [
  new DevBlogsScraper('commandline'),
  new DevBlogsScraper('powershell'),
  new HabrScraper('devops'),
  new HabrScraper('kubernetes'),
  new KubernetesScraper(),
]);

void app.run();
