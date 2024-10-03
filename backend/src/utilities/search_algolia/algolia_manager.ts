import algoliasearch, { SearchClient } from "algoliasearch";
import { DocumentReference } from "firebase-admin/firestore";
import { OfferStatus, OrderPaymentStatus, OrderStatus } from "../enums";

// Assuming LatLng is defined as you provided
interface LatLng {
  latitude: number;
  longitude: number;
}

class AlgoliaQueryParams {
  constructor(
    public index: string,
    public term?: string,
    public latLng?: LatLng,
    public maxResults?: number,
    public searchRadiusMeters?: number,
    public offerStatus?: OfferStatus,
    public orderPaymentStatus?: OrderPaymentStatus,
    public userId?: DocumentReference
  ) {}
}

export default class AlgoliaManager {
  private static instance: AlgoliaManager;
  private algoliaClient: SearchClient;
  private algoliaCache: Map<string, any[]> = new Map();

  private constructor() {
    this.algoliaClient = algoliasearch(
      "RKAOYYPYVD",
      "e3a1a76be848282c25bc4df8d4434818"
    );
  }

  public static getInstance(): AlgoliaManager {
    if (!AlgoliaManager.instance) {
      AlgoliaManager.instance = new AlgoliaManager();
    }
    return AlgoliaManager.instance;
  }

  public async algoliaQuery({
    index,
    term,
    maxResults,
    location,
    searchRadiusMeters,
    offerStatus,
    orderPaymentStatus,
    userId, // Include userId in the parameters
    useCache = false,
  }: {
    index: string;
    term?: string;
    maxResults?: number;
    location?: () => Promise<LatLng> | LatLng;
    searchRadiusMeters?: number;
    offerStatus?: OfferStatus;
    orderPaymentStatus?: OrderPaymentStatus;
    userId?: DocumentReference;
    useCache?: boolean;
  }): Promise<any[]> {
    let loc: LatLng | undefined;
    if (location) {
      loc = typeof location === "function" ? await location() : location;
      if (!loc) return [];
    }

    const params = new AlgoliaQueryParams(
      index,
      term,
      loc,
      maxResults,
      searchRadiusMeters,
      offerStatus,
      orderPaymentStatus,
      userId
    );
    const cacheKey = JSON.stringify(params);

    if (useCache && this.algoliaCache.has(cacheKey)) {
      return this.algoliaCache.get(cacheKey)!;
    }

    const searchParams: any = {};
    if (maxResults) searchParams.hitsPerPage = maxResults;
    if (loc) {
      searchParams.aroundLatLng = `${loc.latitude},${loc.longitude}`;
      searchParams.aroundRadius = searchRadiusMeters
        ? searchRadiusMeters
        : "all";
    }
    if (userId) {
      // Extract userId from DocumentReference
      const userIdString = userId!.id;
      // Assuming id is the field containing the user ID
      // Use filters to filter by userId

      searchParams.filters = `users:"users/${userIdString}"`;
    }
    if (offerStatus) {
      searchParams.filters = `status:${offerStatus}`;
    }
    if (orderPaymentStatus) {
      searchParams.filters = `paymentStatus:${orderPaymentStatus}`;
    }
    try {
      const query = this.algoliaClient.initIndex(index);
      const result = await query.search(term!, searchParams);
      this.algoliaCache.set(cacheKey, result.hits);
      return result.hits;
    } catch (error) {
      console.error("Algolia error:", error);
      return [];
    }
  }
}
