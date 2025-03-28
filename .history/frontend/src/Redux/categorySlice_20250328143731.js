import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    categories: [],
    subcategories: [],
    subcategoriesItem: [],
    attributes: [],
    loading: false,
    error: null,
};

// Async Thunks for API calls
export const fetchCategories = createAsyncThunk("category/fetchCategories", async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
    return response.json();
});

export const fetchSubcategories = createAsyncThunk("category/fetchSubcategories", async (categoryId) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategories`);
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
// Redux Slice
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
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
            });
    },
});

export default categorySlice.reducer;
