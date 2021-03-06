import {QueryDocumentSnapshot} from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {CallableContext} from 'firebase-functions/lib/providers/https';

import {LinkClaimData, Meta} from './types';

admin.initializeApp();
const db = admin.firestore();

// Base 62 Helper functions
// These allow us to easily increment our "nextUrl" metadata so we can quickly
// create new links in the first available slot. The actual integer value of
// these base62 fields starts 1, but it's never directly used (only
// incremented). What matters is that the URLs will make use of all combinations
// of [0-9A-Za-z]+
const b62 = [
  // tslint:disable-next-line:ban
  ...[...Array(10)].map((_, i) => String.fromCharCode('0'.charCodeAt(0) + i)),
  // tslint:disable-next-line:ban
  ...[...Array(26)].map((_, i) => String.fromCharCode('A'.charCodeAt(0) + i)),
  // tslint:disable-next-line:ban
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

// Find the next available slot for the next link that someone decides to
// create. The reason we can't just increment a counter is because we want to
// support custom links, and it's possible that the automatic "shortest link
// possible" will bump into someone's custom link, so we always just increment
// until we find a free space. Chances are this will just increment once in
// nearly all cases.
// This function is idempotent.
async function updateNextUrl() {
  // Get value of nextUrl
  let meta = (await db.doc('meta/meta').get()).data() as Meta | undefined;

  // Fresh database. Start nextUrl at '0'
  if (meta === undefined) {
    meta = {nextUrl: '0'};
    // Not stopping here, because the first link might have just been created at
    // '0', so we still need to see if it should be incremented.
  }

  let {nextUrl} = meta;

  // Check if nextUrl is taken
  let exists = (await db.collection('links').doc(nextUrl).get()).exists;
  while (exists) {
    // Incremement nextUrl until we find an open link
    nextUrl = base62Encode(base62Decode(nextUrl) + 1);
    exists = (await db.collection('links').doc(nextUrl).get()).exists;
  }

  // Update db with new nextUrl
  await db.doc('meta/meta').set({nextUrl}, {merge: true});
}

export const onLinkCreateIncrementNextUrl =
    functions.firestore.document('links/{linkId}')
        .onCreate(async (_snapshot, _context) => {
          await updateNextUrl();
        });

export const callableIncrementNextUrl =
    functions.https.onCall(async (_data, _context) => {
      await updateNextUrl();
    });

// Increment the hit count for the given short link. If the hits field does not
// exist on the link, it is created. If a v1Hits field exists on the link
// (legacy hit count), then its value is added to the hits field and the v1Hits
// field is deleted.
// This function is NOT idempotent.
async function incrementHitCount(short: string) {
  const docRef = db.collection('links').doc(short);
  await db.runTransaction(async transaction => {
    const doc = await transaction.get(docRef);
    if (doc.exists) {
      const v1Hits: number|undefined = doc.get('v1Hits');
      let hits: number = doc.get('hits') || 0;

      if (v1Hits !== undefined) {
        hits += v1Hits;
        transaction.update(
            docRef, {v1Hits: admin.firestore.FieldValue.delete()});
      }

      hits++;
      transaction.update(docRef, {hits});
    }
  });
}

export const callableIncrementHitCount =
    functions.https.onCall(async (data: string, _context) => {
      await incrementHitCount(data);
    });

// Delete the given link. The content field is erased (intentionally
// unrecoverable), but the owner and hit count remain.
async function deleteLink(short: string) {
  await db.collection('links').doc(short).update(
      {content: admin.firestore.FieldValue.delete()});
}

export const callableDeleteLink =
    functions.https.onCall(async (data: string, context: CallableContext) => {
      if (context.auth === undefined) {
        return;
      }
      const doc = await db.collection('links').doc(data).get();
      if (doc.exists && doc.get('owner') === context.auth.uid) {
        // Can only delete your own link
        await deleteLink(data);
      }
    });

// Change the owner of all links owned by fromUser to be owned by toUser. This
// allows users to take ownership of their anonymously-created links once they
// sign in. fromUser must be an anonymous user.
async function claimLinks(data: LinkClaimData) {
  // Verify that fromUser is an anonymous user.
  const from = await admin.auth().getUser(data.fromUser);
  if (from.providerData.length > 0) {
    return;
  }

  const snapshot =
      await db.collection('links').where('owner', '==', data.fromUser).get();
  snapshot.forEach((doc: QueryDocumentSnapshot) => {
    doc.ref.update({owner: data.toUser});
  });
}

export const callableClaimLinks = functions.https.onCall(
    async (data: LinkClaimData, _context: CallableContext) => {
      await claimLinks(data);
    });
