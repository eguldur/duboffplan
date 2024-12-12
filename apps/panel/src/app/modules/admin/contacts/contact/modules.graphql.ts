import { gql } from 'apollo-angular';
export const GRAPHQL = {
  subscribeToItem: gql`
    subscription ($type: String!) {
      itemSub: citizenSub(type: $type) {
        id
        fullName
        email
        phone {
          phoneType {
            id
            title
          }
          phone
        }
        socialMediaAccounts {
          platform {
            id
            title
          }
          username
        }
        developer {
          id
          title
        }
        unvan {
          id
          title
        }
        type
        isActive
        avatar
      }
    }
  `,

  getPagination: gql`
    query ($page: Int!, $size: Int!, $sort: String!, $order: String!, $search: String!, $filter: String!, $status: String!, $selectedIds: [String!], $type: String!) {
      itemsPegination: citizensPegination(page: $page, size: $size, sort: $sort, order: $order, search: $search, filter: $filter, status: $status, selectedIds: $selectedIds, type: $type) {
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
          fullName
          email
          phone {
            phoneType {
              id
              title
            }
            phone
          }
          socialMediaAccounts {
            platform {
              id
              title
            }
            username
          }
          developer {
            id
            title
          }
          unvan {
            id
            title
          }
          type
          isActive
          avatar
        }
      }
      itemsCount: citizensCount(filter: $filter, status: $status, type: $type) {
        count1
        count2
      }
    }
  `,
  getSelects: gql`
    query {
      phonetypes: baseSettingsSelect(type: "phonetypes") {
        id
        title
      }
      socialmediaplatforms: baseSettingsSelect(type: "socialmediaplatforms") {
        id
        title
      }
      developers: developerSelect(type: "developer") {
        id
        title
      }
      unvans: baseSettingsSelect(type: "unvans") {
        id
        title
      }
    }
  `,
  getSubByBaseAdres: gql`
  query ($id: String!) {
    subkatsbyAddressUnit(id: $id) {
      id
      title
      location
        {
        coordinates  
        }
    }
  }
`,
  createItem: gql`
    mutation {
      createNew: newCitizen {
        id
        isActive
      }
    }
  `,
  updateItem: gql`
    mutation ($item: updateCitizenInput!, $changeAvatar: Boolean!) {
      updateItem: updateCitizen(updateCitizenInput: $item, changeAvatar: $changeAvatar) {
        id
      }
    }
  `,
  updateItemMulti: gql`
    mutation ($item: updateCitizenInput!) {
      updateCitizen(updateCitizenInput: $item) {
        isOk
      }
    }
  `,

  createItemsMulti: gql`
    mutation ($item: createMultiCitizenInput!) {
      createCitizen(createMultiCitizenInput: $item) {
        isOk
      }
    }
  `,
};
