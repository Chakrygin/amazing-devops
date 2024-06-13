import * as cheerio from 'cheerio';
import moment from 'moment';

import { Link, Post } from '@core/models';
import { ScraperBase } from '@core/scrapers';

export default class KubernetesScraper extends ScraperBase {
  readonly name = 'Kubernetes';
  readonly path = 'kubernetes.io';

  private readonly Kubernetes: Link = {
    title: 'Kubernetes Blog',
    href: 'https://kubernetes.io/blog/',
  };

  protected override fetchPosts(): AsyncGenerator<Post> {
    return this
      .fromHtmlPage(this.Kubernetes.href)
      .fetchPosts('main>div>div>ul:first-of-type>li>div.media-body', ($, element) => {

        const link = element.find('h5>a');
        const title = link.text();
        const href = link.attr('href') ?? '';
        const date = this.getDate($, element);

        return {
          title,
          href: this.getFullHref(href),
          categories: [this.Kubernetes],
          date: moment(date, 'LL')
        };

      });
  }

  protected override enrichPost(post: Post): Promise<Post | undefined> {
    return this
      .fromHtmlPage(post.href)
      .enrichPost('main>div.td-content', ($, element) => {

        const image = this.getImage($, element);
        const description = this.getDescription($, element);

        return {
          ...post,
          image: this.getFullImageHref(image, post.href),
          description,
        };

      });
  }

  private getFullHref(href: string): string {
    if (href.startsWith('/')) {
      href = 'https://kubernetes.io' + href;
    }

    return href;
  }

  private getDate($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string {
    const match = $(element)
      .find('p:first-of-type small')
      .text()
      .match(/\w+ \d{2}, \d{4}/);

    return match?.at(0) ?? '';
  }

  private getImage($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | undefined {
    const imgs = $(element).find('img');
    for (const img of imgs) {
      const src = $(img).attr('src');
      if (src) {
        const success =
          src.endsWith('.jpeg') ||
          src.endsWith('.jpg') ||
          src.endsWith('.png');

        if (success) {
          return src;
        }
      }
    }
  }

  private getFullImageHref(href: string | undefined, baseHref: string): string | undefined {
    if (href) {
      if (href.startsWith('https://')) {
        return href;
      }

      if (href.startsWith('/')) {
        return 'https://kubernetes.io' + href;
      }

      if (!href.includes('/') && baseHref.endsWith('/')) {
        return baseHref + href;
      }
    }
  }

  private getDescription($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string[] {
    const description = [];

    const children = $(element).children();
    for (const child of children) {
      if (child.name == 'p') {
        const text = $(child)
          .text()
          .trim()
          .replace(/\s+/g, ' ');

        if (text) {
          description.push(text);

          if (description.length > 4) {
            break;
          }
        }
      }
      else if (description.length > 0) {
        break;
      }
    }

    return description;
  }
}
