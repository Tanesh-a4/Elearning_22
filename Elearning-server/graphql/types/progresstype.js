import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLList,
  } from 'graphql';
  
  export const ProgressType = new GraphQLObjectType({
    name: 'Progress',
    fields: () => ({
      id: { type: GraphQLID },
      course: { type: GraphQLID },
      completedLectures: { type: new GraphQLList(GraphQLID) },
      user: { type: GraphQLID },
    }),
  });
  