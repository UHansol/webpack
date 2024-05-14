<template>
  <div align="right">
    <button @click="showAddModal = true">追加</button>
  </div>

  <div>
    <!-- 登録 -->
    <Modal v-if="showAddModal" @close="showAddModal = false" title="追加">
      <table class="mo">
        <thead>
          <tr>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Address</th>
            <th>Birth</th>
            <th>Gender</th>
            <th>TelePhone</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" v-model="newData.firstname" placeholder="FirstName"></td>
            <td><input type="text" v-model="newData.lastname" placeholder="LastName"></td>
            <td><input type="text" v-model="newData.address" placeholder="Address"></td>
            <td><input type="text" v-model="newData.birth" placeholder="0000-00-00"></td>
            <td><input type="radio" v-model="newData.gender" value="男性">男性
              <input type="radio" v-model="newData.gender" value="女性">女性
            </td>
            <td><input type="text" v-model="newData.telephone" placeholder="Telephone"></td>
            <td><input type="text" v-model="newData.remarks" placeholder="Remarks"></td>
          </tr>
        </tbody>
      </table>
      <!-- <button @click="showAddModal = false" style="float:right; margin-top: 5px;">キャンセル</button> -->
      <button @click="addData" style="float:right; margin-top: 5px;">追加</button>


    </Modal>

    <!-- 修正 -->
    <Modal v-if="showEditModal" @close="showEditModal = false" title="修整">
      <table class="mo">
        <thead>
          <tr>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Address</th>
            <th>Birth</th>
            <th>TelePhone</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" v-model="editData.firstname" placeholder="FirstName"></td>
            <td><input type="text" v-model="editData.lastname" placeholder="LastName"></td>
            <td><input type="text" v-model="editData.address" placeholder="Address"></td>
            <td><input type="text" v-model="editData.birth" placeholder="0000-00-00"></td>
            <td><input type="text" v-model="editData.telephone" placeholder="Telephone"></td>
            <td><input type="text" v-model="editData.remarks" placeholder="Remarks"></td>
          </tr>
        </tbody>
      </table>
      <button @click="confirmEdit" style="float:right; margin-top: 5px;">確認</button>
    </Modal>

    <!-- 削除 -->
    <Modal v-if="showDeleteModal" @close="showDeleteModal = false" title="削除">
      <table>
        <p>削除しますか?</p>
      </table>
      <button @click="deleteData" style="float:right; margin-top: 5px;">削除</button>

    </Modal>

    <!-- メイン画面 テーブル -->
    <table style="margin-top: 5px;">
      <!-- テーブルをClickして整列 -->
      <thead>
        <tr>
          <th @click="sortData('id')">ID</th>
          <th @click="sortData('firstname')">FirstName</th>
          <th @click="sortData('lastname')">Lastname</th>
          <th @click="sortData('address')">Address</th>
          <th @click="sortData('birth')">Birth</th>
          <th @click="sortData('gender')">Gender</th>
          <th @click="sortData('telephone')">Telephone</th>
          <th @click="sortData('remarks')">Remarks</th>
          <th @click="sortData('updatedAt')" style="width : 15%">Update</th>
          <th @click="sortData('createdAt')" style="width : 15%">Create</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in paginatedData" :key="item.id" @click="selectRow(item.id)"
          :class="{ selected: selectedId === item.id }">
          <td>{{ item.id }}</td>
          <td>{{ item.firstname }}</td>
          <td>{{ item.lastname }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.birth }}</td>
          <td>{{ item.gender }}</td>
          <td>{{ item.telephone }}</td>
          <td>{{ item.remarks }}</td>
          <td style="width : 15%">{{ item.updatedAt }}</td>
          <td style="width : 15%">{{ item.createdAt }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 修正ー削除 BTN -->
    <div id="ED">
      <button @click="EditForm" :class="{ active: showEditModal }" :disabled="selectedId === null">修正</button>
      <button @click="showDeleteModal = true" :disabled="selectedId === null">削除</button>
    </div>

    <!-- ページ -->
    <div>
      <PageSection :pageCount="pageCount" :currentPage="currentPage" @page-changed="changePage" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import PageSection from './PageSection.vue';
import Modal from './Modal.vue';

export default {
  components: {
    PageSection,
    Modal,
  },
  data() {
    return {
      data: [],
      newData: { firstname: '', lastname: '', address: '', birth: '', gender: '', telephone: '', remarks: '' },
      editData: { id: null, firstname: '', lastname: '', address: '', birth: '', gender: '', telephone: '', remarks: '' },
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      selectedId: null,
      sortBy: '',
      sortOrder: 1,
      currentPage: 1,
      pageSize: 10,
      searchId: ''
    };
  },
  watch: {
    selectedId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.showEditModal = false;
        this.showDeleteConfirm = false;
      }

    },
    showAddModal(newVal) {
      if (!newVal) {
        this.newData = { firstname: '', lastname: '', address: '', birth: '', gender: '', telephone: '', remarks: '' };
      }
    },
    showEditModal(newVal) {
      if (!newVal) {
        this.editData = { id: null, firstname: '', lastname: '', address: '', birth: '', gender: '', telephone: '', remarks: '' };
      }
    },
  },


  methods: {


    selectRow(id) {
      this.selectedId = (this.selectedId === id) ? null : id;
    },

    // 検索
    searchById() {
      if (this.searchId.trim() === '') {
        axios.get(`/api/users`)
          .then(response => {
            this.data = response.data;
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        axios.get(`/api/users/${this.searchId}`)
          .then(response => {
            this.data = response.data ? [response.data] : [];
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    },

    // 整列
    sortData(key) {
      if (this.sortBy === key) {
        this.sortOrder *= -1;
      } else {
        this.sortBy = key;
        this.sortOrder = 1;
      }
    },

    // でーた表示
    fetchData() {
      axios.get('/api/users')
        .then(response => {
          this.data = response.data;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },

    // 修正
    EditForm() {
      if (this.selectedId) {
        const selectedItem = this.data.find(item => item.id === this.selectedId);
        if (selectedItem) {
          this.editData = { ...selectedItem };
          this.showEditModal = true;
        }
      } else {
        this.showEditModal = false;
      }
    },
    confirmEdit() {
      if (confirm("修正しますか?")) {
        axios.put(`/api/users/${this.editData.id}`, this.editData)
          .then(() => {
            this.fetchData();
            this.showEditModal = false;
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    },

    // 登録
    addData() {
      if (this.newData.firstname.trim() === '' || this.newData.lastname.trim() === '') {
        window.alert("名前を入力してください")
      }else
      axios.post('/api/users', this.newData)
        .then(() => {
          this.fetchData();
          this.showAddModal = false;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },

    // 削除
    deleteData() {
      axios.delete(`/api/users/${this.selectedId}`)
        .then(() => {
          this.fetchData();
          this.showDeleteModal = false;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },

    // ページ
    changePage(page) {
      this.currentPage = page;
    }
  },
  computed: {

    // 整列
    sortedData() {
      return this.data.slice().sort((a, b) => {
        if (a[this.sortBy] < b[this.sortBy]) return -1 * this.sortOrder;
        if (a[this.sortBy] > b[this.sortBy]) return 1 * this.sortOrder;
        return 0;
      });
    },

    // ページ
    paginatedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.sortedData.slice(startIndex, startIndex + this.pageSize);
    },
    pageCount() {
      return Math.ceil(this.sortedData.length / this.pageSize);
    }
  },

  // 画面表示
  mounted() {
    this.fetchData();
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  border-style: double;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  cursor: pointer;
}

tr:hover {
  background-color: #e9e9e9;
}

button {
  margin-right: 5px;
  margin-bottom: 5px;
}

button.active {
  color: red;
}

.selected {
  background-color: #e9e9e9;
}

#ED {
  float: right;
    margin-right: 4px;
    margin-top: 5px;
}
#Search {
  
  float: right;
}
</style>
