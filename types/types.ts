// Types used in Firestore that are referenced by both Angular and Firestore
// functions

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
  content: string;
  // The creator of the link.
  owner: string;
}