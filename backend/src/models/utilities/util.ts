import {
  Timestamp,
  GeoPoint,
  DocumentData,
  DocumentReference,
} from "firebase-admin/firestore"; // Adjust import path based on your setup
import { type } from "os";

function withoutNulls(obj: { [key: string]: any }): { [key: string]: any } {
  const result: { [key: string]: any } = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      result[key] = value;
    }
  });
  return result;
}
function isEmptyResult(obj: { [key: string]: any }): boolean {
  return Object.keys(withoutNulls(obj)).length === 0;
}

function mapFromFirestore(data?: DocumentData): DynamicObject {
  // First, merge nested fields
  let mergedData = mergeNestedFields(data as DynamicObject);

  // Filter out the specific key (if necessary) and transform the data
  const transformedData: DynamicObject = {};
  Object.entries(mergedData).forEach(([key, value]) => {
    // Handle Timestamp
    if (value instanceof Timestamp) {
      value = value.toDate();
    }
    // Handle list of Timestamps
    else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof Timestamp
    ) {
      value = value.map((v) => (v as Timestamp).toDate());
    }
    // Handle GeoPoint
    else if (value instanceof GeoPoint) {
      value = { latitude: value.latitude, longitude: value.longitude }; // Convert GeoPoint to a simple object
    }

    // Handle list of GeoPoints
    else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof GeoPoint
    ) {
      value = value.map((v) => ({
        latitude: (v as GeoPoint).latitude,
        longitude: (v as GeoPoint).longitude,
      }));
    }
    // Handle nested data and list of nested data within the recursive call

    // Add the transformed value to the result
    transformedData[key] = value;
  });

  return transformedData;
}

type DynamicObject = { [key: string]: any };

function mergeNestedFields(data: DynamicObject): DynamicObject {
  const nestedDataEntries = Object.entries(data).filter(([key, _]) =>
    key.includes(".")
  );
  const fieldNames = new Set(
    nestedDataEntries.map(([key, _]) => key.split(".")[0])
  );

  // Remove nested values (e.g., 'foo.bar') and merge them into a map
  Object.keys(data).forEach((key) => {
    if (key.includes(".")) {
      delete data[key];
    }
  });

  fieldNames.forEach((name) => {
    const mergedValues = mergeNestedFields(
      nestedDataEntries
        .filter(([key, _]) => key.split(".")[0] === name)
        .reduce((acc, [key, value]) => {
          const newKey = key.split(".").slice(1).join(".");
          acc[newKey] = value;
          return acc;
        }, {} as DynamicObject)
    );

    const existingValue = data[name];
    data[name] = {
      ...(existingValue instanceof Object ? existingValue : {}),
      ...mergedValues,
    };
  });

  // Merge any nested maps inside any of the fields as well
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof Object && !(value instanceof Array)) {
      data[key] = mergeNestedFields(value);
    }
  });

  return data;
}

interface Enum {
  serialize(): string;
}

// Example enum implementation
class MyEnum implements Enum {
  constructor(private name: string) {}

  serialize(): string {
    return this.name;
  }
}

type FirestoreData =
  | string
  | number
  | boolean
  | Date
  | FirestoreData[]
  | { [key: string]: FirestoreData };

function mapToFirestore(data: any): FirestoreData {
  // Handle null and undefined
  if (data === null || data === undefined) {
    return data;
  }

  // Handle primitive types (string, number, boolean, Date)
  if (
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
  ) {
    return data;
  }

  if (data instanceof Date) {
    // Convert Date to Firestore Timestamp (or any desired format)
    // This is a placeholder conversion. Adjust according to your Firestore client library.
    return data.toISOString();
  }
  if (data instanceof Map) {
    const obj: { [key: string]: FirestoreData } = {};
    data.forEach((value, key) => {
      obj[key] = mapToFirestore(value);
    });
    return obj;
  }

  // Handle arrays (including nested)
  if (Array.isArray(data)) {
    return data.map((item) => mapToFirestore(item));
  }

  if (typeof data === "object") {
    const result: { [key: string]: FirestoreData } = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        // Skip undefined values
        result[key] = mapToFirestore(value);
      }
    });
    return result;
  }

  // Fallback for types not explicitly handled (could adjust based on requirements)
  return JSON.stringify(data);
}
function mapToFirestoreT2(data: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (data instanceof Map) {
      const obj: { [key: string]: FirestoreData } = {};
      data.forEach((value, key) => {
        obj[key] = mapToFirestoreT2(value);
      });
      return obj;
    }

    // Handle nested data
    if (value && typeof value === "object" && !Array.isArray(value)) {
      value = mapToFirestoreT2(value);
    }
    // Handle list of nested data
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object"
    ) {
      value = value.map((v) => mapToFirestoreT2(v));
    }
    result[key] = value;
  });
  return result;
}

function dateToFirestore(date: Date) {
  return date;
}

function dateFromAlgolia(date: number) {
  return new Date(date);
}

async function classToApi<T extends Record<string, any>>(
  instance: T
): Promise<DynamicObject> {
  const instanceData: DynamicObject = {};
  const keys = Object.keys(instance);
  for (const key of keys) {
    const value = (instance as any)[key];
    if (Array.isArray(value)) {
      if (value.length > 0 && value[0] instanceof DocumentReference) {
        instanceData[key] = await Promise.all(
          value.map((docRef: DocumentReference) => docRef.id)
        );
      } else {
        instanceData[key] = value;
      }
    } else if (value instanceof DocumentReference) {
      instanceData[key] = await value.id;
    } else {
      instanceData[key] = value;
    }
  }
  return instanceData;
}

export {
  withoutNulls,
  mapFromFirestore,
  classToApi,
  DynamicObject,
  mapToFirestore,
  mapToFirestoreT2,
  FirestoreData,
  dateFromAlgolia,
  dateToFirestore,
  isEmptyResult,
};
