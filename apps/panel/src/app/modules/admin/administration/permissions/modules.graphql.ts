import { gql } from 'apollo-angular'
export const GRAPHQL = {
  getPagination: gql`
    query ($page: Int!, $size: Int!, $sort: String!, $order: String!, $search: String!, $filter: String!, $status: String!, $selectedIds: [String!]) {
      permissionPegination(
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
          permId
          basemodule {
            id
            title
          }
          submodule {
            id
            title
          }
          isActive
        }
      }
      permissionCount(filter: $filter, status: $status) {
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
  getSubModulesByBaseId: gql`
    query ($id: String!) {
      subModulesByBaseId(id: $id) {
        id
        title
      }
    }
  `,
  createItem: gql`
    mutation {
      newPermissions {
        id
        isActive
      }
    }
  `,
  updateItem: gql`
    mutation ($item: updatePermissionInput!) {
      updatePermission(updatePermissionInput: $item) {
        id
        title
        permId
        basemodule {
          id
          title
        }
        submodule {
          id
          title
        }
        isActive
      }
    }
  `,
  updateItemMulti: gql`
    mutation ($item: updatePermissionInput!) {
      updatePermissions(updatePermissionInput: $item) {
        isOk
      }
    }
  `,
}
