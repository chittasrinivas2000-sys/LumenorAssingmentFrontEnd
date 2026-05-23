import { apiSlice } from "../../app/apiSlice";
import type { User, InviteUserRequest, PaginatedResponse } from "../../types";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyUsers: builder.query<
      PaginatedResponse<User>,
      { page?: number; search?: string; role?: string; status?: string; companyId?: string }
    >({
      query: ({ page = 1, search = "", role = "", status = "", companyId = "" } = {}) =>
        `/users/company?page=${page}&search=${search}&role=${role}&status=${status}&companyId=${companyId}`,
      providesTags: ["User"],
    }),
  getAllUsers: builder.query<
  PaginatedResponse<User>,
  {
    page?: number;
    search?: string;
    role?: string;
    status?: string;
  }
>({
  query: ({
    page = 1,
    search = "",
    role = "",
    status = "",
  } = {}) =>
    `/users/all?page=${page}&search=${search}&role=${role}&status=${status}`,
  providesTags: ["User"],
}),
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),
    inviteUser: builder.mutation<
      { message: string; user: User; tempPassword: string },
      InviteUserRequest
    >({
      query: (data) => ({
        url: "/users/invite",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Dashboard"],
    }),
    updateProfile: builder.mutation<
      User,
      { id: string; name: string; profilePicture: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/users/${id}/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deactivateUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["User", "Dashboard"],
    }),
  
    activateUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["User", "Dashboard"],
    }),
  }),
});

export const {
  useGetCompanyUsersQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useInviteUserMutation,
  useUpdateProfileMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
} = usersApi;
