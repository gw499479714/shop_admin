<template>
    <div class="roles">
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
        <el-table :data="roleList" style="width:100%">
            <el-table-column type="expand">
                  <template slot-scope="scope">
                      <el-row v-if="scope.row.children.length === 0">
                          <span>暂无权限</span>
                      </el-row>
                     <el-row  class="level1" v-for="level1 in scope.row.children" :key="level1.id">
                         <el-col :span="4">
                             <el-tag closable @close="delRight(scope.row,level1.id)">{{level1.authName}}</el-tag><i class="el-icon-arrow-right"></i>
                         </el-col>
                         <el-col :span="20">
                             <el-row class="level2" v-for="level2 in level1.children" :key="level2.id">
                                 <el-col :span="4">
                                     <el-tag closable type="success" @close="delRight(scope.row,level2.id)">{{level2.authName}}</el-tag><i class="el-icon-arrow-right"></i>
                                 </el-col>
                                 <el-col :span="20">
                                      <el-tag @close="delRight(scope.row,level3.id)" class="level3" closable type="danger" v-for="level3 in level2.children" :key="level3.id">{{level3.authName}}</el-tag>
                                 </el-col>
                             </el-row>
                         </el-col>
                     </el-row>
                  </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="描述"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                     <el-button type="primary" icon="el-icon-edit" plain size="mini"  @click="showEditDialog(scope.row)"></el-button>
                     <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delRole(scope.row)"></el-button>
                     <el-button type="success" icon="el-icon-check" plain size="mini" @click="showAssignDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
         <el-dialog
          title="添加角色"
          :visible.sync="addDialogVisible"
          width="40%">
          <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules" status-icon>
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addForm.roleDesc"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
          </span>
      </el-dialog>

      <el-dialog
          title="修改角色"
          :visible.sync="editDialogVisible"
          width="40%">
          <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules" status-icon>
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editForm.roleDesc"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRole">确 定</el-button>
          </span>
      </el-dialog>
      <el-dialog
          title="分配权限"
          :visible.sync="assignDialogVisible"
          width="40%"
          @closed="clearRight">

          <el-tree
          :data="rightList"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>

          <span slot="footer" class="dialog-footer">
            <el-button @click="assignDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="assignRight">分 配</el-button>
          </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          {required: true, $message: '请输入角色的名称', trigger: 'change'}
        ]
      },
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      assignDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rightList: [],
      roleId: ''
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      let { meta: {status}, data } = res.data
      if (status === 200) {
        this.roleList = data
        // console.log(this.roleList)
      }
    },
    async delRole(row) {
      try {
        await this.$confirm('确定要删除吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${row.id}`)
        let {meta: {status}} = res.data
        if (status === 200) {
          this.$message.success('恭喜你,删除成功')
          this.getRoleList()
        } else {
          this.$message.error('删除角色失败')
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
    },
    showAddDialog () {
      this.addDialogVisible = true
    },
    async addRole () {
      let res = await this.axios.post(`roles`, this.addForm)
      let { meta: {status} } = res.data
      if (status === 201) {
        this.addDialogVisible = false
        this.$refs.addForm.resetFields()
        this.getRoleList()
        this.$message.success('恭喜你,添加角色成功')
      } else {
        this.$message.error('很抱歉,添加角色失败')
      }
    },
    showEditDialog (row) {
      this.editDialogVisible = true
      // this.editForm = row
      this.roleId = row.id
    },
    async editRole () {
      let res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
      let { meta: {status} } = res.data
      if (status === 200) {
        this.editDialogVisible = false
        this.$refs.editForm.resetFields()
        this.getRoleList()
        this.$message.success('恭喜你,修改角色成功')
      } else {
        this.$message.error('很抱歉,修改角色失败')
      }
    },
    async delRight (row, rightId) {
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      let { meta: {status}, data } = res.data
      if (status === 200) {
        this.$message.success('删除成功')
        row.children = data
      } else {
        this.$message.error('删除成功')
      }
    },
    async showAssignDialog (row) {
      this.assignDialogVisible = true
      this.roleId = row.id
      let res = await this.axios.get(`rights/tree`)
      let {meta: {status}, data} = res.data
      if (status === 200) {
        this.rightList = data
      }
      let temp = []
      row.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            temp.push(level3.id)
          })
        })
      })

      this.$refs.tree.setCheckedKeys(temp)
    },
    clearRight () {
      this.$refs.tree.setCheckedKeys([])
    },
    async assignRight() {
      let keys = this.$refs.tree.getCheckedKeys()
      let halfKeys = this.$refs.tree.getHalfCheckedNodes()
      let rids = keys.concat(halfKeys).join()
      // console.log(rids)
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      let { meta: { status } } = res.data
      if (status === 200) {
        this.assignDialogVisible = false
        this.$message.success('恭喜你,分配角色权限成功了')
        this.getRoleList()
      } else {
        this.$message.error('分配角色权限失败了')
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="" scoped>
    .level2{
        margin-bottom: 10px;
    }
    .level3{
        margin-right: 10px;
        margin-bottom: 5px;
    }
</style>
