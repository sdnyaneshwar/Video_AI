import { Account,Client, ID } from "react-native-appwrite";

export const config ={
    endpoint:'https://cloud.appwrite.io/v1',
    platform:'com.dnyaneshwar.react_native',
    projectId:'66ddf25d002cf7af5c42',
    databaseId:'66ddf54a002e7d397bed',
    userCollectionId:'66ddf5950022311717c1',
    videoCollectionId:'66ddf5f00035e3b8c75f',
    storageId:'66ddf981001df897838c'
}   

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);


const account = new Account(client);

// Register 
export const createUser =()=>{

    account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
    .then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
    });
}