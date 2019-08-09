<template>
  <v-container>
    <v-layout row wrap justify-space-between>
      <v-flex xs12 md5>
        <v-textarea
          v-model="proxylist"
          label="IPS PROXY"
          placeholder="Put proxy with line break format"
          @onpaste="countProxy()"
          @oncut="countProxy()"
          @keyup="countProxy()"
        ></v-textarea>
        <v-btn
          large
          :disabled="checkload"
          :loading="checkload"
          @click="Test()"
        >Test {{proxylistlength}}</v-btn>
        <v-btn large @click="formatear()">Formatear</v-btn>
      </v-flex>

      <v-flex xs12 md5>
        <v-card>
          <v-list id="limittext">
            <v-list-tile v-for="item in validos" :key="item">
              <span class="green--text" v-text="item"></span>
            </v-list-tile>
          </v-list>
        </v-card>
        <v-btn
          large
          v-if="validos.length > 0"
          @click="guardar()"
        >Guardar {{validos.length}}/{{proxylistlength}}</v-btn>
        <v-btn large v-else disabled>Guardar</v-btn>
      </v-flex>
      <v-flex xs12 md5></v-flex>
      <v-flex xs12 md5>
        <v-card>
          <v-list id="limittext2">
            <v-list-tile v-for="item in novalidos" :key="item">
              <span class="red--text" v-text="item"></span>
            </v-list-tile>
          </v-list>
        </v-card>
        <v-btn large @click="actualizar()">Test Again {{novalidos.length}}/{{proxylistlength}}</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
const httpaxi = axios.create({ timeout: 5000000 });
const wait = seconds =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000));
export default {
  data() {
    return {
      checkload: false,
      proxylist: "",
      validos: [],
      novalidos: [],
      checksave: true,
      proxylistlength: 0,
      packs: 0
    };
  },
  methods: {
    onCopy(e) {
      alert("You just copied: " + e.text);
    },
    onError(e) {
      alert("Failed to copy texts error:" + e);
    },
    formatear() {
      this.proxylist = "";
    },
    partition(array, n) {
      // PARA HACER LOTES DE 50. LUEGO LO HABLAMOS CON JORDI Y LE HACEMOS UN VISTAZO
      return array.length
        ? [array.splice(0, n)].concat(this.partition(array, n))
        : [];
    },
    /* eslint-disable no-console */
    async Test() {
      this.checkload = true;
      const proxylistCopia = this.proxylist
        .split("\n")
        .map(x => x.trim())
        .filter(x => x !== "");
      const arraypart = this.partition(proxylistCopia, 500);
      this.validos = [];
      this.novalidos = [];
      this.packs = arraypart.length;
      for (const proxies of arraypart) {
        if (this.packs !== arraypart.length) await wait(4);
        try {
          console.log(`PACK: ${this.packs} / ${arraypart.length}`);
          console.log(arraypart);
          this.packs = this.packs - 1;
          var response = await httpaxi.post(
            "http://localhost:3000/proxy/lista",
            {
              proxies
            }
          );
          this.validos = [...this.validos, ...response.data.ok];
          this.novalidos = [...this.novalidos, ...response.data.ko];
          console.log(this.packs + " Finished.");
        } catch (error) {
          console.log("There is something wrong here..");
          console.log(error);
        }
      }
      this.checkload = false;

      /*
      httpaxi
        .post("http://localhost:3000/proxy/lista", { proxies: proxylistCopia })
        */
      /*
        .then(response => {
          this.validos = response.data.ok;
          this.novalidos = response.data.ko;
          this.checkload = false;
        })
        .catch(() => {
          console.log("ha ido mal");
          this.btnvalue = false;
          this.checkload = false;
        });
        */
    },
    guardar() {
      console.log(this.validos);
      Promise.all([
        httpaxi.post("http://localhost:3000/proxy/actualizar", {
          info: this.validos,
          status: 1
        }),
        httpaxi.post("http://localhost:3000/proxy/actualizar", {
          info: this.novalidos,
          status: 0
        })
      ])
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    actualizar() {
      let a = "";
      for (let index = 0; index < this.novalidos.length; index++) {
        if (index == this.novalidos.length - 1) {
          a += this.novalidos[index];
        } else {
          a += this.novalidos[index] + "\n";
        }
      }
      console.log(a);
      this.proxylist = a;
      alert("PROXY IP UPDATED!!");
    },
    countProxy() {
      const cantidad = this.proxylist.split("\n").filter(x => x !== "").length;
      if (cantidad > 10000) {
        alert("MAX 10000, array sliced until 9999)");
        this.proxylist = this.proxylist.slice(0, 10000);
        this.proxylistlength = 10000;
      } else this.proxylistlength = cantidad;
    }
  }
};
</script>

<style>
#limittext,
#limittext2 {
  display: block;
  height: 300px;
  overflow: hidden;
  white-space: nowrap;
  overflow: scroll;
}
</style>
