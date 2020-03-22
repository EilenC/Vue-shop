<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片结构  -->
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>  

    <!-- 订单列表 表格区域       -->
    <el-table :data="orderlist" border  stripe >
        <el-table-column label="#" type="index" header-align="center" align="center"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格(RMB)" prop="order_price" width="110px" header-align="center" align="center"></el-table-column>
        <el-table-column label="付款状态" prop="pay_status" width="90px" header-align="center" align="center">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.pay_status == '1'">已付款</el-tag>
                <el-tag type="danger" v-else>未付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="发货状态" prop="is_send" width="80px" header-align="center" align="center"></el-table-column>
        <el-table-column label="下单时间" width="150px" header-align="center" align="center">
            <template slot-scope="scope">
                {{scope.row.create_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" header-align="center" align="center">
            <template slot-scope="scope">
                <el-tooltip
                    content="编辑订单"
                    placement="top"
                    :enterable="false"
                >
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="editOrder"></el-button>
                </el-tooltip>
                <el-tooltip
                    content="查看物流"
                    placement="top"
                    :enterable="false"
                >
                    <el-button type="success" icon="el-icon-location" size="small" @click="showProgress"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 编辑订单地址Dialog -->
    <el-dialog
    title="编辑订单地址"
    :visible.sync="editOrderDialogVisible"
    width="50%"
    @close="editOrderDialogVisibleClosed"
    >
    <!-- 编辑订单地址Dialog表单 -->
    <el-form :model="addRessForm" :rules="addRessFormRules" ref="addRessFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityData" clearable
            v-model="addRessForm.address1"
            :props="caseaderProps"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addRessForm.address2"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderDialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>

    <!-- 查看物流地址Dialog -->
    <el-dialog
    title="查看物流地址"
    :visible.sync="progressDialogVisible"
    width="50%"
    >
    <el-timeline :reverse="false">
        <el-timeline-item
        v-for="(activity, index) in progressInfo"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
        </el-timeline-item>
    </el-timeline>
    </el-dialog>
    </div>
</template>

<script>

import cityData from './citydata'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderlist: [],
      total: 0,
      editOrderDialogVisible: false,
      progressDialogVisible: false,
      addRessForm: {
        address1: [],
        address2: ''
      },
      addRessFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      caseaderProps: {
        expandTrigger: 'hover',
        children: 'children',
        checkStrictly: false
      },
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: result } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (result.meta === 'error') {
        this.$message.error('oooops!服务器连接出现问题!')
        return 
      }
      if (result.meta.status !== 200) {
        return this.$message.error('获取订单列表失败!')
      }
      this.orderlist = result.data.goods
      this.total = result.data.total
    //   console.log(this.orderlist)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    editOrder() {
      this.editOrderDialogVisible = true
    },
    editOrderDialogVisibleClosed() {
      this.$refs.addRessFormRef.resetFields()
    },
    async showProgress() {
      const { data: result } = await this.$http.get(
        '/kuaidi/1106975712662'
      )
      if (result.meta === 'error') {
        this.$message.error('oooops!服务器连接出现问题!')
        return
      }
      if (result.meta.status !== 200) {
        return this.$message.error('添加' + this.titleText + '失败!')
      }
      this.$message.success('查询物流信息成功!')
      this.progressInfo = result.data
      this.progressDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
