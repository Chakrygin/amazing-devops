import { App } from '@core/App';

import { DevBlogsScraper } from './scrapers/DevBlogsScraper';
import { HabrScraper } from './scrapers/HabrScraper';
import { KubernetesScraper } from './scrapers/KubernetesScraper';

const app = new App(() => [
  new DevBlogsScraper('commandline'),
  new DevBlogsScraper('powershell'),
  new HabrScraper('devops'),
  new HabrScraper('it-infrastructure'),
  new HabrScraper('kubernetes'),
  new HabrScraper('postgresql'),
  new KubernetesScraper(),
]);

void app.run();
