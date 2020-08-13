import React, { useState, useEffect } from "react";
import { Link as Rlink } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { useFetch } from "../utils/useFetch";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Menu() {
  const classes = useStyles();
  const [branch, setBranch] = useState(1);
  const [category, setCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const { data, loading } = useFetch(
    category
      ? `http://localhost:5000/${branch}/products/${category}`
      : `http://localhost:5000/${branch}/products/`
  );
  //   console.log(category ? `category` : `${category}`);

  const add_to_cart = (pbranch, pcategory, id, stock, price, description) => {
    if (cart.length === 0) {
      setCart([
        ...cart,
        {
          branch: pbranch,
          category: pcategory,
          id: id,
          stock: stock,
          price: price,
          description: description,
          quantity: 1,
        },
      ]);
    } else {
      for (let i = 0; i < cart.length; ++i) {
        if (cart[i].id === id) {
          let newCart = [...cart];
          ++newCart[i].quantity;
          setCart(newCart);
          return;
        }
      }
      setCart([
        ...cart,
        {
          branch: pbranch,
          category: pcategory,
          id: id,
          stock: stock,
          price: price,
          description: description,
          quantity: 1,
        },
      ]);
    }
  };

  const Content = () => {
    if (loading) {
      return (
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              {}
            </Typography>
          </Grid>
        </Container>
      );
    } else if (!loading && data.products.length > 0)
      return (
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {data.products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={product.image}
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.description}
                    </Typography>
                    <Typography>Restaurante {product.branch}</Typography>
                    <Typography>Categoria: {product.category}</Typography>
                    <Typography>Precio: ${product.price}</Typography>
                    <Typography>Stock: {product.stock}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Comprar
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        add_to_cart(
                          product.branch,
                          product.category,
                          product.id,
                          product.stock,
                          product.price,
                          product.description
                        );
                      }}
                    >
                      Añadir
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      );
    else {
      return (
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Empty
            </Typography>
          </Grid>
        </Container>
      );
    }
  };

  // useEffect(() => {}, [branch, category]);

  const dumbContent = () => {
    return (
      <Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image="https://source.unsplash.com/random"
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Heading
                  </Typography>
                  <Typography>
                    This is a media card. You can use this section to describe
                    the content.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View
                  </Button>
                  <Button size="small" color="primary">
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };

  return (
    <React.Fragment>
      <CssBaseline />
      {/* <AppBar position="relative">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Productos
          </Typography>
        </Toolbar>
      </AppBar> */}
      <main>
        {/* Hero unit */}

        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Platillos
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Productos de la sucursal Restaurante {branch}
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setBranch(1);
                    }}
                  >
                    Restaurante 1
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setBranch(2);
                    }}
                  >
                    Restaurante 2
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setBranch(3);
                    }}
                  >
                    Restaurante 3
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setBranch(4);
                    }}
                  >
                    Restaurante 4
                  </Button>
                </Grid>
              </Grid>
            </div>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setCategory("Bebida");
                    }}
                  >
                    Bebidas
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setCategory("Comida");
                    }}
                  >
                    Comidas
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setCategory("Entrada");
                    }}
                  >
                    Entradas
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setCategory("Postres");
                    }}
                  >
                    Postres
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setCategory(null);
                    }}
                  >
                    Todos
                  </Button>
                </Grid>
              </Grid>
            </div>

            <Container className={classes.cardGrid} maxWidth="md">
              {/* End hero unit */}
              <Grid container spacing={4}>
                {cart.map((product) => (
                  <Grid item key={product.id} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      {/* <CardMedia
                    className={classes.cardMedia}
                    image={product.image}
                    title="Image title"
                  /> */}
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {product.description}
                        </Typography>
                        <Typography color="secondary">
                          cantidad: {product.quantity}
                        </Typography>
                        <Typography color="textSecondary">
                          Restaurante {product.branch}
                        </Typography>
                        {/* <Typography>{product.category}</Typography> */}
                        <Typography color="textSecondary">
                          Precio: ${product.price}
                        </Typography>
                        {/* <Typography>Stock: {product.stock}</Typography> */}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
            <div className={classes.heroButtons}>
              {/* -----COMPRAR SELECCIONADOS---- */}
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    color="secondary"
                    component={Rlink}
                    to={{ pathname: "/Checkout", state: { cart } }}
                  >
                    Comprar seleccionados
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        {Content()}
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
