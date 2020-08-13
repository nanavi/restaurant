import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Review from "./Review";

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
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function Checkout(props) {
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  console.log("User in Checktout:", user);
  const [cart, setCart] = React.useState(props.location.state.cart);
  const date = new Date();
  console.log("cart", cart);
  console.log("props", props);

  const getBranch = () => {
    let cbr = -1;
    if (cart) {
      cbr = cart[0].branch;
      for (let i = 1; i < cart.length; ++i) {
        if (cart[i].branch !== cbr) return -1;
      }
    }
    return cbr;
  };

  const PlaceOrder = async () => {
    console.log("placing cart", cart);
    const order = {
      id_customer: user.id,
      name_customer: user.username,
      products: cart,
      total: getTotal(),
      date: date,
      branch: getBranch(),
    };
    try {
      let res = await fetch("http://localhost:5000/add-facture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      let res_ = await res.json();
      console.log(res_);
      if (res_.error) throw res_.error;
      //   setUser(res_.user);
    } catch (err) {
      console.log(err);
      console.log(order);
    }
  };

  const getTotal = () => {
    let total = 0;
    if (cart) {
      for (let i = 0; i < cart.length; ++i) {
        total += cart[i].price * cart[i].quantity;
      }
    }
    return total;
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Resumen de Ordenes
          </Typography>
          <React.Fragment>
            {/* {getStepContent(activeStep)} */}
            <Review
              cart={cart}
              total={getTotal()}
              date={date}
              branch={getBranch()}
              username={user ? user.username : "OFFLINE"}
            />
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  console.log("click");
                  PlaceOrder();
                }}
                className={classes.button}
              >
                {"Place order"}
              </Button>
            </div>
          </React.Fragment>
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
}
