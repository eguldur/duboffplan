import { gql } from 'apollo-angular';
export const AUTH = {
  singin: gql`
    mutation($email: String!, $password: String!) {
        login (loginInput: {email: $email, password: $password}) {
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
            accessToken
            tokenType
      }
    }
  `,
  signInUsingToken: gql`
    mutation($accessToken: String!) {
        signInUsingToken (accessToken: $accessToken) {
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
            accessToken
            tokenType
        }
    }
    `,
  singup: gql`
    mutation($email: String!, $password: String!, $firstname: String!, $lastname: String!) {
        signup (signupInput: {email: $email, password: $password, firstname: $firstname, lastname: $lastname}) {
            user {
                id
            }
      }
    }
  `, 
  cofirmEmailToken: gql`
    mutation($cofirmEmailToken: String!) {
        cofirmEmailToken (cofirmEmailToken: $cofirmEmailToken) {
            user {
                email
            }
           
      }
    }
  `,
  sendPasswordResetEmail: gql`
    mutation($email: String!) {
        sendPasswordResetEmail (email: $email) {
            user {
                email
            }
          }
    }
  `,
  resetPassword: gql`
    mutation($password: String!, $passwordResetToken: String!) {
        resetPassword (password: $password, passwordResetToken: $passwordResetToken) {
            user {
                email
            }
          }
    }
  `,
};
