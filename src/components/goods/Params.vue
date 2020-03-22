<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-alert
        title="注意: 仅允许设置第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <el-row class="cat_opt">
        <el-col>
          <span>选择分类:</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectKeys"
            :options="catelist"
            :props="caseaderProps"
            @change="cateChanged"
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- card body -->

      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane name="many">
          <span slot="label"><i class="el-icon-document"></i>动态参数</span>
          <el-button
            type="primary"
            size="small"
            round
            icon="el-icon-document-add"
            :disabled="isBtnDisabled" @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格区域 -->
          <el-table
            :data="manyTabData"
            stripe
            border
          >
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleColse(index, scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的tag文本框 -->
                <el-input
                class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 输入tag的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type='index'>
              #
            </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="200px"
              width="250px"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id, scope.row.attr_name)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="only">
          <span slot="label"><i class="el-icon-document"></i>静态属性</span>
          <el-button
            type="primary"
            size="small"
            round
            icon="el-icon-document-add"
            :disabled="isBtnDisabled" @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态属性表格区域 -->
          <el-table
            :data="onlyTabData"
            stripe
            border
          >
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleColse(index, scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的tag文本框 -->
                <el-input
                class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 输入tag的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type='index'>
              #
            </el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="200px"
              width="250px"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id, scope.row.attr_name)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数Dialog -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogVisibleClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addParams"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数Dialog -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogVisibleClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      catelist: [],
      //   级联选择器选中的id
      selectKeys: [],
      //   级联选择器的配置项
      caseaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: false
      },
      activeName: 'many',
      manyTabData: [],
      onlyTabData: [],
      // 控制添加参数或属性
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          // eslint-disable-next-line no-undef
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      editFormRules: {
        attr_name: [
          // eslint-disable-next-line no-undef
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      // 控制tag按钮与文本框的显示
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: result } = await this.$http.get('categories')
      if (result.meta === 'error') {
        this.$message.error('oooops!服务器连接出现问题!')
        return
      }
      if (result.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      this.catelist = result.data
      this.total = result.data.total
    },
    async getParamsData() {
      const { data: result } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (result.meta === 'error') {
        this.$message.error('oooops!服务器连接出现问题!')
        return
      }
      if (result.meta.status !== 200) {
        return this.$message.error('获取参数列表失败,请检查是否选中分类!')
      }

      result.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(result.data)
      if (this.activeName == 'many') {
        this.manyTabData = result.data
      } else {
        this.onlyTabData = result.data
      }
    },
    async cateChanged() {
      this.getParamsData()
    },
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    addDialogVisibleClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogVisibleClosed() {
      this.$refs.editFormRef.resetFields()
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: result } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (result.meta === 'error') {
          this.$message.error('oooops!服务器连接出现问题!')
          return
        }
        if (result.meta.status !== 201) {
          return this.$message.error('添加' + this.titleText + '失败!')
        }
        this.$message.success('添加' + this.titleText + '成功!')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: result } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )

        if (result.meta === 'error') {
          this.$message.error('oooops!服务器连接出现问题!')
          return
        }
        if (result.meta.status !== 200) {
          return this.$message.error('编辑' + this.titleText + '失败!')
        }
        this.$message.success('编辑' + this.titleText + '成功!')
        this.editDialogVisible = false
        this.editDialogVisibleClosed()
        this.getParamsData()
      })
    },
    async showEditDialog(id) {
      const { data: result } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          attr_sel: this.activeName
        }
      )
      if (result.meta === 'error') {
        this.$message.error('oooops!服务器连接出现问题!')
        return
      }
      if (result.meta.status !== 200) {
        return this.$message.error('查询' + this.titleText + '失败!')
      }

      this.editForm = result.data
      this.editDialogVisible = true
    },
    async removeParams(id, attrName) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该 "' + attrName + '" 角色权限, 是否继续?',
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
        return this.$message.info('取消了删除权限!')
      }

      const { data: result } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (result.meta === 'error') {
        this.$message.error('oooops!服务器连接出现问题!')
        return
      }
      if (result.meta.status !== 200) {
        return this.$message.error('删除' + this.titleText + '失败!')
      }
      this.$message.success('删除' + this.titleText + '成功!')
      this.getParamsData()
    },
    async handleInputConfirm(row) {
      console.log(row)
      // 判断tag文本框内容是否合法
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.replace(/\s/g, ''))
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 保存服务器attr_vals
    async saveAttrVals(row) {
      const { data: result } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )

      if (result.meta === 'error') {
        this.$message.error('oooops!服务器连接出现问题!')
        return
      }
      if (result.meta.status !== 200) {
        return this.$message.error('编辑' + this.titleText + '失败!')
      }
      this.$message.success('编辑' + this.titleText + '成功!')
    },
    // 输入tag的点击事件
    showInput(row) {
      row.inputVisible = true
      // tag文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //  删除tag参数
    handleColse(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectKeys.length < 3) {
        return true
      }
      return false
    },
    cateId() {
      return this.selectKeys[this.selectKeys.length - 1]
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName == 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px auto;
  span {
    margin-right: 20px;
  }
}

.el-table {
  .el-tag {
    margin: 10px;
  }
  .input-new-tag {
    margin-left: 10px;
    width: 150px;
  }
}
</style>
