/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginBaseURL, APIversion } from "../utility/config";

export const musafirLoginApi = createApi({
    reducerPath: "musafirLoginApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${loginBaseURL}${APIversion}`,
        /**
         * Prepares the headers for the API requests by checking if the loginSlice
         * contains a valid access token and adding it to the headers if it does.
         * Also sets the Content-Type to application/json.
         * @param {Headers} headers - The headers to be modified.
         * @param {{ getState: () => any }} api - The api object.
         * @returns {Headers} The modified headers.
         */
        prepareHeaders: (headers, { getState }: any) => {
            const token = getState()?.loginSlice?.userLoginInfo?.auth?.accessToken;
            if (token) {
                headers.set("authorization", `${token}`);
            }
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    /**
      * Defines the endpoints for the API.
      *
      * @param {import("@reduxjs/toolkit/query/react").MutationBuilder} builder - The builder for the mutation.
      * @returns {Record<string, import("@reduxjs/toolkit/query/react").MutationDefinition<any, any, any>>} The endpoints.
      */
    endpoints: (builder) => ({
        login: builder.mutation({
            /**
             * Creates a POST request for user login.
             *
             * @param {object} patch - The data to be sent in the request body.
             * @returns {object} The configuration for the API request, including the URL,
             *                   HTTP method, and request body.
             */
            query: (patch) => ({
                url: `auth/login`,
                method: "POST",
                body: patch,
            }),
        }),

        createToken: builder.mutation({
            /**
             * Creates a POST request for user login.
             *
             * @param {object} patch - The data to be sent in the request body.
             * @returns {object} The configuration for the API request, including the URL,
             *                   HTTP method, and request body.
             */
            query: (patch) => ({
                url: `token/create`,
                method: "POST",
                body: patch,
            }),
        }),

        logout: builder.mutation({
            /**
             * Creates a POST request for user logout.
             *
             * @returns {object} The configuration for the API request, including the URL,
             *                   HTTP method.
             */
            query: () => ({
                url: `auth/logout`,
                method: "POST",
            }),
        }),

        loginmethods: builder.mutation({
            /**
             * Creates a POST request for user login.
             *
             * @param {object} patch - The data to be sent in the request body.
             * @returns {object} The configuration for the API request, including the URL,
             *                   HTTP method, and request body.
             */
            query: (patch) => ({
                url: `auth/loginmethods`,
                method: "POST",
                body: patch,
            }),
        }),
        authProfiles: builder.mutation({
            /**
             * Creates a POST request for user login.
             *
             * @param {object} patch - The data to be sent in the request body.
             * @returns {object} The configuration for the API request, including the URL,
             *                   HTTP method, and request body.
             */
            query: (patch) => ({
                url: `auth/profiles`,
                method: "POST",
                body: patch,
            }),
        }),

    }),
});


export const {
    useLoginMutation,
    useLogoutMutation,
    useCreateTokenMutation,
    useLoginmethodsMutation,
    useAuthProfilesMutation
} = musafirLoginApi;