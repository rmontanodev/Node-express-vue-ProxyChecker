<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Proxy Checker</span>
        <span class="font-weight-light">Proxy Tester</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <ProxyTest/>
    </v-content>
  </v-app>
</template>

<script>
import ProxyTest from "./components/proxytest.vue";

export default {
  name: "App",
  components: {
    ProxyTest
  },
  data() {
    return {
      //
    };
  }
};
</script>
