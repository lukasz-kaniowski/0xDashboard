import * as React from "react"
import {useEffect, useState} from "react"
import {Box, Button, ChakraProvider, Grid, List, ListItem, theme, VStack,} from "@chakra-ui/react"
import {ColorModeSwitcher} from "./ColorModeSwitcher"
import {useEthers} from "@usedapp/core"
import {BondResult, fetchBonds, redeemPendingPayout} from "./contracts/wonderland/wonderland";

const RedeemButton = ({name}: { name: string }) => (
    <Button onClick={() => redeemPendingPayout(name)}>Redeem {name}</Button>
)

const WonderlandDetails = () => {
    const [wonderland, setWonderland] = useState<BondResult[]>([]);

    useEffect(() => {
        fetchBonds().then(setWonderland).catch(console.error)
    }, [])

    return (
        <>
            {wonderland.length > 0 && <>
                <h2>Wonderland</h2>
                <List spacing={3}>
                    {wonderland.map((it) => (<ListItem key={it.name}>
                        {it.displayName}
                        {it.payout} TIME <RedeemButton
                        name={it.name}/>
                    </ListItem>))}
                </List>
            </>}
        </>
    )
}


export const App = () => {
    const {activateBrowserWallet} = useEthers()

    return (
        <ChakraProvider theme={theme}>
            <Box textAlign="center" fontSize="xl">
                <Grid minH="100vh" p={3}>
                    <ColorModeSwitcher justifySelf="flex-end"/>
                    <VStack spacing={8}>
                        <Button onClick={() => activateBrowserWallet()}>
                            Connect
                        </Button>
                        <WonderlandDetails/>

                    </VStack>
                </Grid>
            </Box>
        </ChakraProvider>
    )
}
