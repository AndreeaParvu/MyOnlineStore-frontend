//get the data and store it inside the catalogSlice

import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { PagedProducts, PageMetadata, Product, ProductFilterOptions, ProductSearchBodyParams, ProductSearchParams, toProductSearchBodyParams } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

//gets the Axios params
function getProductQueryParams(productParams: ProductSearchParams) {
    const params = new URLSearchParams();
    params.append("page", productParams.page.toString()); //cheie: valoare
    params.append("size", productParams.size.toString());
    params.append("sort", productParams.orderBy);

    return params;
}

export const fetchProductsAsync = createAsyncThunk<PagedProducts, void, {state: RootState}>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        const wholeProductParams: ProductSearchParams = thunkAPI.getState().catalog.productParams;
        const queryParams: URLSearchParams = getProductQueryParams(wholeProductParams);
        const bodyParams: ProductSearchBodyParams = toProductSearchBodyParams(wholeProductParams);

        try{
            return await agent.Catalog.list(bodyParams, queryParams);
        } catch (error: any){
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => {
        try{
            return await agent.Catalog.details(productId);
        } catch (error: any){
            return thunkAPI.rejectWithValue({error: error.data}) //in cazul in care sse cauta un id de produs care nu exista
        }
    }
)

export const fetchProductFiltersOptionsAsync = createAsyncThunk<ProductFilterOptions>(
    'catalog/fetchProductFiltersOptionsAsync',
    async (_,thunkAPI) => {
        try{
            return agent.Catalog.filters();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

//starea produselor
interface ProductState {
    productsLoaded: boolean,
    status: string,
    filtersLoaded: boolean,
    types: string[],
    brands: string[],
    productParams: ProductSearchParams,
    pagedMetadata: PageMetadata | null
};

//starea initializata
const extraInitialState: ProductState = {
    productsLoaded: false,
    status: 'idle',
    filtersLoaded: false,
    types: [],
    brands: [],
    productParams: {
        page: 0,
        size: 6,
        orderBy: "name",
        types: [],
        brands: []
    },
    pagedMetadata: null
};

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<ProductState>(extraInitialState),
    reducers: {
        setPagedMetadata: (state, action) => {
            state.pagedMetadata = action.payload;
        },
        setPageNumber: (state, action) => {
            state.productParams = {...state.productParams, page: action.payload};
            state.productsLoaded = false;
        },
        setProductSearchParams: (state, action) => {
            state.productsLoaded = false; 
            //... = spread operator: append new values onto the existing productParams
            state.productParams = {...state.productParams, ...action.payload, page: 0}
        },
        resetProductSearchParams: (state) => {
            state.productParams = {
                page: 0,
                size: 6,
                orderBy: "name",
                types: [],
                brands: []
            };
            state.productsLoaded = false;
        }
    },
    extraReducers: (builder => {
        //fetch all products
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts'; 
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload.content);
            state.pagedMetadata = {
                number: action.payload.number,
                numberOfElements: action.payload.numberOfElements,
                size: action.payload.size,
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages
            };
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });

        //fetch single product
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });

        //fetch products filter options
        builder.addCase(fetchProductFiltersOptionsAsync.fulfilled, (state, action) => {
            state.types = action.payload.types;
            state.brands = action.payload.brands;
            state.filtersLoaded = true;
        })
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);
export const { setPagedMetadata, setProductSearchParams, resetProductSearchParams, setPageNumber } = catalogSlice.actions;