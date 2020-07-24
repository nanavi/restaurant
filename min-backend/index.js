const express = require("express");
// const dse = require("dse-driver");
const cassandra = require("cassandra-driver");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const Uuid = cassandra.types.Uuid;

// utiliza el puerto 5555 la api
const PORT = process.env.PORT || 5555;

const client = new cassandra.Client({
  // la ip del red no me acuerdo como se sacaba xd pero esta es la mia
  contactPoints: ["172.30.0.1"],
  keyspace: "restaurant_keyspace",
  localDataCenter: "DC1",
});

/* Products */
app.get("/:branch/products", async (req, res) => {
  const { branch } = req.params;
  console.log("Restaurant:", branch);
  const query = "SELECT * FROM product_by_branch WHERE branch = ?";
  try {
    result = await client.execute(query, [branch], { prepare: true });
    res.json(result.rows);
    console.log("Ok");
  } catch (err) {
    res.jsonp(err);
    console.log("Not ok");
  }
});
app.get("/:branch/product/:category/:description", async (req, res) => {
  const { branch, category, description } = req.params;
  console.log("Restaurant:", branch);
  const query =
    "SELECT * FROM product_by_branch WHERE branch = ? AND category = ? AND description = ?";
  try {
    console.log("params ", [branch, category, description]);
    result = await client.execute(query, [branch, category, description], {
      prepare: true,
    });
    res.json(result.rows);
    console.log("Ok");
  } catch (err) {
    res.jsonp(err);
    console.log("Not ok");
    console.log(err);
  }
});

app.post("/:branch/add-product", async (req, res) => {
  const { branch } = req.params;
  const { description, category, stock, price } = req.body;
  const query = `insert into product_by_branch (description, category, branch, stock, price) values (?, ?, ?, ?, ?)`;
  const params = [description, category, branch, stock, price];
  console.log("Restaurant", branch);
  console.log(params);
  try {
    result = await client.execute(query, params, { prepare: true });
    res.json({ result: "Ok" });
    console.log("Ok");
    console.log(result);
  } catch (err) {
    res.jsonp(err);
    console.log("Not ok");
    console.log(err);
    console.log(result);
  }
});

app.put(
  "/:branch/update-product-stock/:category/:description",
  async (req, res) => {
    const { branch, category, description } = req.params;
    const { stock } = req.body;
    const query =
      "UPDATE product_by_branch SET stock = ? where branch = ? and category = ? and description = ?";
    const params = [stock, branch, category, description];
    try {
      result = await client.execute(query, params, { prepare: true });
      res.json({ result: "Product stock updated" });
      console.log(result);
    } catch (err) {
      res.json(err);
      console.log(err);
    }
  }
);
// metodo para obtener un producto que sea de una branch y categoria especifica
app.get("/:branch/products/:category", async (req, res) => {
  //        |               |
  //        V           ____|
  const { branch, category } = req.params; //obtiene esos parametros del url
  const query =
    "select * from product_by_branch where branch = ? and category = ?";
  const params = [branch, category];
  try {
    // realizar query
    result = await client.execute(query, params, { prepare: true });
    // manda al cliente el resultados de las columnas en formator JSON
    res.json(result.rows);
    console.log(result);
  } catch (err) {
    // muestra error si en JSON tmbn
    res.json(err);
    console.log(err);
  }
});

app.delete("/:branch/del-product/:category/", async (req, res) => {
  const { branch, category } = req.params;
  const { description } = req.body;
  const query =
    "delete from product_by_branch where branch = ? and category = ? and description = ?";
  const params = [branch, category, description];
  console.log(params);
  try {
    result = await client.execute(query, params, { prepare: true });
    res.json({ result: "del ok" });
    console.log("Ok");
    console.log(result);
  } catch (err) {
    res.jsonp(err);
    console.log("Not ok");
    console.log(err);
  }
});

/* Customers */

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
