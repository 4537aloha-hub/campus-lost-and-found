<script setup>
import {defineProps, defineEmits} from 'vue'
defineProps({
  total: {
    type: Number,
    default: 0
  },
  params: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['page-change'])

const onPageChange = (page) => {
  emit('page-change', page)
}


</script>
<template>
  <div class="pagination">
    <el-pagination
      v-model:current-page="params.pageNum"
      :page-size="params.pageSize"
      :background=true
      layout="jumper, total, prev, pager, next"
      @current-change="onPageChange"
      :total="total" />
  </div>
</template>
<style lang="scss" scoped>
.pagination{
  margin-top: 20px;
}
</style>
