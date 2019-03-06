# v3
bthl.es is currently undergoing a major rewrite that will use Angular Material + Cloud Firestore to provide a clean and scalable shortening experience. You can track its progress via the [v3 MVP Milestone](https://github.com/brikr/bthles/milestone/1) and view its code in the [v3 branch](https://github.com/brikr/bthles/tree/v3). As of now, v1 is in maintenance mode and I will only update it with things that are necessary for the v3 upgrade.

## Will my links still work?
Yes, as part of the upgrade to v3, all existing links will be transferred and they will continue to work in v3.

## What happened to v2?
[v2 exists](https://github.com/brikr/bthles-v2), but was never deployed to production. It's fully functional, but I ended up not liking its stack very much and it wasn't something I'd want to maintain (just like v1 isn't something I want to maintain).

# bthl.es
[bthl.es](http://bthl.es) is a basic URL shortener / text sharing tool. It's bitly meets pastebin.

## To Do
- Support multiple shortening types (e.g. raw text)
- SSL
- Migrate to more scalable framework
  - Determine framework (lambda/serverless, Rails)
  - Determine storage solution (DynamoDB, Firebase)
- Public stats page
