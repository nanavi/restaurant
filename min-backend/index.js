const express = require("express");
const cassandra = require("cassandra-driver");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const Uuid = cassandra.types.Uuid;

const PORT = process.env.PORT || 5000;

const client = new cassandra.Client({
  contactPoints: ["172.18.0.2"],
  keyspace: "restaurant_keyspace",
  localDataCenter: "DC1",
});

const generate_hash = (passwd) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(passwd, salt);
  // console.log(hash);
  return hash;
};

const compare_hash = async (passwd, hash) => {
  console.log("CHECK LOG IN");
  // let pass = false;
  const match = await bcrypt.compare(passwd, hash);
  console.log("match?:", match);
  // bcrypt.compare(passwd, hash, function (err, res) {
  //   console.log("Result_compare_hash:", res);
  //   if (res) {
  //     console.log("PASS");
  //     pass = true;
  //   } else {
  //     console.log("FAIL");
  //     pass = false;
  //   }
  // });
  return match;
};

const addUser = async (user) => {
  const { firstName, lastName, email, password } = user;
  const hashed_password = generate_hash(password);
  const uid = Uuid.random().toString();
  const query = `insert into customer_by_id (id, email, first_name, last_name, password) values (?, ?, ?, ?, ?)`;
  const params = [uid, email, firstName, lastName, hashed_password];
  try {
    result = await client.execute(query, params, { prepare: true });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
// insert admin
// admin = "admin";
// addUser({
//   firstName: admin,
//   lastName: admin,
//   email: admin,
//   password: admin,
// });

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

/* // metodo para obtener un producto que sea de una branch y categoria especifica
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
}); */

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

/* **************************************************EXPERIMENTAL******************************************** */

/* Customers */

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
