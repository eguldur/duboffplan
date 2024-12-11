import { gql } from 'apollo-angular';
export const GRAPHQL = {
  subscription: gql`
    subscription {
       newInAppNotificationSub(type: "inApp") {
         id
         icon
         title
         description
         time
         read
         link
         useRouter
      }
    }
  `,

  findAll: gql`
    query InAppNotifications {
      InAppNotifications {
        id
         icon
         title
         description
         time
         read
         link
         useRouter
      }
    }
  `,
};
