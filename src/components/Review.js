import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

export default function Review(props) {
  const classes = useStyles();
  const { cart, total, date, branch, username } = props;
  console.log("Review. Props", cart);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Ordenes
      </Typography>
      <List disablePadding>
        {cart.map((product) => (
          <ListItem className={classes.listItem} key={product.id}>
            <ListItemText
              primary={product.name}
              secondary={product.description}
            />
            <Typography variant="body2">
              {product.quantity} x ${product.price}
            </Typography>
          </ListItem>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            ${total}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Restaurante XYZ
          </Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Detalles
          </Typography>
          <Grid container>
            <React.Fragment key={1}>
              <Grid item xs={6}>
                <Typography gutterBottom>Fecha</Typography>
                <Typography gutterBottom>Cliente</Typography>
                <Typography gutterBottom>Sucursal</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>
                  {date.toJSON().slice(0, 10).replace(/-/g, "/")}
                </Typography>
                <Typography gutterBottom>{username}</Typography>
                <Typography gutterBottom>S{branch}</Typography>
              </Grid>
            </React.Fragment>
          </Grid>
          {/* <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid> */}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
