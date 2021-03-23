<template>
  <div class="content">
     <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="attr_name"
        label="属性名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="attr_vals"
        label="属性内容"
        width="180">
      </el-table-column>
      <el-table-column label="tag" v-slot="props">
        <div>{{ props.row.attr_vals }}</div>
        <div>
          <el-tag
            :key="i"
            v-for="(tag,i) in props.row.attr_vals"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="props.row.inputVisible"
            v-model="props.row.inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoriesConfig: {
      },
      tableData: []
    }
  },
  created() {
    // this.getCatInfo()
    this.getAttrInfo()
  },
  methods: {
    // 获取每个分类的数据
    getCatInfo() {
      this.$axios.get('categories').then(res => {
        // console.log(res)
      })
    },
    getAttrInfo() {
      this.$axios.get('categories/10997/attributes', { params: { sel: 'many' } }).then(res => {
        // this.tableData = res.data.data
        // console.log(this.tableData)
        // console.log(this.tableData)
        res.data.data.forEach(element => {
          element.attr_vals = element.attr_vals.split(',')
          // console.log(element)
          element.inputValue = ''
          element.inputVisible = false
        })
        this.tableData = res.data.data
        console.log(this.tableData)
      })
    },
    handleClose(tag) {
      console.log(tag)
    },
    handleInputConfirm() {},
    showInput() {}
  }
}
</script>

<style scoped>
.content{
  width: 100%;
  height: 400px;
  background-color: #fff;
}
</style>
