const express = require("express");
const cassandra = require("cassandra-driver");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { json } = require("express");

const { Uuid, Tuple } = cassandra.types;
const saltRounds = 10;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const PORT = process.env.PORT || 5000;

const client = new cassandra.Client({
  // 172.23.0.2
  contactPoints: ["172.23.0.2"],
  keyspace: "restaurant_keyspace",
  localDataCenter: "DC1",
});

const generate_hash = (passwd) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(passwd, salt);
  return hash;
};

const compare_hash = async (passwd, hash) => {
  console.log("CHECK LOG IN");
  const match = await bcrypt.compare(passwd, hash);
  console.log("match?:", match);
  return match;
};

// customer by id
app.get("/email/:email/", async (req, res) => {
  const { email } = req.params;
  // console.log(email);
  const query = `select id, email, first_name FROM customer_by_email WHERE email = ?`;
  const params = [email];
  try {
    result = await client.execute(query, params, { prepare: true });
    console.log(result);
    res.json({
      status: result.rows.length > 0 ? true : false,
      user: result.rows,
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.jsonp({ status: false, error: err, user: [] });
  }
});

/* Products by branch ALL*/
app.get("/:branch/products", async (req, res) => {
  const { branch } = req.params;
  console.log("Restaurant:", branch);
  const query = "SELECT * FROM product_by_branch WHERE branch = ?";
  try {
    result = await client.execute(query, [branch], { prepare: true });
    res.json({ products: result.rows, error: null });
    console.log("Ok");
  } catch (err) {
    res.json({ products: null, error: err });
    console.log("Not ok");
  }
});
/* Products by branch and category*/
app.get("/:branch/products/:category", async (req, res) => {
  const { branch, category } = req.params;
  console.log("Restaurant:", branch);
  const query =
    "SELECT * FROM product_by_branch WHERE branch = ? AND category = ? ";
  try {
    console.log("params ", [branch, category]);
    result = await client.execute(query, [branch, category], {
      prepare: true,
    });
    res.json({ products: result.rows, error: null });
    console.log("Ok");
  } catch (err) {
    res.json({ products: null, error: err });
    console.log("Not ok");
    console.log(err);
  }
});

/* select a single product */
app.get("/:branch/product/:category/:id", async (req, res) => {
  const { branch, category, id } = req.params;
  console.log("Restaurant:", branch);
  const query =
    "SELECT * FROM product_by_branch WHERE branch = ? AND category = ? AND id = ?";
  try {
    console.log("params ", [branch, category, id]);
    result = await client.execute(query, [branch, category, id], {
      prepare: true,
    });
    res.json({ products: result.rows[0], error: null });
    console.log("Ok");
  } catch (err) {
    res.json({ products: null, error: err });
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

/* update stock */
app.put("/:branch/update-product-stock/:category/:id", async (req, res) => {
  const { branch, category, id } = req.params;
  const { stock } = req.body;
  const query =
    "UPDATE product_by_branch SET stock = ? where branch = ? and category = ? and id = ?";
  const params = [stock, branch, category, id];
  try {
    result = await client.execute(query, params, { prepare: true });
    res.json({ result: "Product stock updated", error: null });
    console.log(result);
  } catch (err) {
    res.json({ result: null, error: err });
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

/* **************************************************EXPERIMENTAL******************************************** */
app.get("/:branch/facturas", async (req, res) => {
  const { branch } = req.params;
  console.log("Restaurant:", branch);
  const query = "SELECT * FROM factura_by_branch WHERE branch = ? ";
  try {
    result = await client.execute(query, [branch], { prepare: true });
    res.json(result.rows);
    console.log("Ok");
  } catch (err) {
    res.jsonp(err);
    console.log("Not ok");
  }
});

app.get("/:customer/fac_personal", async (req, res) => {
  const { customer } = req.params;
  console.log("Restaurant:", customer);
  const query = "SELECT * FROM factura_by_customer WHERE id_customer = ?";
  try {
    console.log("params ", [customer]);
    result = await client.execute(query, [customer], {
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

app.get("/:branch/facturas/:id/", async (req, res) => {
  const { customer } = req.params;
  console.log("Restaurant:", customer);
  const query = "SELECT * FROM factura_by_customer WHERE id_customer = ?";
  try {
    console.log("params ", [customer]);
    result = await client.execute(query, [customer], {
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

app.put("/update-facture-products/:id/:products", async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  const query = "UPDATE factura_by_id SET products = ? WHERE id = ?";
  const params = [products, id];
  try {
    result = await client.execute(query, params, { prepare: true });
    res.json({ result: "Facture Updated" });
    console.log(result);
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

app.get("/:branch/reservations", async (req, res) => {
  const { branch } = req.params;
  console.log("Restaurant:", branch);
  const query = "SELECT * FROM reservation_by_branch WHERE branch = ?";
  try {
    console.log("params ", [branch]);
    result = await client.execute(query, [branch], {
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

app.get("/:customer/reservation", async (req, res) => {
  const { customer } = req.params;
  console.log("Restaurant:", customer);
  const query = "SELECT * FROM reservation_by_customer WHERE id_customer = ?";
  try {
    console.log("params ", [customer]);
    result = await client.execute(query, [customer], {
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

//producto, cantidad, precio, semitotal

/* **************************************************EXPERIMENTAL******************************************** */

/* 
POST REQUESTS 
* SignIn (customer)
* SignUp (customer)
* SignIn (employee) NO 
* SignUp (employee) NO
* SignIn (employee) NO
* Facture           YES
    - update stocks NO
*/
/* SIGN IN AND SIGN UP */
app.post("/signIn", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log("input_email:", email, "input_password:", password);
  const query = `select id, email, first_name, password FROM customer_by_email WHERE email = ?`;
  const params = [email];
  try {
    result = await client.execute(query, params, { prepare: true });
    console.log("len:", result.rows.length);
    if (result.rows.length === 0) throw "user not found";
    pass = await compare_hash(password, result.rows[0].password);
    if (!pass) throw "incorrect password";
    res.json({
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        username: result.rows[0].first_name,
      },
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.json({ error: err, user: null });
  }
});

app.post("/signUp", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashed_password = generate_hash(password);
  const uid = Uuid.random().toString();
  const query = `insert into customer_by_id (id, email, first_name, last_name, password) values (?, ?, ?, ?, ?)`;
  const params = [uid, email, firstName, lastName, hashed_password];
  try {
    result = await client.execute(query, params, { prepare: true });
    console.log(result);
    res.json({
      user: {
        id: uid,
        email: email,
        username: firstName,
      },
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.json({ error: err, user: null });
  }
});

/* FACTURE */

app.post("/add-facture/", async (req, res) => {
  const {
    id_customer,
    name_customer,
    products,
    total,
    date,
    branch,
  } = req.body;
  id_facture = Uuid.random().toString();
  id_vale = Uuid.random().toString();
  let queries = [];
  let productsTupled = [];

  const query1 = `insert into factura_by_id (
    id, 
    id_customer, 
    name_customer, 
    products, 
    total, 
    date, 
    id_vale, 
    branch)
  values (?, ?, ?, ?, ?, ?, ?, ?)`;

  for (let i = 0; i < products.length; ++i) {
    let {
      description,
      quantity,
      price,
      stock,
      branch,
      category,
      id,
    } = products[i];
    productsTupled.push(
      new Tuple(description, quantity, price, quantity * price)
    );
    queries.push({
      query:
        "UPDATE product_by_branch SET stock = ? where branch = ? and category = ? and id = ?",
      params: [stock - quantity, branch, category, id],
    });
  }
  console.log("set of tuples", productsTupled);
  const params1 = [
    id_facture,
    id_customer,
    name_customer,
    productsTupled,
    total,
    Date.now(),
    id_vale,
    branch,
  ];
  // console.log("params", params1);
  queries.unshift({ query: query1, params: params1 });
  console.log(queries);
  try {
    result = await client.batch(queries, {
      prepare: true,
      consistency: cassandra.types.consistencies.quorum,
    });
    res.json({ result: true, error: null });
  } catch (err) {
    console.log(err);
    res.json({ result: null, error: err });
  }
});

/* reservation */
// make a reservation
//  parameters:
/* 
create table reservation_by_branch_and_id(
    id                  uuid,
    reservation_date    date,
    hour                time,
    id_mesa             uuid,
    id_customer         uuid,
    branch              int,
    PRIMARY KEY(branch,id)
);
*/

/* 
GET REQUESTS
* getproducts by branch                 /:branch/products
* getproducts by branch and category    /:branch/products/:category
*/

// get tables AVAILABLE  order = available ,branch, id
app.get("/:branch/available-tables", async (req, res) => {
  const { branch } = req.params;
  console.log("Restaurant:", branch);
  const query =
    "select * from table_by_id_and_availability where available = True and branch = ?";
  try {
    result = await client.execute(query, [branch], { prepare: true });
    res.json({ tables: result.rows, error: null });
    console.log("Ok");
  } catch (err) {
    res.json({ tables: null, error: err });
    console.log("Not ok");
  }
});

// get ALL tables
app.get("/:branch/tables", async (req, res) => {
  const { branch } = req.params;
  console.log("Restaurant:", branch);
  const query = "SELECT * FROM table_by_branch WHERE branch = ? ";
  try {
    result = await client.execute(query, [branch], { prepare: true });
    res.json({ tables: result.rows, error: null });
    console.log("Ok");
  } catch (err) {
    res.json({ tables: null, error: err });
    console.log("Not ok");
  }
});

/* 
PUT REQUESTS
* 
* 
*/
// updates available to False or True
app.put("/:branch/update-table/:id/", async (req, res) => {
  const { branch, id } = req.params;
  const { available } = req.body;
  const query =
    "UPDATE table_by_branch SET available = ? where branch = ? and id = ?";
  const params = [available, branch, id];
  try {
    result = await client.execute(query, params, { prepare: true });
    res.json({ result: "table updated", error: null });
    console.log(result);
  } catch (err) {
    res.json({ result: null, error: err });
    console.log(err);
  }
});

// update table set AVAILABLE to FALSE or TRUE

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
