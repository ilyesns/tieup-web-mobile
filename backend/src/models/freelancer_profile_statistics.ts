import { DocumentReference } from "firebase-admin/firestore";

class FreelancerProfileStatistics {
    freelancerId: DocumentReference;
    sellerLevel?: string; // Assuming seller level is a string (e.g., "Gold", "Silver")
    nextEvaluationDate?: Date;
    responseTime?: number; // Assuming response time is a double representing hours or minutes
    orderCompletionRate?: number; // Assuming this is a percentage represented as a double
    onTimeDeliveryRate?: number; // Assuming this is a percentage represented as a double
    positiveRatingPercentage?: number;
    documentRef?:DocumentReference;  
    constructor({
      freelancerId,
      sellerLevel,
      nextEvaluationDate,
      responseTime,
      orderCompletionRate,
      onTimeDeliveryRate,
      positiveRatingPercentage,
      documentRef
    }:{
      freelancerId: DocumentReference,
      sellerLevel?: string,
      nextEvaluationDate?: Date,
      responseTime?: number,
      orderCompletionRate?: number,
      onTimeDeliveryRate?: number,
      positiveRatingPercentage?: number
      documentRef?:DocumentReference
    }
      
    ) {
      this.freelancerId = freelancerId;
      this.sellerLevel = sellerLevel;
      this.nextEvaluationDate = nextEvaluationDate;
      this.responseTime = responseTime;
      this.orderCompletionRate = orderCompletionRate;
      this.onTimeDeliveryRate = onTimeDeliveryRate;
      this.positiveRatingPercentage = positiveRatingPercentage;
      this.documentRef = documentRef;
      
    }



  }
  
export default FreelancerProfileStatistics;