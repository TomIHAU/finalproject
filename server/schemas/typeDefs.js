const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Auth {
    user: User
    token: ID
  }

  type Meal {
    id: ID!
    mealName: String!
    mealDes: String
    protein: Int!
    fat: Int!
    carbs: Int!
    price: Float!
    img: String!
  }

  type PurchaseOrder {
    id: ID!
    user_id: User!
    buyDate: String!
  }

  type Purchase {
    id: ID!
    meal_id: Meal!
    qty: Int!
    purchaseOrder_id: PurchaseOrder!
  }

  input purchases {
    meal_id: ID!
    qty: Int!
  }

  type Query {
    meals: [Meal]!
    users: [User]!
    user(id: ID): User
    purchases: [Purchase]
    myPurchases(user_id: ID): [PurchaseOrder]!
    allPurchaseOrders: [PurchaseOrder]!
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addPurchase(user_id: ID!, purchases: [purchases]!): PurchaseOrder
  }
`;

module.exports = typeDefs;
