# Architectural Decision Records (ADR)

This directory contains records of architectural decisions made for the GitCaster project.

## What is an ADR?

An ADR is a document that captures an important architectural decision made along with its context and consequences.

## Format

Each ADR follows this structure:

1. **Title**: Short noun phrase
2. **Status**: Proposed, Accepted, Deprecated, Superseded
3. **Context**: What is the issue we're seeing?
4. **Decision**: What are we going to do?
5. **Consequences**: What becomes easier or harder?
6. **Alternatives Considered**: What else did we think about?

## Index

- [ADR-0001](./0001-layered-architecture.md) - Adopting Layered Architecture
- [ADR-0002](./0002-dependency-injection.md) - Implementing Dependency Injection
- [ADR-0003](./0003-domain-validators.md) - Domain-Level Validation

## Contributing

When making significant architectural decisions:

1. Create a new ADR file: `NNNN-title-with-dashes.md`
2. Use the next sequential number
3. Follow the standard format
4. Get team review before accepting
5. Update this index

