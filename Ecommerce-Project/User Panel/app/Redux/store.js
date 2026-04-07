import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { UserApi } from "../Features/UserApi";
import { ProductApi } from "../Features/ProductApi";
import { cartApi } from "../Features/CartApi";
import { CategoryApi } from "../Features/CategoryApi";
import { DashboardApi } from "../Features/DashboardApi";
// import { DashboardComponentApi } from "../Features/DashboardComponentApi";
import { orderApi } from "../Features/OrderApi";

export const store = configureStore({
  reducer: {
    [UserApi.reducerPath]: UserApi.reducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [CategoryApi.reducerPath]: CategoryApi.reducer,
    [DashboardApi.reducerPath]: DashboardApi.reducer,
    // [DashboardComponentApi.reducerPath]: DashboardComponentApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      UserApi.middleware,
      ProductApi.middleware,
      cartApi.middleware,
      CategoryApi.middleware,
      DashboardApi.middleware,
      // DashboardComponentApi.middleware,
      orderApi.middleware,
    ),
});

setupListeners(store.dispatch);
