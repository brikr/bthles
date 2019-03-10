# Contributing to bthles
Thanks for your interest in contributing! Be sure to check out the [Developer getting started](docs/developer-getting-started.md) documentation to get setup with serving bthl.es locally for development. Once you're all setup, take a look at the [help wanted issues](https://github.com/brikr/bthles/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) to see where we'd like you to contribute.

Of course, you aren't limited to contributing towards the help wanted issues, or any of the currently tracked issues. However if you'd like to contribute a change that isn't tracked in an issue, we'd recommend filing one so that there is a good place for discussion.

## Contribution guidelines
There are some styling/linting guidelines that should be followed in the repository. It's recommended that you install the tools listed below to avoid having to do all of this manually when it's review time.
- We use `clang-format` to style all Typescript code in the repository. The repository root contains a `.clang-format` file with the preferred configuration, and the `clang-format` Node library is included in `devDependencies` in `package.json`, which means after you've ran `npm install`, you can access the executable at `node_modules/clang-format/bin`.
  - If you use VS Code, the [Clang-Format plugin](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format) is very handy. You can point it to the executable in mentioned above and configure it to format your files whenever you save.
- We use `tslint` to lint the Typescript code. Run `ng lint` to make sure your Angular code passes all linter checks, and run `npm run lint` from the `functions` directory to make sure your Firestore functions pass all linter checks.

That's all for now; be sure to check this file again before submitting pull requests in case any of the guidelines have changed, and thanks again for contributing!
