# Changelog
#### es-utils

Simple journal of changes made to package.

---

### [2026-01-26] - `1.12.4`

Add delay clamp to Retry via maxDelay, rename maxAttempts to not confuse

### [2026-01-25] - `1.12.3`

Move Array index proxy under Symbol to prevent failure due to Object.getOwnPropertyNames

### [2026-01-25] - `1.12.2`

Fix problems with esbuild vs global await in Promise extension module

### [2026-01-25] - `1.12.1`

Add cancellation ability to Retry and Promise.after; update docs

### [2026-01-24] - `1.12.0`

Added Retry utility for exponential backoff retry of a promise producer

### [2026-01-24] - `1.11.1`

Move after function to Promise static extension method

### [2025-09-08] - `1.11.0`

Added tagging utility to log

### [2025-09-08] - `1.10.0`

Added factory method to Iter

### [2025-09-06] - `1.9.0`

Added Object.also for conditional transformation of defined values

### [2025-09-05] - `1.8.0`

Added custom Iter(ator) helper

### [2025-09-05] - `1.7.0`

Added extension for unsafe `at`-like indexing of Arrays via lezy-proxy $.

### [2025-08-31] - `1.6.0`

Added JSON.maybeStringify for safe debugging of object values.

### [2025-08-31] - `1.5.1`

Refactor SC.Message.expect to SC.Message.handler, to be passable to `.catch()` instead of wrapping promise

### [2025-08-30] - `1.5.0`

Added Error.todo and backing TodoError class.

### [2025-08-29] - `1.4.0`

Add String division (chunking).

### [2025-08-29] - `1.3.1`

Fixed wrong refactorung of Enum (missing `const` for generic type). 

### [2025-08-18] - `1.3.0`

Added ES2024 Set operators.

### [2025-08-17] - `1.2.0`

Added function after, refactored Enum into dynamic class, minor linting changes.

### [2025-08-06] - `1.1.1`

Fix docs and project structure.

### [2025-08-06] - `1.1.0`

Documentation revamp, addition of several APIs, standalone modules for exported extension/polyfill deps.

### [2025-07-03] - `1.0.0`

Initial release.
