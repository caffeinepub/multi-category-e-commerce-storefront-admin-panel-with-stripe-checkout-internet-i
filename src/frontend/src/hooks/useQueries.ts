import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Category, Product, ProductVar, Review, CartItemVar, UserProfile, UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetProductsByCategory(categoryId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(categoryId);
    },
    enabled: !!actor && !isFetching && !!categoryId
  });
}

export function useGetVariantsByProduct(productId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductVar[]>({
    queryKey: ['variants', productId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVariantsByProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId
  });
}

export function useGetProductReviews(productId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductReviews(productId);
    },
    enabled: !!actor && !isFetching && !!productId
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, rating, comment }: { productId: string; rating: number; comment: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitReview(productId, BigInt(rating), comment);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
    }
  });
}

export function useGetCallerCartItems() {
  const { actor, isFetching } = useActor();

  return useQuery<CartItemVar[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerCartItems();
    },
    enabled: !!actor && !isFetching
  });
}

export function useAddItemToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addItemToCart(variantId, BigInt(quantity));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

export function useUpdateCartItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCartItem(variantId, BigInt(quantity));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

export function useRemoveItemFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variantId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeItemFromCart(variantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    retry: false
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: string; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.assignCallerUserRole(Principal.fromText(user), role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    }
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching
  });
}
