import { HabrScraperBase } from '@core/scrapers/shared';

const hubs = {
  'devops': 'DevOps',
  'it-infrastructure': 'IT-инфраструктура',
  'kubernetes': 'Kubernetes',
  'postgresql': 'PostgreSQL',
};

export default class HabrScraper extends HabrScraperBase {
  constructor(id: keyof typeof hubs) {
    super(id, hubs[id], {
      minRating: 20,
    });
  }
}
