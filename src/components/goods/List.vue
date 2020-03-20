<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片结构  -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="7">
          <el-input
            v-model="queryInfo.query"
            @keyup.enter.native="getGoodsList"
            @clear="getGoodsList"
            placeholder="请输入内容"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary" @click='addGoods'
          >添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table
        :data="goodlist"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="100px"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="80px"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          width="140px"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150px"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-tooltip
              content="编辑商品"
              placement="top"
              :enterable="false"
            ></el-tooltip>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
              ></el-button>
              <el-tooltip
              content="删除商品"
              placement="top"
              :enterable="false"
            ></el-tooltip>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="removeGoodsById(scope.row.goods_id, scope.row.goods_name)"
              ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodlist: [],
      total: 0,
      addGoodsDialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //   根据分页获取所有商品数据
    async getGoodsList() {
      const { data: result } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (result.meta === 'error') {
        this.$message.error('oooops!服务器连接出现问题!')
        return
      }
      if (result.meta.status !== 200) {
        return this.$message.error('获取用户失败!')
      }
      // this.$message.success('获取商品数据成功!')
      console.log(result)
      this.goodlist = result.data.goods
      this.total = result.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 根据id删除商品
    async removeGoodsById(goodId, goodName) {
      const confirmResult = await this.$confirm(
        '将永久删除该 "' + goodName.substring(0, 8) + '..." 商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除商品!')
      }

      const { data: result } = await this.$http.delete(
        `goods/${goodId}`
      )
      if (result.meta === 'error') {
        this.$message.error('oooops!服务器连接出现问题!')
        return 
      }
      if (result.meta.status !== 200) {
        return this.$message.error('删除商品 "' + goodName.substring(0, 8) + '..." 失败!')
      }

      this.$message.success('删除商品 "' + goodName.substring(0, 8) + '..." 成功!')
      this.getGoodsList()
    },
    addGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
