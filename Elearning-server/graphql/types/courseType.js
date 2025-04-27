import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLFloat,
    GraphQLInt,
  } from 'graphql';
  
  export const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: () => ({
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      image: { type: GraphQLString },
      price: { type: GraphQLFloat },
      duration: { type: GraphQLInt },
      category: { type: GraphQLString },
      createdBy: { type: GraphQLString },
      createdAt: { type: GraphQLString },
      owner: { type: GraphQLID },
    }),
  });
  