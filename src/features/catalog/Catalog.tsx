import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

export default function Catalog() { //specific proprietatile unui obiect de care am nevoie
    const[products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    agent.Catalog.list().then(products => setProducts(products))
  }, []) //[] => array gol de dependinte care impiedica executarea codului intr-o bucla continua de request-uri

    return (
        <>
           <ProductList products={products} />
        </>
    );
}