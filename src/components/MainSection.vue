<template>
  <div align="right">
    <button @click="showAddModal = true">登録</button>
  </div>

  <div>
    <!-- 登録MODAL -->
    <Modal
      v-if="showAddModal"
      @close="showAddModal = false"
      title="ユーザー情報登録"
    >
      <table class="mo">
        <tr>
          <td><label>氏名(姓)</label></td>
          <td>
            <input
              type="text"
              v-model="newData.firstname"
              placeholder="FirstName"
              id="Fname1"
              maxlength="20"
            />
          </td>
        </tr>
        <tr>
          <td><label>氏名(名)</label></td>
          <td>
            <input
              type="text"
              v-model="newData.lastname"
              placeholder="LastName"
              id="Lname1"
              maxlength="20"
            />
          </td>
        </tr>
        <tr>
          <td><label>住所</label></td>
          <td>
            <input
              type="text"
              v-model="newData.address"
              placeholder="Address"
              id="address1"
              maxlength="30"
            />
          </td>
        </tr>
        <tr>
          <td><label>生年月日</label></td>
          <td>
            <VueDatePicker
              v-model="newData.birth"
              format="yyyy-MM-dd"
              :enable-time-picker="false"
              :max-date="new Date()"
              :clearable="false"
              no-today
              id="birth1"
            />
          </td>
        </tr>
        <tr>
          <td><label>性別</label></td>
          <td>
            <input type="radio" v-model="newData.gender" value="男性" />男性
            <input type="radio" v-model="newData.gender" value="女性" />女性
          </td>
        </tr>
        <tr>
          <td><label>電話番号</label></td>
          <td>
            <input
              type="text"
              v-model="newData.telephone"
              placeholder="電話番号"
              v-mask="'###-###-####'"
              id="tel1"
              onKeyup="this.value=this.value.replace(/[^-0-9]/g,'');"
            />
          </td>
        </tr>
      </table>
      <button @click="addData" style="float: right; margin-top: 5px">
        登録
      </button>
    </Modal>

    <!-- 更新MODAL -->
    <Modal
      v-if="showEditModal"
      @close="showEditModal = false"
      title="ユーザー情報更新"
    >
      <table class="mo">
        <tr>
          <td><label>氏名(姓)</label></td>
          <td>
            <input
              type="text"
              v-model="editData.firstname"
              placeholder="FirstName"
              id="Fname2"
              maxlength="20"
            />
          </td>
        </tr>
        <tr>
          <td><label>氏名(名)</label></td>
          <td>
            <input
              type="text"
              v-model="editData.lastname"
              placeholder="LastName"
              id="Lname2"
              maxlength="20"
            />
          </td>
        </tr>
        <tr>
          <td><label>住所</label></td>
          <td>
            <input
              type="text"
              v-model="editData.address"
              placeholder="Address"
              id="address2"
              maxlength="30"
            />
          </td>
        </tr>
        <tr>
          <td><label>生年月日</label></td>
          <td>
            <VueDatePicker
              v-model="editData.birth"
              format="yyyy-MM-dd"
              :enable-time-picker="false"
              :max-date="new Date()"
              :clearable="false"
              no-today
              id="birth2"
            />
          </td>
        </tr>
        <tr>
          <td><label>性別</label></td>
          <td>
            <input type="radio" v-model="editData.gender" value="男性" />男性
            <input type="radio" v-model="editData.gender" value="女性" />女性
          </td>
        </tr>
        <tr>
          <td><label>電話番号</label></td>
          <td>
            <input
              type="text"
              v-model="editData.telephone"
              placeholder="電話番号"
              v-mask="'###-###-####'"
              id="tel2"
              onKeyup="this.value=this.value.replace(/[^-0-9]/g,'');"
            />
          </td>
        </tr>
      </table>

      <button @click="confirmEdit" style="float: right; margin-top: 5px">
        確認
      </button>
    </Modal>

    <!-- 検索 -->
    <div id="Search">
      <input type="text" v-model="searchId" placeholder="ID" />
      <button @click="searchById">検索</button>
    </div>

    <!-- メイン画面 テーブル -->
    <TableSection
      :data="data"
      :paginatedData="paginatedData"
      :sortData="sortData"
      :selectRow="selectRow"
      :selectedId="selectedId"
    />

    <!-- 修正ー削除 BTN -->

    <div id="ED">
      <button
        @click="EditForm"
        :class="{ active: showEditModal }"
        :disabled="selectedId === null"
      >
        更新
      </button>
      <button @click="deleteData" :disabled="selectedId === null">削除</button>
    </div>

    <!-- ページ -->

    <div>
      <PageSection
        :pageCount="pageCount"
        :currentPage="currentPage"
        @page-changed="changePage"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PageSection from "./PageSection.vue";
import Modal from "./ModalSection.vue";
import TableSection from "./TableSection.vue";

export default {
  components: {
    PageSection,
    Modal,
    TableSection,
  },

  data() {
    return {
      data: [],
      newData: {
        firstname: "",
        lastname: "",
        address: "",
        birth: "",
        gender: "男性",
        telephone: "",
      },
      editData: {
        id: null,
        firstname: "",
        lastname: "",
        address: "",
        birth: "",
        gender: "",
        telephone: "",
      },
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      selectedId: null,
      sortBy: "id",
      sortOrder: -1,
      currentPage: 1,
      pageSize: 10,
      searchId: "",
    };
  },

  // --------------------------------------------watch------------------------------------------
  watch: {
    selectedId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.showEditModal = false;
        this.showDeleteConfirm = false;
      }
    },
    showAddModal(newVal) {
      if (!newVal) {
        this.newData = {
          firstname: "",
          lastname: "",
          address: "",
          birth: "",
          gender: "男性",
          telephone: "",
        };
      }
    },
    showEditModal(newVal) {
      if (!newVal) {
        this.editData = {
          id: null,
          firstname: "",
          lastname: "",
          address: "",
          birth: "",
          gender: "",
          telephone: "",
        };
      }
    },
  },

  // --------------------------------------------method------------------------------------------
  methods: {
    selectRow(id) {
      this.selectedId = this.selectedId === id ? null : id;
    },
    searchById() {
      if (this.searchId.trim() === "") {
        axios.get(`/api/users`).then((response) => {
          this.data = response.data;
          this.searchId = "";
        });
      } else {
        axios
          .get(`/api/users/${this.searchId}`)
          .then((response) => {
            this.data = response.data ? [response.data] : [];
            this.searchId = "";
          })
          .catch((error) => {
            axios.get(`/api/users`).then((response) => {
              this.data = response.data;
              this.searchId = "";
              alert("検索結果が存在しません");
              console.error("Error:", error);
            });
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
      axios
        .get("/api/users")
        .then((response) => {
          this.data = response.data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    EditForm() {
      if (this.selectedId) {
        const selectedItem = this.data.find(
          (item) => item.id === this.selectedId
        );
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
        if (this.editData.firstname.trim() === "") {
          document.getElementById("Fname2").focus();
          window.alert("氏名(姓)を確認してください");
        } else if (this.editData.lastname.trim() === "") {
          document.getElementById("Lname2").focus();
          window.alert("氏名(名)を確認してください");
        } else if (this.editData.address.trim() === "") {
          document.getElementById("address2").focus();
          window.alert("住所を確認してください");
        } else if (this.editData.birth === "") {
          window.alert("生年月日を確認してください");
        } else if (this.editData.telephone.trim() === "") {
          document.getElementById("tel2").focus();
          window.alert("電話番号を確認してください");
        } else {
          axios
            .put(`/api/users/${this.selectedId}`, this.editData)
            .then(() => {
              this.fetchData();
              this.showEditModal = false;
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
    },
    addData() {
      if (this.newData.firstname.trim() === "") {
        document.getElementById("Fname1").focus();
        window.alert("氏名(姓)を入力してください");
      } else if (this.newData.lastname.trim() === "") {
        document.getElementById("Lname1").focus();
        window.alert("氏名(名)を入力してください");
      } else if (this.newData.address.trim() === "") {
        document.getElementById("address1").focus();
        window.alert("住所を入力してください");
      } else if (this.newData.birth === "") {
        window.alert("生年月日を入力してください");
      } else if (this.newData.telephone.trim() === "") {
        document.getElementById("tel1").focus();
        window.alert("電話番号を入力してください");
      } else {
        axios
          .post("/api/users", this.newData)
          .then(() => {
            this.fetchData();
            this.showAddModal = false;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    },
    deleteData() {
      if (confirm("削除しますか?")) {
        axios
          .delete(`/api/users/${this.selectedId}`)
          .then(() => {
            this.fetchData();
            this.selectedId = null;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
  },

  // -------------------------------------Computed--------------------------------------
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
      const pageCount = Math.ceil(this.data.length / this.pageSize);
      return pageCount > 0 ? pageCount : 1;
    },
  },
  mounted() {
    this.fetchData();
  },
};
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
  width: auto;
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
  background-color: #e9e9e9 !important;
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

tr:nth-child(even) {
  background-color: #f4feff;
}
</style>
