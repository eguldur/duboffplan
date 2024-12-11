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
    submodulesPegination(
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
        type
        link
        siraNo
        isActive
        basemodule {
          id
          title
        }
      }
    }
    submodulesCount(
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
      baseModulesActive {
        id
        title
      }
    }
  `,
  
  createItem: gql`
    mutation {
      newSubModules {
        id
      }
    }
  `,
  updateItem: gql`
    mutation($item: updateSubmoduleInput!) {
      updateSubmodule(updateSubmoduleInput: $item) {
        id
        title
        type
        link
        siraNo
        isActive
        basemodule {
          id
          title
        }
      }
    }
  `,
  updateItemMulti: gql`
    mutation($item: updateSubmoduleInput!) {
      updateSubmodules(updateSubmoduleInput: $item) {
        isOk
      }
    }
  `,
};
