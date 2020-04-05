<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="24">
          <div>
            <span>
                <b>欢迎</b>
            </span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="12">
          <div style="text-align:center;">
            <el-calendar v-model="nowDate">
            </el-calendar>
          </div>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      nowDate: new Date()
    }
  }
}
</script>

<style lang="less" scoped>
 .el-card{
     margin-bottom: 20px;
 }
</style>
