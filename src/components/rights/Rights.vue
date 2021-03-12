<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="userContent">
            <!-- ============================================添加角色============================================ -->
            <!-- ============================================角色表格============================================ -->
            <el-row>
                <template>
                <el-table
                    :data="rightsList"
                    border
                    style="width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="authName" label="权限名称"></el-table-column>
                    <el-table-column prop="path" label="路径"></el-table-column>
                    <el-table-column label="权限等级" width="180">
                        <template v-slot:default="item">
                            <el-tag :type="rightsTags[item.row.level].type">{{ rightsTags[item.row.level].tagName }}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                </template>
            </el-row>
            <!-- ============================================角色表格============================================ -->
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取到的权限列表
      rightsList: [],
      // 权限标签
      rightsTags: {
        0: { type: '', tagName: '一级' },
        1: { type: 'success', tagName: '二级' },
        2: { type: 'warning', tagName: '三级' }
      }
    }
  },
  created() {
    this.getRights()
  },
  methods: {
    /**
     * 通过axios获取到的权限列表
     */
    getRights() {
      this.$axios.get('rights/list').then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.rightsList = res.data.data
        //   console.log(this.rightsList)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
