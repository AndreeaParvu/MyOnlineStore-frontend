import { useState, useEffect } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

export default function Catalog() { //specific proprietatile unui obiect de care am nevoie
    const[products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/commerce/api/public/catalog/products')
    .then(response => response.json())
    .then(data => setProducts(data))
  }, []) //[] => array gol de dependinte care impiedica executarea codului intr-o bucla continua de request-uri

    return (
        <>
           <ProductList products={products} />
        </>
    );
}