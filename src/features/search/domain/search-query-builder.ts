/**
 * Search query builder
 */

import type { SearchQuery, SearchFilters, SearchSort } from '../types';

export class SearchQueryBuilder {
  private query: Partial<SearchQuery> = {
    text: '',
    filters: {},
  };

  setText(text: string): this {
    this.query.text = text;
    return this;
  }

  addLanguageFilter(language: string): this {
    if (!this.query.filters!.languages) {
      this.query.filters!.languages = [];
    }
    this.query.filters!.languages.push(language);
    return this;
  }

  addSkillFilter(skill: string): this {
    if (!this.query.filters!.skills) {
      this.query.filters!.skills = [];
    }
    this.query.filters!.skills.push(skill);
    return this;
  }

  setLocationFilter(location: string): this {
    this.query.filters!.location = location;
    return this;
  }

  setStarsRange(min?: number, max?: number): this {
    if (min !== undefined) {
      this.query.filters!.minStars = min;
    }
    if (max !== undefined) {
      this.query.filters!.maxStars = max;
    }
    return this;
  }

  setSort(field: SearchSort['field'], order: SearchSort['order'] = 'desc'): this {
    this.query.sort = { field, order };
    return this;
  }

  setPagination(page: number, perPage: number = 20): this {
    this.query.pagination = { page, perPage };
    return this;
  }

  build(): SearchQuery {
    return {
      text: this.query.text || '',
      filters: this.query.filters || {},
      sort: this.query.sort,
      pagination: this.query.pagination || { page: 1, perPage: 20 },
    };
  }

  static fromUrl(params: URLSearchParams): SearchQuery {
    const builder = new SearchQueryBuilder();

    const text = params.get('q');
    if (text) builder.setText(text);

    const languages = params.get('languages');
    if (languages) {
      languages.split(',').forEach((lang) => builder.addLanguageFilter(lang));
    }

    const skills = params.get('skills');
    if (skills) {
      skills.split(',').forEach((skill) => builder.addSkillFilter(skill));
    }

    const location = params.get('location');
    if (location) builder.setLocationFilter(location);

    const minStars = params.get('minStars');
    const maxStars = params.get('maxStars');
    if (minStars || maxStars) {
      builder.setStarsRange(
        minStars ? parseInt(minStars) : undefined,
        maxStars ? parseInt(maxStars) : undefined
      );
    }

    const sort = params.get('sort');
    const order = params.get('order') as 'asc' | 'desc';
    if (sort) {
      builder.setSort(sort as any, order || 'desc');
    }

    const page = params.get('page');
    const perPage = params.get('perPage');
    builder.setPagination(
      page ? parseInt(page) : 1,
      perPage ? parseInt(perPage) : 20
    );

    return builder.build();
  }
}

