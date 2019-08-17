// Types used in Firestore that are referenced by both Angular and Firestore
// functions
// This file is duplicated at bthles/types/types.ts. Make sure to copy changes
// over.

// Bthles is the entire Firestore database
export interface Bthles {
  meta: {
    meta: Meta,
  };
  links: {
    [key: string]: Link,
  };
}

// Meta contains metadata about the database. There should only be one instance
// of this, located at meta/meta.
export interface Meta {
  // nextUrl is the next available short URL path
  nextUrl: string;
}

// Link refers to a short link created by a user.
export interface Link {
  // The type of link this represents. Currently these are only 'link', which
  // redirects to the URL at `content`.
  type: 'link';
  // Content of the link. For type 'link', this is a URL.
  content?: string;
  // The creator of the link.
  owner: string;
  // The number of times the link has been clicked
  hits?: number;
  // The legacy hit count from v1. This value is converted to `hits` the first
  // time a link is clicked.
  v1Hits?: number;
}

// LinkClaimData is used when updating all anonymous links to be owned by a
// signed-in user.
export interface LinkClaimData {
  // The anonymous user's uid whose links we are claiming.
  fromUser: string;
  // The new uid to own the links.
  toUser: string;
}
