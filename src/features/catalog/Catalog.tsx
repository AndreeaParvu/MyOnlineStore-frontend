import { Grid, Paper } from "@mui/material";
import { Fragment, useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductFiltersOptionsAsync, fetchProductsAsync, productSelectors, setPageNumber, setProductSearchParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

//array de optiuni de sortare
const sortOptions = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'price,DESC', label: 'Price - High to low' },
  { value: 'price', label: 'Price - Low to high' }
];

//Catalog => specific proprietatile unui obiect de care am nevoie
export default function Catalog() { 

  const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, types, brands, filtersLoaded, productParams, pagedMetadata} = useAppSelector (state => state.catalog);
    const dispatch = useAppDispatch();

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchProductFiltersOptionsAsync());
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, filtersLoaded, dispatch]);

  if (!pagedMetadata) {
    return (
      <Fragment></Fragment>
    );
  }

return (
      <Grid container columnSpacing={4}>
        <Grid item xs={3}>

{/* search products */}
          <Paper sx={{mb: 2}}>
             <ProductSearch />
          </Paper>

{/* sort options */}
          <Paper sx={{ mb: 2, p: 2 }}>
            <RadioButtonGroup
               selectedValue={productParams.orderBy}
               options={sortOptions}
               onChange={(e) => dispatch(setProductSearchParams({ orderBy: e.target.value }))}
            />
          </Paper>

{/* filter by brand */}
          <Paper sx={{ mb: 2, p: 2 }}>
             <CheckboxButtons
                items={brands}
                checked={productParams.brands}
                onChange={(items: string[]) => dispatch(setProductSearchParams({ brands: items }))}
             />
          </Paper> 

{/* filter by type */}
          <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
                items={types}
                checked={productParams.types}
                onChange={(items: string[]) => dispatch(setProductSearchParams({ types: items }))}
             />
          </Paper> 

{/* products display */}
        </Grid>
        <Grid item xs={9}>
           <ProductList products={products} />
        </Grid>

        <Grid item xs={3} />
        
{/* page display */}
        <Grid item xs={9} sx={{ mb: 2 }}>
          <AppPagination
             pagedMetadata={pagedMetadata!}
             onPageChange={(page: number) => dispatch(setPageNumber(page - 1))}
          />
         
        </Grid>
      </Grid>
  );
}

