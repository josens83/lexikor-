/**
 * Barrel Export for React Query Hooks
 *
 * Centralized exports for all React Query hooks
 */

// Auth hooks
export {
  authKeys,
  useCurrentUser,
  useUpdateProfile,
  useChangePassword,
  useEnableMFA,
  useVerifyMFA,
  useDisableMFA,
  useDeleteAccount,
  useLogin,
  useLogout,
  useRegister,
} from './useAuth'

// Chat hooks
export {
  chatKeys,
  useConversations,
  useConversation,
  useCreateConversation,
  useSendMessage,
  useUpdateMessageFeedback,
  useDeleteConversation,
} from './useChat'

// Documents hooks
export {
  documentKeys,
  useDocuments,
  useDocument,
  useUploadDocument,
  useAnalyzeDocument,
  useDeleteDocument,
  useShareDocument,
} from './useDocuments'

// Billing hooks
export {
  billingKeys,
  useSubscription,
  useUsage,
  usePaymentMethods,
  useInvoices,
  useUpgradeSubscription,
  useCancelSubscription,
  useAddPaymentMethod,
} from './useBilling'

// Research hooks
export {
  researchKeys,
  useSearchCases,
  useSearchCasesMutation,
  useCaseDetail,
  useSearchStatutes,
  useSearchStatutesMutation,
  useStatuteDetail,
} from './useResearch'

// Analytics hooks
export {
  analyticsKeys,
  useDashboard,
  useUsageAnalytics,
  useExportData,
} from './useAnalytics'
