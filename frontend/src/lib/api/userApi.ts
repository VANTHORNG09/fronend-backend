import { baseApi } from "./baseApi";
import type { Page, Role, User, UserStatus } from "@/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<Page<User>, { role?: Role; status?: UserStatus; search?: string; page?: number }>({
      query: (params) => ({ url: "/users", params }),
      providesTags: ["Users"]
    }),
    createUser: build.mutation<User, Partial<User> & { initialPassword?: string }>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: ["Users", "Dashboard"]
    }),
    updateUserStatus: build.mutation<User, { id: string; status: UserStatus }>({
      query: ({ id, status }) => ({ url: `/users/${id}/status`, method: "PATCH", body: { status } }),
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patch = dispatch(userApi.util.updateQueryData("getUsers", {}, (draft) => {
          draft.content.find((u) => u.id === id)!.status = status;
        }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
      invalidatesTags: ["Users"]
    }),
    updateUserRole: build.mutation<User, { id: string; role: Role }>({
      query: ({ id, role }) => ({ url: `/users/${id}/role`, method: "PATCH", body: { role } }),
      invalidatesTags: ["Users"]
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users", "Dashboard"]
    })
  })
});

export const { useGetUsersQuery, useCreateUserMutation, useUpdateUserStatusMutation, useUpdateUserRoleMutation, useDeleteUserMutation } = userApi;

