import { gql } from 'apollo-angular';
export const GRAPHQL = {
  subscribeToItem: gql`
    subscription ($type: String!) {
      itemSub: newDeveloperSub(type: $type) {
        id
        title
        description
        title_dld
        dldId
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
        phone_dld
        email
        website
        email_dld
        address
        address_dld
        location {
          coordinates
        }
        type
        isActive
        logo
      }
    }
  `,
  getItemDetailsById: gql`
    query ($id: String!) {
      item: developer(id: $id) {
        id
        title
        description
        title_dld
        dldId
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
        phone_dld
        email
        website
        email_dld
        address
        address_dld
        location {
          coordinates
        }
        type
        isActive
        logo
        files {
          name
          fileLink
          type
          size
          mimefirst
          uploadDate
        }
      }
      contacts: developerContacts(developerId: $id) {
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
        unvan {
          id
          title
        }
        avatar
      }
      notes: developerNotes(developerId: $id) {
        id
        content
        createdAt
        user {
          id
          firstname
          lastname
        }
        files {
          name
          fileLink
          type
          size
          mimefirst
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
      itemPegination: developerPegination(
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
          description
          title_dld
          dldId
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
          website
          phone_dld
          email
          email_dld
          address
          address_dld
          location {
            coordinates
          }
          logo
          type
          isActive
        }
      }
      itemCount: developerCount(filter: $filter, status: $status, type: $type) {
        count1
        count2
      }
    }
  `,

  createNote: gql`
    mutation ($item: createNoteInput!) {
      createNote(createNoteInput: $item) {
        id
        content
        createdAt
        user {
          id
          firstname
          lastname
        }
        files {
          name
          fileLink
          type
          size
          mimefirst
        }
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
    }
  `,
  uploadFile: gql`
    mutation ($developerId: String!, $fileInput: FileInput!) {
      addFileToDeveloper(developerId: $developerId, fileInput: $fileInput) {
        isOk
      }
    }
  `,
  deleteFile: gql`
    mutation ($developerId: String!, $fileLink: String!) {
      deleteFileFromDeveloper(developerId: $developerId, fileLink: $fileLink) {
        isOk
      }
    }
  `,

  deleteNote: gql`
    mutation ($id: String!) {
      deleteNote(id: $id) {
        isOk
      }
    }
  `,
  createItem: gql`
    mutation {
      newItem: newDeveloper {
        id
        isActive
      }
    }
  `,
  updateItem: gql`
    mutation ($item: updateDeveloperInput!, $changeAvatar: Boolean!) {
      updateItem: updateDeveloper(updateDeveloperInput: $item, changeAvatar: $changeAvatar) {
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
