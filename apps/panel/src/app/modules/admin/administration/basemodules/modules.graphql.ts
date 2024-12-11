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
    basemodulesPegination(
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
        title
        subtitle
        type
        icon
        siraNo
        isActive
      }
    }
    basemodulesCount(
      filter: $filter
      status: $status
    ) {
      count1
      count2
    }
  }
  `,
  
  createItem: gql`
    mutation {
      newBaseModules {
        id
      }
    }
  `,
  updateItem: gql`
    mutation($item: updateBasemoduleInput!) {
      updateBasemodule(updateBasemoduleInput: $item) {
        id
        title
        subtitle
        type
        icon
        siraNo
        isActive
      }
    }
  `,
  updateItemMulti: gql`
    mutation($item: updateBasemoduleInput!) {
      updateBasemodules(updateBasemoduleInput: $item) {
        isOk
      }
    }
  `,
};
