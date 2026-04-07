import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { ProductApi } from "../features/ProductApi";
import { CategoryApi } from "../features/CategoryApi";
import { UserApi } from "../features/UserApi";
import { OrderApi } from "../features/OrderApi";
import { DashboardApi } from "../features/DashboardApi";

export const store = configureStore({
  reducer: {
    [ProductApi.reducerPath]: ProductApi.reducer,
    [CategoryApi.reducerPath]: CategoryApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [OrderApi.reducerPath]: OrderApi.reducer,
    [DashboardApi.reducerPath]: DashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ProductApi.middleware,
      CategoryApi.middleware,
      UserApi.middleware,
      OrderApi.middleware,
      DashboardApi.middleware,
    ),
});

setupListeners(store.dispatch);
