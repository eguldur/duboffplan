import { gql } from 'apollo-angular';
export const GRAPHQL = {
  getPagination: gql`
  query (
    $page: Int!
    $size: Int!
    $sort: String!
    $order: String!
    $search: String!
    $filter: String!
    $status: String!
    $selectedIds: [String!]
  ) {
    usersPegination(
      page: $page
      size: $size
      sort: $sort
      order: $order
      search: $search
      filter: $filter
      status: $status
      selectedIds: $selectedIds
    ) {
      pagination {
        length
        size
        page
        lastPage
        startIndex
        endIndex
      }
      items {
        id
        firstname
        lastname
        email
        isActive
        isEmailActive
        role {
          id
          title
        }
      }
    }
    usersCount(
      filter: $filter
      status: $status
    ) {
      count1
      count2
    }
  }
  `,

  getSelects: gql`
    query {
      rolesActive {
        id
        title
      }
    }
  `,
  
  createItem: gql`
    mutation {
      newUser {
        id
        isActive
        isEmailActive
      }
    }
  `,
  updateItem: gql`
    mutation($item: updateUserInput!) {
      updateUser(updateUserInput: $item) {
        id
        firstname
        lastname
        email
        isActive
        isEmailActive
        role {
          id
          title
        }
      }
    }
  `,
  updateItemMulti: gql`
    mutation($item: updateUserInput!) {
      updateUsers(updateUserInput: $item) {
        isOk
      }
    }
  `,
};
