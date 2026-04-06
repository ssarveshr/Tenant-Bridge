import React from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Radius } from "../../constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTransactionStore } from "../../store/transactionStore";
import { useLanguage } from "../../hooks/useLanguage";

export default function TransactionsScreen() {
  const { transactions, fetchTransactions, isLoading } = useTransactionStore();
  const { n, language } = useLanguage();

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    fetchTransactions();
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  if (isLoading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Fetching transaction history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <Text style={styles.headerSubtitle}>Immutable rental history on Polygon</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Colors.accent} />
        }
      >
        <View style={styles.list}>
          {transactions.length > 0 ? (
            transactions.map((tx, idx) => (
              <TransactionCard 
                key={tx.id}
                title={`${tx.category || 'Rent Payment'} - ${formatDate(tx.created_at)}`}
                date={formatDate(tx.created_at)}
                amount={`₹${n(tx.amount.toLocaleString())}`}
                method={tx.method || "Razorpay"}
                hash={tx.blockchain_hash || "Securing on Polygon..."}
                index={idx}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color={Colors.border} />
              <Text style={styles.emptyTitle}>No Transactions Yet</Text>
              <Text style={styles.emptySubtitle}>Your immutable payment history will appear here once you pay rent.</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TransactionCard({ title, date, amount, method, hash, index }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="receipt-outline" size={20} color={Colors.accent} />
          </View>
          <View style={styles.details}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <Text style={styles.amountText}>{amount}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.blockchainBadge}>
            <Ionicons name="shield-checkmark" size={12} color={Colors.success} />
            <Text style={styles.blockchainHash}>{hash}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.border} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.l,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  list: {
    gap: Spacing.m,
  },
  card: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.s,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  details: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  blockchainBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  blockchainHash: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginLeft: 6,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginTop: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  }
});
