import "../styles/globals.css";
import '../styles/react-paginate.css';

import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FlagsmithProvider } from "flagsmith/react";
import flagsmith, { createFlagsmithInstance } from "flagsmith/isomorphic";
import store from "../store/store";

// @ts-ignore
function MyApp({ Component, pageProps, flagsmithState }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <FlagsmithProvider flagsmith={flagsmith} serverState={flagsmithState}>
          <Component {...pageProps} />
        </FlagsmithProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async () => {
  // This could be getStaticProps too depending on your build flow.
  // Using createFlagsmithInstance rather than flagsmith here is only necessary if your servers allow for concurrent requests to getInitialProps.
  const flagsmithSSR = createFlagsmithInstance();
  await flagsmithSSR.init({
    // fetches flags on the server
    environmentID: "gdUifKusXBWwb92WjMD2Un",
  });
  return { flagsmithState: flagsmithSSR.getState() };
};

export default store.withRedux(MyApp);
