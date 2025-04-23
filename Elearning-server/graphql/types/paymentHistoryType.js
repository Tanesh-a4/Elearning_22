import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLFloat,
  } from 'graphql';
  
  export const PaymentHistoryType = new GraphQLObjectType({
    name: 'PaymentHistory',
    fields: () => ({
      id: { type: GraphQLID },
      userId: { type: GraphQLID },
      courseId: { type: GraphQLID },
      paymentId: { type: GraphQLString },
      status: { type: GraphQLString },
      amount: { type: GraphQLFloat },
      createdAt: { type: GraphQLString },
    }),
  });
  