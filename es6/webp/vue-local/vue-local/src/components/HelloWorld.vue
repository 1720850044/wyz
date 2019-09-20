<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
// import { test,test1 } from '../tools';
import * as tools from '../tools';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {

  },
  mounted () {
    // console.log(tools)
    // function taskA() {
    //     console.log("Task A");
    // }
    // function taskB() {
    //     console.log("Task B");
    // }
    // function onRejected(error) {
    //     console.log("Catch Error: A or B", error);
    // }

    // var promise = Promise.resolve();
    // promise
    //     .then(taskA)
    //     .then(taskB)
    //     .catch(onRejected)
    //     // console.log(test());
    //     // console.log(test1());
    //   }
    var obj = { 'name': '早上','age':18 };
    var loggedObj = new Proxy(obj, {
      get(target, name) {
        console.log('get', target, name);
        return Reflect.get(target, name);
      },
      deleteProperty(target, name) {
        console.log('delete' + name);
        return Reflect.deleteProperty(target, name);
      },
      has(target, name) {
        console.log('has' + name);
        return Reflect.has(target, name);
      }
    });
    console.log(Reflect.get(obj,'age'));
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
