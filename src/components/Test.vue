<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="活动名称" prop="userName">
                <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        userName: ''
      },
      rules: {
        userName: [
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
