import { testScraper } from '@core/testing';

import { DevBlogsScraper } from '../src/scrapers/DevBlogsScraper';

test('DevBlogs / Windows Command Line', async () => {
  await testScraper(() => new DevBlogsScraper('commandline'));
});

test('DevBlogs / PowerShell Team', async () => {
  await testScraper(() => new DevBlogsScraper('powershell'));
});
