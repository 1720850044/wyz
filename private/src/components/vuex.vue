<template>
  <div class="hello">
    <ul class="shop_container">
      <li v-for="item in $store.state.goods" :key="item.id" class="shop_container_li">
        <div class="shop_img">
          <img :src="item.img" alt="" width="100px" height="100px"/>
        </div>
        <div class="shop_detail">
          <p>{{item.name}}</p>
          <p>{{item.hint}}</p>
          <p>￥{{item.price}}</p>
          <p>
            <span class="shop_reduce" @click="reduce_num(item.id)">-</span>
            <span class="shop_num">{{item.num}}</span>
            <span class="shop_add" @click="add_num(item.id)">+</span>
          </p>
        </div>
      </li>
    </ul>
    <div class="foot">
      <div class="total_price">
        <span>合计：￥{{totalPrice}}</span>
      </div>
      <div class="total_num" :class="{payment: totalNum}">
        <span>去结账：{{totalNum}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapMutations, mapGetters} from 'vuex'
export default {
  name: 'vuex',
  data () {
    return {
    }
  },
  created () {
    // console.log(this.goods)
    // console.log(this.goods_obj)
    // console.log(this.goods_length)
    // console.log(this.$store.state.shop)  // 模块化 Vuex允许我们将 store 分割成模块（module）每个模块拥有自己的 state、mutation、action、getter、
  },
  computed: {
    ...mapState([
    // 获取state中的数据可以通过mapState辅助函数获取，也可以直接获取 例：this.$store.state.goods
      'goods', 'totalPrice', 'totalNum'
    ]),
    ...mapGetters([
      'goods_obj', 'goods_length'
    ])
  },
  methods: {
    ...mapMutations([
    // 获取mutation中的方法可以通过mapMutations 辅助函数获取，也可以直接获取。
      'ADD_CART'
      // 'REDUCE_CART'
    ]),
    reduce_num (id) {
      // this.REDUCE_CART(id)
      this.$store.commit('REDUCE_CART', id) //也可以直接获取
    },
    add_num (id) {
      this.ADD_CART(id) //通过mapMutations 辅助函数获取
    }
  }
}
</script>