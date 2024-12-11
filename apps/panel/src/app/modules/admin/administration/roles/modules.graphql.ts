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
    rolesPegination(
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
        isActive
      }
    }
    rolesCount(
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
      newRoles {
        id
        isActive
      }
    }
  `,
  updateItem: gql`
    mutation($item: updateRoleInput!) {
      updateRole(updateRoleInput: $item) {
        id
        title
        permissions
        isActive
      }
    }
  `,
  updateItemMulti: gql`
    mutation($item: updateRoleInput!) {
      updateRoles(updateRoleInput: $item) {
        isOk
      }
    }
  `,
  getSubModules: gql`
  query($search:String!) {
    submodules(search:$search) {
      id
      title
      basemodule {
        id
        title
      }
      permissions {
        id
        title
        permId
      }
    }
  }
  `,

  getItem: gql`
  query($id:String!) {
    role(id:$id) {
      id
      title
      permissions
      isActive
    }
  }
  `,
};
