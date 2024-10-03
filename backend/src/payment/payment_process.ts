import axios from "axios";
import { Request, Response } from "express";

// This function now contains the logic separated from the Express route handler
export async function paymentProcessHandler(paymentData: {
  amount: number;
  description: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  orderId: string;
}): Promise<JSON | null> {
  try {
    const response = await axios.post(
      "https://api.konnect.network/api/v2/payments/init-payment",
      {
        receiverWalletId: "66965031cd32a2e7cd235589",
        token: "TND",
        amount: paymentData.amount,
        type: "immediate",
        description: paymentData.description,
        acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
        lifespan: 10,
        checkoutForm: true,
        addPaymentFeesToAmount: false,
        firstName: paymentData.firstName,
        lastName: paymentData.lastName,
        phoneNumber: paymentData.phoneNumber || "12345678",
        email: paymentData.email,
        orderId: paymentData.orderId,
        webhook: "https://webhook-dot-tieup-6eea9.ew.r.appspot.com",
        silentWebhook: true,
        successUrl: "https://tieup.net/payment-success",
        failUrl: "https://dev.konnect.network/gateway/payment-failure",
        theme: "light",
      },
      {
        headers: {
          "x-api-key":
            "6696502ecd32a2e7cd2354f9:JSH4MRPh1TxaApWIwsvqhDuYiYOecgm",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Payment initiation failed:" + error);
    return null;
  }
}
