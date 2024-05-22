<template>
  <table style="margin-top: 5px">
    <thead>
      <tr>
        <th @click="sortData('id')" style="width: 50px">ID</th>
        <th @click="sortData('firstname')" style="width: 100px">名前(姓)</th>
        <th @click="sortData('lastname')" style="width: 100px">名前(名)</th>
        <th @click="sortData('address')" style="width: 300px">住所</th>
        <th @click="sortData('birth')" style="width: 140px">生年月日</th>
        <th @click="sortData('gender')" style="width: 50px">性別</th>
        <th @click="sortData('telephone')" style="width: 100px">電話番号</th>
        <th @click="sortData('updatedAt')" style="width: 13%">更新日時</th>
        <th @click="sortData('createdAt')" style="width: 13%">登録日時</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in paginatedData"
        :key="item.id"
        @click="selectRow(item.id)"
        :class="{ selected: selectedId === item.id }"
      >
        <td style="width: 50px">{{ item.id }}</td>
        <td style="width: 100px">{{ item.firstname }}</td>
        <td style="width: 100px">{{ item.lastname }}</td>
        <td style="width: 300px">{{ item.address }}</td>
        <td style="width: 140px">{{ item.birth }}</td>
        <td style="width: 50px">{{ item.gender }}</td>
        <td style="width: 100px">{{ item.telephone }}</td>
        <td style="width: 13%">{{ item.updatedAt }}</td>
        <td style="width: 13%">{{ item.createdAt }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "TableSection",
  props: ["data", "paginatedData", "sortData", "selectRow", "selectedId"],
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
  background-color: #e9e9e9 !important;
}

.selected {
  background-color: #e9e9e9 !important;
}

td input[type="text"] {
  width: 250px;
}

tr:nth-child(even) {
  background-color: #f4feff;
}
</style>
