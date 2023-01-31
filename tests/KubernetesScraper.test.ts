import { testScraper } from 'core/testing';

import KubernetesScraper from '../src/scrapers/KubernetesScraper'

test('Kubernetes', async () => {
  await testScraper(() => new KubernetesScraper());
});
