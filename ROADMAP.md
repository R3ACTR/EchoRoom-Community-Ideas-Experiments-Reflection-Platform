# EchoRoom Roadmap

This roadmap reflects the current codebase state as of February 2026.

## Phase 1: Core Backend and Frontend Foundations

Status: Mostly complete

- [x] Frontend pages for ideas, experiments, outcomes, reflections
- [x] Express backend with route groups for core resources
- [x] Idea lifecycle state transitions
- [x] Basic health endpoint and local dev setup
- [x] Initial tests for selected services

## Phase 2: Authentication and Access Control

Status: In progress

- [x] User registration and login endpoints
- [x] JWT access token and refresh token flow
- [x] Password hashing and token persistence with Prisma
- [ ] Enforce authentication on write endpoints across all domain routes
- [ ] Enforce role/permission checks consistently
- [ ] Connect frontend auth screens to backend auth API

## Phase 3: Persistence Unification

Status: In progress

- [x] Prisma + MongoDB integration started
- [x] Prisma schema includes core models
- [ ] Move ideas to persistent storage
- [ ] Move experiments to persistent storage
- [ ] Move outcomes to persistent storage
- [ ] Move reflections to persistent storage
- [ ] Move comments to persistent storage
- [ ] Remove in-memory-only runtime stores

## Phase 4: Insights and Graph Features

Status: Planned

- [ ] Mount insights routes in active server
- [ ] Persist synthesized insight data
- [ ] Connect graph output to frontend visualizations
- [ ] Add quality tests for graph and suggestion outputs

## Phase 5: Reliability and Contributor Experience

Status: Planned

- [ ] Normalize API response shapes across all routes
- [ ] Improve backend error handling consistency
- [ ] Expand integration and contract testing
- [ ] Harden setup docs and environment config handling
- [ ] Add CI checks for backend and frontend

## Contribution Focus Right Now

Highest-value contribution areas:

1. Persistence migration from in-memory services to Prisma-backed repositories
2. Auth and permission middleware rollout across domain write routes
3. Frontend and backend auth integration (replace local demo auth)
4. API documentation updates alongside behavior changes

## Updating This Roadmap

When backend or frontend behavior changes, update this file in the same PR so roadmap status stays accurate.
