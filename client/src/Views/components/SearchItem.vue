<script setup>
import { getItemsByName } from "@/api/home";
import { ref, computed, defineEmits } from "vue";

const emit = defineEmits(['update-itemList'])

const searchItemNameRef = ref("")
const itemList = ref([])

const isFocus = ref(false)

// 校验函数
const validate = (val) => {
  if (val === "") return "" // 初始态不报错
  if (/^\s+$/.test(val)) return "不能输入空白字符"
  return ""
}

// 实时校验（只在“输入中 + 聚焦”才触发）
const errorMsg = computed(() => {
  if (!isFocus.value) return ""   // 失焦不展示
  return validate(searchItemNameRef.value)
})

// 输入
const handleInput = () => {}

// 聚焦
const handleFocus = () => {
  isFocus.value = true
}

// 失焦
const handleBlur = () => {
  isFocus.value = false
}

// 搜索
const searchItemName = async () => {
  const err = validate(searchItemNameRef.value)

  if (err) return

  const res = await getItemsByName({
    title: searchItemNameRef.value
  })

  itemList.value = res.data
  emit('update-itemList', itemList.value)
}
</script>

<template>
  <div class="search">
    <input
      v-model="searchItemNameRef"
      type="text"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup.enter="searchItemName"
      placeholder="搜索物品名称"
    />

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  </div>
</template>

<style scoped lang="scss">
.search {
  width: 100%;
  max-width: 1240px;
  padding: 0 16px;
  margin: 20px auto;
  box-sizing: border-box;

  input {
    width: 170px;
    height: 32px;
    padding: 0 8px;
    border: 1px solid #ccc;
    border-radius: 20px;
  }

  .error {
    color: red;
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>
