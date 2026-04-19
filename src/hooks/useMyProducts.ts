"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getMyProducts,
  updateProduct,
  type ProductListFilters,
} from "@/services";
import { ApiError } from "@/lib/api";
import type {
  CreateProductPayload,
  PaginatedResult,
  Product,
  UpdateProductPayload,
} from "@/types";
import { queryKeys } from "./queryKeys";

export function useMyProducts(filters: ProductListFilters = {}) {
  return useQuery<PaginatedResult<Product>>({
    queryKey: queryKeys.myProducts(filters),
    queryFn: () => getMyProducts(filters),
    staleTime: 1000 * 30,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, ApiError, CreateProductPayload>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation<
    Product,
    ApiError,
    { id: string; payload: UpdateProductPayload }
  >({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "products"] });
    },
  });
}
