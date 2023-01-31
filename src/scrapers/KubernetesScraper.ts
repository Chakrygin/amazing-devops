import * as core from '@actions/core';

import axios from 'axios';
import * as cheerio from 'cheerio';
import moment from 'moment';

import { Scraper } from 'core/scrapers';
import { Post, Link } from 'core/posts';

export default class KubernetesScraper implements Scraper {
  readonly name = 'Kubernetes';
  readonly path = 'kubernetes.io';

  private readonly blog: Link = {
    title: 'Kubernetes Blog',
    href: 'https://kubernetes.io/blog/',
  };

  async *scrape(): AsyncGenerator<Post> {
    core.info(`Parsing html page by url '${this.blog.href}'...`);

    const response = await axios.get(this.blog.href);
    const $ = cheerio.load(response.data as string);
    const articles = $('main>div>div>ul:first-of-type>li>div.media-body').toArray();

    if (articles.length == 0) {
      throw new Error('Failed to parse html page. No posts found.');
    }

    core.info(`Html page parsed. Number of posts found is ${articles.length}.`);

    for (let index = 0; index < articles.length; index++) {
      core.info(`Parsing post at index ${index}...`);

      const article = $(articles[index]);
      const link = article.find('h5 a');
      const title = link.text();
      const href = this.getFullHref(link.attr('href')) ?? '';
      const date = this.getDate(article, $);

      let post: Post = {
        title,
        href,
        categories: [
          this.blog,
        ],
        date: moment(date, 'LL'),
        links: [
          {
            title: 'Read more',
            href: href,
          },
        ],
      };

      post = await this.enrichPost(post);

      yield post;
    }
  }

  private getFullHref(href: string | undefined): string | undefined {
    if (href?.startsWith('/')) {
      href = 'https://kubernetes.io' + href;
    }

    return href;
  }

  private getDate(article: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string {
    const match = $(article)
      .find('p:first-of-type small')
      .text()
      .match(/\w+ \d{2}, \d{4}/);

    return match?.at(0) ?? '';
  }

  protected async enrichPost(post: Post): Promise<Post> {
    core.info(`Parsing html page by url '${post.href}'...`);

    const response = await axios.get(post.href);
    const $ = cheerio.load(response.data as string);
    const article = $('main>div.td-content');
    const image = this.getImage(article, $);
    const description = this.getDescription(article, $);

    post = {
      ...post,
      image,
      description,
    };

    return post;
  }

  private getDescription(article: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string[] {
    const description = [];

    const elements = $(article).children();
    for (const element of elements) {
      if (element.name == 'p') {
        const text = $(element)
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
        break
      }
    }

    return description;
  }

  private getImage(article: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string | undefined {
    const imgs = $(article).find('img');
    for (const img of imgs) {
      const src = $(img).attr('src');
      if (src) {
        const success =
          src.endsWith('.png');

        if (success) {
          return src;
        }
      }
    }
  }
}
