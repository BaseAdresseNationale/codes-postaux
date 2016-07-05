Publishing a new version
------------------------

We use [SemVer](http://semver.org).

Updated dataset? It's a minor bump, not a patch bump!

In any case, `git tag && npm publish`, and add a GitHub release, in order to notify implementers of API-compliant alternatives in other languages.


Writing an implementation in another language
---------------------------------------------

First of all, thanks for helping your community leverage the power of this database!

For users convenience, let's try to keep consistent behaviour across languages  :)
The API version numbers should match. This match is important only for major and minor version numbers (the `x` and `y` in `x.y.z`). No need to align patch versions (`z`), these can vary for each implementation and give you room for bugfixes.

You can then reference your implementation by opening a pull request amending the README in this repo.

If you want to add a feature and increase the API surface, it would be nice that you open a discussion through an issue here before adding it, so we have an opportunity to synchronize.
