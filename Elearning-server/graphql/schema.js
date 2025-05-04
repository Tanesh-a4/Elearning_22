import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLBoolean, GraphQLID } from 'graphql';
import { UserType } from './types/userType.js';
import { CourseType } from './types/courseType.js';
import { LectureType } from './types/lectureType.js';
import { PaymentType } from './types/paymentType.js';
import { PaymentHistoryType } from './types/paymentHistoryType.js';
import { ProgressType } from './types/progresstype.js';
import { adminResolvers } from './resolvers/adminResolver.js'; // Import admin resolvers

  import { User } from '../models/user.js';
import { Courses } from '../models/Courses.js';
import { Lecture } from '../models/Lecture.js';
import { Payment } from '../models/Payment.js';
import { PaymentHistory } from '../models/PaymentHistory.js';
import { Progress } from '../models/Progress.js';

// Define MessageResponse type only once to avoid conflicts
const MessageResponseType = new GraphQLObjectType({
  name: 'MessageResponse',
  fields: {
    message: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find();
      },
    },
    courses: {
      type: new GraphQLList(CourseType),
      resolve() {
        return Courses.find();
      },
    },
    lectures: {
      type: new GraphQLList(LectureType),
      resolve() {
        return Lecture.find();
      },
    },
    payments: {
      type: new GraphQLList(PaymentType),
      resolve() {
        return Payment.find();
      },
    },
    paymentHistories: {
      type: new GraphQLList(PaymentHistoryType),
      resolve() {
        return PaymentHistory.find();
      },
    },
    progress: {
      type: new GraphQLList(ProgressType),
      resolve() {
        return Progress.find();
      },
    },
  },
});

// Mutation Type
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createCourse: {
      type: MessageResponseType, // Use the MessageResponseType
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        category: { type: GraphQLString },
        createdBy: { type: GraphQLString },
        duration: { type: GraphQLString },
        price: { type: GraphQLString },
        image: { type: GraphQLString },
      },
      resolve: adminResolvers.Mutation.createCourse,
    },
    addLectures: {
      type: MessageResponseType, // Use the MessageResponseType
      args: {
        courseId: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        video: { type: GraphQLString },
      },
      resolve: adminResolvers.Mutation.addLectures,
    },
    deleteLecture: {
      type: MessageResponseType, // Use the MessageResponseType
      args: {
        lectureId: { type: GraphQLString },
      },
      resolve: adminResolvers.Mutation.deleteLecture,
    },
    deleteCourse: {
      type: MessageResponseType, // Use the MessageResponseType
      args: {
        courseId: { type: GraphQLString },
      },
      resolve: adminResolvers.Mutation.deleteCourse,
    },
    updateRole: {
      type: MessageResponseType, // Use the MessageResponseType
      args: {
        userId: { type: GraphQLString },
        role: { type: GraphQLString },
      },
      resolve: adminResolvers.Mutation.updateRole,
    },
    deleteUser: {
      type: MessageResponseType, // Use the MessageResponseType
      args: {
        userId: { type: GraphQLString },
      },
      resolve: adminResolvers.Mutation.deleteUser,
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
