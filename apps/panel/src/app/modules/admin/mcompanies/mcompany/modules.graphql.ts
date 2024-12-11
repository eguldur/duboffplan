import { gql } from 'apollo-angular';
export const GRAPHQL = {
  subscribeToItem: gql`
    subscription ($type: String!) {
      itemSub: newMCompanySub(type: $type) {
        id
        title
        dldId
        phone
        mobile
        email
        address
        type
        isActive
       
      }
    }
  `,

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
      $type: String!
    ) {
      itemPegination: mCompanyPegination(
        page: $page
        size: $size
        sort: $sort
        order: $order
        search: $search
        filter: $filter
        status: $status
        selectedIds: $selectedIds
        type: $type
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
          dldId
          phone
          mobile
          email
          address
          type
          isActive
        }
      }
      itemCount: mCompanyCount(filter: $filter, status: $status, type: $type) {
        count1
        count2
      }
    }
  `,
  getSelects: gql`
    query {
      cities: baseSettingsSelect(type: "city") {
        id
        title
      }
     
    }
  `,
  createItem: gql`
    mutation {
      newItem: newMCompany {
        id
        isActive
      }
    }
  `,
  updateItem: gql`
    mutation ($item: updateMCompanyInput!) {
      updateItem: updateMCompany(updateMCompanyInput: $item) {
        id
      }
    }
  `,
  updateItemMulti: gql`
    mutation ($item: updateMCompanyInput!) {
      updateMCompany(updateMCompanyInput: $item) {
        isOk
      }
    }
  `,

  createItemsMulti: gql`
    mutation ($item: createMultiMCompanyInput!) {
      createMCompany(createMultiMCompanyInput: $item) {
        isOk
      }
    }
  `,
};
