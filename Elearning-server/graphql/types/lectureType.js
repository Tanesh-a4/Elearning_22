import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
  } from 'graphql';
  
  export const LectureType = new GraphQLObjectType({
    name: 'Lecture',
    fields: () => ({
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      video: { type: GraphQLString },
      course: { type: GraphQLID },
      createdAt: { type: GraphQLString },
    }),
  });
  