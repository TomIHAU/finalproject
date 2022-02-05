const { AuthenticationError } = require("apollo-server-express");
const { Meal, User, Purchase } = require("../models");
const { signToken } = require("../utils/auth");
const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

const resolvers = {
  Query: {
    meals: async () => {
      const mealData = await Meal.findAll({});
      const meals = await mealData.map((Data) => Data.get({ plain: true }));
      return meals;
    },
    users: async () => {
      const userData = await User.findAll({});
      const users = await userData.map((Data) => Data.get({ plain: true }));
      return users;
    },
    user: async (root, args) => {
      const userData = await User.findByPk(args.id);
      const user = await userData.get({ plain: true });
      return user;
    },
    purchases: async () => {
      const purchaseData = await Purchase.findAll({});
      const purchases = await purchaseData.map((Data) =>
        Data.get({ plain: true })
      );
      return purchases;
    },
    myPurchases: async (root, { user_id }) => {
      const purchaseData = await Purchase.findAll({
        where: {
          user_id,
        },
      });
      const purchases = await purchaseData.map((Data) =>
        Data.get({ plain: true })
      );
      return purchases;
    },
  },

  Mutation: {
    addUser: async (root, args) => {
      const userData = await User.create(args);
      const user = await userData.get({ plain: true });
      const token = signToken(user);
      return { token, user };
    },

    login: async (root, { email, password }) => {
      const userData = await User.findOne({ where: { email } });
      const user = await userData.get({ plain: true });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await userData.checkPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    addPurchase: async (root, args) => {
      const purchaseData = await Purchase.create(args);
      const purchase = await purchaseData.get({ plain: true });
      return purchase;
    },
  },
  Purchase: {
    user_id(parent) {
      return User.findOne({
        where: {
          id: parent.user_id,
        },
      });
    },
    meal_id(parent) {
      return Meal.findOne({
        where: {
          id: parent.meal_id,
        },
      });
    },
  },
};

module.exports = resolvers;

// School: {
//   classes(parent) {
//     return Class.find({
//       _id: parent.classes,
//     });
//   },
// },
// Class: {
//   professor(parent) {
//     console.log(parent);
//     return Professor.findOne({
//       _id: parent.professor,
//     });
//   },
// },
