import { App } from 'core';

import HabrScraper from './scrapers/HabrScraper'

const app = new App(() => [
  new HabrScraper('devops'),
  new HabrScraper('kubernetes'),
]);

void app.run();
