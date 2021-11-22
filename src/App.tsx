import * as React from "react"
import {Box, Button, ChakraProvider, Code, Grid, Link, Text, theme, VStack,} from "@chakra-ui/react"
import {ColorModeSwitcher} from "./ColorModeSwitcher"
import {Logo} from "./Logo"
import {useEtherBalance, useEthers} from "@usedapp/core"
import {formatEther} from '@ethersproject/units'

export const App = () => {
    const {activateBrowserWallet, account} = useEthers()
    const etherBalance = useEtherBalance(account)

    return (
        <ChakraProvider theme={theme}>
            <Box textAlign="center" fontSize="xl">
                <Grid minH="100vh" p={3}>
                    <ColorModeSwitcher justifySelf="flex-end"/>
                    <VStack spacing={8}>
                        <Logo h="40vmin" pointerEvents="none"/>
                        <Text>
                            Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
                        </Text>
                        <Link
                            color="teal.500"
                            href="https://chakra-ui.com"
                            fontSize="2xl"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Learn Chakra
                        </Link>

                        <Button onClick={() => activateBrowserWallet()}>
                            Connect
                        </Button>
                        {account && <p>Account: {account}</p>}
                        {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
                    </VStack>
                </Grid>
            </Box>
        </ChakraProvider>
    )
}
