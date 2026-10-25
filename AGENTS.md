# Repository Guidelines
  개발 모드로 실행하여 브라우저에서 바로 확인하실 수 있습니다:

   1 cd /home/migowj/ittia/HerpesZoster/ui
   2 npm run dev

## Project Structure & Module Organization

This repository is currently a scaffold: it contains no application source, test suite, build configuration, or assets. Keep the root reserved for repository configuration and top-level documentation. As implementation is added, use a predictable layout appropriate to the selected stack—for example, `src/` for production code, `tests/` for automated tests, `docs/` for design notes, and `assets/` for static files. Keep modules focused and place related tests near the feature or under a matching `tests/` hierarchy.

## Build, Test, and Development Commands

No build, run, formatting, or test commands are defined yet. Before adding code, commit the chosen toolchain's manifest and document its standard commands in `README.md` and this file. Typical commands should be reproducible from a clean checkout, such as:

```sh
# Replace with the project's actual commands once tooling is selected.
<package-manager> test
<package-manager> lint
<package-manager> build
```

Avoid undocumented one-off scripts and do not commit generated build output unless the project explicitly requires it.

## Coding Style & Naming Conventions

Follow the formatter and linter supplied by the selected language ecosystem; add their configuration to version control. Use spaces rather than tabs unless the language tooling requires otherwise. Name files, modules, and directories consistently with the ecosystem (for example, `kebab-case` for web assets or `snake_case` for Python modules). Use descriptive names, small functions, and explicit error handling. Do not mix broad formatting-only changes with behavior changes.

## Testing Guidelines

Add automated tests with every behavior change. Name tests after the observable behavior, such as `test_rejects_expired_token` or `returns_404_for_missing_record`. Run the full test command before opening a pull request. Establish coverage targets only after a test framework and baseline are in place; prioritize critical paths and regression tests over an arbitrary percentage.

## Commit & Pull Request Guidelines

No readable Git history is available to establish an existing convention. Use concise, imperative commit subjects, such as `Add symptom intake validation`. Keep commits focused and include tests when applicable. Pull requests should explain the change, testing performed, linked issue (if any), and screenshots or request/response examples for user-visible or API changes. Call out configuration, migration, or security implications explicitly.

## Security & Configuration

Never commit secrets, credentials, tokens, or local environment files. Provide a sanitized `.env.example` when configuration is introduced, and document required variables without their values.
