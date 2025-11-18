/**
 * React Query Hooks for Billing & Subscriptions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { billingAPI } from '@services/api.refactored'
import type { BillingAPI } from '@types'

/**
 * Query keys for billing-related queries
 */
export const billingKeys = {
  all: ['billing'] as const,
  subscription: () => [...billingKeys.all, 'subscription'] as const,
  paymentMethods: () => [...billingKeys.all, 'payment-methods'] as const,
  invoices: () => [...billingKeys.all, 'invoices'] as const,
  usage: () => [...billingKeys.all, 'usage'] as const,
}

/**
 * Hook to get current subscription
 */
export function useSubscription() {
  return useQuery({
    queryKey: billingKeys.subscription(),
    queryFn: async () => {
      const response = await billingAPI.getSubscription()
      return response.data.subscription
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get usage statistics
 */
export function useUsage() {
  return useQuery({
    queryKey: billingKeys.usage(),
    queryFn: async () => {
      const response = await billingAPI.getUsage()
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - fresher data for usage
  })
}

/**
 * Hook to get payment methods
 */
export function usePaymentMethods() {
  return useQuery({
    queryKey: billingKeys.paymentMethods(),
    queryFn: async () => {
      const response = await billingAPI.getPaymentMethods()
      return response.data.payment_methods
    },
  })
}

/**
 * Hook to get invoices
 */
export function useInvoices() {
  return useQuery({
    queryKey: billingKeys.invoices(),
    queryFn: async () => {
      const response = await billingAPI.getInvoices()
      return response.data.invoices
    },
  })
}

/**
 * Hook to upgrade subscription
 */
export function useUpgradeSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BillingAPI.UpgradeSubscriptionRequest) =>
      billingAPI.upgradeSubscription(data),
    onSuccess: (response) => {
      queryClient.setQueryData(billingKeys.subscription(), response.data.subscription)
      queryClient.invalidateQueries({ queryKey: billingKeys.usage() })
      message.success('구독이 업그레이드되었습니다')
    },
  })
}

/**
 * Hook to cancel subscription
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => billingAPI.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.subscription() })
      message.success('구독이 취소되었습니다')
    },
  })
}

/**
 * Hook to add payment method
 */
export function useAddPaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BillingAPI.AddPaymentMethodRequest) =>
      billingAPI.addPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.paymentMethods() })
      message.success('결제 수단이 추가되었습니다')
    },
  })
}
