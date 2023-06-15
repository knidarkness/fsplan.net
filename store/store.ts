import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

export const mapStateSlice = createSlice({
  name: "mapStateSlice",
  initialState: {
    lat: 0,
    lon: 0,
    zoom: 4,
  },
  reducers: {
    setState: (state, action) => ({
      ...action.payload,
    }),
    setLat: (state, action) => ({
      ...state,
      lat: action.payload,
    }),
    setLon: (state, action) => ({
      ...state,
      lon: action.payload,
    }),
    setZoom: (state, action) => ({
      ...state,
      zoom: action.payload,
    }),
  },
});

export const airportFiltersSlice = createSlice({
  name: "airportFilters",
  initialState: {
    departureAirport: "",
    distanceRange: {
      min: 1,
      max: 2000,
    },
    runwayLength: {
      min: NaN,
      max: NaN,
    },
    visibilityRange: {
      min: NaN,
      max: NaN,
    },
    ceilingRange: {
      min: NaN,
      max: NaN,
    },
    allowDerivedMetar: false,
  },
  reducers: {
    setDepartureAirport: (state, action) => {
      return {
        ...state,
        departureAirport: action.payload,
      };
    },
    setDistanceMin: (state, action) => ({
      ...state,
      distanceRange: {
        ...state.distanceRange,
        min:
          typeof action.payload === "number"
            ? action.payload
            : state.distanceRange.min,
      },
    }),
    setDistanceMax: (state, action) => ({
      ...state,
      distanceRange: {
        ...state.distanceRange,
        max:
          typeof action.payload === "number"
            ? action.payload
            : state.distanceRange.min,
      },
    }),
    setRunwayLengthMin: (state, action) => ({
      ...state,
      runwayLength: {
        ...state.runwayLength,
        min:
          typeof action.payload === "number"
            ? action.payload
            : state.runwayLength.min,
      },
    }),
    setRunwayLengthMax: (state, action) => ({
      ...state,
      runwayLength: {
        ...state.runwayLength,
        max:
          typeof action.payload === "number"
            ? action.payload
            : state.runwayLength.min,
      },
    }),
    setVisibilityMin: (state, action) => ({
      ...state,
      visibilityRange: {
        ...state.visibilityRange,
        min:
          typeof action.payload === "number"
            ? action.payload
            : state.visibilityRange.min,
      },
    }),
    setVisibilityMax: (state, action) => ({
      ...state,
      visibilityRange: {
        ...state.visibilityRange,
        max:
          typeof action.payload === "number"
            ? action.payload
            : state.visibilityRange.max,
      },
    }),
    setCeilingMin: (state, action) => ({
      ...state,
      ceilingRange: {
        ...state.ceilingRange,
        min:
          typeof action.payload === "number"
            ? action.payload
            : state.ceilingRange.min,
      },
    }),
    setCeilingMax: (state, action) => ({
      ...state,
      ceilingRange: {
        ...state.ceilingRange,
        max: action.payload,
      },
    }),
    setAllowDerivedMetar: (state, action) => ({
      ...state,
      allowDerivedMetar: action.payload,
    }),
  },
});

export const makeStore = () =>
  configureStore({
    reducer: {
      airportFilters: airportFiltersSlice.reducer,
      mapState: mapStateSlice.reducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);

export default wrapper;
export const airportFiltersActions = airportFiltersSlice.actions;
export const mapStateActions = mapStateSlice.actions;
