import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLID } from 'graphql';
import { UserType } from './types/userType.js';
import { CourseType } from './types/courseType.js';
import { LectureType } from './types/lectureType.js';
import { PaymentType } from './types/paymentType.js';
import { PaymentHistoryType } from './types/paymentHistoryType.js';
import { ProgressType } from './types/progresstype.js';
import { User } from '../models/user.js';
import { Courses } from '../models/Courses.js';
import { Lecture } from '../models/Lecture.js';
import { Payment } from '../models/Payment.js';
import { PaymentHistory } from '../models/PaymentHistory.js';
import { Progress } from '../models/Progress.js';

// RootQuery with only queries
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

export default new GraphQLSchema({
  query: RootQuery,
});
