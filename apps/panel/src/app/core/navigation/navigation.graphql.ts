import { gql } from 'apollo-angular';
export const GRAPHQL = {
  getNavigation: gql`
  query {
    navigation
      {
        id
        title
        type
        icon
        link
        children {
          id
          title
          type
          link
        }
    }
  }
  `,
};
