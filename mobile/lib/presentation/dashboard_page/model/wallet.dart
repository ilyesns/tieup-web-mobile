class Wallet {
  final String? walletId;
  final String? userId;
  final int? balance;
  final int? pendingClearance;
  final Map<int, int>? activeOrdersValue;
  final int? earningsInMonth;
  final String? documentRef;

  Wallet({
    this.walletId,
    this.userId,
    this.balance,
    this.pendingClearance,
    this.activeOrdersValue,
    this.earningsInMonth,
    this.documentRef,
  });

  factory Wallet.fromJson(Map<String, dynamic> json) {
    final Map<int, int>? activeOrdersValue = json['activeOrdersValue'] == null
        ? null
        : Map<int, int>.from(
            json['activeOrdersValue'] as Map<dynamic, dynamic>);
    return Wallet(
      walletId: json['walletId'] as String,
      userId: json['userId'] as String,
      balance: json['balance'],
      pendingClearance: json['pendingClearance'],
      activeOrdersValue: activeOrdersValue,
      earningsInMonth: json['earningsInMonth'],
      documentRef: json['documentRef'] as String?,
    );
  }
}
