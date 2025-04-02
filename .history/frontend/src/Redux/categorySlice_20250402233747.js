// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Initial state
// const initialState = {
//     categories: [],
//     subcategories: [],
//     subcategoriesItem: [],
//     attributes: [],
//     attributeValues:[],
//     countries: [],
//     cities: [],

//     loading: false,
//     error: null,
// };

// // Async Thunks for API calls
// export const fetchCategories = createAsyncThunk("category/fetchCategories", async () => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
//     return response.json();
// });


// export const fetchSubcategories = createAsyncThunk("category/fetchSubcategories", async (categoryId) => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategories?categoryId=${categoryId}`);
//     return response.json();
// });

// export const fetchSubcategoryItems = createAsyncThunk("category/fetchSubcategoryItems", async (subcategoryId) => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategory-items/${subcategoryId}`);
//     return response.json();
// });
// export const fetchAttributes = createAsyncThunk("category/fetchAttributes", async (subcategoryId) => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/attributes/${subcategoryId}`);
//     return response.json();
// });
// export const fetchAttributeValues = createAsyncThunk("category/fetchAttributeValues", async (attributeId) => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/attribute-values/${attributeId}`);
//     return response.json();
// });
// // Fetch countries
// export const fetchCountries = createAsyncThunk("category/fetchCountries", async () => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/countries`);
//     return response.json();
// });

// // Fetch cities based on countryId
// export const fetchCities = createAsyncThunk("category/fetchCities", async (countryId) => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cities/${countryId}`);
//     return response.json();
// });

// // Redux Slice
// const categorySlice = createSlice({
//     name: "category",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchCategories.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchCategories.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.categories = action.payload;
//             })
//             .addCase(fetchCategories.rejected, (state) => {
//                 state.loading = false;
//                 state.error = "Failed to fetch categories";
//             })
//             .addCase(fetchSubcategories.fulfilled, (state, action) => {
//                 state.subcategories = action.payload;
//             })
//             .addCase(fetchSubcategoryItems.fulfilled, (state, action) => {
//                 state.subcategoriesItem = action.payload;
//             })
//             .addCase(fetchAttributes.fulfilled, (state, action) => {
//                 state.attributes = action.payload;
//             })
//             .addCase(fetchAttributeValues.fulfilled, (state, action) => {
//                 state.attributeValues = [
//                     ...state.attributeValues,
//                     ...action.payload, // Append fetched attribute values
//                 ];
//             })
//               // Handle fetchCountries
//               .addCase(fetchCountries.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchCountries.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.countries = action.payload;
//             })
//             .addCase(fetchCountries.rejected, (state) => {
//                 state.loading = false;
//                 state.error = "Failed to fetch countries";
//             })
//             // Handle fetchCities
//             .addCase(fetchCities.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchCities.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.cities = action.payload;
//             })
//             .addCase(fetchCities.rejected, (state) => {
//                 state.loading = false;
//                 state.error = "Failed to fetch cities";
//             });
//             ;
//     },
// });

// export default categorySlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state with attributeValues as an object indexed by attribute_id
const initialState = {
    categories: [],
    subcategories: [],
    subcategoriesItem: [],
    attributes: [],
    attributeValues: {}, // Changed to an object for easier lookup
    attributeValuesLoading: {}, // Track loading status per attribute
    countries: [],
    cities: [],
    loading: false,
    error: null,
};

// Async Thunks for API calls
export const fetchCategories = createAsyncThunk("category/fetchCategories", async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
    return response.json();
});

export const fetchSubcategories = createAsyncThunk("category/fetchSubcategories", async (categoryId) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategories?categoryId=${categoryId}`);
    return response.json();
});

export const fetchSubcategoryItems = createAsyncThunk("category/fetchSubcategoryItems", async (subcategoryId) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategory-items/${subcategoryId}`);
    return response.json();
});

export const fetchAttributes = createAsyncThunk("category/fetchAttributes", async (subcategoryId) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/attributes/${subcategoryId}`);
    return response.json();
});

export const fetchAttributeValues = createAsyncThunk(
    "category/fetchAttributeValues",
    async (attributeId) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/attribute-values/${attributeId}`);
        const data = await response.json();
        return { attributeId, values: data };
    }
);

// Fetch countries
export const fetchCountries = createAsyncThunk("category/fetchCountries", async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/countries`);
    return response.json();
});

// Fetch cities based on countryId
export const fetchCities = createAsyncThunk("category/fetchCities", async (countryId) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cities/${countryId}`);
    return response.json();
});

// Redux Slice
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        clearAttributeValues: (state) => {
            state.attributeValues = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to fetch categories";
            })
            .addCase(fetchSubcategories.fulfilled, (state, action) => {
                state.subcategories = action.payload;
            })
            .addCase(fetchSubcategoryItems.fulfilled, (state, action) => {
                state.subcategoriesItem = action.payload;
            })
            .addCase(fetchAttributes.pending, (state) => {
                state.attributes = []; // Clear attributes when fetching new ones
            })
            .addCase(fetchAttributes.fulfilled, (state, action) => {
                state.attributes = action.payload;
            })
            .addCase(fetchAttributeValues.pending, (state, action) => {
                // Track loading status for specific attribute
                state.attributeValuesLoading = {
                    ...state.attributeValuesLoading,
                    [action.meta.arg]: true,
                };
            })
            .addCase(fetchAttributeValues.fulfilled, (state, action) => {
                const { attributeId, values } = action.payload;
                // Store values indexed by attribute ID
                state.attributeValues = {
                    ...state.attributeValues,
                    [attributeId]: values,
                };
                state.attributeValuesLoading = {
                    ...state.attributeValuesLoading,
                    [attributeId]: false,
                };
            })
            .addCase(fetchAttributeValues.rejected, (state, action) => {
                state.attributeValuesLoading = {
                    ...state.attributeValuesLoading,
                    [action.meta.arg]: false,
                };
                state.error = "Failed to fetch attribute values";
            })
            // Handle fetchCountries
            .addCase(fetchCountries.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = action.payload;
            })
            .addCase(fetchCountries.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to fetch countries";
            })
            // Handle fetchCities
            .addCase(fetchCities.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.loading = false;
                state.cities = action.payload;
            })
            .addCase(fetchCities.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to fetch cities";
            });
    },
});

export const { clearAttributeValues } = categorySlice.actions;
export default categorySlice.reducer;