import React from "react";
import { useAppSelector } from "../../store/hooks";
import CartEmptyScreen from "./CartEmptyScreen";
import CartWithItemsScreen from "./CartWithItemsScreen";

interface CartScreenProps {
  navigation?: any;
}

export default function CartScreen({ navigation }: CartScreenProps) {
  const { items } = useAppSelector(state => state.cart);

  if (items.length === 0) {
    return <CartEmptyScreen navigation={navigation} />;
  }

  return <CartWithItemsScreen navigation={navigation} />;
}

