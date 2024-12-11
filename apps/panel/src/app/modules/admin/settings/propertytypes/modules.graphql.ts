import { gql } from 'apollo-angular';
export const GRAPHQL = {
  subscribeToItem: gql`
    subscription ($type: String!) {
      itemSub:newSettingSub(type: $type) {
        id
        title
        type
        siraNo
        isActive
        basekat {
          id
          title
        }
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
      itemPegination: basesettingsPegination(
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
          type
          siraNo
          isActive
          basekat {
            id
            title
          }
        }
      }
      itemCount: basesettingsCount(filter: $filter, status: $status, type: $type) {
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
      newItem: newBaseSettings {
        id
        isActive
      }
    }
  `,
  updateItem: gql`
    mutation ($item: updateBasesettingInput!) {
      updateItem: updateBaseSetting(updateBasesettingInput: $item) {
        id
      }
    }
  `,
  updateItemMulti: gql`
    mutation ($item: updateBasesettingInput!) {
      updateBaseSettings(updateBasesettingInput: $item) {
        isOk
      }
    }
  `,

  createItemsMulti: gql`
    mutation ($item: createMultiBaseSettingsInput!) {
      createBaseSettings(createMultiBaseSettingsInput: $item) {
        isOk
      }
    }
  `,
};
