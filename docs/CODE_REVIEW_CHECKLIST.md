# Code Review Checklist

Use this checklist when reviewing pull requests to ensure code quality and consistency.

## Architecture & Design

- [ ] Changes follow layered architecture principles
- [ ] No circular dependencies between layers
- [ ] Presentation layer doesn't directly import from Infrastructure or Domain
- [ ] Domain layer remains framework-agnostic
- [ ] New code placed in appropriate layer
- [ ] Services use dependency injection where appropriate

## Code Quality

- [ ] Code follows project style guide
- [ ] Variable and function names are descriptive
- [ ] No magic numbers or hardcoded values
- [ ] Complex logic has explanatory comments
- [ ] No commented-out code
- [ ] No console.log statements (except in error handlers)
- [ ] Files are under 500 lines (max 800 for exceptions)

## TypeScript

- [ ] No `any` types (use `unknown` if needed)
- [ ] Proper type annotations for function parameters and returns
- [ ] Interfaces properly defined and exported
- [ ] Type guards used for runtime type checking
- [ ] Enums used instead of string literals where appropriate
- [ ] No TypeScript errors or warnings

## React Best Practices

- [ ] Components are functional (not class-based)
- [ ] Hooks used correctly (no violations of rules of hooks)
- [ ] Dependencies in useEffect are complete
- [ ] Complex logic extracted to custom hooks
- [ ] Props properly typed with interfaces
- [ ] No prop drilling (use context if needed)
- [ ] Memoization used where appropriate (useMemo, useCallback)

## Testing

- [ ] Unit tests added for new functions/utilities
- [ ] Integration tests added for new features
- [ ] Tests are meaningful (not just for coverage)
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Mocks/stubs used appropriately
- [ ] Test names clearly describe what is being tested

## Security

- [ ] User input is validated and sanitized
- [ ] No sensitive data in logs or error messages
- [ ] API endpoints have proper authentication/authorization
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS prevention (proper escaping)
- [ ] No hardcoded secrets or tokens

## Performance

- [ ] No unnecessary re-renders
- [ ] Large lists use virtualization if needed
- [ ] Images properly optimized
- [ ] API calls properly cached
- [ ] Database queries optimized (no N+1 queries)
- [ ] Expensive operations memoized

## Accessibility

- [ ] Interactive elements have proper ARIA labels
- [ ] Keyboard navigation works correctly
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader compatible
- [ ] Forms have proper labels and error messages

## Error Handling

- [ ] All async operations have try-catch blocks
- [ ] Errors are logged appropriately
- [ ] User-friendly error messages shown
- [ ] Edge cases handled gracefully
- [ ] No silent failures

## Database & API

- [ ] Database migrations are reversible
- [ ] API endpoints follow RESTful conventions
- [ ] Request/response properly typed
- [ ] Proper HTTP status codes used
- [ ] Rate limiting considered
- [ ] Pagination implemented for large datasets

## Documentation

- [ ] Public APIs have JSDoc comments
- [ ] Complex logic explained in comments
- [ ] README updated if needed
- [ ] ADR created for architectural decisions
- [ ] Type definitions properly documented

## Git & Commits

- [ ] Commit messages follow conventional commits format
- [ ] Commits are atomic and focused
- [ ] No unrelated changes in PR
- [ ] Branch up to date with main
- [ ] No merge conflicts

## Pre-Merge

- [ ] All CI checks passing
- [ ] No linter errors or warnings
- [ ] All tests passing
- [ ] Build succeeds
- [ ] Changes tested locally
- [ ] Breaking changes documented

## Final Questions

- [ ] Does this change align with project goals?
- [ ] Is there a simpler way to achieve this?
- [ ] Are there any potential side effects?
- [ ] Will this scale as the project grows?
- [ ] Is this maintainable by other team members?

---

## Review Severity Levels

### 🔴 Blocker
- Must be fixed before merge
- Examples: Security issues, breaking changes, architecture violations

### 🟡 Major
- Should be fixed before merge
- Examples: Poor performance, missing tests, unclear code

### 🟢 Minor
- Can be addressed in follow-up
- Examples: Formatting, minor optimizations, documentation improvements

### 💡 Suggestion
- Optional improvement
- Examples: Alternative approaches, refactoring ideas

