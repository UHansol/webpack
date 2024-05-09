<template>
  <div>
    <h1>DB情報出力</h1>
    <button @click="toggleAddForm">追加</button>
    <button @click="toggleEditForm" :disabled="selectedId === null">修整</button>
    <button @click="confirmDelete" :disabled="selectedId === null">削除</button>

    <!-- 追加 入力 -->
    <div v-if="showAdd">
      <input type="text" v-model="newData.name" placeholder="Name">
      <input type="text" v-model="newData.content" placeholder="Content">
      <button @click="addData">確認</button>
    </div>

    <!-- 修整 入力  -->
    <div v-if="showEdit">
      <input type="text" v-model="editData.name" placeholder="Name">
      <input type="text" v-model="editData.content" placeholder="Content">
      <button @click="updateData">確認</button>
    </div>

    <!-- 削除 -->
    <div v-if="showDeleteConfirm">
      <p>削除しますか？</p>
      <button @click="deleteData">確認</button>
      <button @click="cancelDelete">Cancle</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>選択</th>
          <th @click="sortData('id')">ID</th>
          <th @click="sortData('name')">Name</th>
          <th @click="sortData('content')">Content</th>
          <th @click="sortData('updatedAt')">Update</th>
          <th @click="sortData('createdAt')">Create</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in paginatedData" :key="item.id">
          <td><input type="radio" name="selectedItem" v-model="selectedId" :value="item.id"></td>
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.content }}</td>
          <td>{{ item.updatedAt }}</td>
          <td>{{ item.createdAt }}</td>
        </tr>
      </tbody>
    </table>

    <div>
      <button v-for="page in pageCount" :key="page" @click="changePage(page)">{{ page }}</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      data: [],
      newData: { name: '', content: '' },
      editData: { name: '', content: '' },
      showAdd: false,
      showEdit: false,
      showDeleteConfirm: false,
      selectedId: null,
      sortBy: '',
      sortOrder: 1,
      currentPage: 1,
      pageSize: 8
    };
  },
  methods: {
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
    toggleAddForm() {
      this.showAdd = !this.showAdd;
      this.newData = { name: '', content: '' };
    },
    toggleEditForm() {
      if (this.selectedId) {
        const selectedItem = this.data.find(item => item.id === this.selectedId);
        if (selectedItem) {
          this.editData = { id: this.selectedId, name: selectedItem.name, content: selectedItem.content };
          this.showEdit = !this.showEdit;
        }
      }
    },
    addData() {
      axios.post('/api/users', this.newData)
        .then(() => {
          this.fetchData();
          this.showAdd = false;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    updateData() {
      axios.put(`/api/users/${this.editData.id}`, {
        name: this.editData.name,
        content: this.editData.content
      })
        .then(() => {
          this.fetchData();
          this.showEdit = false;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    confirmDelete() {
      if (this.selectedId) {
        this.showDeleteConfirm = true;
      }
    },
    deleteData() {
      axios.delete(`/api/users/${this.selectedId}`)
        .then(() => {
          this.fetchData();
          this.showDeleteConfirm = false;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    cancelDelete() {
      this.showDeleteConfirm = false;
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
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
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
  background-color: #f2f2f2;
}

button {
  margin-right: 5px;
}
</style>
