import { apiSlice } from "../../app/apiSlice";
import type { Company, CreateCompanyRequest, PaginatedResponse } from "../../types";

export const companiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<
      PaginatedResponse<Company>,
      { page?: number; search?: string }
    >({
      query: ({ page = 1, search = "" } = {}) =>
        `/companies?page=${page}&search=${search}`,
      providesTags: ["Company"],
    }),
    createCompany: builder.mutation<Company, CreateCompanyRequest>({
      query: (data) => ({
        url: "/companies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Company", "Dashboard"],
    }),
    deactivateCompany: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/companies/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Company", "Dashboard"],
    }),
    activateCompany: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/companies/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Company", "Dashboard"],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useDeactivateCompanyMutation,
  useActivateCompanyMutation,
} = companiesApi;
