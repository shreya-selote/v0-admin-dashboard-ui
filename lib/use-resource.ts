"use client";

import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

/**
 * Generic typed hook for fetching a list resource from our API routes.
 * Returns data (defaulting to an empty array), loading and error states.
 */
export function useResource<T>(url: string) {
  const { data, error, isLoading, mutate } = useSWR<T[]>(url, fetcher);
  return {
    data: data ?? [],
    isLoading,
    isError: Boolean(error),
    mutate,
  };
}
