import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLInt } from 'graphql';
import { UserType } from './types/userType.js';
import { CourseType } from './types/courseType.js';
import { LectureType } from './types/lectureType.js';
import { PaymentType } from './types/paymentType.js';
import { PaymentHistoryType } from './types/paymentHistoryType.js';
import { ProgressType } from './types/progresstype.js';
import { adminResolvers } from './resolvers/adminResolver.js'; // Import admin resolvers
import { courseResolvers } from './resolvers/courseResolvers.js'; // Import course resolvers

// Define MessageResponse type to handle mutation responses
const MessageResponseType = new GraphQLObjectType({
  name: 'MessageResponse',
  fields: {
    message: { type: GraphQLString },
  },
});

// RootQuery with queries from both resolvers
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Admin queries
    getAllStats: {
      type: new GraphQLObjectType({
        name: 'Stats',
        fields: {
          totalCourses: { type: GraphQLInt },
          totalLectures: { type: GraphQLInt },
          totalUsers: { type: GraphQLInt },
          userDistribution: { type: new GraphQLList(GraphQLString) },
          courseRegistrationStats: { type: new GraphQLList(CourseType) }, // Adapt according to actual response structure
        },
      }),
      resolve: adminResolvers.Query.getAllStats,
    },
    getAllUsers: {
      type: new GraphQLList(UserType),
      resolve: adminResolvers.Query.getAllUsers,
    },

    // Course queries
    getAllCourses: {
      type: new GraphQLList(CourseType),
      resolve: courseResolvers.Query.getAllCourses,
    },
    getSingleCourse: {
      type: CourseType,
      args: { id: { type: GraphQLID } },
      resolve: courseResolvers.Query.getSingleCourse,
    },
    fetchLectures: {
      type: new GraphQLList(LectureType),
      args: { courseId: { type: GraphQLID } },
      resolve: courseResolvers.Query.fetchLectures,
    },
  },
});

// RootMutation with mutations from both resolvers
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Admin mutations
    createCourse: {
      type: MessageResponseType,
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
      type: MessageResponseType,
      args: {
        courseId: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        video: { type: GraphQLString },
      },
      resolve: adminResolvers.Mutation.addLectures,
    },
    deleteLecture: {
      type: MessageResponseType,
      args: { lectureId: { type: GraphQLID } },
      resolve: adminResolvers.Mutation.deleteLecture,
    },
    deleteCourse: {
      type: MessageResponseType,
      args: { courseId: { type: GraphQLID } },
      resolve: adminResolvers.Mutation.deleteCourse,
    },
    updateRole: {
      type: MessageResponseType,
      args: {
        userId: { type: GraphQLID },
        role: { type: GraphQLString },
      },
      resolve: adminResolvers.Mutation.updateRole,
    },
    deleteUser: {
      type: MessageResponseType,
      args: { userId: { type: GraphQLID } },
      resolve: adminResolvers.Mutation.deleteUser,
    },

    // Course mutations
    checkout: {
      type: MessageResponseType,
      args: { courseId: { type: GraphQLID } },
      resolve: courseResolvers.Mutation.checkout,
    },
    paymentVerification: {
      type: MessageResponseType,
      args: {
        razorpay_order_id: { type: GraphQLString },
        razorpay_payment_id: { type: GraphQLString },
        razorpay_signature: { type: GraphQLString },
      },
      resolve: courseResolvers.Mutation.paymentVerification,
    },
    addProgress: {
      type: MessageResponseType,
      args: { courseId: { type: GraphQLID }, lectureId: { type: GraphQLID } },
      resolve: courseResolvers.Mutation.addProgress,
    },
    getMyCourses: {
      type: new GraphQLList(CourseType),
      resolve: courseResolvers.Mutation.getMyCourses,
    },
    generateCourseReport: {
      type: new GraphQLObjectType({
        name: 'CourseReport',
        fields: {
          courseId: { type: GraphQLID },
          totalSubscribers: { type: GraphQLInt },
          totalRevenue: { type: GraphQLInt },
          progress: { type: new GraphQLList(ProgressType) },
        },
      }),
      args: { courseId: { type: GraphQLID } },
      resolve: courseResolvers.Mutation.generateCourseReport,
    },
    getMonthlyStats: {
      type: new GraphQLList(GraphQLString),
      resolve: courseResolvers.Mutation.getMonthlyStats,
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
