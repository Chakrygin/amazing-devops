import { App } from 'core';

import DevBlogsScraper from './scrapers/DevBlogsScraper'
import HabrScraper from './scrapers/HabrScraper'

const app = new App(() => [
  new DevBlogsScraper('commandline'),
  new DevBlogsScraper('powershell'),
  new HabrScraper('devops'),
  new HabrScraper('kubernetes'),
]);

void app.run();
