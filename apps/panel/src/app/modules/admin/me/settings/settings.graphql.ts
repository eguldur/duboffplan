import { gql } from 'apollo-angular';
export const PROFILE = {
  updateProfile: gql`
    mutation($user: updateProfileDto!, $changeAvatar: Boolean!, $changeHeaderPic: Boolean!) {
        updateProfile (updateProfileInput: $user, changeAvatar: $changeAvatar, changeHeaderPic: $changeHeaderPic) {
          user {
            id
            firstname
            lastname
            email
            avatar
            isEmailActive
            title
            about
            phone
            address
            name
            headerPic
          }
        }
    }
  `,
  updatePassword: gql`
    mutation($password: String!, $newPassword: String!) {
        updatePassword (password: $password, newPassword: $newPassword) {
          user {
            id
            firstname
            lastname
            email
            avatar
            isEmailActive
            title
            about
            phone
            address
            name
            headerPic
          }
        }
    }
  `,
 
};
