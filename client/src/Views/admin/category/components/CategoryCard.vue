<script setup>
const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'edit',
  'delete'
])

const edit = () => {
  emit('edit', props.category)
}

const remove = () => {
  emit('delete', props.category.id)
}
</script>

<template>

  <div class="category-card">

    <div class="cat-header">

      <div class="left">

        <span class="cat-icon">
          📁
        </span>

        <span class="cat-name">
          {{ category.name }}
        </span>

      </div>

      <el-tag
        size="small"
        effect="plain"
      >
        {{ category.children.length }} 个子分类
      </el-tag>

    </div>

    <div class="cat-children">

      <el-tag
        v-for="item in category.children.slice(0,4)"
        :key="item.id"
        effect="light"
      >
        {{ item.name }}
      </el-tag>

      <el-tag
        v-if="category.children.length>4"
        type="info"
      >
        +{{ category.children.length-4 }}
      </el-tag>

    </div>

    <div class="cat-footer">

      <el-button
        size="small"
        type="primary"
        plain
        @click="edit"
      >
        编辑
      </el-button>

      <el-button
        size="small"
        type="danger"
        plain
        @click="remove"
      >
        删除
      </el-button>

    </div>

  </div>

</template>

<style scoped lang="scss">

.category-card{

    background:#fff;

    border-radius:14px;

    padding:20px;

    transition:.3s;

    border:1px solid #ebeef5;

    box-shadow:0 2px 10px rgba(0,0,0,.04);

}

.category-card:hover{

    transform:translateY(-5px);

    box-shadow:0 12px 28px rgba(0,0,0,.08);

}

.cat-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:18px;

}

.left{

    display:flex;

    align-items:center;

    gap:10px;

}

.cat-icon{

    font-size:24px;

}

.cat-name{

    font-size:17px;

    font-weight:600;

    color:#303133;

}

.cat-children{

    display:flex;

    flex-wrap:wrap;

    gap:10px;

    min-height:42px;

    margin-bottom:18px;

}

.cat-footer{

    display:flex;

    justify-content:flex-end;

    gap:10px;

}

@media(max-width:768px){

.cat-footer{

    justify-content:space-between;

}

}

</style>

