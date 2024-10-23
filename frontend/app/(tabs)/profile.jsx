import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity } from "react-native";

import { icons } from "../../constants";
import useRefresh from "../../lib/useRefresh";
import { getUserPosts, signOut } from "../../lib/db";
import { useGlobalContext } from "../../context/GlobalProvider";
import InfoBox from "../../components/InfoBox";
// import EmptyState from "../../components/EmptyState";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  // const { data: posts } = useRefresh(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/login");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        // data={posts}
        // keyExtractor={(item) => item.$id}
        // renderItem={({ item }) => (
        //   <VideoCard
        //     video={item}
        //     // title={item.title}
        //     // thumbnail={item.thumbnail}
        //     // video={item.video}
        //     // creator={item.creator.username}
        //     // avatar={item.creator.avatar}
        //   />
        // )}
        // ListEmptyComponent={() => (
        //   <EmptyState
        //     title="No Videos Found"
        //     subtitle="No videos found for this profile"
        //   />
        // )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.firstName + " " + user?.lastName}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                // title={posts.length || 0}
                title="15"
                subtitle="Events"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox title="6" subtitle="Attended" titleStyles="text-xl" />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
