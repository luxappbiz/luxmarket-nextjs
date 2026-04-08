# Development Tasklist

## Executive Summary
The codebase is functional, builds successfully on Next 16.2.2, and has a clear product direction, but it currently relies on weak security boundaries and duplicated client-side state management. The highest-value work is not visual polish; it is hardening the commerce/auth architecture so checkout, account, and messaging flows are easier to trust and maintain. Outside of that, there are a few areas where placeholder UI, duplicate implementations, and missing automated coverage are raising long-term cost more than they should.

## Major Feature Improvements

### 1. Turn The Account Area Into A Real Product Surface
- **Priority**: Medium
- **Description**: The account experience looks substantial, but several sections are still placeholders or partially wired. `app/(main)/account/page.tsx` contains empty orders, fake address data, non-persisted form editing, and settings toggles with no backend integration. This creates a mismatch between the UI and what users can actually do.
- **Proposed Solution**: Define a real account domain layer and connect each tab to live APIs or server actions for profile updates, addresses, payment methods, orders, and membership status. Split the page into route-level sections or tab modules backed by explicit data fetchers rather than static placeholder content.
- **Estimated Effort**: Large
- **Rationale**: This is one of the highest user-value surfaces after authentication. Completing it would improve trust, reduce confusion, and make the product feel materially more finished.
- **Dependencies / Risks**: Depends on available backend endpoints for profile, address, and order management. May require WordPress/WooCommerce API additions if those capabilities do not already exist.

## Major Bug Fixes / Technical Debt

### ✅ 2. Remove Privileged Commerce Credentials From Client Bundles
- **Priority**: High
- **Description**: WooCommerce and related credentials are currently configured with `NEXT_PUBLIC_*` variables and consumed directly in browser-side code, including `lib/products-api.ts`, `lib/account-api.ts`, `app/(main)/checkout/page.tsx`, and `checkout-module/index.ts`. That makes privileged keys part of the client boundary and weakens the security model significantly.
- **Proposed Solution**: Move all privileged WooCommerce and WordPress interactions behind server actions or internal API route handlers. Replace browser-facing secrets with server-only environment variables, proxy only the minimum data the UI needs, and rotate any credentials that have already been exposed client-side.
- **Estimated Effort**: Large
- **Rationale**: This is the most important issue in the repository. It affects security, operational safety, and future maintainability across checkout, catalog, and account features.
- **Dependencies / Risks**: Requires backend/API contract work and credential rotation. Some existing frontend flows may need to be redesigned around server-owned requests.

### ✅ 3. Consolidate Authentication And Session State Into One Model
- **Priority**: High
- **Description**: Authentication is currently implemented through overlapping mechanisms with inconsistent keys and storage rules. Examples include `contexts/UserContext.tsx`, `hooks/useAuth.ts`, `lib/api.ts`, `lib/auth.ts`, and `app/actions/auth.ts`, which variously use `user`, `lux_user`, `lux_token`, `lux_auth_token`, `user_info`, and `app_password`. Some code reads cookies, some reads `localStorage`, and some attempts both. This makes auth bugs difficult to reason about and increases the chance of stale or partial session state.
- **Proposed Solution**: Define a single session contract for token, user payload, and refresh/logout behavior. Prefer server-owned cookies for auth, keep client state derived from that source of truth, and remove legacy fallback paths once migration is complete. Centralize session reads/writes in one module or provider.
- **Estimated Effort**: Large
- **Rationale**: A unified auth model will reduce breakage across protected routes, header state, account flows, and checkout. It also removes a major source of accidental complexity.
- **Dependencies / Risks**: Session migration must be handled carefully to avoid logging users out unexpectedly or breaking middleware/proxy behavior.

### 4. Make Checkout Server-Authoritative For Plan Data And Pricing
- **Priority**: High
- **Description**: The checkout route currently trusts URL query parameters for `productId`, `variationId`, `price`, `period`, `interval`, and `planName` in `app/(main)/checkout/page.tsx`. The checkout flow then constructs order data client-side and couples it to exposed WooCommerce credentials. This makes checkout fragile and easier to tamper with than it should be.
- **Proposed Solution**: Replace query-string driven checkout setup with a server-side lookup keyed by a stable plan identifier. Resolve pricing, variation IDs, subscription metadata, and payment intent/order creation on the server. The client should submit intent, not authority.
- **Estimated Effort**: Large
- **Rationale**: This improves security, reliability, and future pricing flexibility. It also reduces the chance of mismatched plans, stale client config, or invalid order payloads.
- **Dependencies / Risks**: Depends on backend support for authoritative plan retrieval and order/session creation. Requires coordinated testing of subscription flows.

### 5. Add Automated Coverage For Critical User Journeys
- **Priority**: Medium
- **Description**: The repository currently has build and lint scripts but no real automated test suite for auth, checkout, messaging, or account behavior. Given the amount of stateful client logic and external API coupling, regressions are likely to be expensive and easy to miss.
- **Proposed Solution**: Introduce a pragmatic test pyramid: unit tests for helpers and reducers, component tests for forms and conditional flows, and a small set of end-to-end tests covering login, membership checkout, protected account access, and messaging navigation.
- **Estimated Effort**: Large
- **Rationale**: The codebase has reached the point where manual verification alone is not a good control mechanism. Tests would materially lower the risk of future upgrades and refactors.
- **Dependencies / Risks**: Requires selecting a test stack and deciding how to mock or stage WordPress/WooCommerce dependencies.

### 6. Resolve Current Production Dependency Vulnerabilities
- **Priority**: Medium
- **Description**: `npm audit --omit=dev` currently reports a high-severity `axios` issue and a critical `form-data` issue. Because these libraries sit on request paths used throughout the application, they are worth addressing rather than carrying indefinitely.
- **Proposed Solution**: Update vulnerable transitive and direct dependencies, re-run build and smoke tests, and capture any required code changes from the upgrade. If a package cannot be upgraded immediately, document the exposure and containment plan.
- **Estimated Effort**: Small
- **Rationale**: This is a relatively low-cost risk reduction task with clear security and maintenance value.
- **Dependencies / Risks**: Dependency updates may change request behavior or error surfaces and should be validated against WordPress/WooCommerce integrations.

## Minor Feature Improvements / Polish

### 7. Source Membership Plans From Backend Configuration Instead Of Hardcoding Them
- **Priority**: Medium
- **Description**: Membership options are currently hardcoded in `app/(main)/membership/page.tsx`, including product IDs, variation IDs, prices, and copy. That makes content changes operationally expensive and tightly couples pricing to redeploys.
- **Proposed Solution**: Load plan definitions from a backend endpoint or CMS-managed configuration, then render the membership page from that source. Keep the UI shape, but move plan metadata out of source code.
- **Estimated Effort**: Medium
- **Rationale**: This is a useful product improvement once checkout is server-authoritative. It reduces operational overhead and lets the business team change offers safely.
- **Dependencies / Risks**: Best implemented after the checkout hardening work so the backend becomes the single source of truth.

## Minor Bug Fixes / Cleanup

### 8. Eliminate Duplicate Implementations In Catalog And Product Creation Flows
- **Priority**: Medium
- **Description**: There are near-duplicate implementations for category browsing and product creation, including `components/Category.tsx` vs. `components/category/container.tsx`, and `components/create/Product.tsx` vs. `components/account/CreateProductTab.tsx`. These copies will drift and force fixes to be made multiple times.
- **Proposed Solution**: Extract shared logic into reusable hooks/components and keep one canonical implementation per feature. Route-specific behavior should be passed through props, not maintained in copied files.
- **Estimated Effort**: Medium
- **Rationale**: This is straightforward technical debt with a clear maintenance payoff. It will make future bug fixes cheaper and reduce inconsistent behavior across routes.
- **Dependencies / Risks**: Moderate regression risk if both copies have already diverged subtly; refactor should be validated with manual QA.

### 9. Repair Messaging Hardcodes, Inconsistent Endpoints, And Destructive UI Patterns
- **Priority**: Medium
- **Description**: The messaging area contains several brittle details: hardcoded filtering of conversation `id !== 123`, a hardcoded delete endpoint to `api.luxclub.com` in `components/messages/messageBubble.tsx`, `window.confirm` and `window.location.reload()` in `components/messages/chatDetails.tsx`, and multiple hook dependency/state issues already surfaced by lint. The feature works, but it is more fragile than necessary.
- **Proposed Solution**: Normalize messaging API access behind a shared client, remove hardcoded IDs/domains, replace browser-native destructive prompts with app-level dialogs/toasts, and clean up state flow in conversation/message loaders.
- **Estimated Effort**: Medium
- **Rationale**: Messaging is user-facing and stateful. Tightening this area should improve reliability without needing a full rewrite.
- **Dependencies / Risks**: Some hardcoded behaviors may exist as temporary workarounds for backend data issues; confirm intent before removing them.

### ✅ 10. Remove Debug Logging And Align Repository Documentation With Reality
- **Priority**: Low
- **Description**: The codebase still contains numerous `console.log` statements in production paths, and the README no longer reflects the current runtime accurately. It documents environment variables that are now partly inconsistent with actual usage and still contains generic starter text.
- **Proposed Solution**: Remove noisy runtime logging or gate it behind a development logger, then refresh the README with the real architecture, required environment variables, package-manager expectation, and local development steps.
- **Estimated Effort**: Small
- **Rationale**: This will not change product behavior, but it improves developer experience and reduces avoidable confusion for future contributors.
- **Dependencies / Risks**: Low risk. The main requirement is to avoid deleting logs that are still needed for temporary operational debugging.

## Recommendations
Tackle the security boundary first: move privileged API access server-side, rotate exposed credentials, and collapse authentication into one session model. After that, make checkout server-authoritative so pricing and subscription setup stop depending on client-provided data. Once those foundations are stable, the next best return is to finish the account surface, reduce duplicated implementations, and add a minimal automated test suite around auth, checkout, and messaging before more feature work is layered on top.
