<template>
    <div>
        <ul class="menu-tree">
            <li>
                <p class="level-item" v-if="data.child && data.child.length > 0" @click.stop="isShowSubmenu(data)">
                    <span id="quanxuan" @click.stop='allCheckedChildData($event,data)'>
                      <Icon type="android-checkbox" v-if="data.selected"></Icon>
                      <Icon type="android-checkbox-outline-blank" v-else></Icon>
                      <!-- {{data.selected}}
                      {{data.expand}} -->
                    </span>
                    <span class="first-level-name">{{data.title}}</span>
                    <!-- <Icon :type="data.expand ? 'arrow-down-b' : 'arrow-right-b'"></Icon> -->
                    <Icon type="arrow-down-b" v-if="data.expand"></Icon>
                    <Icon type="arrow-right-b" v-else></Icon>
                </p>
                <div class="leaf-item" :class="{'item-selected': data.selected}" v-else @click.stop="selectChildItem(data)">
                  <Icon type="android-checkbox" v-if="data.selected"></Icon>
                  <Icon type="android-checkbox-outline-blank" v-else></Icon>
                  <span class="third-level-name">{{data.title}}</span>
                  <!-- {{data.selected}} -->
                </div>
                <tree-menu v-if="data.expand" v-for="(item, index) in data.child" :key="index" :data="item" :multiple="multiple" @selectChildItem='selectChildItem'></tree-menu>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: "treeMenu",
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    allData: {
      type: Array,
      default() {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    selectedItem: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      openChild: false,
      isTitleCheckedFlag: false,
      getChildData: []
    };
  },
  mounted() {},
  methods: {
    isShowSubmenu(item) {
      let expand = item.expand;
      this.$delete(item, "expand");
      this.$set(item, "expand", !expand);
    },
    selectChildItem(item) {
      this.$emit("selectChildItem", item);
    },
    // 全选
    allCheckedChildData(event, data) {
      let _this = this;
      let selected = data.selected;
      let expand = data.expand;
      this.$delete(data, "selected");
      this.$set(data, "selected", !selected);
      this.isShowSubmenu(data);
      if (data.selected) {
        if (data.child && data.child.length > 0) {
          data.child.forEach(item => {
            _this.$delete(item, "selected");
            _this.$set(item, "selected", true);
            _this.selectedItem.push(item);
          });
        }
      } else if (data.child && data.child.length > 0) {
        data.child.forEach(item => {
          _this.$delete(item, "selected");
          _this.$set(item, "selected", false);
        });
      }
      _this.$emit("checkAllChild", this.allData);
    }
  }
};
</script>

<style lang="less" scoped>
.menu-tree {
  width: 100%;
  margin-bottom: 5px;
  li {
    line-height: 30px;
    li {
      padding: 0 20px;
    }
    .leaf-item {
      position: relative;
      padding: 2px 5px;
      cursor: pointer;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      i {
        color: #3cd2b4;
        font-size: 18px;
      }
    }
  }
}
</style>
