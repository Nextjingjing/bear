import { Stack } from "expo-router";

const RootLayout = () => {
    return(
        <Stack>
            <Stack.Screen name="index"/>
            <Stack.Screen name="game"/>
        </Stack>
    )
}