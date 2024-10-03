class PricingService {
  // This could be a fixed fee or could be calculated based on some criteria
  static feePercentageClient: number = 7; // Assuming a 8% fee
  static feePercentageFreelancer: number = 10; // Assuming a 7% fee

  static calculateTotalPrice(baseAmount: number): number {
    const feeAmount = baseAmount * PricingService.feePercentageClient;
    return baseAmount + feeAmount;
  }
}
export { PricingService };
