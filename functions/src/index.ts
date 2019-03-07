import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {Meta} from './types';

admin.initializeApp();
const db = admin.firestore();

// Base 62 Helper functions
// These allow us to easily increment our "nextUrl" metadata so we can quickly
// create new links in the first available slot. The actual integer value of
// these base62 fields starts 1, but it's never directly used (only
// incremented). What matters is that the URLs will make use of all combinations
// of [0-9A-Za-z]+
const b62 = [
  ...[...Array(10)].map((_, i) => String.fromCharCode('0'.charCodeAt(0) + i)),
  ...[...Array(26)].map((_, i) => String.fromCharCode('A'.charCodeAt(0) + i)),
  ...[...Array(26)].map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i)),
];

// Converts a number to a base62 string
function base62Encode(num: number): string {
  let result = '';
  let value = num - 1;
  while (value >= 0) {
    result = b62[value % 62] + result;
    value = Math.floor((value - 62) / 62);
  }
  return result;
}

// Converts a base62 string to a number
function base62Decode(str: string): number {
  let power = 1;
  let result = 0;
  for (const char of str.split('').reverse()) {
    result += (b62.findIndex(x => x === char) + 1) * power;
    power *= 62;
  }
  return result;
}

// When a link is created, we find the next available slot for the next link
// that someone decides to create. The reason we can't just increment a counter
// is because we want to support custom links, and it's possible that the
// automatic "shortest link possible" will bump into someone's custom link, so
// we always just increment until we find a free space. Chances are this will
// just increment once in nearly all cases.
export const onLinkCreateIncrementNextUrl =
    functions.firestore.document('links/{linkId}')
        .onCreate(async (_snapshot, _context) => {
          // Get value of nextUrl
          // nextUrl should always be defined. If it's not, then the database
          // wasn't setup and FE shouldn't have been able to make a link, so we
          // won't be here.
          const meta = (await db.doc('meta/meta').get()).data()! as Meta;
          let nextUrl = meta.nextUrl

          // Check if nextUrl is taken
          let exists = (await db.collection('links').doc(nextUrl).get()).exists;
          while (exists) {
            // Incremement nextUrl until we find an open link
            nextUrl = base62Encode(base62Decode(nextUrl) + 1);
            exists = (await db.collection('links').doc(nextUrl).get()).exists;
          }

          // Update db with new nextUrl
          await db.doc('meta/meta').update({nextUrl: nextUrl});
        });
