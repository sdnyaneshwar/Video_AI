import { ThemeProvider } from "@react-navigation/native";
import { Account,Avatars,Client, Databases, ID, Query, Storage } from "react-native-appwrite";

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
const avatars = new Avatars(client)
const databases = new Databases(client)

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config   
// Register 
export const createUser =async(email , password, username)=>{
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signin(email,password)

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId:newAccount.$id,
                email,
                username,
                avatar:avatarUrl
            }
        )
        return newUser;
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}


export const signin = async(email,password)=>{
    try {
        const session  = await account.createEmailPasswordSession(email,password);

        return session;
    } catch (error) {
        throw new Error(error);
        
    }
}

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }
export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      
      if (!currentAccount) throw Error;
      
    

      const currentUser = await databases.listDocuments(
        databaseId,
        userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
      console.log('currentUser ',currentUser)
      
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

export const getAllPosts=async()=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
        
    }
}

export const getLatestPosts=async()=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
        
    }
}

export const searchPost=async(query)=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title',query)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
        
    }
}

export const getUserPost=async(userId)=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator',userId)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
        
    }
}



export const signOut= async()=>{
    try {
        const session= await account.deleteSession(
            'current'
        );
        return session;

    } catch (error) {
        throw new Error(error)
    }
}

export async function uploadFile(file, type) {
    if (!file) return;
  
    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };
  
    try {
      const uploadedFile = await Storage.createFile(
        storageId,
        ID.unique(),
        asset
      );
  
      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getFilePreview(fileId, type) {
    let fileUrl;
  
    try {
      if (type === "video") {
        fileUrl = Storage.getFileView(storageId, fileId);
      } else if (type === "image") {
        fileUrl = Storage.getFilePreview(
          appwriteConfig.storageId,
          fileId,
          2000,
          2000,
          "top",
          100
        );
      } else {
        throw new Error("Invalid file type");
      }
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }


  export async function createVideoPost(form) {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
  
      const newPost = await databases.createDocument(
        databaseId,
        videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
        }
      );
  
      return newPost;
    } catch (error) {
      throw new Error(error);
    }
  }
  