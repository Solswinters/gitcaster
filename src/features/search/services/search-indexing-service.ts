/**
 * Search Indexing Service - Build and maintain search indexes for fast queries
 * FEATURE: Improve search performance with pre-built indexes
 */

export interface SearchDocument {
  id: string;
  type: 'profile' | 'repository' | 'user' | 'skill';
  title: string;
  description: string;
  tags: string[];
  metadata: Record<string, any>;
  score: number;
  timestamp: Date;
}

export interface IndexConfig {
  fields: string[];
  weights: Record<string, number>;
  stopWords?: string[];
  minWordLength?: number;
  caseSensitive?: boolean;
}

export interface SearchIndex {
  documents: Map<string, SearchDocument>;
  invertedIndex: Map<string, Set<string>>;
  fieldIndex: Map<string, Map<string, Set<string>>>;
  config: IndexConfig;
  lastUpdated: Date;
}

export class SearchIndexingService {
  private indexes: Map<string, SearchIndex> = new Map();
  private stopWords: Set<string> = new Set([
    'a',
    'an',
    'and',
    'are',
    'as',
    'at',
    'be',
    'by',
    'for',
    'from',
    'has',
    'he',
    'in',
    'is',
    'it',
    'its',
    'of',
    'on',
    'that',
    'the',
    'to',
    'was',
    'will',
    'with',
  ]);

  constructor() {
    // Initialize default indexes
    this.createIndex('profiles', {
      fields: ['title', 'description', 'tags', 'skills'],
      weights: {
        title: 3,
        tags: 2,
        skills: 2,
        description: 1,
      },
    });

    this.createIndex('repositories', {
      fields: ['name', 'description', 'language', 'topics'],
      weights: {
        name: 3,
        topics: 2,
        language: 2,
        description: 1,
      },
    });
  }

  /**
   * Create a new search index
   */
  createIndex(name: string, config: IndexConfig): void {
    this.indexes.set(name, {
      documents: new Map(),
      invertedIndex: new Map(),
      fieldIndex: new Map(),
      config: {
        ...config,
        stopWords: config.stopWords || Array.from(this.stopWords),
        minWordLength: config.minWordLength || 2,
        caseSensitive: config.caseSensitive || false,
      },
      lastUpdated: new Date(),
    });
  }

  /**
   * Add document to index
   */
  addDocument(indexName: string, document: SearchDocument): void {
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index "${indexName}" not found`);
    }

    // Store document
    index.documents.set(document.id, document);

    // Build inverted index
    this.buildInvertedIndex(index, document);

    // Build field indexes
    this.buildFieldIndexes(index, document);

    index.lastUpdated = new Date();
  }

  /**
   * Add multiple documents
   */
  addDocuments(indexName: string, documents: SearchDocument[]): void {
    documents.forEach((doc) => this.addDocument(indexName, doc));
  }

  /**
   * Update document in index
   */
  updateDocument(indexName: string, document: SearchDocument): void {
    this.removeDocument(indexName, document.id);
    this.addDocument(indexName, document);
  }

  /**
   * Remove document from index
   */
  removeDocument(indexName: string, documentId: string): void {
    const index = this.indexes.get(indexName);
    if (!index) return;

    const document = index.documents.get(documentId);
    if (!document) return;

    // Remove from inverted index
    for (const [term, docIds] of index.invertedIndex.entries()) {
      docIds.delete(documentId);
      if (docIds.size === 0) {
        index.invertedIndex.delete(term);
      }
    }

    // Remove from field indexes
    for (const [field, termMap] of index.fieldIndex.entries()) {
      for (const [term, docIds] of termMap.entries()) {
        docIds.delete(documentId);
        if (docIds.size === 0) {
          termMap.delete(term);
        }
      }
    }

    // Remove document
    index.documents.delete(documentId);

    index.lastUpdated = new Date();
  }

  /**
   * Build inverted index for document
   */
  private buildInvertedIndex(
    index: SearchIndex,
    document: SearchDocument
  ): void {
    const terms = this.extractTerms(document, index.config);

    for (const term of terms) {
      if (!index.invertedIndex.has(term)) {
        index.invertedIndex.set(term, new Set());
      }
      index.invertedIndex.get(term)!.add(document.id);
    }
  }

  /**
   * Build field indexes for document
   */
  private buildFieldIndexes(
    index: SearchIndex,
    document: SearchDocument
  ): void {
    for (const field of index.config.fields) {
      if (!index.fieldIndex.has(field)) {
        index.fieldIndex.set(field, new Map());
      }

      const fieldIndex = index.fieldIndex.get(field)!;
      const fieldValue = this.getFieldValue(document, field);

      if (fieldValue) {
        const terms = this.tokenize(fieldValue, index.config);

        for (const term of terms) {
          if (!fieldIndex.has(term)) {
            fieldIndex.set(term, new Set());
          }
          fieldIndex.get(term)!.add(document.id);
        }
      }
    }
  }

  /**
   * Extract terms from document
   */
  private extractTerms(
    document: SearchDocument,
    config: IndexConfig
  ): Set<string> {
    const terms = new Set<string>();

    // Extract from each field
    for (const field of config.fields) {
      const value = this.getFieldValue(document, field);
      if (value) {
        const fieldTerms = this.tokenize(value, config);
        fieldTerms.forEach((term) => terms.add(term));
      }
    }

    return terms;
  }

  /**
   * Get field value from document
   */
  private getFieldValue(document: SearchDocument, field: string): string {
    if (field === 'title') return document.title;
    if (field === 'description') return document.description;
    if (field === 'tags') return document.tags.join(' ');

    // Check metadata
    const value = document.metadata[field];
    if (Array.isArray(value)) return value.join(' ');
    return value ? String(value) : '';
  }

  /**
   * Tokenize text into terms
   */
  private tokenize(text: string, config: IndexConfig): string[] {
    let processed = text;

    // Case sensitivity
    if (!config.caseSensitive) {
      processed = processed.toLowerCase();
    }

    // Split into words
    const words = processed
      .split(/[\s\-_.,;:!?()\[\]{}]+/)
      .filter((w) => w.length >= (config.minWordLength || 2));

    // Remove stop words
    const stopWords = new Set(config.stopWords || []);
    return words.filter((word) => !stopWords.has(word));
  }

  /**
   * Search index
   */
  search(
    indexName: string,
    query: string,
    options: {
      fields?: string[];
      limit?: number;
      offset?: number;
      fuzzy?: boolean;
    } = {}
  ): SearchDocument[] {
    const index = this.indexes.get(indexName);
    if (!index) return [];

    const queryTerms = this.tokenize(query, index.config);
    if (queryTerms.length === 0) return [];

    // Find matching documents
    const scores = new Map<string, number>();

    for (const term of queryTerms) {
      // Search in inverted index
      const matchingDocs = index.invertedIndex.get(term) || new Set();

      for (const docId of matchingDocs) {
        scores.set(docId, (scores.get(docId) || 0) + 1);
      }

      // Field-specific search
      if (options.fields) {
        for (const field of options.fields) {
          const fieldIndex = index.fieldIndex.get(field);
          if (fieldIndex) {
            const fieldMatches = fieldIndex.get(term) || new Set();
            const weight = index.config.weights[field] || 1;

            for (const docId of fieldMatches) {
              scores.set(docId, (scores.get(docId) || 0) + weight);
            }
          }
        }
      }

      // Fuzzy matching
      if (options.fuzzy) {
        const fuzzyMatches = this.fuzzySearch(term, index.invertedIndex);
        for (const [matchTerm, matchDocs] of fuzzyMatches) {
          const similarity = this.similarity(term, matchTerm);
          for (const docId of matchDocs) {
            scores.set(docId, (scores.get(docId) || 0) + similarity);
          }
        }
      }
    }

    // Get documents and sort by score
    const results = Array.from(scores.entries())
      .map(([docId, score]) => ({
        document: index.documents.get(docId)!,
        score,
      }))
      .sort((a, b) => b.score - a.score);

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 10;
    const paginatedResults = results.slice(offset, offset + limit);

    return paginatedResults.map((r) => r.document);
  }

  /**
   * Fuzzy search for similar terms
   */
  private fuzzySearch(
    term: string,
    invertedIndex: Map<string, Set<string>>
  ): Map<string, Set<string>> {
    const results = new Map<string, Set<string>>();

    for (const [indexedTerm, docs] of invertedIndex.entries()) {
      const distance = this.levenshteinDistance(term, indexedTerm);
      if (distance <= 2) {
        // Allow up to 2 character differences
        results.set(indexedTerm, docs);
      }
    }

    return results;
  }

  /**
   * Calculate similarity between two strings
   */
  private similarity(a: string, b: string): number {
    const distance = this.levenshteinDistance(a, b);
    const maxLength = Math.max(a.length, b.length);
    return 1 - distance / maxLength;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Get index statistics
   */
  getIndexStats(indexName: string): {
    documentCount: number;
    termCount: number;
    lastUpdated: Date;
    indexSize: number;
  } | null {
    const index = this.indexes.get(indexName);
    if (!index) return null;

    return {
      documentCount: index.documents.size,
      termCount: index.invertedIndex.size,
      lastUpdated: index.lastUpdated,
      indexSize: this.calculateIndexSize(index),
    };
  }

  /**
   * Calculate index size (approximate)
   */
  private calculateIndexSize(index: SearchIndex): number {
    let size = 0;

    // Approximate size of documents
    size += index.documents.size * 500; // ~500 bytes per document

    // Approximate size of inverted index
    for (const [term, docs] of index.invertedIndex.entries()) {
      size += term.length + docs.size * 50;
    }

    return size;
  }

  /**
   * Rebuild index
   */
  rebuildIndex(indexName: string): void {
    const index = this.indexes.get(indexName);
    if (!index) return;

    const documents = Array.from(index.documents.values());

    // Clear index
    index.invertedIndex.clear();
    index.fieldIndex.clear();

    // Rebuild
    documents.forEach((doc) => {
      this.buildInvertedIndex(index, doc);
      this.buildFieldIndexes(index, doc);
    });

    index.lastUpdated = new Date();
  }

  /**
   * Clear index
   */
  clearIndex(indexName: string): void {
    const index = this.indexes.get(indexName);
    if (!index) return;

    index.documents.clear();
    index.invertedIndex.clear();
    index.fieldIndex.clear();
    index.lastUpdated = new Date();
  }

  /**
   * Delete index
   */
  deleteIndex(indexName: string): boolean {
    return this.indexes.delete(indexName);
  }

  /**
   * Get all index names
   */
  getIndexNames(): string[] {
    return Array.from(this.indexes.keys());
  }

  /**
   * Export index
   */
  exportIndex(indexName: string): string | null {
    const index = this.indexes.get(indexName);
    if (!index) return null;

    return JSON.stringify({
      config: index.config,
      documents: Array.from(index.documents.entries()),
      lastUpdated: index.lastUpdated,
    });
  }

  /**
   * Import index
   */
  importIndex(indexName: string, data: string): void {
    const parsed = JSON.parse(data);

    this.createIndex(indexName, parsed.config);
    const index = this.indexes.get(indexName)!;

    // Import documents
    for (const [id, doc] of parsed.documents) {
      this.addDocument(indexName, doc);
    }

    index.lastUpdated = new Date(parsed.lastUpdated);
  }
}

export default SearchIndexingService;

