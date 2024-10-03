import { firestore } from "../config/firebase.config";
import { DynamicObject, withoutNulls } from "./utilities/util";

interface planData {
  planType?: string;
  title?: string;
  description?: string;
  price?: number;
  revisonNumber?: number;
  deliveryTime?: string;
}

class Plan {
  planType?: string;
  title?: string;
  description?: string;
  price?: number;
  revisionNumber?: number;
  deliveryTime?: string;

  constructor({
    planType,
    title,
    description,
    price,
    revisionNumber,
    deliveryTime,
  }: {
    planType?: string;
    title?: string;
    description?: string;
    price?: number;
    revisionNumber?: number;
    deliveryTime?: string;
  }) {
    this.planType = planType;
    this.title = title;
    this.description = description;
    this.price = price;
    this.revisionNumber = revisionNumber;
    this.deliveryTime = deliveryTime;
  }

  toFirestore(): firestore.DocumentData {
    return withoutNulls({
      planType: this.planType,
      title: this.title,
      description: this.description,
      price: this.price,
      revisionNumber: this.revisionNumber,
      deliveryTime: this.deliveryTime,
    });
  }
  static fromFirestore(data: DynamicObject) {
    return new Plan({
      planType: data.planType,
      title: data.title,
      description: data.description,
      price: data.price,
      revisionNumber: data.revisionNumber,
      deliveryTime: data.deliveryTime,
    });
  }
  static mergePlans(oldPlan: Partial<Plan>, newPlan: Partial<Plan>): Plan {
    // Merge plan data, giving precedence to newPlan fields
    const mergedPlanData: Partial<Plan> = {
      ...oldPlan,
      ...newPlan,
      // Add any special handling for specific fields if needed
    };

    // Create a new Plan instance with the merged data
    return new Plan(mergedPlanData);
  }
}

export { Plan, planData };
