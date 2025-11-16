/**
 * Legacy format utilities - re-exports from split modules
 * @deprecated Use specific modules instead (e.g., NumberUtils, DateUtils, StringUtils)
 */

export {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatCompact,
  formatBytes,
} from './number/format';

export {
  formatDate,
  formatDateRelative,
  formatDateShort,
  formatDateLong,
  formatTime,
} from './date/format';

export {
  truncateString,
  truncateWords,
  truncateMiddle,
} from './string/truncate';

export {
  capitalizeFirstLetter,
  capitalizeWords,
  capitalizeAll,
} from './string/capitalize';

export {
  toKebabCase,
  toSnakeCase,
  toCamelCase,
  toPascalCase,
} from './string/case-conversion';
