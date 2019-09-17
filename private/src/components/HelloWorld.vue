<template>
  <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo"></div>
                    <div class="layout-nav" :class="{ 'active': isActive }">
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            Item 1
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-keypad"></Icon>
                            Item 2
                        </MenuItem>
                        <MenuItem name="3">
                            <Icon type="ios-analytics"></Icon>
                            Item 3
                        </MenuItem>
                        <MenuItem name="4">
                            <Icon type="ios-paper"></Icon>
                            Item 4
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                Item 1
                            </template>
                            <MenuItem name="1-1">Option 1</MenuItem>
                            <MenuItem name="1-2">Option 2</MenuItem>
                            <MenuItem name="1-3">Option 3</MenuItem>
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                Item 2
                            </template>
                            <MenuItem name="2-1">Option 1</MenuItem>
                            <MenuItem name="2-2">Option 2</MenuItem>
                        </Submenu>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="ios-analytics"></Icon>
                                Item 3
                            </template>
                            <MenuItem name="3-1">Option 1</MenuItem>
                            <MenuItem name="3-2">Option 2</MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <Breadcrumb :style="{margin: '24px 0'}">
                        <BreadcrumbItem>Home</BreadcrumbItem>
                        <BreadcrumbItem>Components</BreadcrumbItem>
                        <BreadcrumbItem>Layout</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        Content
                    </Content>
                </Layout>
            </Layout>
        </Layout>
        <div>
            <input type="text" v-model="firstname">+
            <input type="text" v-model="lastname">=
            <input type="text" v-model="fullname">
            <button @click="add">点击</button>
        </div>
        <div>
            <router-link 
                :to="'/home/'+item.id" 
                v-for="item of arr">
                Home
            </router-link>
            <router-link :to="{ path: 'home' }" replace>Home2</router-link>
            <router-link :to="{path:'/home1',query:{num:ids}}">Home3</router-link>
            <router-link :to="{name:'Home2',params:{id:777}}">home4</router-link>
        </div>
        <div id="status"></div>
        <div>
             <router-link to="/one">one</router-link>
             <router-link to="/two">two</router-link>
        </div>
        <div>
            <router-view></router-view>
        </div>
  </div>
</template>

<script>
import utli from './tools/utli';
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '',
      ids:'123',
      isActive: true,
      firstname: '',
      lastname: '',
      fullname: '',
      arr: [{id:'002'}]
    }
  },
  methods: {
    getHomeInfo: function(){
        sessionStorage.setItem("session", "这是session");
        // webSQL
        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS WIN (id unique, name)');
        tx.executeSql('INSERT INTO WIN (id, name) VALUES (1, "winty")');
        tx.executeSql('INSERT INTO WIN (id, name) VALUES (2, "LuckyWinty")');
        });
        db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM WIN', [], function (tx, results) {
            var len = results.rows.length, i,msg;
            msg = "<p>查询记录条数: " + len + "</p>";
            document.querySelector('#status').innerHTML +=  msg;
            
            for (i = 0; i < len; i++){
                console.log(results.rows.item(i).name );
            }
            
        }, null);
    });
        utli.test();
    },
    add:function(){
        this.firstname++;
    }
  },
  watch: {
        // 使用这个属性，可以监听 data 中指定数据的变化，
        // 然后触发 watch 中对应的 function 处理函数
        // 其中传参：第一个（newVal）是指改变后的值，第二个（oldVal）是原值
        firstname: function (newVal, oldVal) {
            // this.fullname = this.firstname + this.lastname;
            console.log(newVal, oldVal);
            this.fullname = newVal + '+' + this.lastname;
        },
        lastname: function (newVal, oldVal) {
            console.log(newVal, oldVal);
            // this.fullname = this.firstname + this.lastname;
            this.fullname = this.firstname + '+' + newVal;
        }
    },
  mounted: function(){
      this.getHomeInfo();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.active{
    color:red;
}
</style>
