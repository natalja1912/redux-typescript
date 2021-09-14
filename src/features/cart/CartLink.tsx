import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./CartLink.module.css";
import { getMemoizedNumItems } from "./cartSlice";

export function CartLink() {
  const numItems = useAppSelector(getMemoizedNumItems);

  return (
    <Link to="/cart" className={styles.link}>
      <span className={styles.text}>🛒&nbsp;&nbsp;{!numItems ? 'Cart' : numItems}</span>
    </Link>
  );
}
