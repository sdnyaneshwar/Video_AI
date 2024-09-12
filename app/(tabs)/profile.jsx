import { View, Text, FlatList, TouchableOpacity, Image} from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { getUserPost, searchPost, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'



const Profile = () => {
  const {user, setUser, setIsLogged} = useGlobalContext()
  // console.log('user',user);
  
  const { data: posts } = useAppwrite(()=>getUserPost(user?.$id))


  const logout=async()=>{

    await signOut()


    setUser(null)
    setIsLogged(false)
    router.replace('/sign-in')
    
  }


  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }


  return (
    <SafeAreaView className='bg-primary border-2 h-full ' >

      <FlatList
        data={posts}
        // data={[]}

        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() =>
        (
          <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity
            className='w-full items-end mb-10'

            onPress={logout}
            >
              <Image source={icons.logout} resizeMode='contain'
              className='w-6 h-6'
              />
            </TouchableOpacity>
            <View className='w-6 h-1/6 border border-secondary rounded-lg justify-center items-center'>
            <Image source={{uri:user?.avatar}} className='w-[90%] h-[90%] rounded-lg' resizeMode='cover'/>


            </View>
            <InfoBox
              title={user?.username}
              containerStyles='mt-5'
              titleStyle='text-lg'

            />
            <View className='mt-5 flex-row'>
            <InfoBox
              title={posts?.length || 0}
              containerStyles='mr-10'
              subtitle = 'Posts'
              titleStyle='text-xl'

            />
            <InfoBox
            title='1.2k'
            subtitle='Followers'
            titleStyle='text-xl'

          />
            </View>
          </View>
        )
        }

        ListEmptyComponent={() => (
          <EmptyState
            title="No Video Found"
            subtitle="No videos found for this search query"
          />
        )}

      />
    </SafeAreaView>
  )
}

export default Profile