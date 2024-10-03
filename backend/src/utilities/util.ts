import { DocumentReference } from 'firebase-admin/firestore';
import moment from 'moment-timezone';

import admin from '../config/firebase.config';
import { DynamicObject } from '../models/utilities/util';

const db = admin.firestore();

export default function getCurrentTimestampTunisia(): string {
    // Set the timezone to 'Africa/Tunis' for Tunisia
    return moment().tz('Africa/Casablanca').format();
  }

  function areSameDocument(docRef1: DocumentReference, docRef2: DocumentReference): boolean {
    return docRef1.path === docRef2.path;
  }
  function jsonPathToDocumentRef(jsonPath: DynamicObject) {
    if (!jsonPath || !jsonPath._path || !jsonPath._path.segments) {
      throw new Error('Invalid JSON path object');
    }
    const pathSegments = jsonPath._path.segments;
    if (pathSegments.length === 0) {
      throw new Error('Path segments are empty');
    }
    const fullPath = pathSegments.join('/');
    return db.doc(fullPath);
  }

  export {areSameDocument, jsonPathToDocumentRef}