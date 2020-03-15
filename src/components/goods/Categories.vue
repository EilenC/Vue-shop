<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-button
          type="primary"
          @click="showAddCateDialog"
        >添加分类</el-button>
      </el-row>
      <el-row>
        <!-- 表格区域 -->
        <tree-table
          class="tree-table"
          index-text="#"
          border
          :data="catelist"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          :show-index="true"
          :show-row-hover="false"
        >
          <!-- 是否有效 -->
          <template
            slot="isok"
            slot-scope="scope"
          >
            <i
              class="el-icon-success"
              style="color: lightgreen; font-size:20px;"
              v-if="scope.row.cat_deleted === false"
            ></i>
            <i
              class="el-icon-error"
              v-else
            ></i>
          </template>

          <template
            slot="order"
            slot-scope="scope"
          >
            <el-tag
              size="mini"
              v-if="scope.row.cat_level === 0"
            >一级</el-tag>
            <el-tag
              type="danger"
              size="mini"
              v-else-if="scope.row.cat_level === 1"
            >二级</el-tag>
            <el-tag
              type="warning"
              size="mini"
              v-else
            >三级</el-tag>
          </template>

          <template
            slot="opt"
            slot-scope=""
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
            >删除</el-button>
          </template>
        </tree-table>
      </el-row>

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
    </el-card>

    <!-- 添加分类Dialog -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
    <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item
          label="分类名称"
          prop="cat_name"
        >
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item
          label="父级分类"
        >
        <el-cascader
          v-model="selectKeys"
          :options="parentCateList"
          :props="caseaderProps"
          @change="parentCateChanged"
          clearable
        >
        </el-cascader>
        </el-form-item>
      </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button
            type="primary" @click="addCate"
          >确 定</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data() {
    return {
      // 商品分类查询的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数组
      catelist: [],
      //   添加分类的表单对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      //   添加分类表单验证对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          headerAlign: 'center',
          align: 'center'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
          headerAlign: 'center',
          align: 'center'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
          headerAlign: 'center',
          align: 'center'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
          headerAlign: 'center',
          align: 'center'
        }
      ],
      addCateDialogVisible: false,
      selectKeys: [],
      caseaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获得商品分类的数据
    async getCateList() {
      const { data: result } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      this.catelist = result.data.result
      this.total = result.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList(2)
      this.addCateDialogVisible = true
    },
    /**
     * 获取父级分类
     * type:为需要获取的分类级数
     */
    async getParentCateList(type) {
      const { data: result } = await this.$http.get('categories', {
        params: {
          type: type
        }
      })
      if (result.meta.status !== 200) {
        return this.$message.error('获取父级分类失败!')
      }
      this.parentCateList = result.data
      
    },
    /**
     * 绑定需要添加分类的对象
     */
    parentCateChanged() { 
      if (this.selectKeys.length > 0) {
        // 所要添加分类的父id,就是当前所选项的最后一个成员
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 自身的分类等级就是当前所选项的长度
        this.addCateForm.cat_level = this.selectKeys.length
        return
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys.length = 0
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate() {
      console.log(this.addCateForm)
      console.log(this.selectKeys)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: result } = await this.$http.post('categories', this.addCateForm)
        if (result.meta.status !== 201) {
          return this.$message.error('添加分类 "' + this.addCateForm.cat_name + '" 失败!')
        }
        this.$message.success('添加分类 "' + this.addCateForm.cat_name + '" 成功!')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>
