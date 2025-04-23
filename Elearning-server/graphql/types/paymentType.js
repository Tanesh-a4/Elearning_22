import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
  } from 'graphql';
  
  export const PaymentType = new GraphQLObjectType({
    name: 'Payment',
    fields: () => ({
      id: { type: GraphQLID },
      razorpay_order_id: { type: GraphQLString },
      razorpay_payment_id: { type: GraphQLString },
      razorpay_signature: { type: GraphQLString },
      createdAt: { type: GraphQLString },
    }),
  });
  