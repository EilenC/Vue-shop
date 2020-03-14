<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片结构  -->
    <el-card>
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>

      <!-- 角色列表区 -->
      <el-table
        :data="rolelist"
        stripe
        border
      >
        <el-table-column
          type="expand"
          label="-"
        >
          <template slot-scope="scope">
            <el-row
              :class="['border-bottom' ,index1 === 0 ? 'border-top' : 'border-bottom', 'vcenter']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRoleRightById(scope.row, item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二与三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 !== 0 ? 'border-top' : '', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRoleRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      type="warning"
                      closable
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      @close="removeRoleRightById(scope.row, item3.id)"
                    >
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>

          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限Dialog -->
    <el-dialog
        ref="setRightRef"
      :title='"分配用户 \""+nowRoleObj.roleName + "\" 权限:"'
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightslist"
        :props="rightTreeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editRights"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      rightslist: [],
      rightTreeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      nowRoleObj: {},
      setRightDialogVisible: false
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.$message.success('获取角色列表成功!')
      this.rolelist = result.data
    },
    async removeRoleRightById(roles, rightId) {
      console.log(roles)
      console.log(rightId)
      const confirmResult = await this.$confirm(
        '此操作将永久删除该 "' + roles.roleName + '" 角色权限, 是否继续?',
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
        `roles/${roles.id}/rights/${rightId}`
      )
      if (result.meta.status !== 200) {
        return this.$message.error('删除角色 "' + roles.roleName + '" 权限失败')
      }

      roles.children = result.data
    },
    async showSetRightDialog(roles) {
      // 获取权限列表
      const { data: result } = await this.$http.get('rights/tree')

      if (result.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightslist = result.data
      this.getLeaKeys(roles, this.defKeys)
      this.nowRoleObj = roles
      this.setRightDialogVisible = true
    },

    setRightDialogClosed() {
      this.defKeys.length = 0
    },

    getLeaKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeaKeys(item, arr)
      })
    },

    async editRights() {
      console.log(this.nowRoleObj)
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idKeys = keys.join(',')
      const { data: result } = await this.$http.post(`roles/${this.nowRoleObj.id}/rights`, {
        rids: idKeys
      })

      if (result.meta.status !== 200) {
        return this.$message.error('分配 "' + this.nowRoleObj.roleName + '" 权限列表失败!')
      }
      this.$message.success('分配 "' + this.nowRoleObj.roleName + '" 权限列表成功!')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
  margin-right: 5px;
}

.border-top {
  border-top: 1px solid #eee;
}

.border-bottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
