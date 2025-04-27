import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
  } from 'graphql';
  
  export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      role: { type: GraphQLString },
      designation: { type: GraphQLString },
      mainrole: { type: GraphQLString },
    }),
  });
  