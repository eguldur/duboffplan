import { gql } from 'apollo-angular';
export const GRAPHQL = {
  subscribeToItem: gql`
    subscription ($type: String!) {
      itemSub: newProjectSub(type: $type) {
        id
        title
        description
        title_dld
        dldId
        units_dld
        bank_dld
        bankaccount_dld
        registedAt_dld
        startedAt_dld
        finishedAt_dld
        area_dld
        developer {
          id
          title
        }
        mcompany {
          id
          title
        }
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
        email
        address
        address_sale
        website
        type
        isActive
        location {
          type
          coordinates
        }
        location_sale {
          type
          coordinates
        }
        logo
        projectUnits_dld {
          usagetype {
            id
            title
          }
          propertytype {
            id
            title
          }
          units
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
      itemPegination: projectPegination(
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
          units_dld
          bank_dld
          bankaccount_dld
          registedAt_dld
          startedAt_dld
          finishedAt_dld
          area_dld
          developer {
            id
            title
          }
          mcompany {
            id
            title
          }
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
          email
          address
          address_sale
          website
          type
          isActive
          location {
            type
            coordinates
          }
          location_sale {
            type
            coordinates
          }
          logo
          projectUnits_dld {
            usagetype {
              id
              title
            }
            propertytype {
              id
              title
            }
            units
          }
        }
      }
      itemCount: projectCount(filter: $filter, status: $status, type: $type) {
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
      mcompanies: mCompanySelect(type: "mcompany") {
        id
        title
      }
      usagetypes: baseSettingsSelect(type: "usagetypes") {
        id
        title
      }
      propertytypes: baseSettingsSelect(type: "propertytypes") {
        id
        title
      }
    }
  `,

  getItemById: gql`
    query ($id: String!) {
      item: project(id: $id) {
        id
        title
        description
        title_dld
        dldId
        units_dld
        bank_dld
        bankaccount_dld
        registedAt_dld
        startedAt_dld
        finishedAt_dld
        area_dld
        developer {
          id
          title
        }
        mcompany {
          id
          title
        }
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
        email
        address
        address_sale
        website
        type
        isActive
        location {
          type
          coordinates
        }
        location_sale {
          type
          coordinates
        }
        logo
        projectUnits_dld {
          usagetype {
            id
            title
          }
          propertytype {
            id
            title
          }
          units
        }
      }
    }
  `,

  createItem: gql`
    mutation {
      newItem: newProject {
        id
        isActive
      }
    }
  `,
  updateItem: gql`
    mutation ($item: updateProjectInput!, $changeAvatar: Boolean!) {
      updateItem: updateProject(updateProjectInput: $item, changeAvatar: $changeAvatar) {
        id
      }
    }
  `,
  updateItemMulti: gql`
    mutation ($item: updateProjectInput!) {
      updateProject(updateProjectInput: $item) {
        isOk
      }
    }
  `,

  createItemsMulti: gql`
    mutation ($item: createMultiProjectInput!) {
      createProject(createMultiProjectInput: $item) {
        isOk
      }
    }
  `,
};
