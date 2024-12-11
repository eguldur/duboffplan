import { gql } from 'apollo-angular';
export const GRAPHQL = {
  
  subscribeToUser: gql`
    subscription newUser{
        newUser{
            fullname
            email
        }
    }
    `,
  
};
