import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";

export default function Catalog() { //specific proprietatile unui obiect de care am nevoie
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded} = useAppSelector (state => state.catalog);
    const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]) //[] => array gol de dependinte care impiedica executarea codului intr-o bucla continua de request-uri

return (
      <>
         <ProductList products={products} />
      </>
  );
}