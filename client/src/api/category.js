import request from "@/utils/request";


// 获取物品分类树
export const getCategoryTree = () => request.get('/category/getCategoryTree')
