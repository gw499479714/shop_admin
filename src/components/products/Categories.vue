<template>
    <div>
        <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
        <el-table :data="categoryList" style="width:100%;" v-loading="loading"
        element-loading-text="亲，等会玩命加载中"
        element-loading-spinner="el-icon-loading"
        >
            <el-table-tree-column label="分类名称"
              prop="cat_name"
              tree-key="cat_id"
              level-key="cat_level"
              :indent-size="20"
              parent-key="cat_pid"
              child-key="children"></el-table-tree-column>
            <el-table-column label="是否删除" prop="cate_deleted">
                <template slot-scope="scope">
                    {{scope.row.cate_deleted?'是':'否'}}
                </template>
            </el-table-column>
            <el-table-column label="排序" prop="cat_level"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delCategory(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
         <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size=pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-dialog
          title="添加商品分类"
          :visible.sync="addtDialogVisible"
          width="40%">
          <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules" status-icon>
               <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addForm.cat_name"></el-input>
               </el-form-item>
               <el-form-item label="父级名称" prop="cat_pid">
                 <el-cascader
                 clearable
                :options="options"
                change-on-select
                :props="props"
                v-model="addForm.cat_pid">
                </el-cascader>
               </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addtDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCategory">确 定</el-button>
          </span>
      </el-dialog>
    </div>
</template>

<script>
// common
var ElTreeGrid = require('element-tree-grid')
// Vue.component('el-table-tree-column', ElTreeGrid)
export default {
  data() {
    return {
      categoryList: [],
      current: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      addtDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          {required: true, message: '请输入分类的名称', trigger: 'change'}
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    async getCategoryList() {
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      let {meta: {status}, data: {result, total}} = res.data
      if (status === 200) {
        this.categoryList = result
        this.total = total
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    handleSizeChange (val) {
      this.loading = true
      this.pageSize = val
      this.current = 1
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.loading = true
      this.current = val
      this.getCategoryList()
    },
    async showAddDialog () {
      this.addtDialogVisible = true
      let res = await this.axios.get('categories?type=2')
      let {meta: {status}, data} = res.data
      if (status === 200) {
        this.options = data
      }
    },
    addCategory () {
      this.$refs.addForm.validate(async valid => {
        // if (valid) {

        // } else {
        //   return false
        // }
        if (!valid) {
          return false
        }
        let {cat_name: catName, cat_pid: catPid} = this.addForm
        let res = await this.axios.post('categories', {
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        let {meta: {status}} = res.data
        if (status === 201) {
          this.addtDialogVisible = false
          this.$refs.addForm.resetFields()
          this.getCategoryList()
          this.$message.success('添加商品成功了')
        } else {
          this.$message.error(msg)
        }
      })
    },
    async delCategory (row) {
      await this.$confirm('你确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      let res = await this.axios.delete(`categories/${row.cat_id}`)
      let {meta: {status}} = res.data
      if (status === 200) {
        this.getCategoryList()
        this.$message.success('删除分类成功了')
      } else {
        this.$message.error(msg)
      }
    }
  },
  created() {
    this.getCategoryList()
  },
  components: {
    'el-table-tree-column': ElTreeGrid
  }
}
</script>

<style lang=""></style>
