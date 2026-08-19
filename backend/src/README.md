# backend/src

## Why modules, not layers

The obvious structure is by layer — `routes/`, `controllers/`, `services/` — with every module's files mixed together inside each. We deliberately don't do that.

Four people work on four different modules **at the same time**. Under a layer-first structure, all four of us edit `routes/`, `controllers/` and `services/` simultaneously, and every pull request touches the same directories. Under a module-first structure, each person works almost entirely inside one folder and merge conflicts become rare.

```
src/
  config/       Environment variables, read here and nowhere else
  lib/          Shared infrastructure — the Prisma client lives here
  middleware/   Cross-cutting request handling (auth, errors, 404)
  modules/      One folder per epic. Your work lives here
  utils/        Small helpers with no dependencies of their own
  app.js        Express assembly and route mounting
```

## Adding to your module

Each module has three files, and the split is worth keeping:

| File                   | Holds                                     | Does not hold                |
| ---------------------- | ----------------------------------------- | ---------------------------- |
| `<name>.routes.js`     | URL → controller mapping, middleware      | Any logic                    |
| `<name>.controller.js` | Reading the request, shaping the response | Business rules, Prisma calls |
| `<name>.service.js`    | Business rules, database access           | Anything about HTTP          |

The reason for the third column: acceptance criteria are enforced in the service, so they stay testable and reusable. A rule buried in a controller can only be exercised through an HTTP request.

## Adding a new module

Copy the three files from an existing module, then add two lines to `app.js` — an import at the top with the others, and a mount below:

```js
import yourRoutes from "./modules/<yours>/<yours>.routes.js";
// ...
app.use("/api/<yours>", yourRoutes);
```

Those two lines in `app.js` are the only shared file you touch.

## Rules worth not learning the hard way

**Import Prisma from `lib/prisma.js`.** Never `new PrismaClient()` in your own file — each instance opens its own connection pool and the database runs out of connections quickly.

**Throw `AppError` for expected failures.** `AppError.badRequest("...")`, `.notFound()`, `.conflict()`. Anything else reaching the error handler is treated as a bug: it's logged in full and the client is told nothing, so internal details can't leak.

**Wrap async handlers in `asyncHandler`.** Otherwise a rejected promise can hang the request instead of returning an error.

**Don't write your own auth check.** `middleware/requireAuth.js` is owned by the Account Management epic and is coming — see the cross-cutting authentication section in `docs/module-ownership.md`.
