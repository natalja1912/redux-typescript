import React from "react";
import classNames from "classnames";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import styles from "./Cart.module.css";
import { checkoutCart, getTotalPrice, removeFromCart, updateQuantity } from "./cartSlice";

export function Cart() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.products);
  const items = useAppSelector(state => state.cart.items);
  const totalPrice = useAppSelector(getTotalPrice);
  const checkoutState = useAppSelector(state => state.cart.checkoutState);
  const errorMessage = useAppSelector(state => state.cart.errorMessage);

  const onQuantityChanged = (e: React.FocusEvent<HTMLInputElement>, id: string) => {
    const quantity = Number(e.target.value);
    dispatch(updateQuantity({quantity, id}));
  }

  const tableClasses = classNames({
    [styles.table] : true,
    [styles.checkoutError] : checkoutState === 'ERROR',
    [styles.checkoutLoading] : checkoutState === 'LOADING'
  })

  function onCheckout(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    dispatch(checkoutCart());
  }

  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={tableClasses}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.entries(items).map(([id, quantity]) => 
            <tr key={id}>
            <td>{products[id].name}</td>
            <td>
              <input type="text" 
              className={styles.input} 
              defaultValue={quantity}
              onBlur={(e) => onQuantityChanged(e, id)}
               />
            </td>
            <td>{products[id].price}</td>
            <td>
              <button aria-label={`Remove ${products[id].name} from Shopping Cart`}
              onClick={() => dispatch(removeFromCart(id))}
              >
                X
              </button>
            </td>
          </tr>
            )
          }
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td className={styles.total}>${totalPrice.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      {checkoutState === 'ERROR' && errorMessage ? (<p className={styles.errorBox}>{errorMessage}</p>) : null}
      <form onSubmit={onCheckout}>
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}