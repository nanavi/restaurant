import React, { useState /* , useEffect, useContext */ } from "react";
// import { UserContext } from "../UserContext";
import { useFetch } from "../utils/useFetch";

const show_products = (products) => {
  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>
          <p>Sucursal: {p.branch}</p>
          <p>Id: {p.id}</p>
          <p>Categoria: {p.category}</p>
          <p>Descripcion: {p.description}</p>
          <p>Precio: {p.price}</p>
          <p>Stock: {p.stock}</p>
          <p>Imagen</p>
          {/* <img src={p.image} width="40%" height="40%" /> */}
          <br></br>
        </div>
      ))}
    </div>
  );
};

const options_page = (n) => {
  let content = [];
  for (let i = 0; i < n; ++i) {
    content.push(<option value={i + 1}>Sucursal {i + 1}</option>);
  }
  return content;
};

export default function Products() {
  // const { user } = useContext(UserContext);
  // const [branch, setBranch] = useState(() => {
  //   return localStorage.getItem("branch") === null
  //     ? 1
  //     : JSON.parse(localStorage.getItem("branch"));
  // });
  const [branch, setBranch] = useState(1);
  const { data, loading } = useFetch(
    `http://localhost:5555/${branch}/products`
  );

  // useEffect(() => {
  //   localStorage.setItem("branch", JSON.stringify(branch));
  // }, [branch]);

  if (loading) return <div> Loading... </div>;

  return (
    <div>
      {/* {console.log(anis)} */}
      <h2>Productos de sucursal {branch}</h2>
      <h2>Elige una sucursal:</h2>
      <select
        onChange={(e) => {
          setBranch(e.target.value);
        }}
      >
        <option value=" ">Elige sucursal</option>
        {options_page(4)}
      </select>
      {show_products(data)}
    </div>
  );
}
