<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片结构  -->
    <el-card>
      <div slot="header">
        <span>
          <el-alert
            title="添加商品信息"
            type="info"
            center
            show-icon
            :closable="false"
          >
          </el-alert>
        </span>
        <!-- 步骤条区域 -->
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
            <el-step title="基本信息" description="填写商品的基本信息"></el-step>
            <el-step title="商品参数" description="填写商品的详细参数"></el-step>
            <el-step title="商品属性" description="填写商品的详细属性"></el-step>
            <el-step title="商品图片" description="上传商品的描述图片"></el-step>
            <el-step title="商品内容" description="填写商品的详细内容"></el-step>
            <el-step title="完成" description="完成商品的添加"></el-step>
        </el-steps>
      </div>
      <!-- card body -->
      <!-- 左侧tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tableClicked">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" class="cat_opt" prop="goods_cat">
                        <span>选择分类:</span>
                        <!-- 级联选择框 -->
                        <el-cascader
                            v-model="addForm.goods_cat"
                            :options="catelist"
                            :props="caseaderProps"
                            @change="cateChanged"
                            clearable
                        >
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <!-- 渲染表单的item -->
                    <el-form-item :label="item.attr_name" v-for="(item) in manyTabData" :key="item.attr_id">
                        <!-- 复选框组 -->
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="subItem" v-for="(subItem, index) in item.attr_vals" :key="index" border></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="(item) in onlyTabData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals" placeholder=""></el-input>
                        </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload
                    :headers="headersObj"
                    :action="upLoadURL"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-tab-pane>
            
                <el-tab-pane label="商品内容" name="4">
                    <!-- 富文本编辑器 -->
                    <quill-editor
                        ref="myQuillEditorRef"
                        v-model="addForm.goods_introduce"
                    />
                    <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
                </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览Dialog -->
    <el-dialog
    title="图片预览"
    :visible.sync="imgDialogVisible"
    width="50%">
    <img :src="previewPath" alt="缩略图" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
// 引入深拷贝依赖
import _ from 'lodash'

export default {
  data() {
    return {
      upLoadURL: this.$http.defaults.baseURL + 'upload',
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      activeIndex: 0,
      catelist: [],
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      caseaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: false
      },
      manyTabData: [],
      onlyTabData: [],
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      previewPath: '',
      imgDialogVisible: false
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
    //   this.total = result.data.total
    },
    // 选择分类改变
    cateChanged() {
      console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName == '0' && this.addForm.goods_cat.length < 3) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    //   this.$nextTick(() => {
    //     this.$refs.addFormRef.validateField(['goods_name', 'goods_price', 'goods_number'], (err) => {
    //       console.log('6666 ' + err)
    //       if (err) {
    //         return false
    //       }
    //     })
    //   })
    },
    async getParamsData(sel) {
      const { data: result } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: sel }
        }
      )
      if (result.meta === 'error') {
        this.$message.error('oooops!服务器连接出现问题!')
        return
      }
      if (result.meta.status !== 200) {
        return this.$message.error('获取参数列表失败,请检查是否选中分类!')
      }      
      if (sel == 'many') {
        result.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTabData = result.data
      } else {
        this.onlyTabData = result.data
      }
      console.log(result.data)
    },
    async tableClicked() {
      if (this.activeIndex == '1') {
        //   填写到商品参数了
        await this.getParamsData('many')    
      } else if (this.activeIndex == '2') {
        await this.getParamsData('only')
      }
    },
    // 处理点击上传缩略图的事件
    handlePreview(file) {
      // 赋值下所点击的图片地址
      this.previewPath = file.response.data.url
      console.log(this.previewPath)
      this.imgDialogVisible = true
    },
    // 处理缩略图删除按钮的事件
    handleRemove(file) {

      // 获得所点击的文件临时路径
      const filePath = file.response.data.tmp_path
      // 从addForm.pics数组中 获取对应下标  
      const i = this.addForm.pics.findIndex((item) => {
        // eslint-disable-next-line no-unused-expressions
        return item.pic === filePath
      })
      // 根据下标i 从pics数组中移除相应元素
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    handleSuccess(response) {
      // 拼接下服务器返回临时图片地址
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加商品按钮事件
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写完整商品的必要的信息!')
        }

        // 执行添加商品
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        // 处理静态参数与属性
        this.manyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs

        // 发起添加商品请求
        const { data: result } = await this.$http.post(
          'goods',
          form
        )
        if (result.meta === 'error') {
          this.$message.error('oooops!服务器连接出现问题!')
          return
        }
        if (result.meta.status !== 201) {
          return this.$message.error('添加商品出现问题!')
        }
        this.$message.success('添加商品成功!')
        // 跳转回商品首页
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length < 3) {
        return null
      }
      return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px auto;
  span {
    margin-left: 10px;
    margin-right: 20px;
  }
}
.el-checkbox {
    margin-right: 10px;
}
.previewImg {
    width: 100%;
}

.addBtn {
    margin-top: 15px;
}
</style>
