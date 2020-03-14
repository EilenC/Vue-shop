<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片结构  -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getUserList"
            v-model="queryInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary" @click='addUserDialogVisible = true'
          >添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 用户列表 -->
    <el-table
      :data="userlist"
      stripe
      border
    >
      <el-table-column
        type="index"
        label="#"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
      >
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
      >
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态"
        width="80px"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <!-- 编辑角色按钮 -->
          <el-tooltip
            content="编辑角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id, scope.row.username)"
            ></el-button>
          </el-tooltip>
          <!-- 删除角色按钮 -->
          <el-tooltip
            content="删除角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id, scope.row.username)"
            ></el-button>
          </el-tooltip>

          <!-- 分配角色按钮 -->
          <el-tooltip
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRole(scope.row)"
            ></el-button>
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

    <!-- 添加用户dialog区域 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close='addDialogClosed'
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户dialog区域 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="editForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUser"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色dialog -->
    <el-dialog
      :title='"正在分配\" " + nowUserObj.username + "\" 的角色:"'
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <h4>当前用户:<span style="color:red; font-size:20px;">{{nowUserObj.username}}</span></h4>
      <h4>当前角色:<span style="color:red; font-size:20px;">{{nowUserObj.role_name}}</span></h4>
      <h4>分配新角色:
        <el-select
          v-model="selectRoleId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in roleslist"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </h4>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary" @click="saveRoleInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { async } from 'q'
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱!'))
    }
    var checkMobile = (rule, value, callback) => {
      const regEmail = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号码!'))
    }
    return {
      // 获取用户列表参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      userlist: [],
      total: 0,
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      setRoleDialogVisible: false,
      nowUserObj: {},
      roleslist: {},
      selectRoleId: '',
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      // 添加用户的规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户的规则
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: result } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) {
        return this.$message.error('获取用户失败!')
      }
      this.userlist = result.data.users
      this.total = result.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange(userInfo) {
      const { data: result } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (result.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: result } = await this.$http.post('users', this.addForm)
        if (result.meta.status !== 201) {
          this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功!')
        this.addUserDialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog(id, username) {
      const { data: result } = await this.$http.get('users/' + id)
      if (result.meta.status !== 200) {
        return this.$message.error('查询用户 "' + username + '" 失败!')
      }
      this.$message.success('查询用户 "' + username + '" 成功!')

      this.editForm = result.data
      this.editUserDialogVisible = true
    },
    // 提交编辑用户信息
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: result } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (result.meta.status !== 200) {
          this.$message.error('更新用户"' + this.editForm.username + '" 失败!')
        }
        this.$message.success('更新用户 "' + this.editForm.username + '" 成功!')
        this.editUserDialogVisible = false
        this.getUserList()
      })
    },
    removeUserById(id, username) {
      this.$confirm(
        '此操作将永久删除该 "' + username + '" 用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const { data: result } = await this.$http.delete('users/' + id)
          if (result.meta.status !== 200) {
            return this.$message.error('删除用户 "' + username + '" 失败!')
          }
          this.$message.success('删除用户 "' + username + '" 成功!')
          this.getUserList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async setRole(userInfo) {
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.roleslist = result.data
      this.nowUserObj = userInfo
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的新角色!')
      }

      const { data: result } = await this.$http.put(`users/${this.nowUserObj.id}/role`, {
        rid: this.selectRoleId
      })
      if (result.meta.status !== 200) {
        return this.$message.error('分配用户 "' + this.nowUserObj.username + '" 新角色失败!')
      }
      this.$message.success('分配用户 "' + this.nowUserObj.username + '" 新角色成功!')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed() {
      this.nowUserObj = {}
      this.selectRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
