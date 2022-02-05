import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import { QUERY_USER_PURCHASES } from "../utils/queries";

export default function Dash() {
  const me = Auth.getProfile();
  const [myPurchases, setMyPurchases] = useState([]);

  const { data, loading, error } = useQuery(QUERY_USER_PURCHASES, {
    variables: { user_id: me.data.id },
  });

  useEffect(() => {
    if (data) {
      setMyPurchases(data.myPurchases);
    }
  }, [data]);

  if (loading) {
    return <div>loading...</div>;
  }
  if (error) return `Error! ${error.message}`;

  return (
    <div className="About">
      <button
        className="mainBannerBtn logoutBtn"
        href="/"
        onClick={() => Auth.logout()}
      >
        logout
      </button>
      <div className="dashHeader">
        <h1>Welcome {me.data.username}</h1>
      </div>
      <div className="myPurchases">
        <h2>your orders placed:</h2>
        {myPurchases.map((purchase) => {
          return (
            <div>
              {purchase.meal_id.mealName}
              {purchase.qty}
              {purchase.buyDate}
            </div>
          );
        })}
      </div>
      <h2>your allergies / diet requirements</h2>
    </div>
  );
}
