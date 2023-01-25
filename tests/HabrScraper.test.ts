import { testScraper } from 'core/testing';

import HabrScraper from '../src/scrapers/HabrScraper'

test('Habr / DevOps', async () => {
  await testScraper(() => new HabrScraper('devops'));
});


test('Habr / Kubernetes', async () => {
  await testScraper(() => new HabrScraper('kubernetes'));
});
