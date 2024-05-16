<template>
  <div align="right">
    <button @click="showAddModal = true">登録</button>
  </div>

  <div>
    <!-- 등록 -->
    <Modal v-if="showAddModal" @close="showAddModal = false" title="ユーザー情報登録">
      <table class="mo">
        <tr>
          <td><label>名前(姓)</label></td>
          <td><input type="text" v-model="newData.firstname" placeholder="FirstName"></td>
        </tr>
        <tr>
          <td><label>名前(名)</label></td>
          <td><input type="text" v-model="newData.lastname" placeholder="LastName"></td>
        </tr>
        <tr>
          <td><label>住所</label></td>
          <td><input type="text" v-model="newData.address" placeholder="Address"></td>
        </tr>
        <tr>
          <td><label>生年月日</label></td>
          <td><input type="text" v-model="newData.birth" placeholder="Birth"></td>
        </tr>
        <tr>
          <td><label>性別</label></td>
          <td><input type="radio" v-model="newData.gender" value="男性">男性
            <input type="radio" v-model="newData.gender" value="女性">女性
          </td>
        </tr>
        <tr>
          <td><label>電話番号</label></td>
          <td><input type="text" v-model="newData.telephone" placeholder="電話番号"></td>
        </tr>
      </table>
      <button @click="addData" style="float:right; margin-top: 5px;">登録</button>
    </Modal>


    <!-- 更新 -->
    <Modal v-if="showEditModal" @close="showEditModal = false" title="ユーザー情報更新">
      <table class="mo">
        <tr>
          <td><label>名前(姓)</label></td>
          <td><input type="text" v-model="editData.firstname" placeholder="FirstName" ref="cursor"></td>
        </tr>
        <tr>
          <td><label>名前(名)</label></td>
          <td><input type="text" v-model="editData.lastname" placeholder="LastName"></td>
        </tr>
        <tr>
          <td><label>住所</label></td>
          <td><input type="text" v-model="editData.address" placeholder="Address"></td>
        </tr>
        <tr>
          <td><label>生年月日</label></td>
          <td><input type="text" v-model="editData.birth" placeholder="Birth"></td>
        </tr>
        <tr>
          <td><label>性別</label></td>
          <td><input type="radio" v-model="editData.gender" value="男性">男性
            <input type="radio" v-model="editData.gender" value="女性">女性
          </td>
        </tr>
        <tr>
          <td><label>電話番号</label></td>
          <td><input type="text" v-model="editData.telephone" placeholder="電話番号"></td>
        </tr>
      </table>

      <button @click="confirmEdit" style="float:right; margin-top: 5px;">確認</button>
    </Modal>

    <!-- 検索 -->
    <div id="Search">
      <input type="text" v-model="searchId" placeholder="ID">
      <button @click="searchById">検索</button>

    </div>

    <!-- メイン画面 テーブル -->
    <table style="margin-top: 5px;">
      <thead>
        <tr>
          <th @click="sortData('id')">ID</th>
          <th @click="sortData('firstname')">名前(姓)</th>
          <th @click="sortData('lastname')">名前(名)</th>
          <th @click="sortData('address')">住所</th>
          <th @click="sortData('birth')">生年月日</th>
          <th @click="sortData('gender')">性別</th>
          <th @click="sortData('telephone')">電話番号</th>
          <th @click="sortData('updatedAt')" style="width : 15%">更新日時</th>
          <th @click="sortData('createdAt')" style="width : 15%">登録日時</th>
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
          <td style="width : 15%">{{ item.updatedAt }}</td>
          <td style="width : 15%">{{ item.createdAt }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 修正ー削除 BTN -->

    <div id="ED">
      <button @click="EditForm" :class="{ active: showEditModal }" :disabled="selectedId === null">更新</button>
      <button @click="deleteData" :disabled="selectedId === null">削除</button>
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
      newData: { firstname: '', lastname: '', address: '', birth: '', gender: '', telephone: ''},
      editData: { id: null, firstname: '', lastname: '', address: '', birth: '', gender: '', telephone: ''},
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      selectedId: null,
      sortBy: 'id',
      sortOrder: -1,
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
        this.newData = { firstname: '', lastname: '', address: '', birth: '', gender: '', telephone: '' };
      }
    },
    showEditModal(newVal) {
      if (!newVal) {
        this.editData = { id: null, firstname: '', lastname: '', address: '', birth: '', gender: '', telephone: '' };
      }
    }
  },
  methods: {
      selectRow(id) {
        this.selectedId = (this.selectedId === id) ? null : id;
      },
      searchById() {
        if (this.searchId.trim() === '') {
          axios.get(`/api/users`)
            .then(response => {
              this.data = response.data;

            })
        } else {
          axios.get(`/api/users/${this.searchId}`)
            .then(response => {
              this.data = response.data ? [response.data] : [];
              
            })
            .catch(error => {
              console.error('Error:', error);
              alert("検索結果が存在しません");
            });
        }
      },
      sortData(key) {
        if (this.sortBy === key) {
          this.sortOrder *= -1;
        } else {
          this.sortBy = key;
          this.sortOrder = 1;
        }
      },
      fetchData() {
        axios.get('/api/users')
          .then(response => {
            this.data = response.data;
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },
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
        if (confirm("修正しますか?"))
          if (this.editData.firstname.trim() === '' || this.editData.lastname.trim() === '') {
            window.alert("名前を確認してください")
          } else{
            axios.put(`/api/users/${this.selectedId}`, this.editData)
              .then(() => {
                this.fetchData();
                this.showEditModal = false
              })
              .catch(error => {
                console.error('Error:', error);
              });

          }
      },
      addData() {
        if (this.newData.firstname.trim() === '' || this.newData.lastname.trim() === '') {
          window.alert("名前を入力してください")
        } else {
          axios.post('/api/users', this.newData)
            .then(() => {
              this.fetchData();
              this.showAddModal = false;
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
      },
    deleteData() {
      if (confirm("削除しますか?")) {
        axios.delete(`/api/users/${this.selectedId}`)
          .then(() => {
            this.fetchData();
            this.selectedId = null;
            
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    },
      changePage(page) {
        this.currentPage = page;
      }
    },
    computed: {

      sortedData() {
        return this.data.slice().sort((a, b) => {
          if (a[this.sortBy] < b[this.sortBy]) return -1 * this.sortOrder;
          if (a[this.sortBy] > b[this.sortBy]) return 1 * this.sortOrder;
          return 0;
        });
      },
      paginatedData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.sortedData.slice(startIndex, startIndex + this.pageSize);
      },
      pageCount() {
        return Math.ceil(this.sortedData.length / this.pageSize);
      }
    },
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
  text-align: right;
    margin-right: 4px;
    margin-top: 5px;
}
#Search {
  
  float: right;
}

td input[type="text"] {
  width: 250px;

}
</style>
