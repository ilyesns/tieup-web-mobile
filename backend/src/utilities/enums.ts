enum Role {
  Freelancer = "freelancer",
  Client = "client",
}

enum TypeUser {
  Admin = "admin",
  User = "user",
}

enum AdminRole {
  Approval = "approval",
  Editor = "editor",
  Super = "super",
}

enum LanguageLevel {
  Basic = "Basic",
  Conversational = "conversational",
  Fluent = "fluent",
  Native = "native",
}

enum ExperienceLevel {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Expert = "expert",
}

enum OfferStatus {
  Active = "active",
  Draft = "draft",
  Inactive = "inactive",
  PendingApproval = "pendingApproval",
  Denied = "denied",
}

enum OrderStatus {
  Pending = "pending",
  InProgress = "inProgress",
  Delivered = "delivered",
  Completed = "completed",
  Cancelled = "cancelled",
  Late = "late",
}

enum RevisionStatus {
  Pending = "pending",
  Completed = "completed",
  Rejected = "rejected",
  UnderReview = "underReview",
}

enum MessageStatus {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
}

enum ReportStatus {
  Open = "Open",
  Closed = "Closed",
  UnderInvestigation = "UnderInvestigation",
}

enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  PAYMENT = "PAYMENT",
}

enum SellerLevel {
  Bronze = "bronze",
  Silver = "Silver",
  Gold = "Gold",
}

enum WithdrawalStatus {
  CHECKED = "Checked",
  UNCHECKED = "Unchecked",
}
enum OrderPaymentStatus {
  UNPAID = "Unpaid",
  PAID = "Paid",
}

export {
  Role,
  TypeUser,
  OrderPaymentStatus,
  SellerLevel,
  LanguageLevel,
  ExperienceLevel,
  OfferStatus,
  AdminRole,
  OrderStatus,
  RevisionStatus,
  TransactionType,
  MessageStatus,
  ReportStatus,
  WithdrawalStatus,
};
