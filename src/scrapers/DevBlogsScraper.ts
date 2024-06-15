import { DevBlogsScraperBase } from '@core/scrapers/shared';

const blogs = {
  'commandline': 'Windows Command Line',
  'powershell': 'PowerShell Team',
};

export class DevBlogsScraper extends DevBlogsScraperBase {
  constructor(id: keyof typeof blogs) {
    super(id, blogs[id]);
  }
}
